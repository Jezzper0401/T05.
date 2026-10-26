(function () {
  const width = 550;
  const height = 350;
  const radius = Math.min(width, height) / 2.3;

  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2.5},${height / 2})`);

  d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
    data.forEach(d => {
      d.tech = d.Screen_Tech;
      d.energy = +d["Mean(Labelled energy consumption (kWh/year))"];
    });

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.tech))
      .range(["#0284c7", "#f59e0b", "#10b981"]);

    const pie = d3.pie()
      .value(d => d.energy)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.55)
      .outerRadius(radius * 0.95);

    // Donut Slices
    const arcs = g.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.tech))
      .attr("stroke", "#ffffff")
      .style("stroke-width", "3px");

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 130}, 110)`);

    data.forEach((d, i) => {
      const legRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 28})`);

      legRow.append("rect")
        .attr("width", 16)
        .attr("height", 16)
        .attr("rx", 3)
        .attr("fill", color(d.tech));

      legRow.append("text")
        .attr("x", 24)
        .attr("y", 13)
        .attr("font-size", "13px")
        .attr("fill", "#334155")
        .text(d.tech);
    });
  }).catch(err => console.error("Donut chart load error:", err));
})();