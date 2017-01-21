var config = {}

config.endpoint = "https://edgarcompanies.documents.azure.com:443/";
config.primaryKey = "HxGY1XAFls1OGZQsS9fSQawxiqY642MjLGpNn2dwBfgAI2VoqUt8t9L25yFtECrGbeL5msJnnkGfkrgzNmoUYA==";

config.database = {
    "id": "edgar1"
};

config.collection = {
    "id": "comps1"
};

// sproc for bulk data import into documentdb
config.sproc = {
    "id": "bulkImport"
};


config.MaxLimit = {
    "Limit": "2000"
};



module.exports = config;
