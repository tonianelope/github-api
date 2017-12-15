//var User = require('../../models/user');
var Repo = require('../../models/repo');
//var Commit = require('../../models/commit');

var request = require('request');
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

exports.all_repos = (cb) =>{
    Repo.find((err, result)=>{
        return cb(result);
    });
};

exports.makeJSON = (repo_name, cb) => {
    var map_data = {
        "type": "FeatureCollection",
        "max": 0,
        "features": []
    };
    console.log("LOOKING FOR "+repo_name);
    Repo.findOne({path: repo_name})
        .populate('owner')
        .populate('contributors.user')
        .exec((err, repo) => {
            console.log(JSON.stringify(repo, null, "\t"));
            if(repo) {

                //and info about repo??
                              console.log(repo.contributors.length);

                add_all(repo.contributors, 0, map_data, (err, new_map_data) => {
                    if (err) {
                        cb(err);
                        return;
                    }
                    console.log(new_map_data);
                    console.log("writing json");
                    fs.writeFile(`github-app/public/json/repo.json`, JSON.stringify(new_map_data), (err) => {
                        if (err) cb(err, undefined);
                        console.log("Wrote file");
                        cb(undefined);
                    });
                });
            }else{
                cb("REPO NOT FOUD");
            }
        });

};


var add_all = function (users, i, map_data, cb) {
    //console.log(users);
    console.log(i)
    if(i >= users.length){
        cb(undefined, map_data);
        return;
    }
    var location = users[i].user.location;
    console.log("LOC1: "+location);
    if(location){
        get_coordinates(users[i].user.location, (err, long, lat)=>{
            console.log(err);
            if(long && lat) {
                console.log("Pushing "+users[i].user.login + long);
                map_data.features.push({
                    "type": "Feature",
                    "properties": {
                        "mass": users[i].contributions.toString(),
                        "login": users[i].user.login,
                        "name": users[i].user.name,
                        "reclong": long,
                        "reclat": lat,
                        "city": users[i].user.location,
                        "image": users[i].user.avatar_url
                    }
                });
            }
            else if(err && err !== "NO RESULT"){
                cb(err, undefined);
                return;
            }
            if(i===0){
                map_data.max = users[i].contributions;
            }
            add_all(users, i+1, map_data, cb);
        });
    }
    else{
        add_all(users, i+1, map_data, cb);
    }
    //HANDLE users without location???
};

var get_coordinates = function(location, cb){
    // multiple locations???

    var locations = location.split("and");
    console.log(locations[0]);
    var gecodeURL = `http://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(locations[0])}`;
    console.log("LOC: "+locations);
    //TODO jsonify response!!!
    request.get(gecodeURL, (err, res, body)=>{
        console.log(body.length);
        if(err) cb(err, undefined, undefined);
        else{
            var data = JSON.parse(body);
            console.log(data);
            console.log(res);
            if(data.length > 0){
                cb(undefined, data[0].lon, data[0].lat);
            }else{
                cb("NO RESULT", undefined, undefined);
            }
        }
    });
};