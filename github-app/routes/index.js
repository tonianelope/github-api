var express = require('express');
var scraper = require('../public/js/scraper');
var jsonControl = require('../public/js/jsonController');
//var github = require('octonode');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Github Visual' });
});

router.post('/repo', scraper.get_repo, (req, res)=>{
    res.redirect('/load');
});

router.get('/load', (req, res)=>{
    console.log(req.query.repo);
    jsonControl.makeJSON(req.query.repo, (err)=>{
        if(err) throw(err);
        res.redirect('/map');
    })

});

router.get('/map', (req, res)=>{
    console.log(req.query.repo); // selected val
    //select input json!
    res.render('worldmap');
});

module.exports = router;
