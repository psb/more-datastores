// crontab -e: */1 * * * * /usr/local/bin/node /Users/Catalyst/code/archive.org/workers/htmlfetcher.js

var path = require("path");
var basePath = "/Users/Catalyst/code/more-datastores/archive.org";

var mongodb = require(path.join(basePath + "/node_modules/mongodb"));

var htmlFetcherHelpers = require("./lib/html-fetcher-helpers");

var urlArray = [];
var processUrlFile = function(urlArray){
  if (urlArray.length > 0) {
    htmlFetcherHelpers.downloadUrls(urlArray, function(headers){
      console.log(headers["date"]);
    });
  } else {
    process.exit();
  }
};

mongodb.Db.connect("mongodb://localhost:27017/archive", function(error, db){
  if (error) {
    console.log(error);
  } else {
    console.log("Connected");
    var collection = db.collection("websites");
    collection.find({html: false}).toArray(function(error, results){
      if (error) { console.log(error); }
      else { 
        urlArray = results;
        processUrlFile(urlArray);
      }
    });
  }
});