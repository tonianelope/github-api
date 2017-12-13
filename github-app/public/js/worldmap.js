let map = d3.select("body")
    .append("svg")
    .attr("height", window.innerHeight)
    .attr("width", window.innerWidth);

let group = map.append("g");

let projection = d3.geoMercator()
    .scale((window.innerWidth) / (2 * Math.PI))
    .translate([window.innerWidth / 2, window.innerHeight / 2]);

let path = d3.geoPath()
    .projection(projection);

// World map and boundaries
d3.json("https://gist.githubusercontent.com/abenrob/787723ca91772591b47e/raw/8a7f176072d508218e120773943b595c998991be/world-50m.json", function(error, world) {
    if (error) throw error;
    group.append("path")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path); // d, contains a series of commands and parameters in the SVG Path Mini-Language

    // defines the boundaries all over the world
    group.append("path")
        .datum(topojson.mesh(world, world.objects.countries))
        .attr("class", "boundary")
        .attr("d", path);
});
// Tooltip
let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); // Tooltip that will show meteorites data

const URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"
    // All the meteorite strikes
const repofile = "../json/repo.json";
console.log(repofile);
d3.json(repofile, d => {
    let mScale = d3.scaleLinear()
        .domain([0, d.max])
        .range([2.3, 80])
        .clamp(true)

    map.append("g").selectAll("path")
        .data(d.features)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.properties.reclong, d.properties.reclat])[0]) // Get the x coordinate of the longitude
        .attr("cy", d => projection([d.properties.reclong, d.properties.reclat])[1]) // Get the y coordinate of the latitude
        .attr("r", d => {
            return Math.round(mScale((d.properties.mass)))
        })
        .attr("fill", randomColor())
        .attr("fill-opacity", 0.45)
        .attr("font-family", "Open Sans")
        .on("mouseover", d => {
            //var year = d.properties.year.split("-")[0]
            tooltip.transition().duration(200).style("opacity", 1) // We use d3's transitions
            tooltip.html(
                "<strong>Login: </strong>" + d.properties.login + "<br>" +
                "<strong>Name: </strong>" + d.properties.name + "<br>" +
                "<strong>Contributions: </strong>" + d.properties.mass + "<br>" +
                "<strong>Location: </strong>" + d.properties.city)
                .style("left", (d3.event.pageX + 2) + "px").style("top", (d3.event.pageY) + "px")
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        });
});
