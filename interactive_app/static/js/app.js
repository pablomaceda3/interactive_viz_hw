function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metadata_url = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadata_url).then(function(sampleMetadata) {
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadataSelector = d3.select("#sample-metadata");

    // // Use `.html("") to clear any existing metadata
    sampleMetadataSelector.innerHTML = "";
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleMetadata).forEach(([key,value])=>{
      var entry = sampleMetadataSelector.append("p");
      entry.text(key + ": " + value);
    })

    // BONUS: Build the Gauge Chart
    
  });
};

// function buildGauge(washFrequency) {

// }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample_url = `/samples/${sample}`;
  d3.json(sample_url).then(function(sampleData) {

    var bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      },
      text: sampleData.otu_labels
    };
    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: 'Belly Button Bubble',
      xaxis: {
        title: "OTU_IDS"
      },
      yaxis: {
        title: "Sample Values"
      }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    
    var pieTrace = {
      values: sampleData.sample_values.slice(0,10),
      labels: sampleData.otu_ids.slice(0,10),
      text: sampleData.otu_labels.slice(0,10),
      type: 'pie' 
    };
    var pieData = [pieTrace];


    Plotly.newPlot("pie", pieData)
  });

    // @TODO: Build a Bubble Chart using the sample data


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
