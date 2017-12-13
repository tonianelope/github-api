var User = require('../../models/user');
var Repo = require('../../models/repo');
var Commit = require('../../models/commit');

var fs = require("fs");
// POPULATE BASED ON CONDITION
// populate({
//     path: 'fans',
//     match: { age: { $gte: 21 }},
//     // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
//     select: 'name -_id',
//     options: { limit: 5 }
// }).
// exec()

exports.makeJSON = (repo_name, cb) => {
    var map_data = {
        "type": "FeatureCollection",
        "features": []
    };

    Repo.findOne({path: repo_name})
        .populate('owner')
        .exec((err, repo)=>{
            //and info about repo??
            add_all(repo.contributors, i, map_data, (err, map_data)=>{
                fs.writeFile(`../json/${name}.json`, JSON.stringify(map_data));
            });
};

var add_all = function (users, i, map_data, cb) {
    get_coordinates(user.user.location, (err, coordinates)=>{
        if(err){
            cb(err, undefined);
            return;
        }
        map_data.features.push({
            "type": "Feature",
            "properties": {
                "mass": users[i].contributions,
                "login": users[i].user.login,
                "name": users[i].user.name,
                "reclong": "-176.833",
                "reclat": "-13.883",
                "city": users[i].user.location,
                "image": users[i].user.avatar_url
            }
        });
        add_all(users, i+1, map_data, cb);
    });
};

var get_coordiantes = function(raw_location, cb){
    // multiple locations???
};