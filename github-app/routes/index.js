var express = require('express');
//var github = require('octonode');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Github Visual' });
});

router.get('/get-repo', (req, res, next)=>{
    //input from from
    //call function pass repo??
});

router.get('/map', (req, res)=>{
  res.render('worldmap');
});

module.exports = router;
