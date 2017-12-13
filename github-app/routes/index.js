var express = require('express');
var scraper = require('../public/js/scraper');
var jsonControl = require('../public/js/jsonController');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=> {
    jsonControl.all_repos((repos)=>{
        res.render('index', {
            title: 'Github Visual',
            repos: repos,
            login: !process.env.GITHUB_TOKEN,
            logged: process.env.GITHUB_TOKEN
        });
    });
});

/* GET repo details*/
router.post('/repo', scraper.get_repo);

/* LOAD repo*/
router.get('/load', (req, res)=>{
    console.log(req.query.repo);
    jsonControl.makeJSON(req.query.repo, (err) => {
        if (err) throw(err);
        res.redirect(`/map?repo=${encodeURIComponent(req.query.repo)}`);
    })
});

/* MAP the data*/
router.get('/map', (req, res)=>{
    //select input json?
    res.render('worldmap', {repo: req.query.repo});
});

module.exports = router;