var express = require('express');
var GitHubApi = require('github');
var http = require('http');
var path = require('path');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// app.use('/', index);
// app.use('/users', users);
app.get('/', (req, res) => {
    res.render('home.hbs',{
        client_id: process.env.CLIENT_ID,
    });
});

var github = new GitHubApi({
    host: 'api.github.com',
    version: "3.0.0",
    rejectUnauthorized: false
});

// github.users.getFollowingForUser({
//     // optional
//     // headers: {
//     //     "cookie": "blahblah"
//     // },
//     username: 'defunkt'
// }, function (err, res) {
//     if (err) throw err;
//     console.log(JSON.stringify(res, undefined, 2));
// });
app.get('/auth', (req, res)=>{
    console.log('/AUTH');

    //console.log(req);
    //console.log('\n');
    console.log(req.params);//['socket']['req.IncomingMessage']['client.query']['code'])
    console.log(res.body);
    //session_code = req.env['rack.request.query_has']['code'];
    //console.log(JSON.stringify(req, undefined, 2));
    //console.log(JSON.stringify(res, undefined, 2));
    // var postIt = http.request('https://github.com/login/oauth/access_token', (res)=>{
    // });
});


app.post('/login', (req, res) => {
    console.log('LOGIN');


    // github.authorization.create({
    //     scopes: ['user', 'public_repo', 'repo', 'repo:status', 'gist'],
    //     client_id: process.env.CLIENT_ID,
    //     client_secret: process.env.CLIENT_SECRET
    // }, function(err, resA){
    //         console.log('AUTH');
    //         if(err) throw err;
    //         console.log(JSON.stringify(resA, undefined, 2));
    // });


    github.authenticate({
        type: 'oauth',
        key: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET
    }, function(err, resA){
        console.log('AUTH');
        if(err) throw err;
        console.log(JSON.stringify(resA, undefined, 2));
    });

    console.log('Next');
    // github.repos.getAll({
    //     visibility: 'private',
    //     affiliation: 'owner'
    // }, (err1, res2)=>{
    //     if(err1) throw err1;
    //     console.log(JSON.stringify(res2, undefined, 2));
    // });
});

// github.users.getFollowingForUser({
//     user: "mikedeboer"
// }, function(err, res) {
//     console.log(JSON.stringify(res));
// });

// var github = new GitHubApi({
//     // optional
//     timeout: 5000,
//     host:  'api.github.com',// 'github.my-GHE-enabled-company.com', // should be api.github.com for GitHub
//     //pathPrefix: '/api/v3', // for some GHEs; none for GitHub
//     protocol: 'https',
//     port: 9898,
//     proxy: '<proxyUrl>',
//     ca: 'whatever',
//     headers: {
//         'accept': 'application/vnd.github.something-custom',
//         'cookie': 'something custom',
//         'user-agent': 'something custom'
//     },
//     requestMedia: 'application/vnd.github.something-custom',
//     rejectUnauthorized: false, // default: true
//     family: 6
// })



// github.authorization.create({
//     scopes: ['user', 'public_repo', 'repo', 'repo:status', 'gist'],
//     note: 'what this auth is for',
//     note_url: 'http://url-to-this-auth-app',
//     headers: {
//         'X-GitHub-OTP': 'two-factor-code'
//     }
// }, function (err, res) {
//     if (err) throw err
//     if (res.token) {
//         // save and use res.token as in the Oauth process above from now on
//     }
// })

app.listen(5000, () => {
    console.log('Server on port 5000');
});

module.exports = app;
