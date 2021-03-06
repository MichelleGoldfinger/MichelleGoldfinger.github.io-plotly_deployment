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
//Bar and Bubble Charts
// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var samples = data.samples; 
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(s => s.id == sample); 
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetaData = data.metadata.filter(s => s.id == sample);
    // Create a variable that holds the first sample in the array.
    var result = filteredSamples[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var freq = filteredMetaData[0];
    console.log(freq)
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var washingFreqFloat = parseFloat(freq.wfreq);
    console.log(washingFreqFloat)
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).map(otuIds => `otuIds ${otuIds}`).reverse();

    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type:  "bar",
      orientation: "h",
      text: otuLabels.slice(0,10).reverse()
     }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive:true});
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      type: "bubble",
      text: otuLabels,
      mode: "markers",
      marker: {
      color: otuIds,
      size: sampleValues}
    }];

    // Create the layout for the bubble chart.
    var barLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin: {
        l: 40,
        r: 40,
        t: 69, 
        b: 70,
      },
      hovermode: otuLabels, 
    };

    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, barLayout, {responsive:true});
    
    // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washingFreqFloat,
          title: {text: "Scrubs Per Week", font: {size: 14}},
          type: "indicator", 
          mode: "gauge+number",
          gauge: {
          axis: {range: [null, 10], tickwidth: 1, tickcolor: "black"},
          bgcolour: "white",
          borderwidth: 2,
          bordercolor: "black",
          bar: {color: "black"},
          steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
        ],
      }
    }
  ]
  console.log(gaugeData)
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {text: "<b>Belly Button Washing Frequency</b>"},
      width: 500,
      height: 400,
      margin: {t: 25, r:25, 1: 25, b: 25},
      font: {color: "black"}
     };
 
  // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive:true});
  });
}
