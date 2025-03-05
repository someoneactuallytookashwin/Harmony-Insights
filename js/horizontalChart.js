class HorizontalChart {
    constructor(_config, _data, _colorScale) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600, // Adjusted width
        containerHeight: _config.containerHeight || 300, // Adjusted height
        margin: _config.margin || { top: 50, right: 50, bottom: 50, left: 80 }
        };
        this.data = _data;
        this.colorScale = _colorScale;

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

        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);

        vis.yScale = d3.scaleBand()
            .range([0, vis.height])
            .paddingInner(0.1);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .tickSizeOuter(0);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        // Add axis title and center it horizontally
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', vis.config.containerWidth / 2) // Center horizontally
            .attr('y', 0)
            .attr('dy', '.91em')
            .style('text-anchor', 'middle') // Center text horizontally
            .text('Listening time by artist');

    }

    /**
     * Prepare and update the data and scales before we render the chart
     */
    updateVis() {
        let vis = this;

        // Prepare data
        vis.data.sort((a, b) => d3.descending(a.minutesPlayed, b.minutesPlayed));

        vis.xValue = d => d.minutesPlayed; 
        vis.yValue = d => d.artistName;

        vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
        vis.yScale.domain(vis.data.map(vis.yValue));

        vis.renderVis();
    }

    /**
     * Bind data to visual elements
     */
    renderVis() {
        let vis = this;

        // Add bars
        const bars = vis.chart.selectAll('.bar')
            .data(vis.data)
            .join('rect')
            .attr('class', 'bar')
            .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr('height', vis.yScale.bandwidth())
            .attr('width', d => vis.xScale(vis.xValue(d)))
            .attr('fill', '#1DB954');

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}

