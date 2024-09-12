document.addEventListener('DOMContentLoaded', () => {
    const data = [
        { month: '一月', sales: 120 },
        { month: '二月', sales: 150 },
        { month: '三月', sales: 200 },
        { month: '四月', sales: 180 },
        { month: '五月', sales: 220 },
        { month: '六月', sales: 250 }
    ];

    const margin = { top: 40, right: 20, bottom: 50, left: 60 };
    const width = document.getElementById('chart-container').offsetWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d.sales)]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.sales))
        .attr("height", d => height - y(d.sales))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text("月份");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("销售额 (万元)");

    function showTooltip(event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 1)
            .html(`${d.month}: ${d.sales}万元`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }

    function hideTooltip() {
        d3.select("#tooltip").style("opacity", 0);
    }
});