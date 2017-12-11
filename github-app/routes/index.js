var express = require('express');
var scraper = require('../scraper');
//var github = require('octonode');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Github Visual' });
});

router.post('/repo', scraper.get_repo);
    //(req, res, next)=>{
    //res.send('You entered the repo "' + req.body.repo + '".');
    //makeJSON(req.body.repo);
    //res.redirect(`/map?repo=${req.body.repo}`);
//});

router.get('/map', (req, res)=>{
    console.log(req.query.repo); // selected val
    //select input json!
    res.render('worldmap');
});

module.exports = router;
