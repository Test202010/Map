document.addEventListener('DOMContentLoaded', () => {
    const width = 960;
    const height = 600;

    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoAlbersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // d3.json("https://d3js.org/us-10m.v1.json").then(function (us) {
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(function (us) {
        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "state");

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
            .attr("class", "state-borders")
            .attr("d", path);
    });

    function displayStateName(name) {
        const stateNameElement = document.getElementById('state-name');
        stateNameElement.textContent = name;
        stateNameElement.style.fontSize = '36px';
        setTimeout(() => {
            stateNameElement.style.fontSize = '24px';
        }, 1000);
    }
});