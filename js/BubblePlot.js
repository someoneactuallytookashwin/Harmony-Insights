class BubbleChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 300,
            margin: _config.margin || { top: 30, right: 30, bottom: 50, left: 80 }
        };
        this.data = _data;

        // Initialize variables for bubble chart
        this.width = this.config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.height = this.config.containerHeight - this.config.margin.top - this.config.margin.bottom;

        // Initialize scales
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Color scale for different artists
        this.radiusScale = d3.scaleSqrt().range([2, 20]); // Scale for bubble size

        this.initVis();
    }

    initVis() {
        // Create SVG element for the bubble chart
        this.svg = d3.select(this.config.parentElement)
            .append('svg')
            .attr('width', this.config.containerWidth)
            .attr('height', this.config.containerHeight);

        // Create group element for bubbles
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`);

        // Add tooltip div
        this.tooltip = d3.select(this.config.parentElement)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        // Call updateVis to render the bubble chart
       
    }

    updateVis(min_val, max_val ,arr) {
        this.chart.selectAll('.bubble').remove();
        
        // Process the data
        let artistTrackMap = new Map();
    
        // Aggregate data by artist and track
        // this.data.forEach(d => {
        //     const key = `${d.artistName}-${d.trackName}`;
        //     if (!artistTrackMap.has(key)) {
        //         artistTrackMap.set(key, { artist: d.artistName, track: d.trackName, totalMsPlayed: 0 });
        //     }
        //     artistTrackMap.get(key).totalMsPlayed += +d.msPlayed;
        // });
    
        // Convert map to array of objects
        // let trackData = Array.from(artistTrackMap.values());
        let trackData = this.data
    
        // Determine bubble size based on track popularity
         const maxTotalMsPlayed = d3.max(trackData, d => d.msPlayed);

        this.radiusScale.domain([0, maxTotalMsPlayed]);

        trackData.splice(1,1);
   


let newtrackdata = [];
if( arr.includes("All") ){
newtrackdata = trackData
}
else{
    var ind2 = 0;
    for (let index = 0; index < trackData.length; index++) {

        const element = trackData[index];
        if( arr.includes(element.artistName) ){
            newtrackdata[ind2] = element;
            ind2++;
        }
    }


}

// const meanTotalMsPlayed =  sumTotalMsPlayed/trackData.length;

  // Calculate the min and max threshold values based on the percentage range provided by the val parameter
// let sortedData = newtrackdata.sort((a, b) => a.msPlayed  < b.msPlayed)




  // Filter trackData array to include only elements with totalMsPlayed within the percentage range
//   let filteredTrackData = sortedData.slice(0, some_val)
let mmm = [];

var ind3 = 0;
newtrackdata.forEach(d => {

    if(d.msPlayed /60000 > min_val && d.msPlayed/60000 < max_val){
  
        // mmm.append(d);
        mmm[ind3] = d;
        ind3 = ind3+1;
    }
})




        // if()





        // if(tra)
    
        // Draw bubbles
        const bubbles = this.chart.selectAll('.bubble')
            .data(mmm)
            .enter().append('circle')
            .attr('class', 'bubble')
            .attr('cx', d => Math.random() * this.width) // Random x position for now
            .attr('cy', d => Math.random() * this.height) // Random y position for now
            .attr('r', d => this.radiusScale(d.msPlayed))
            .attr('fill', d => this.colorScale(d.artistName))
            .attr('opacity', 0.7)
            .on('mouseover', (event, d) => {
                // Show tooltip on mouseover
                this.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                this.tooltip.html(`<strong>${d.trackName}</strong><br/>Artist: ${d.artistName}<br/>Total Listening Time: ${d.minutesPlayed} minutes`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                // Hide tooltip on mouseout
                this.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    
        // Position bubbles using force simulation or any other layout algorithm
        // You can use D3's force simulation or other layout algorithms to position the bubbles nicely
    }
}



