const fs = require('fs');
const path = require('path');

function changeFileExtesion(filepath, ext) {
   return path.format({ ...path.parse(filepath), base: undefined, ext: ext })
}

const file = process.argv[2];

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

        const fullEntities =
        entities
            .map(e => {
                e.attributes = attributes.filter(a => a.to === e.id/*  && !a.pk */).map(a => a.name); // TODO primary_keys
                return e;
            });

        const sql = fullEntities.map(e => 
            `CREATE TABLE ${e.name} (\n${e.attributes.map(a => '    ' + a + ' VARCHAR(255);').join('\n')}\n);`
        ).join('\n\n');

        console.log(sql);

        fs.writeFileSync(changeFileExtesion(file, '.sql'), sql);

    } catch (err) {
        console.error(err);
    }
} else {
    console.error('Enter filename like so: node index.js "ueberflieger.erdplus"');
}
