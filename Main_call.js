#!/usr/bin/env node
 var connect_db = require('./cust_modules/db_operation')
 var Read_save_json = require('./cust_modules/read_SaveJson')
 var argv = require('yargs').argv;

//connect_db.dbfunctions.dbcleanup();
//connect_db.dbfunctions.dbcreate();
//connect_db.dbfunctions.Colcreate();
//connect_db.dbfunctions.dbcreate_storedproceedurebulk();
Read_save_json.writeJson.read_SendJson(argv.url,argv.keytype,argv.Header,argv.collength,argv.startline,argv.Cikreq)








