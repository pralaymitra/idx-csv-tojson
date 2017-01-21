var config = require("./App_config");
var documentClient = require('documentdb-q-promises').DocumentClientWrapper;
var docclient=require('documentdb').DocumentClient;
var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });  
var docclientdb = new docclient(config.endpoint, { "masterKey": config.primaryKey })
 

var bulkImport = {
id: "bulkImport",
body:function bulkImport(docObject) {
    var context = getContext();
    var collection = context.getCollection();
   
    var collectionLink = collection.getSelfLink();
   
    var count = 0;

    // Check input
    if (!docObject.items || !docObject.items.length) throw new Error("invalid document input parameter or undefined.");
    var docs = docObject.items;
    var docsLength = docs.length;
    if (docsLength == 0) {
        context.getResponse().setBody(0);
    }

    // Call the funct to create a document.
    tryCreateOrUpdate(docs[count], callback);

    // Obviously I have truncated this function. The above code should help you understand what has to change.

    // Note that there are 2 exit conditions:
    // 1) The createDocument request was not accepted. 
    //    In this case the callback will not be called, we just call setBody and we are done.
    // 2) The callback was called docs.length times.
    //    In this case all documents were created and we don't need to call tryCreate anymore. Just call setBody and we are done.
    function tryCreateOrUpdate(doc, callback) {
         doc.id=doc.CIK;
        var isAccepted = true;
        var isFound = collection.queryDocuments(collectionLink, 'SELECT * FROM root r WHERE r.id = "' + doc.id + '"', function (err, feed, options) {
            if (err) throw err;
            if (!feed || !feed.length) {
                isAccepted = collection.createDocument(collectionLink, doc, callback);
            }
            else {
                // The metadata document.
                var existingDoc = feed[0];
                isAccepted = collection.replaceDocument(existingDoc._self, doc, callback);
            }
        });

        // If the request was accepted, callback will be called.
        // Otherwise report current count back to the client, 
        // which will call the script again with remaining set of docs.
        // This condition will happen when this stored procedure has been running too long
        // and is about to get cancelled by the server. This will allow the calling client
        // to resume this batch from the point we got to before isAccepted was set to false
        if (!isFound && !isAccepted) getContext().getResponse().setBody(count);
    }

    // This is called when collection.createDocument is done and the document has been persisted.
    function callback(err, doc, options) {
        if (err) throw err;

        // One more document has been inserted, increment the count.
        count++;

        if (count >= docsLength) {
            // If we have created all documents, we are done. Just set the response.
            getContext().getResponse().setBody(count);
        } else {
            // Create next document.
            tryCreateOrUpdate(docs[count], callback);
        }
    }
}
}

function CreateStoredProcedure()
{
    client.createStoredProcedureAsync('dbs/'+config.database.id+'/colls/'+config.collection.id, bulkImport)
    .then(function (response) {       
        console.log("Successfully created stored procedure with this id------"+response.resource.id);
    }, function (error) {
      console.log(error.code==409?"Stored Procedure already exist with this id------"+bulkImport.id:error.code);
    });
   
}          
    
var total=0; 
function savedocdb(jsondata, actualData, startIndex, maxlimit)
{     
  var b=JSON.parse(jsondata);
  total=total+actualData[0].items.length;
  console.log('\n');  
  console.log("Data Saved",total);  
   client.executeStoredProcedureAsync('dbs/'+config.database.id+'/colls/'+config.collection.id+'/sprocs/'+config.sproc.id,actualData)
    .then(function (response) {
        var acdata = [{items:[] }];
            var limit = 0;
            for(var k=startIndex; k < b[0].items.length; k++){
                if(limit < maxlimit){
                    acdata[0].items.push(b[0].items[k]);
                    startIndex++;
                }
                else{
                    break;
                }
                limit++;
            }
            if(acdata[0].items.length > 0){
                savedocdb(jsondata, acdata, startIndex,maxlimit);
            }
      
    }, function (err) {
         console.log("Error", err);
    });
 }




function createdb()
{
var databaseDefinition = { id:config.database.id};
var collectionDefinition = { id:config.collection.id };
docclientdb.createDatabase(databaseDefinition, function(err, database) {
    if(err) return console.log(err.code==409?"DataBase already exist with this id----"+databaseDefinition.id:err.code);
    console.log('created db-----'+databaseDefinition.id);   
});
}


function createcoll()
{
var databaseUrl = `dbs/${config.database.id}`;
var collectionDefinition = { id:config.collection.id };
docclientdb.createCollection(databaseUrl, collectionDefinition, function(err, collection) {
        if(err) return console.log(err.code==409?"Collection already exist with this id------"+collectionDefinition.id:err.code);
        console.log('created collection------'+collectionDefinition.id);
        

    });
}


function dbcleanup() {  
  console.log(`Cleaning up by deleting database------- ${config.database.id}`);
   var databaseUrl = `dbs/${config.database.id}`;
    return new Promise((resolve, reject) => {
        docclientdb.deleteDatabase(databaseUrl, (err) => {
            if (err) reject(err)
            else resolve(null);
        });
    });
       
}

module.exports.dbfunctions=
{savedocdb:savedocdb,dbcleanup:dbcleanup,dbcreate:createdb,Colcreate:createcoll,dbcreate_storedproceedurebulk:CreateStoredProcedure};
