(function () {
  const width = 550;
  const height = 350;
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
    data.forEach(d => {
      d.tech = d.Screen_Tech;
      d.energy = +d["Mean(Labelled energy consumption (kWh/year))"];
    });

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.tech))
      .range([0, innerWidth])
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energy) * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // X-Axis
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .text("Screen Technology (55-inch TVs)");

    // Y-Axis
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale));

    g.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .text("Mean Energy Consumption (kWh/year)");

    // Bars
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.tech))
      .attr("y", d => yScale(d.energy))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.energy))
      .attr("fill", "#0d9488")
      .attr("rx", 4);
  }).catch(err => console.error("Bar chart load error:", err));
})();