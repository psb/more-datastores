// var fs = require("fs");
var path = require("path");
// var httpGet = require("http-get");
// var _ = require("underscore");

var basePath = "/Users/Catalyst/code/more-datastores/archive.org";
var _ = require(path.join(basePath + "/node_modules/underscore"));
var httpGet = require(path.join(basePath + "/node_modules/http-get"));
// var sitesDirectoryPath = path.join(basePath + "/data/sites/");

var mongodb = require(path.join(basePath + "/node_modules/mongodb"));

// var mongoServer = new mongodb.Server("127.0.0.1/archive", 27017, {});
// var mongoClient = mongodb.MongoClient;
var createOptions = function(url){
  var options = {
    url: url,
    stream: true
  };
  return options;
};

    

exports.downloadUrls = function(records, cb){
  mongodb.Db.connect("mongodb://localhost:27017/archive", function(error, db){
    if (error) {
      console.log(error);
    } else {
      _.each(records, function(record){
        var options = createOptions(record.url);
        httpGet.get(options, function(error, result){
          if (error) {
            console.log(error);
          } else {
            var website = "";
            result.stream.on("data", function(data){
              website += data;
            });
            result.stream.on("end", function(){
              var collection = db.collection("websites");
              collection.update({_id: record._id}, {$set: {html: website}})
              cb(result.headers);
            });
            result.stream.resume();
          }
        });
      });
      return true;
    }
  });
};



