var fs = require("fs");
var path = require("path");
var url = require("url");
var util = require('util');
var querystring = require('querystring');

var mongodb = require("mongodb");
var mongoServer = new mongodb.Server("127.0.0.1", 27017, {});
var mongoClient = new mongodb.Db("archive", mongoServer, {});

var websitesCollection;

mongoClient.open(function(error, p_client){
  if (error) {console.log(error);}
  else {
    mongoClient.createCollection("websites", function(error, collection){
      if (error) {console.log(error);}
      else {
        console.log("Created websites collection");
        websitesCollection = collection;
      }
    });
  }
});

var basePath = "/Users/Catalyst/code/more-datastores/archive.org";
var homePagePath = path.join(basePath + "/web/public/index.html");
var cssPath = path.join(basePath + "/web/public/styles.css");
var javascriptsPath = path.join(basePath + "/web/public/javascripts.js");

var $ = require(path.join(basePath + "/node_modules/jquery"));

var homePage = fs.readFileSync(homePagePath, "utf8");
var $resonseToPost = $("<p>The URL you submitted is being archived. Please check later for the result.</p>");

var writeResponseHead = function(res, code, contentType){
  var headers = {'Content-Type': contentType};
  res.writeHead(code, headers);
};

var parseQuery = function(query){
  var queryObject = querystring.parse(query);
  queryObject.urlToWrite = queryObject.url;

  return queryObject;
};

var saveToDB = function(queryObject){
  console.log("saving url");
  websitesCollection.update({url: queryObject.urlToWrite, html: false}, {url: queryObject.urlToWrite, html: false},{upsert: true});
};

var handleGetRequest = function(req, res){
  var urlObject = url.parse(req.url);
  
  switch(urlObject["pathname"]) {
    case "/":
      writeResponseHead(res, 200, "text/html");
      res.end(homePage);
      break;
    case "/styles.css":
      var css = fs.readFileSync(cssPath, "utf8");
      writeResponseHead(res, 200, "text/css");
      res.end(css);
      break;
    case "/javascripts.js":
      var javascripts = fs.readFileSync(javascriptsPath, "utf8");
      writeResponseHead(res, 200, "text/javascript");
      res.end(javascripts);
      break;
    default:
      var fixtureName = urlObject["pathname"].slice(1);   
      console.log(fixtureName);
      var webpage = websitesCollection.findOne({url: fixtureName, html: {$ne: false}});
      if (webpage) {
        writeResponseHead(res, 200, "text/html");
        res.end(webpage.html);
      } else { 
        writeResponseHead(res, 404, "text/plain");
        res.end();
      }
  }
};

var handlePostRequest = function(req, res, outputOverride){
  var urlObject = url.parse(req.url);
  
  if (urlObject["pathname"] === "/") {
    var query = "";
    req.addListener("data", function(data){
      query += data;
    });
    req.addListener("end", function(){
      var queryObject = parseQuery(query);
      console.log(queryObject);
      saveToDB(queryObject);
      writeResponseHead(res, 302, "text/html");
      $homePage = $(homePage);
      $homePage.find("#webpage").append($resonseToPost);
      var html = $("<html>").append($homePage.clone()).remove().html();
      res.end(html);
    });
  }
};

exports.handleRequest = function (req, res, outputOverride) {
  switch(req.method){
    case "GET":
      handleGetRequest(req, res);
      break;
    case "POST":
      handlePostRequest(req, res, outputOverride);
      break;
    default:
      response.writeHead(404, "Not found", {'Content-Type': 'text/html'});
      response.end();
  }  
};
