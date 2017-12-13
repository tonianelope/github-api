var request = require('request');

var locations = ["United Kingdom",  "Berlin, Germany", "err"];

var options = {
    hostname: 'nominatim.openstreetmap.org',
    path: '/serach',

};

for(var i = 0; i<locations.length; i++){
    var gecodeURL = `http://nominatim.openstreetmap.org/search?format=json&q=${locations[i]}`;

    request.get(gecodeURL, (err, res, body)=>{
        console.log(res);
        console.log();
        console.log(body);
    });
}

