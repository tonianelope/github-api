var express = require('express');
var github = require('octonode');
var scraper = require('../public/js/scraper');

var router = express.Router();

/* Configure github oath */
var auth = github.auth.config({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    apiUrl: 'https://github.com/',
    webUrl: 'https://github.com/'
});


var authenticated = function (req, res, next) {
    console.log("AUTH: "+process.env.GITHUB_TOKEN);
    if(process.env.GITHUB_TOKEN){
        return next();
    }
    res.redirect('/?e=' + encodeURIComponent('Please login to access!'));
};

var auth_url = auth.login(['user', 'repo']); // and gist for read write access

// Store info to verify against CSRF
var state = auth_url.match(/&state=([0-9a-z]{32})/i);
var client;

/* GET user listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Redirect user to github login*/
router.get('/login', (req, res)=>{
    //var uri = url.parse(req.url);
    res.writeHead(302, {'Content-Type': 'text/plain', 'Location': auth_url});
    res.end('Redirecting to ' + auth_url);
});

router.get('/auth', (req, res)=>{
    // Check against CSRF attacks
    if (!state || state[1] != req.query.state) {
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end('');
        console.log("ERROR");
    } else {
        github.auth.login(req.query.code, function (err, token, headers) {
            console.log(headers);
            client = github.client(token);
            process.env['GITHUB_TOKEN'] = token;
            console.log("CLIENT INITIALISED");
            //console.log(client);
            res.redirect('profile');
        });
    }
});

router.get('/profile', authenticated, scraper.get_all_files,
 (req, res)=>{
    //check if client
        //console.log(res.info);
        //console.log(res.langs);
        res.render('profile.hbs', {
            user: "test2",
            user_image: 'https://avatars0.githubusercontent.com/u/23743176?v=4',
            github: "/profile",//info.html_url,
            repos: []
        });
});

module.exports = {
    router:router,
    client:client
};
