const width = 900;
const height = 600;

const svg = d3.select("svg")
    .attr("viewBox", [0, 0, width, height]);

const projection = d3.geoAlbersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// 颜色比例尺
const colorScale = d3.scaleOrdinal(d3.schemeSet3);

// 加载美国地图数据
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(us => {
    const states = svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d, i) => colorScale(i))
        .attr("class", "state");

    let activeState = null;

    function handleMouseMove(event) {
        const [x, y] = d3.pointer(event);
        const hoveredState = states.filter(d => {
            const [[x0, y0], [x1, y1]] = path.bounds(d);
            return x >= x0 && x <= x1 && y >= y0 && y <= y1 && d3.geoContains(d, projection.invert([x, y]));
        });

        if (!hoveredState.empty()) {
            const d = hoveredState.datum();
            if (activeState !== d) {
                if (activeState) {
                    svg.selectAll(".state-label").remove();
                    d3.select(states.filter(state => state === activeState).node())
                        .attr("fill", (_, i) => colorScale(i));
                }
                activeState = d;
                const [cx, cy] = path.centroid(d);
                svg.append("text")
                    .attr("class", "state-label")
                    .attr("x", cx)
                    .attr("y", cy)
                    .attr("text-anchor", "middle")
                    .attr("dy", "-0.5em")
                    .text(d.properties.name);
                d3.select(hoveredState.node()).attr("fill", "#3498db");
            }
        } else if (activeState) {
            svg.selectAll(".state-label").remove();
            d3.select(states.filter(state => state === activeState).node())
                .attr("fill", (_, i) => colorScale(i));
            activeState = null;
        }
    }

    svg.on("mousemove", handleMouseMove)
        .on("mouseleave", () => {
            if (activeState) {
                svg.selectAll(".state-label").remove();
                d3.select(states.filter(state => state === activeState).node())
                    .attr("fill", (_, i) => colorScale(i));
                activeState = null;
            }
        })
        .on("click", function (event) {
            const [x, y] = d3.pointer(event);
            const clicked = states.filter(function (d) {
                return d3.geoContains(d, projection.invert([x, y]));
            });

            if (!clicked.empty()) {
                const d = clicked.datum();
                d3.select("#state-info").text(d.properties.name);
            }
        });

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
});