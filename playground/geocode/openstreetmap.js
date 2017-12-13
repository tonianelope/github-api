var axios = require('axios');

var locations = ["United Kingdom",  "Berlin, Germany", "err"];


for(var i = 0; i<locations.length; i++){
    var gecodeURL = `http://nominatim.openstreetmap.org/search?format=json&q=${locations[i]}`;

    axios.get(gecodeURL)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        });
}

