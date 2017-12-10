data = {
	  "type": "FeatureCollection",
	  "features": [
        {
		        "geometry": {
			          "type": "Point",
			          "coordinates": [-176.633, 51.883]
		        },
		        "type": "Feature",
		        "properties": {
			          "wikipedia": "Adak,_Alaska",
			          "city": "Adak"
		        },
		        "id": "Adak"
	      }, {
		        "geometry": {
			          "type": "Point",
			          "coordinates": [-175.2, -21.133]
		        },
		        "type": "Feature",
		        "properties": {
			          "wikipedia": "Nuku%CA%BBalofa",
			          "city": "Nuku%CA%BBalofa"
		        },
		        "id": "Nuku%CA%BBalofa"
	      }, {
		        "geometry": {
			          "type": "Point",
			          "coordinates": [-171.833, -13.833]
		        },
		        "type": "Feature",
		        "properties": {
			          "wikipedia": "Apia",
			          "city": "Apia"
		        },
		        "id": "Apia"
	      }, {
		        "geometry": {
			          "type": "Point",
			          "coordinates": [-170.7, -14.267]
		        },
		        "type": "Feature",
		        "properties": {
			          "wikipedia": "Pago_Pago",
			          "city": "Pago Pago"
		        },
		        "id": "Pago Pago"
	      }]
}

console.log(data.features[1].geometry.coordinates[1]);
