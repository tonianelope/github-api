var http = require('http');
var path = require('path');
var express = require('express');
var github = require('octonode');
var url = require('url');
var qs = require('querystring');
var hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Build the authorization config and url
var auth_url = github.auth.config({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    apiUrl: 'https://github.com/',  //login/oauth/authorize/?scope=user:email&',
    webUrl: 'https://github.com/' //login/oauth/'//authorize'
}).login(['user', 'repo']); //gist for read write access

// Store info to verify against CSRF
var state = auth_url.match(/&state=([0-9a-z]{32})/i);
var client;

app.get('/', (req, res) => {
    res.render('home.hbs',{
    });
});

app.get('/auth', (req, res)=>{
    console.log("AUTH");
    var uri = url.parse(req.url);
    var values = qs.parse(uri.query);
    // Check against CSRF attacks
    if (!state || state[1] != values.state) {
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end('');
        console.log("ERROR");
    } else {
        github.auth.login(values.code, function (err, token, headers) {
            //res.writeHead(200, {'Content-Type': 'text/plain'});
            client = github.client(token);
            console.log('SET CLIENT');

//             client.get('/user', {}, function (err, status, body, headers) {
//                 console.log(body); //json object
// //                res.render(body);
//             });
            //res.end(token);
            res.redirect('/profile');
        });
    }
});

app.get('/profile', (req, res)=>{
    console.log(client);
    var ghme = client.me();
    ghme.info((err, info)=>{
        if(err) throw err;
        console.log(info);

        ghme.repos((err1, repos)=>{
            if(err1) throw err1;
            console.log(repos);

            res.render('profile.hbs', {
                user: info.login,
                user_image: info.avatar_url,
                github: info.html_url,
                repos: repos
            });
        });
    });
});

app.get('/login', (req, res) =>{
    var uri = url.parse(req.url);
    res.writeHead(302, {'Content-Type': 'text/plain', 'Location': auth_url});
    res.end('Redirecting to ' + auth_url);
});

hbs.registerHelper('list', function(context, options) {
    var ret = "<ul>";

    for(var i=0, j=context.length; i<j; i++) {
        ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }

    return ret + "</ul>";
});

hbs.registerHelper('if', function(conditional, options) {
    if(conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});



app.listen(5000, () => {
    console.log('Server on port 5000');
});
