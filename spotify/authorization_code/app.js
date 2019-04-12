/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = ''; // Your client id
var client_secret = ''; // Your secret
var redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri

var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
var mysql = require('mysql');
var path = require('path');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodeDb"
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

   //Note that in version 4 of express, express.bodyParser() was
   //deprecated in favor of a separate 'body-parser' module.
   app.use(bodyParser.urlencoded({ extended: true }));

   var express = require('express');
   var session = require('express-session');



   app.use(session({secret:'XASDASDA'}));
   var ssn ;
   app.get('/',function(req,res){
       ssn=req.session;
      /*
      * Here we have assign the 'session' to 'ssn'.
      * Now we can create any number of session variable we want.
      * Here we do like this.
      */
      // YOUR CODE HERE TO GET COMPORT AND COMMAND
      ssn.comport;
      ssn.command;
   });

   var ssn;
   app.get('/',function(req,res) {
  ssn = req.session;
  if(ssn.email) {
    res.redirect('/public/redirect.html');
  } else {
    res.render('/public/index.html');
  }
});
   app.post('/registers', function(req, res){
     res.send('you snet "'+ req.body.username + req.body.passwords + req.body.email +'".');
     var username = req.body.username;
     var password = req.body.passwords;
     var email = req.body.email;

       var date = new Date();

       var hour = date.getHours();
       hour = (hour < 10 ? "0" : "") + hour;

       var min  = date.getMinutes();
       min = (min < 10 ? "0" : "") + min;

       var sec  = date.getSeconds();
       sec = (sec < 10 ? "0" : "") + sec;

       var year = date.getFullYear();

       var month = date.getMonth() + 1;
       month = (month < 10 ? "0" : "") + month;

       var day  = date.getDate();
       day = (day < 10 ? "0" : "") + day;

       var time = year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

       var idNumber = Math.floor(Math.random() * 1000000000);

     con.connect(function(err) {
       if (err) throw err;
       console.log("Connected!");
       var sql = "INSERT INTO members (id, username, sign_up_date, email, account_permissions, email_activation, password) VALUES ('"+idNumber+"','"+username+"', '"+time+"', '"+email+"', '0', '1', '"+password+"')";
       con.query(sql, function (err, result) {
         if (err) throw err;
         console.log(""+username+": registered");
       });
     });
   });

   app.post('/myaction', function(req, res) {
     //res.send('You sent the name "' + req.body.user + req.body.password + '".');
     var user = req.body.user;
     var pwd = req.body.password;
       con.connect(function(err) {
       if (err) throw err;
       con.query("SELECT id, username FROM members where username='"+user+"' and password='"+pwd+"'", function (err, result) {
         if (err) throw err;
         if(result.length == 0){
           res.writeHead(302, {'Location': 'http://localhost:8888/' + req.url});
           res.end();

         }else{
        ssn = req.session;
        ssn.usernames = user;
        res.end('done');
        res.redirect('/register/auth.html')
        console.log(ssn.usernames);
       }
       });
     });
   });

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
          con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "UPDATE members SET account_token = '"+access_token+"' WHERE username = '"+"'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
          console.log(access_token);

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});
console.log("hey");
app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
