var request = require('request');

var locations = ["Prague"];


for(var i = 0; i<locations.length; i++){
    var gecodeURL = `http://nominatim.openstreetmap.org/search?format=html&accept-language=en&q=${locations[i]}`;

    request.get(gecodeURL, (err, res, body)=>{
        //console.log(res);

        //nominatim_results
        console.log();
        console.log(body);
    });
}

