var express = require('express');
var github = require('octonode');
var router = express.Router();

/* Configure github oath */
var auth = github.auth.config({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    apiUrl: 'https://github.com/',
    webUrl: 'https://github.com/'
});


var authenticated = function (req, res, next) {
    if(process.env.GITHUB_TOKEN){
        return next();
    }
    res.redirect('login');
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
            //res.writeHead(200, {'Content-Type': 'text/plain'});
            client = github.client(token);
            process.env['GITHUB_TOKEN'] = token;
            console.log("CLIENT INITIALISED");
            //console.log(client);
            res.redirect('profile');
        });
    }
});

router.get('/profile', authenticated, (req, res)=>{
    //check if client
    var ghme = client.me();
    ghme.info((err, info, head)=>{
        if(err) throw err;
        console.log(head);

        // ghme.repos((err1, repos)=>{
        //     if(err1) throw err1;
        //     console.log(repos);
        //
        //     res.render('profile.hbs', {
        //         user: info.login,
        //         user_image: info.avatar_url,
        //         github: info.html_url,
        //         repos: repos
        //     });
        // });
        res.render('profile.hbs', {
                    user: info.login,
                    user_image: info.avatar_url,
                    github: info.html_url,
                    repos: []
                });
    });
});

router.get('/logout', (req, res)=>{
    auth.revoke();
});

module.exports = {
    router:router,
    client:client
};
