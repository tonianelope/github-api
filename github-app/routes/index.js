var express = require('express');
var scraper = require('../public/js/scraper');
var jsonControl = require('../public/js/jsonController');
//var github = require('octonode');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=> {
    jsonControl.all_repos((repos)=>{
        res.render('index', { title: 'Github Visual', repos: repos});
    });
});


router.post('/repo', scraper.get_repo);


router.get('/load', (req, res)=>{
    console.log(req.query.repo);
    jsonControl.makeJSON(req.query.repo, (err) => {
        if (err) throw(err);
        res.redirect('/map');
    })
});

router.get('/map', (req, res)=>{
    console.log(req.query.repo); // selected val
    //select input json!
    res.render('worldmap', {repo: req.query.repo});
});

module.exports = router;
