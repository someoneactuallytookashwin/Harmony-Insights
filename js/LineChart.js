class LineChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600, // Adjusted width
        containerHeight: _config.containerHeight || 300, // Adjusted height
        margin: _config.margin || { top: 50, right: 50, bottom: 50, left: 60 }
        };
        this.data = _data;
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Calculate inner chart size; margin specifies the space around the actual chart
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Add the SVG element and define the size of drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Add group element that will contain the actual chart
        // Adjust the position according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        // Set up scales
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.1);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        // Set up axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        // Append axis groups
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        // Add axis titles
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('x', -vis.height / 2)
            .attr('y', (-vis.config.margin.left / 2) + -16)
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .text('Total Minutes Played');

        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('x', vis.width / 2)
            .attr('y', (vis.height + vis.config.margin.bottom / 2) + 7)
            .style('text-anchor', 'middle')
            .text('Month');

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Process data
        let aggregatedData = d3.rollup(vis.data, v => d3.sum(v, d => +d.msPlayed / 60000), d => new Date(d.endTime).getMonth());

        // console.log(aggregatedData);

        // Convert map to array of objects
        let processedData = Array.from(aggregatedData, ([key, value, month_ind]) => ({ month: vis.monthNames[key], totalMinutesPlayed: value, month_ind:key }));


        // console.log(processedData);
        // // Sort data by month
        processedData.sort((a, b) => a.month_ind - b.month_ind);
        // Sort data by month

        // processedData.sort((a, b) => vis.monthNames.indexOf(a.month) - vis.monthNames.indexOf(b.month));

        // processedData.forEach(element => {
        //     element.month = element.month + 1
        // });

        // Update scales
        // vis.xScale.domain(processedData.map(d => d.month));
        vis.xScale.domain(processedData.map(d => d.month)); 
        vis.yScale.domain([1, d3.max(processedData, d => d.totalMinutesPlayed)]);

        // Update axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

        // Draw line
        vis.chart.selectAll('.line')
            .data([processedData])
            .join('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', d3.line()
                .x(d => vis.xScale(d.month))
                .y(d => vis.yScale(d.totalMinutesPlayed))
            );
    }
}