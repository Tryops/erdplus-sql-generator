const exp = require('constants');
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const util = require('util');

function changeFileExtesion(filepath, ext) {
   return path.format({ ...path.parse(filepath), base: undefined, ext: ext })
}

let counter = 0;
function nextNum() {
    return counter++;
}

const file = process.argv[2];
const export_type = process.argv[3]; // 'sql' (for sql create table statements) or 'rel' (for relational model)

if(file) {
    try {
        const json = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); // BOM workaround
        const data = JSON.parse(json);
        const shapes = data.shapes;
        const connectors = data.connectors;

        const entities = 
        shapes
            .filter(s => s.type === 'Entity')
            .map(e => ({ name: e.details.name, id: e.details.id }));
        
        const attributes = 
        shapes
            .filter(s => s.type === 'Attribute')
            .map(a => ({ name: a.details.name, id: a.details.id, pk: a.details.isUnique }))
            .map(a => {
                const c_source = connectors.find(c => c.type === 'Connector' && a.id === c.source);
                const c_destination = connectors.find(c => c.type === 'Connector' && a.id === c.destination);
                if(c_source) {
                    a.to = c_source.destination;
                    return a;
                } else if (c_destination) {
                    a.to = c_destination.source;
                    return a;
                } else {
                    return false;
                }
            })
            .filter(a => a); // filter out unbound attributes

        const relationships = 
        shapes
            .filter(s => s.type === 'Relationship')
            .map(r => ({
                name: r.details.name, 
                id: r.details.id, 
                from: {
                    entity: r.details.slots[0].entityId, 
                    cardinality: r.details.slots[0].cardinality 
                }, 
                to: {
                    entity: r.details.slots[1].entityId, 
                    cardinality: r.details.slots[1].cardinality 
                }
            }));

        let fullEntities =
        entities
            .map(e => {
                e.primary_keys = attributes.filter(a => a.to === e.id && a.pk).map(a => a.name);
                e.attributes = attributes.filter(a => a.to === e.id && !a.pk).map(a => a.name);
                return e;
            });

        fullEntities = 
        fullEntities
            .map(e => { // 1 to n
                e.foreign_keys = [];
                const from_pks = relationships
                    .filter(r => r.from.entity === e.id && r.from.cardinality === 'many' && r.to.cardinality !== 'many')
                    .map(r => {
                        const ent = fullEntities.find(e2 => e2.id === r.to.entity);
                        return { attribute: 'fk_' + ent.primary_keys[0], entity: ent.name, primary_key: ent.primary_keys[0] };
                    });

                const to_pks = relationships
                    .filter(r => r.to.entity === e.id && r.to.cardinality === 'many' && r.from.cardinality !== 'many')
                    .map(r => {
                        const ent = fullEntities.find(e2 => e2.id === r.from.entity);
                        return { attribute: 'fk_' + ent.primary_keys[0], entity: ent.name, primary_key: ent.primary_keys[0] };
                    });

                e.foreign_keys = [...from_pks, ...to_pks];

                return e;
            })
            .map(e => { // 1 to 1
                const from_fks = relationships
                    .filter(r => r.from.entity === e.id && r.from.cardinality !== 'many' && r.to.cardinality !== 'many')
                    .map(r => {
                        const ent = fullEntities.find(e2 => e2.id === r.to.entity);
                        return { attribute: 'fk_' + ent.primary_keys[0], entity: ent.name, primary_key: ent.primary_keys[0] };
                    });
                const to_fks = relationships
                    .filter(r => r.to.entity === e.id && r.to.cardinality !== 'many' && r.from.cardinality !== 'many')
                    .map(r => {
                        const ent = fullEntities.find(e2 => e2.id === r.from.entity);
                        return { attribute: 'fk_' + ent.primary_keys[0], entity: ent.name, primary_key: ent.primary_keys[0] };
                    });
                
                // console.log(...[...from_fks, ...to_fks]);
                e.foreign_keys.push(...[...from_fks, ...to_fks]);
                return e;
            });

        const weakEntities =
        relationships // n to m
            .filter(r => r.from.cardinality === 'many' && r.to.cardinality === 'many')
            .map(r => {
                const ent_from = fullEntities.find(e => e.id === r.from.entity);
                const ent_to = fullEntities.find(e => e.id === r.to.entity);
                const [pk_from, pk_to] = [ent_from.primary_keys[0], ent_to.primary_keys[0]].map(pk => 'pk_fk_' + pk);
                return {
                    id: null,
                    name: ent_from.name + '_' + ent_to.name,
                    primary_keys: [pk_from, pk_to],
                    foreign_keys: [
                        {
                            attribute: pk_from,
                            entity: ent_from.name,
                            primary_key: ent_from.primary_keys[0]
                        },
                        {
                            attribute: pk_to,
                            entity: ent_to.name,
                            primary_key: ent_to.primary_keys[0]
                        }
                    ],
                    attributes: []
                };
            });

        fullEntities = [...fullEntities, ...weakEntities];
        fullEntities = fullEntities.sort((e1, e2) => e1.foreign_keys.length - e2.foreign_keys.length);

        if(export_type === 'sql') {
            const sql = fullEntities.map(e => 
                'CREATE TABLE ' + e.name + ' (\n' + 
                    e.primary_keys.map(p => '    ' + p + ' INTEGER NOT NULL;').join('\n') + '\n' +
                    e.foreign_keys.map(f => '    ' + f.attribute + ' INTEGER NOT NULL;').join('\n') + '\n' +
                    e.attributes.map(a => '    ' + a + ' TEXT;').join('\n') + '\n' +
                    '    CONSTRAINT pk_' + nextNum() + ' PRIMARY KEY (' + e.primary_keys.join(', ') + ');\n' +

                    e.foreign_keys.map(f => `    CONSTRAINT fk_${nextNum()} FOREIGN KEY (${f.attribute}) REFERENCES ${f.entity}(${f.primary_key}) ON DELETE CASCADE;`).join('\n') +
                '\n);'
            ).join('\n\n');
            console.log(sql);
            fs.writeFileSync(changeFileExtesion(file, '.sql'), `/* Generated Oracle SQL from '${file}' */\n\n` + sql);
        } else if (export_type === 'rel') {
            const rel = fullEntities.map(e => e.name + '(' + e.primary_keys.join(', ') + ', ' + e.foreign_keys.map(f => f.attribute).join(', ') + ', ' + e.attributes.join(', ') + ')').join('\n');
            console.log(rel);
            fs.writeFileSync(changeFileExtesion(file, '.txt'), `/* Generated Relational Model from '${file}' */\n\n` + rel);
        } else {
            console.error('Invalid/missing export type ("sql" or "rel")');
            console.error('Try this: node index.js ' + file + ' sql');
        }
    } catch (err) {
        console.error(err);
    }
} else {
    console.error('Enter filename like so: node index.js "ueberflieger.erdplus"');
}
