//    .row(function (d) { return { effort: Number(d.Effort.trim()) }; })

var min = Infinity,
    max = -Infinity;

d3.csv("/DataFiles/desharnais.csv")
    .row(function (d) { return { language: Number(d.Language.trim()), transactions: Number(d.Transactions.trim()), entities: Number(d.Entities.trim()), effort: Number(d.Effort.trim()) }; })
    
    .get(function (error, data) {

        var minEffort = d3.min(data, function (d) { return d.effort });
        var maxEffort = d3.max(data, function (d) { return d.effort });
        var maxtran = d3.max(data, function (d) { return d.transactions });
        var mintran = d3.min(data, function (d) { return d.transactions });
        var maxentity = d3.max(data, function (d) { return d.entities });
        var minentity = d3.min(data, function (d) { return d.entities });

        var formatCount = d3.format(",.0f");

        var data1 = data.map(function (d) { return d.effort });


        var svg = d3.select("#svg02"),
            margin = { top: 10, right: 30, bottom: 30, left: 30 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scaleLinear()
            .domain([minEffort,maxEffort])
            .range([0,width]);

        var histogram = d3.histogram()
            .domain(x.domain())
            .thresholds(x.ticks(10));

        var bins = histogram(data1);

        var y = d3.scaleLinear()
            .domain([0, d3.max(bins, function (d) { return d.length; })])
            .range([height, 0]);

        var bar = g.selectAll(".bar")
          .data(bins)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr("height", function (d) { return height - y(d.length); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function (d) { return formatCount(d.length); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        /*box chart*/

        var margin = { top: 10, right: 50, bottom: 20, left: 50 },
            width = 120 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        var min = Infinity,
            max = -Infinity;

        var chart = d3.box()
            .whiskers(iqr(1.5))
            .width(width)
            .height(height);

        var data2 = [];
        // using an array of arrays with
        // data[n][2] 
        // where n = number of columns in the csv file 
        // data[i][0] = name of the ith column
        // data[i][1] = array of values of ith column

        data2[0] = [];
        data2[1] = [];
        // add more rows if your csv file has more columns

        // add here the header of the csv file
        data2[0][0] = "transactions";
        data2[1][0] = "entities";
        // add more rows if your csv file has more columns

        data2[0][1] = [];
        data2[1][1] = [];

        data.forEach(function (x) {
            var v1 = Math.floor(x.transactions),
                v2 = Math.floor(x.entities);
            // add more variables if your csv file has more columns

            var rowMax = Math.max(v1, v2);
            var rowMin = Math.min(v1, v2);

            data2[0][1].push(v1);
            data2[1][1].push(v2);
            // add more rows if your csv file has more columns

            if (rowMax > max) max = rowMax;
            if (rowMin < min) min = rowMin;
        });


        var svg1 = d3.select("#svg01")
            .data(data2)
            .append("svg")
            .attr("class", "box")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(chart);


        setInterval(function () {
            svg1.datum(randomize).call(chart.duration(1000));
        }, 2000);
    })

function randomize(d) {
    if (!d.randomizer) d.randomizer = randomizer(d);
    return d.map(d.randomizer);
}

function randomizer(d) {
    var k = d3.max(d) * .02;
    return function (d) {
        return Math.max(min, Math.min(max, d + k * (Math.random() - .5)));
    };
}

// Returns a function to compute the interquartile range.
function iqr(k) {
    return function (d, i) {
        var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
    };
}

