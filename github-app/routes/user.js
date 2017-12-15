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

var auth_url = auth.login(['user', 'repo']); // and gist for read write access

// Store info to verify against CSRF
var state = auth_url.match(/&state=([0-9a-z]{32})/i);
var client;

/* CHECK if user is autheticated - else promt to login */
var authenticated = function (req, res, next) {
    console.log("AUTH: " + process.env.GITHUB_TOKEN);
    if (process.env.GITHUB_TOKEN) {
        return next();
    }
    res.redirect('/?e=' + encodeURIComponent('Please login to access!'));
};

/* Redirect user to github login*/
router.get('/login', (req, res) => {
    //var uri = url.parse(req.url);
    res.writeHead(302, {'Content-Type': 'text/plain', 'Location': auth_url});
    res.end('Redirecting to ' + auth_url);
});

/* Callback from github - save token */
router.get('/auth', (req, res) => {
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
            res.redirect('profile');
        });
    }
});

/* check if user autheticated - get user data - display profile */
router.get('/profile', authenticated, scraper.get_all_files, (req, res) => {
        console.log();

        res.render('profile.hbs', {
            user: res.info.login,
            user_image: res.info.avatar_url,
            github: res.info.html_url,
            repos: res.repos,
            auth: process.env.GITHUB_TOKEN
        });
    });

/* clear token */
router.get('/logout', (req, res)=>{
    process.env.GITHUB_TOKEN = "";//process.env['NOTHING'];
    res.redirect('/');
});

module.exports = router;
