var User = require('../../models/user');
var Repo = require('../../models/repo');
var Commit = require('../../models/commit');
var axios = require('axios');

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
        "max": 0,
        "features": []
    };
    console.log("LOOKING FOR "+repo_name);
    Repo.findOne({path: repo_name})
        //.populate('owner')
        .populate('contributors.user')
        .exec((err, repo) => {
            //and info about repo??
            console.log(repo.contributors.length);
            add_all(repo.contributors, 0, map_data, (err, map_data) => {
                if(err){
                    cb(err, undefined);
                    return;
                }
                console.log("writing json");
                fs.writeFile(`../json/repo.json`, JSON.stringify(map_data));
            });
        });
};


var add_all = function (users, i, map_data, cb) {
    //console.log(users);
    //console.log(i)
    //console.log(" AT "+ users[i].user);
    var location = users[i].user.location;
    if(location){
        get_coordinates(users[i].user.location, (err, long, lat)=>{
            if(err){
                cb(err, undefined);
                return;
            }
            if(i===0){
                map_data.max = users[i].contributions;
            }
            map_data.features.push({
                "type": "Feature",
                "properties": {
                    "mass": users[i].contributions,
                    "login": users[i].user.login,
                    "name": users[i].user.name,
                    "reclong": long,
                    "reclat": lat,
                    "city": users[i].user.location,
                    "image": users[i].user.avatar_url
                }
            });
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

    locations = location.split("and");
    var gecodeURL = `http://nominatim.openstreetmap.org/search?format=json&q=${locations[0]}`;

    axios.get(gecodeURL)
        .then((res)=>{
            //console.log(res.data);
            if(res.data.length > 0){
                cb(undefined, res.data[0].lon, res.data[0].lat);
                return;
            }
            cb("NO RESULT", undefined, undefined);
        })
        .catch((err)=>{
            cb(err, undefined, undefined);
        });
};