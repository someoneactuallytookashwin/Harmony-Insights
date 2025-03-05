let data;
let horizontalChart, verticalChart, lineChart, bubbleChart ;
let checkboxes = document.querySelectorAll('.artist-checkbox');
let SelecteddCheckboxes = [];

let rangeVals = {
    min: 2,
    max: 7
}



let trckbar_1;

const rangevalue =  
    document.querySelector(".slider-container .price-slider"); 
const rangeInputvalue =  
    document.querySelectorAll(".range-input input"); 


    const priceInputvalue =  
    document.querySelectorAll(".price-input input"); 
  
// Set the price gap 
let priceGap = 1; 

let minminutes =0;

// Load data from CSV file
d3.csv('data/merged_streamingHistory.csv').then(_data => {
    data = _data;
    data.forEach(d => {
        d.msPlayed = +d.msPlayed;
        d.minutesPlayed = d.msPlayed/60000
        d.endTime = new Date(d.endTime);
    });

rangeVals_min  = parseInt(d3.min(data, d => d.msPlayed) );
rangeVals_max =  parseInt(d3.max(data, d => d.minutesPlayed));




    // Aggregate data by artist and sum up the duration
    let artistDurationMap = new Map();
    data.forEach(d => {

        if (!artistDurationMap.has(d.artistName)) {
            artistDurationMap.set(d.artistName, 0);
        }

        artistDurationMap.set(d.artistName, artistDurationMap.get(d.artistName) + d.msPlayed);
    });

    // Convert milliseconds to minutes for each artist
    let aggregatedData = [];
    artistDurationMap.forEach((duration, artistName) => {
        aggregatedData.push({
            artistName: artistName,
            minutesPlayed: duration / 60000 // Convert milliseconds to minutes
        });
    });

    // Sort aggregated data to get top artists by minutes played
    let topArtists = aggregatedData.sort((a, b) => d3.descending(a.minutesPlayed, b.minutesPlayed)).slice(0, 10);
 
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Initialize color scale

    horizontalChart = new HorizontalChart({ parentElement: '#horizontalChart' }, topArtists, colorScale);
    bubbleChart = new BubbleChart({ parentElement: '#bubbleChart' }, data);
    verticalChart = new createVerticalChart({ parentElement: '#verticalChart'}, _data, colorScale);
    updateSelectedCheckboxes();

    horizontalChart.updateVis();
    
    
   
    verticalChart.updateVis(SelecteddCheckboxes);


    lineChart = new LineChart({ parentElement: '#lineChart' }, data);
    lineChart.updateVis();

   

    checkboxes = document.querySelectorAll('.artist-checkbox');
    bubbleChart.updateVis(2,7,SelecteddCheckboxes);
    update_bar(2, 7)

    
   
    


}).catch(error => console.error(error));





      function updateSelectedCheckboxes() {
        const selectedCheckboxes = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const label = checkbox.id;
              
                selectedCheckboxes.push(label);
            }
        });
        SelecteddCheckboxes = selectedCheckboxes;
        // bubbleChart.updateVis(50,selectedCheckboxes);
        bubbleChart.updateVis(rangeVals_min,rangeVals_max,selectedCheckboxes);
        verticalChart.updateVis(selectedCheckboxes);
        return selectedCheckboxes;
    }






     // Attach the update function to the click event of each checkbox
     checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', updateSelectedCheckboxes);
    });














const updateGlobal = () => {
    rangeVals.min = priceInputvalue[0].value;
    rangeVals.max = priceInputvalue[1].value;

    bubbleChart.updateVis(rangeVals.min,rangeVals.max,SelecteddCheckboxes);
}

for (let i = 0; i < priceInputvalue.length; i++) { 
    priceInputvalue[i].addEventListener("input", e => { 
  
        // Parse min and max values of the range input 
        let minp = parseInt(priceInputvalue[0].value); 
        let maxp = parseInt(priceInputvalue[1].value); 
        let diff = maxp - minp 
  
        if (minp < 0) { 
            alert("minimum price cannot be less than 0"); 
            priceInputvalue[0].value = 0; 
            minp = 0; 
            console.log(priceInputvalue[0].value + "iske wajaha se hua")
        } 
  
        // Validate the input values 
        if (maxp > 17) { 
            alert("maximum price cannot be greater than 17"); 
            priceInputvalue[1].value = 17; 
            maxp = 17; 
        } 
  
        if (minp > maxp - priceGap) { 
            priceInputvalue[0].value = maxp - priceGap; 
            minp = maxp - priceGap; 
            rangeInputvalue[1].value = maxp; 
            rangeInputvalue[0].value = minp; 
            update_bar(minp, maxp)
  
            if (minp < 0) { 
                priceInputvalue[0].value = 0; 
                minp = 0; 
            } 
        } 
  
        // Check if the price gap is met  
        // and max price is within the range 
        if (diff >= priceGap && maxp <= rangeInputvalue[1].max) { 
            if (e.target.className === "min-input") { 
                rangeInputvalue[0].value = minp; 
                let value1 = rangeInputvalue[0].max; 
                rangevalue.style.left = `${(minp / value1) * 100}%`; 
            } 
            else { 
                rangeInputvalue[1].value = maxp; 
                let value2 = rangeInputvalue[1].max; 
                rangevalue.style.right =  
                    `${100 - (maxp / value2) * 100}%`; 
            } 
        } 
        updateGlobal();
    }); 
  
    // Add event listeners to range input elements 
    
}

for (let i = 0; i < rangeInputvalue.length; i++) { 
    rangeInputvalue[i].addEventListener("input", e => { 
        let minVal =  
            parseInt(rangeInputvalue[0].value); 
        let maxVal =  
            parseInt(rangeInputvalue[1].value); 

        let diff = maxVal - minVal 
          
        // Check if the price gap is exceeded 
        if (diff < priceGap) { 
          
            // Check if the input is the min range input 
            if (e.target.className === "min-range") { 
                rangeInputvalue[0].value = maxVal - priceGap; 
            } 
            else { 
                rangeInputvalue[1].value = minVal + priceGap; 
            } 
        } 
        else { 
          
            // Update price inputs and range progress 
            priceInputvalue[0].value = minVal; 
            priceInputvalue[1].value = maxVal;
            rangevalue.style.left = 
                `${(minVal / rangeInputvalue[0].max) * 100}%`; 
            rangevalue.style.right = 
                `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`; 
        } 
        updateGlobal();
    }); 
}


function update_bar(min_val, max_val){
    rangevalue.style.left = 
    `${(min_val / rangeInputvalue[0].max) * 100}%`; 
rangevalue.style.right = 
    `${100 - (max_val / rangeInputvalue[1].max) * 100}%`; 
}














// Function to check checkboxes based on selected items
function checkCheckboxes(selectedItems) {
    selectedItems.forEach(item => {
        const checkbox = document.getElementById(item);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// Function to uncheck checkboxes except those in the selected list
function uncheckCheckboxes(selectedItems) {
    const allCheckboxes = document.querySelectorAll('.artist-checkbox');
    allCheckboxes.forEach(checkbox => {
        if (!selectedItems.includes(checkbox.id)) {
            checkbox.checked = false;
        }
    });
}








// Get the modal element
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// Show the modal when the page is loaded
window.onload = function () {
    modal.style.display = 'block';
};

// Close the modal when the user clicks on <span> (x)
span.onclick = function () {
    modal.style.display = 'none';
};

// Close the modal if the user clicks anywhere outside of the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};