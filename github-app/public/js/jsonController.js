var User = require('../../models/user');
var Repo = require('../../models/repo');

var request = require('request');
var fs = require("fs");

// return a list of all repos in the db
exports.all_repos = (cb) =>{
    Repo.find((err, result)=>{
        return cb(result);
    });
};

// export repo to db if in database
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
            if(repo) {

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

// add contributor to json
var add_all = function (users, i, map_data, cb) {
    if(i >= users.length){
        cb(undefined, map_data);
        return;
    }
    var location = users[i].user.location;
    // if user has location get it
    if(location){
        get_coordinates(users[i].user.location, (err, long, lat)=>{
            console.log(err);
            if(long && lat) {
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


// get coordinates for location (if multiple pick first)
var get_coordinates = function(location, cb){
    var locations = location.split("and");
    console.log(locations[0]);
    var gecodeURL = `http://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(locations[0])}`;
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