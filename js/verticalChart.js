class createVerticalChart {
    constructor(_config, _data, _colorScale) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 400, // Adjusted width
            containerHeight: _config.containerHeight || 310, // Adjusted height
            margin: _config.margin || { top: 10, right: 50, bottom: 100, left: 50 }
        };
        this.data = _data;
        this.colorScale = _colorScale;

        this.initVis();
    }

    initVis() {
        let vis = this;

        const container_checkbox = document.getElementById('checkbox_container');
        
        // Calculate inner chart dimensions
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Add SVG element
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', 320)
            .append('g')
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
        vis.svg.append('g')
            .attr('class', 'axis-s x-axis')
            .attr('transform', `translate(0, ${vis.height})`);

        vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // Add axis labels
        vis.svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - vis.config.margin.left-35)
            .attr('x', 0 - (vis.height / 2))
            .attr('dy', '4em')
            .style('text-anchor', 'middle')
            .text('Minutes Played');

        // vis.svg.append('text')
        //     .attr('x', vis.width / 2)
        //     .attr('y', vis.height + vis.config.margin.bottom / 2)
        //     .style('text-anchor', 'middle')
        //     .text('Artist');


         // Process data
         vis.processedData = d3.rollup(vis.data, v => d3.sum(v, d => d.msPlayed / 60000), d => d.artistName);
         
         let randomStartIndex=0;
         let randomEndIndex = 10;

        //  randomStartIndex = Math.floor(Math.random() * (vis.processedData.size - 10));

        //  randomEndIndex = randomStartIndex + 10;


         vis.sortedData = Array.from(vis.processedData.entries())
             .slice(randomStartIndex, randomEndIndex)
             .sort((a, b) => d3.descending(a[1], b[1]));



                vis.sortedData.forEach(data => {
                


                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = data[0]; // lower case and remove spaces
                checkbox.className = 'artist-checkbox';
                checkbox.addEventListener('click', updateSelectedCheckboxes);
            
            
               
            
                // Create a label element
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.appendChild(document.createTextNode(data[0])); // Add the artist name as label text



                // Append the checkbox and label to the container
                
                container_checkbox.appendChild(checkbox);
                container_checkbox.appendChild(label);
                container_checkbox.appendChild(document.createElement('br')); 
        });

 
    }

    updateVis(SelecteddCheckboxes) {
        let vis = this;
        
        

    

        // container_checkbox.innerHTML = '';

        
     
        // Set scale domains
        vis.xScale.domain(vis.sortedData.map(d => d[0]));
        vis.yScale.domain([0, d3.max(vis.sortedData, d => d[1])]);

        this.renderVis();
    }

    renderVis() {
        let vis = this;

        // Add bars
        vis.svg.selectAll(".bar")
            .data(vis.sortedData)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => vis.xScale(d[0]))
            .attr("y", d => vis.yScale(d[1]))
            .attr("width", vis.xScale.bandwidth())
            .attr("height", d => vis.height - vis.yScale(d[1]))
            .on('click', function(event, d) {

                SelecteddCheckboxes = [d[0]];
                console.log(d[0] + SelecteddCheckboxes)
          
                checkCheckboxes(SelecteddCheckboxes);

                uncheckCheckboxes(SelecteddCheckboxes);

                
                bubbleChart.updateVis(rangeVals.min, rangeVals.max, SelecteddCheckboxes);

                vis.svg.selectAll(".bar").attr("fill", d => {
                    if(SelecteddCheckboxes.includes("All")){
                        return '#1DB954'; 
                    }
                    
                    if (SelecteddCheckboxes.includes(d[0])) {
                        return '#1DB954'; // Green color for selected artists
                    } else {
                        return 'rgba(29, 185, 84, 0.5)'; // Reduced opacity for non-selected artists
                    }
                }
            );
                
            })
         
            .attr("fill", d => {
                
                if(SelecteddCheckboxes.includes("All")){
                    return '#1DB954'; 
                }
                // Check if the artist is selected
                if (SelecteddCheckboxes.includes(d[0])) {
                    return '#1DB954'; // Green color for selected artists
                } else {
                    return 'rgba(29, 185, 84, 0.5)'; // Reduced opacity for non-selected artists
                }
            }
            );


        // Call axes
        vis.svg.select('.x-axis').call(vis.xAxis);
        vis.svg.select('.y-axis').call(vis.yAxis);
    }
}
