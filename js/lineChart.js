(function () {
  const width = 550;
  const height = 350;
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(data => {
    data.forEach(d => {
      d.Year = +d.Year;
      d.AvgPrice = +d["Average Price (notTas-Snowy)"];
    });

    const cleanData = data.filter(d => !isNaN(d.Year) && !isNaN(d.AvgPrice));
    cleanData.sort((a, b) => a.Year - b.Year);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(cleanData, d => d.Year))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.AvgPrice) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // X-Axis
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(8));

    g.append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .text("Year");

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
      .text("Average Spot Price ($/MWh)");

    // Line Path
    const lineGenerator = d3.line()
      .x(d => xScale(d.Year))
      .y(d => yScale(d.AvgPrice))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(cleanData)
      .attr("fill", "none")
      .attr("stroke", "#e11d48")
      .attr("stroke-width", 2.5)
      .attr("d", lineGenerator);
  }).catch(err => console.error("Line chart load error:", err));
})();