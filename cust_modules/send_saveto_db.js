#!/usr/bin/env node

function sendsavedb(jsontext)
{
  
var filestream = require("fs");
var connect_db = require('./db_operation')
var jsontxt =jsontext; 
var config = require('./App_config')

   var b=JSON.parse(jsontxt);
   var acdata = [{items:[]}];
   var maxlimit=config.MaxLimit.Limit;
    var startindex = b[0].items.length < maxlimit ? b[0].items.length : maxlimit;
   
    for(var k=0; k < startindex; k++){
        var v = b[0].items[k];
        acdata[0].items.push(b[0].items[k]);
    }
    connect_db.dbfunctions.savedocdb(jsontxt,acdata,startindex,maxlimit)
   // console.log("Final message for operation----- "+ connect_db.dbfunctions.savedocdb(jsontxt,acdata,limit)); 

} 
module.exports.sendsavedb=sendsavedb;