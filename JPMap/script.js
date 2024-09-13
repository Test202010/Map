document.addEventListener('DOMContentLoaded', () => {
    const width = 700;
    const height = 600;

    const svg = d3.select("#map-container")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3.geoMercator()
        .center([137, 38])
        .scale(1500)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // 使用更丰富的颜色方案
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.append("g");

    d3.json("japan.topojson").then(function (japan) {
        const prefectures = topojson.feature(japan, japan.objects.japan).features;

        const prefectureGroups = g.selectAll("g")
            .data(prefectures)
            .enter().append("g");

        prefectureGroups.append("path")
            .attr("d", path)
            .attr("class", "prefecture")
            .attr("fill", (d, i) => colorScale(i))
            .attr("original-color", (d, i) => colorScale(i)); // 存储原始颜色

        prefectureGroups.append("text")
            .attr("class", "prefecture-name")
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(d => d.properties.nam_ja);

        g.append("path")
            .datum(topojson.mesh(japan, japan.objects.japan, (a, b) => a !== b))
            .attr("class", "prefecture-borders")
            .attr("d", path);

        prefectureGroups
            .on("mouseover", function (event, d) {
                d3.select(this).select("path").attr("fill", "#ff0000");
                d3.select(this).select("text").style("opacity", 1);
                updateInfoBox(d.properties.nam_ja);
                highlightPrefecture(this);
            })
            .on("mouseout", function (event, d) {
                const originalColor = d3.select(this).select("path").attr("original-color");
                d3.select(this).select("path").attr("fill", originalColor);
                d3.select(this).select("text").style("opacity", 0);
                updateInfoBox("");
                resetHighlight();
            });
    }).catch(error => {
        console.error("Error loading japan.topojson:", error);
    });

    function updateInfoBox(name) {
        const infoBox = document.getElementById('info-box');
        if (name) {
            infoBox.innerHTML = `选择的都道府县：<br><span class="prefecture-name">${name}</span>`;
        } else {
            infoBox.textContent = '请将鼠标悬停在都道府县上';
        }
    }

    function highlightPrefecture(element) {
        g.selectAll(".prefecture")
            .transition()
            .duration(300)
            .attr("opacity", 0.3);

        d3.select(element).select("path")
            .transition()
            .duration(300)
            .attr("opacity", 1)
            .attr("stroke", "#000")
            .attr("stroke-width", 2);
    }

    function resetHighlight() {
        g.selectAll(".prefecture")
            .transition()
            .duration(300)
            .attr("opacity", 1)
            .attr("stroke", "none")
            .attr("stroke-width", 0.5);
    }
});