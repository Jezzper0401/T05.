(function () {
  const width = 550;
  const height = 350;
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };

  const svg = d3.select("#scatter-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  d3.csv("data/Ex5_TV_energy.csv").then(data => {
    data.forEach(d => {
      d.star = +d.star2;
      d.energy = +d.energy_consumpt;
    });

    const cleanData = data.filter(d => !isNaN(d.star) && !isNaN(d.energy));

    const xScale = d3.scaleLinear()
      .domain([d3.min(cleanData, d => d.star) - 0.5, d3.max(cleanData, d => d.star) + 0.5])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.energy) * 1.05])
      .nice()
      .range([innerHeight, 0]);

    // X-Axis
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(8));

    g.append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .text("Star Rating (Energy Efficiency)");

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
      .text("Energy Consumption (kWh/year)");

    // Circles
    g.selectAll("circle")
      .data(cleanData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.star))
      .attr("cy", d => yScale(d.energy))
      .attr("r", 3)
      .attr("fill", "#0284c7")
      .attr("opacity", 0.5);
  }).catch(err => console.error("Scatter plot load error:", err));
})();