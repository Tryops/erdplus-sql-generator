# Erdplus SQL Generator
Script to generate **very basic** SQL create table statements based on `.erdplus` files. 

This is only intended as a boilerplate SQL generator to get started writing the actual create table statements. This script does not generate actual SQL. 

### Draw ER diagram
Draw a diagram with [ERDPlus](https://erdplus.com/standalone) and export it
(Menu > Export ...).

### Generate SQL
Use the `index.js` from this repo with the `sql` option:
```bash
node index.js "path/to/export.erdplus" sql
```
This will generate a `export.sql` with basic create table statements in the given directory. 
Be aware that this is very buggy and potentially not valid SQL. Also some attributes/columns might be duplicate. 

### Generate relational model
Use the `index.js` from this repo with the `rel` option:
```bash
node index.js "path/to/export.erdplus" rel
```
This will generate a `export.txt` with basic relational model text strings in the given directory. 
This is also very buggy and also has the same duplicate attributes/columns. 

![finally sql](res/finally.png)