var User = require('../../models/user');
var Repo = require('../../models/repo');
var Commit = require('../../models/commit');
var auth = require('../../routes/user');
var github = require('octonode');

//move!!!
var client = github.client();


save_user = function (user_login, cb) {
    console.log(`Saving ${user_login}`);
    var ghuser = client.user(user_login);
    ghuser.info((err, info, head)=>{
        if(err){
            throw err;
        }
        var u = new User({
            user_id: info.id,
            name: info.name,
            login: info.login,
            location: info.location,
            avatar_url: info.avatar_url
        });
        u.save((err)=>{
           if(err) throw err;
            console.log("New User: "+u);
        });
        cb(u._id);
    });
};

get_user = function(user_login, cb){
    console.log("Looking for "+user_login);
    User.findOne({login: user_login}, '_id', (err, user) => {
        if(err) throw err;
        else if(user){ console.log(`${user_login} in DB`);cb(user);}
        else save_user(user_login, (user_id)=>{
                cb(user_id);
            });
    });
    cb(undefined);
};


save_repo = function(repo_name){
    //client = auth.client;
    //console.log("CLIENT IS: "+client);
    //client = undefined;
    var ghrepo = client.repo(repo_name);
    ghrepo.contributors((err, contributors, head) => {
        console.log(head);
        if(err) throw err;
        else{
            var contribs = [];
            for(var i=0; i<contributors.length; i++){
                //console.log(contributors[i]);
                //console.log(contributors[i].contributions);
                get_user(contributors[i].login, (user_id)=>{
                    contribs.push({
                        contributions: contributors[i].contributions,
                        user: user_id
                    });
                });
            }
            ghrepo.info((err, info, head)=>{
               if(err) {
                   throw err;
                   return
               }
               var r = new Repo({
                   repo_id: info.id,
                   name: info.name,
                   path: info.full_name,
                   description: info.description,
                   owner: info.owner.id,
                   contributors: contribs
               });
               r.save((err)=>{
                   if(err) throw err;
                   console.log("New repo: "+r);
               });
            });
        }
    });
};


exports.get_repo = (req, res, next) =>{
    var repo_name = req.body.repo;
    Repo.findOne({name: repo_name}, (err, repo)=>{
        if(err) throw err; //redirect to error??
        else if(repo) console.log("Found repo");
        else{
            console.log(`${repo_name} not saved. getting repo ...`);
            save_repo(repo_name);
        }
    });
    console.log('END SCRAPE');
    res.redirect('/map');
};

exports.insert_user = (req, res, next)=>{
    var u = new User({
        user_id: 1,
        name: "monalisa octocat",
        login: 'octocat',
        location: "San Francisco",
        avatar_url: "https://github.com/images/error/octocat_happy.gif"
    });
    u.save((err)=>{
        if(err) throw err;
        console.log("New User: "+u);
    });
    //cb(null, u);
    res.send(u);
};