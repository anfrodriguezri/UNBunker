var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mydb;

/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
* 	"name": "Bob"
* }
*/
app.post("/api/visitors", function (request, response) {
  var userName = request.body.name;
  if(!mydb) {
    console.log("No database.");
    response.send("Hello " + userName + "!");
    return;
  }
  // insert the username as a document
  mydb.insert({ "name" : userName }, function(err, body, header) {
      if (err) {
        return console.log('[mydb.insert] ', err.message);
    }
    response.send("Hello " + userName + "! I added you to the database.");
  });
});

/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
 app.get("/api/visitors", function (request, response) {
    var names = [];
    if(!mydb) {
      response.json(names);
      return;
    }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
        body.rows.forEach(function(row) {
          if(row.doc.name)
            names.push(row.doc.name);
        });
        response.json(names);
    }
  });
});

function saveFile(data){
  var fs = require('fs');

  fs.writeFile("./tmp/test", JSON.stringify(data, null, 2), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
 }
function content_items_from_twitter(twitterUsername, socialFeed){
  var Twitter = require('twitter');

  var client = new Twitter({
    consumer_key: 'dxxI1DOvKwI8uK1MzxAMsSjvA',
    consumer_secret: 'zxgmLYwSCQ5QPqAnGlHwQJuEWDFJZMIPjR7NEW9SoikpsarV8L',
    access_token_key: '927052691741839360-ffsLkorHilBtUvQ21sMXvOzXwkHhWPu',
    access_token_secret: 'ahZyAqQWhl1gKuaGRrhHyi0N3d9ZSSBeDgcqFEmkjFvQA'
  });

  
  var params = {screen_name: 'nodejs', q: '@' + twitterUsername};

  let tweetsTexts = [];

  for( feed of socialFeed ){
    tweetsTexts.push({
      "content": feed,
      "contenttype": "text/plain",
      "language": "es"
    });
  }

  return client.get('https://api.twitter.com/1.1/search/tweets.json/', params)
        .then(function(tweets) {
              console.log( tweets.statuses.length );
              for(tweet of tweets.statuses){
                  tweetsTexts.push({
                    "content": tweet.text,
                    "contenttype": "text/plain",
                    "language": "es"
                  });
              }
              //saveFile(tweetsTexts);

              return tweetsTexts;
        }).catch(function(error){
          throw error;
        });
}

app.post("/twitter-personality-insight", function (request, response) {
    var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
    var personality_insights = new PersonalityInsightsV3({
        username: 'd66c776d-38ac-4dbe-84b7-017bebd48277',
        password: 'wQs83W4T5jjH',
        version_date: '2017-10-13',
        headers: {
            'X-Watson-Learning-Opt-Out': 'true'
        }
    });

    let summary = "";

    let summaryPromise = content_items_from_twitter(request.body.twitterUser, request.body.socialFeed)
                .then(function(contentItems){
                    if( contentItems.length == 0 ) response.json('No se pudo verificar el perfil');
                    var params = {
                        // Get the content items from the JSON file.
                        //content_items: require('./profile.json').contentItems,
                        content_items: contentItems,
                        consumption_preferences: true,
                        raw_scores: true,
                        headers: {
                            'accept-language': 'es',
                            'accept': 'application/json'
                        }
                    };
                    
                    personality_insights.profile(params, function(error, profile) {
                        if (error)
                            console.log('Error:', error);
                        else{
                            //console.log(JSON.stringify(response, null, 2));
                            saveFile(profile);
                            
                            var PersonalityTextSummaries = require('personality-text-summary');
                            var v3EnglishTextSummaries = new PersonalityTextSummaries({ locale: 'es', version: 'v3' });

                            summary = v3EnglishTextSummaries.getSummary(profile);

                            response.json(profile);
                        }
                    });
                }).catch(function(error){
                    throw error;
                })
    
});

// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  if (appEnv.services['cloudantNoSQLDB']) {
     // CF service named 'cloudantNoSQLDB'
     var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
 } else {
     // user-provided service with 'cloudant' in its name
     var cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
 }

  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
});

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));


app.use('/node_modules', express.static(__dirname + '/node_modules'));

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
