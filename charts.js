function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Bar and Bubble charts
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    


    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesFiltered = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = samplesFiltered[0];
console.log(firstSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = firstSample.otu_ids;
    var otu_label = firstSample.otu_labels;
    var sample_value = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var otu_id1 = otu_id.slice(0,10);
    var otu_label1 = otu_label.slice(0,10);
    var sample_value1 = sample_value.slice(0,10);
    console.log(otu_id);
    console.log(sample_value);
    // Reverse the array to accommodate Plotly's defaults

    var otu_id1 = otu_id1.reverse();
    var otu_label1 = otu_label1.reverse();
    var sample_value1 = sample_value1.reverse();
    var OTU = [];
    for( var i = 0; i < otu_id1.length; i++) {
      OTU[i] = 'OTU ' + otu_id1[i];
    }
    var yticks = OTU;
    //otu_id.map(otu_id => 'OTU' + out_id);
    console.log(yticks);
    console.log(sample_value1);
 
    // 8. Create the trace for the bar chart. 

    var trace = {
      x: sample_value1,
      y: OTU,
      text: otu_label1,
      type: "bar",
      orientation: "h"
  };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//bubble chart


        // 1. Create the trace for the bubble chart.
        var bubbleTrace = {
          x: otu_id,
          y: sample_value,
          text: otu_label,
          mode: 'markers',
          marker: {
          size: sample_value,
          color: otu_id
         // colorscale: 
        }
      };
        var bubbleData = [bubbleTrace];
      
        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          xaxis: {title: "OTU ID"}
        };
    
        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 



            // 4. Create the trace for the gauge chart.

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    Wfreq = parseFloat(result.wfreq);
    console.log(Wfreq);

    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: Wfreq,
      title: { text: "<b>Bellybutton Washing Frequency</b><br>Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 2, increasing: { color: "white" } },
      gauge: {

        axis: { range: [0, 10], tickwidth: 1, tickcolor: "white" },
  
        bar: { color: "black" },
  
        bgcolor: "white",
  
        borderwidth: 2,
  
        bordercolor: "gray",
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "darkorange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "greenyellow" },
        { range: [8, 10], color: "green" }
      ]
    }
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 450, margin: { t: 25, r: 25, l: 25, b: 25 }
      
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
