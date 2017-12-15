
var data_url = "../json/files.json";
var colors_url = d3.scale.category20();
var data, filter;

console.log(colors_url);
d3.json(data_url, loadData);

function loadData(json) {
    //data
    data = sortData(json);
    visualize();
    // window.onresize = function () {
    //     d3.select("svg").remove();
    //     visualize(undefined);
    // };
}

function reset() {
    d3.select("svg").remove();
    d3.json(data_url, loadData);
}

function filterRepo(filter) {
    console.log(filter);
    if(filter){
        data = data.filter(function (elem) {
            return elem.repo === filter;
        });
    }
    d3.select("svg").remove();
    visualize();
}

function filterOut(filter) {
    if(filter){
        data = data.filter(function (elem) {
            return elem.repo !== filter;
        });
    }
    d3.select("svg").remove();
    visualize();
}

function visualize() {

    //style
    var pad = 10;
    var h = window.innerHeight - pad;
    var w = window.innerWidth - pad;
    var size = 780;
    var r = size / 8;
    var barWidth = w / data.length;
    var animTime = 1500;

    var radiusScale = d3.scale.sqrt()
        .domain([0, d3.max(data, function (d) {
            return d.size
        })])
        .range([0, r * 3]);

    var colorScale = d3.scale.category20()
            .domain(arrayFromProperty(data, "repo"));



    //bars
    var svg = d3.select("body")
        .append("svg")
        .attr("height", h)
        .attr("width", w)
        .style("margin", "auto")
        .style("display", "block");

    var pie = d3.layout.pie()
        .value(function (d) {
            return d.size;
        })
        .sort(null);

    var arc_zero = d3.svg.arc()
        .outerRadius(r)
        .innerRadius(r);

    var arc = d3.svg.arc()
        .outerRadius(function (d) {
            return r + radiusScale(d.data.size)
        })
        .innerRadius(r);

    var g = svg.append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ") rotate(-180)");
    g.transition().duration(animTime)
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");


    var bars = g.selectAll("g")
        .data(pie(data)).enter()
        .append("g")
        .attr("class", "bar")
        .attr("id", function (d, i) {
            return i
        });

    bars.append("path")
        .attr("d", arc_zero)
        .attr("stroke", "#FFF")
        .attr("fill", function (d) {
            return colorScale(d.data.repo)
        })
        .transition().duration(animTime)
        .attr("d", arc);

    //text info
    var circle = g.append("circle")
        .attr("fill", "#fff")
        .attr("r", 1)
        .transition().duration(animTime)
        .attr("r", r - 5);

    var title_default = "Repositories break down";
    var title = g.append("text")
        .text(title_default)
        .attr("xml:space", "preserve")
        .attr("text-anchor", "middle")
        .attr("font-family", "Roboto")
        .attr("font-size", size / 70 + "px")
        .attr("fill", "#000");

    var subtitle_default = data.length + " Files";
    var subtitle = g.append("text")
        .text(subtitle_default)
        .attr("xml:space", "preserve")
        .attr("text-anchor", "middle")
        .attr("font-family", "Roboto")
        .attr("font-size", size / 63 + "px")
        .attr("fill", "#000")
        .attr("y", size / 40);

    var subtitle_family = g.append("text")
        .text("")
        .attr("xml:space", "preserve")
        .attr("text-anchor", "middle")
        .attr("font-family", "Lato, sans-serif")
        .attr("font-size", size / 40 + "px")
        .attr("fill", "#000")
        .attr("y", size / 2.5);

    bars.on("mouseover", function (d) {
        title.text(d.data.name);
        subtitle.text("Size: " + d.data.size);
        subtitle_family.text(d.data.repo);
    });
    bars.on("mouseout", function (d) {
        title.text(title_default);
        subtitle.text(subtitle_default);
        subtitle_family.text("");
    });
    bars.on("click", function (d) {
        d3.select("svg").remove();
        filterOut(d.data.repo);
        //window.open(d.data.url, "_blank")
    });
}

function sortData(data) {
    var filter = "size";

    //sort by filter
    data.sort(sortProperty(filter));

    //break array into families
    var families = d3.nest()
        .sortValues(sortProperty(filter))
        .key(function (d) {
            return d.repo;
        })
        .entries(data);

    //sort families by total filter
    families.forEach(function (family) {
        family.size = 0;
        family.values.forEach(function (member) {
            family.size += member.size;
        })
    });
    families.sort(sortProperty(filter));

    //move "other" to end no matter what
    families.forEach(function (obj, i) {
        if (obj.key === "Other") {
            families.push(families[i])
            families.splice(i, 1);
            return;
        }
    });

    return flattenTree(families);
}

function flattenTree(tree) {
    var arr = [];
    tree.forEach(function (e, i) {
        arr.push(e.values);
    });

    if (arr[0] instanceof Array)
        return d3.merge(arr);
    else
        return arr;
}

function arrayFromProperty(arr, prop) {
    var new_arr = [];
    arr.forEach(function (value) {
        new_arr.push(value[prop]);
    });
    return d3.set(new_arr).values();
}

function sortProperty(property) {
    return (function (a, b) {
        if (a[property] < b[property])
            return 1;
        else if (a[property] > b[property])
            return -1;
        return 0;
    });
}