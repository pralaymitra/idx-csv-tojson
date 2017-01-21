"use strict";
function read_SaveJsonTotext(callurl,keytype,Header,collength,startline,Cikreq)
{
var filestream = require("fs");
var jsondata = require('./jsonworking')
var request = require('request');
function keys(){if(keytype==1){return ['CIK']}else{return ['CIK','Company Name']}}
request.get(callurl, function (error, response, ResponseData) {
  if (!error && response.statusCode == 200) {
    var jsondta = jsondata.Dotext(ResponseData,Header,keys(),collength,startline,Cikreq);  
    filestream.writeFile("E:/jsonresult.txt", jsondta, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
  }
  else
  {   
    console.log("Error " + error.message);
  }

})

}

function read_SendJson(callurl,keytype,Header,collength,startline,Cikreq)
{
var jsondata = require('./jsonworking')
var request = require('request');
var savejson=require('./send_saveto_db');

function keys(){if(keytype==1){return ['CIK']}else{return ['CIK','Company Name']}}
request.get(callurl, function (error, response, ResponseData) {
  if (!error && response.statusCode == 200) {
    var jsondta = jsondata.Dotext(ResponseData,Header,keys(),collength,startline,Cikreq);  
    savejson.sendsavedb(jsondta);
  }
  else
  {   
   return ("Error " + error);
  }

})

}

module.exports.writeJson=
{read_SendJson:read_SendJson,read_SaveJsonTotext:read_SaveJsonTotext};



