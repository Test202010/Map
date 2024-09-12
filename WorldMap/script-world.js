document.addEventListener('DOMContentLoaded', () => {
    const svg = d3.select('svg');
    const width = 960;
    const height = 500;
    const projection = d3.geoNaturalEarth1()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2]);
    const pathGenerator = d3.geoPath().projection(projection);

    const mapGroup = svg.append('g');

    mapGroup.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({ type: 'Sphere' }));

    const colorScale = d3.scaleOrdinal(d3.schemeSet3);

    const tooltip = svg.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
        .then(data => {
            const countries = topojson.feature(data, data.objects.countries);
            mapGroup.selectAll('path.country')
                .data(countries.features)
                .enter().append('path')
                .attr('class', 'country')
                .attr('d', pathGenerator)
                .attr('fill', (d, i) => colorScale(i))
                .on('mouseover', function (event, d) {
                    displayCountryName(d.properties.name, d);
                    d3.select(this).attr('fill', '#f39c12');
                })
                .on('mouseout', function (event, d) {
                    tooltip.style("opacity", 0);
                    d3.select(this).attr('fill', (d, i) => colorScale(i));
                });
        });

    function displayCountryName(name, d) {
        const centroid = pathGenerator.centroid(d);
        tooltip.attr("x", centroid[0])
            .attr("y", centroid[1])
            .text(name)
            .style("opacity", 1);

        document.getElementById('country-info').textContent = `当前国家：${name}`;
    }
});