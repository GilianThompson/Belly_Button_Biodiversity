function init() {
  //grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  //use the list of sample names to populate the select options 
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => { //for each "name" in the sampleNames array 
      selector
        .append("option")
        .text(sample)
        .property("value", sample);  
    });
    
  //use the first sample from the list to build the initial plots  
  var firstSample = sampleNames[0]; 
  console.log("firstSample: " + firstSample);
  buildMetadata(firstSample);
  buildCharts(firstSample);
  });
}

//initialize dashboard 
init();

//fetch new data each time a new sample is selected
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0]; //result is the metadata object 
    console.log(result)
    var PANEL = d3.select("#sample-metadata");

    var allResults = Object.entries(result); //array with values for given id number
    //console.log("all results:" , allResults); 
    //var allData = allResults.map( value => console.log(value));

    //add to demographics panel 
    PANEL.html(""); //clears panel
    allResults.forEach( ([key, value]) =>{
        PANEL.append("h6").text(key.toUpperCase() + ": " + value);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    samplesArray.forEach(val=>console.log(val)); 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample = samplesArray.filter( (element) => 
      { if(element.id === sample) {
          return true;}
      });
    filteredSample.forEach(val=>console.log(val)); 
    
    //  5. Create a variable that holds the first sample in the array.
    var firstFilteredSample = filteredSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_idsArray = firstFilteredSample.otu_ids; //otu_idsArray is an object 

    var otu_labelsArray = firstFilteredSample.otu_labels;
    //otu_labelsArray.forEach(val=>console.log(val));
    
    var sample_valuesArray = firstFilteredSample.sample_values;
    sample_valuesArray.forEach(val=>console.log(val));

    // 7. Create the yticks for the bar chart.
 
    var newAr = Object.values(sample_valuesArray);

    var top10 = newAr.slice(0,10);

    var yticks = Object.values(otu_idsArray);
    console.log(Object.values(otu_idsArray));
    var emptyAr = [];
    yticks = yticks.map(value => {
      emptyAr.push(`OTU ${value}`);
    });
    emptyAr.slice(0,10);

    emptyAr.forEach(val=>console.log(val));

    // 8. Create the trace for the bar chart. 
    var barData = {
        x: top10,
        y: emptyAr, 
        type: "bar",
        text: otu_labelsArray,
        orientation: "h"
    };
      // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterical Cultures Found",
      yticks,
      yaxis: {autorange:"reversed"}
    };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", [barData], barLayout);

      //BUBBLE CHART 
      // 1. Create the trace for the bubble chart.
      var bubbleData = {
        x: otu_idsArray,
        y: sample_valuesArray,
        mode: "markers",
        marker: 
          { size: sample_valuesArray,
            color: otu_idsArray
          },
        text: otu_labelsArray
      };
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis:{title: "OTU ID"}
      };
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

      //GAUGE
      //Create a variable that filters the metadata array for the object with the desired sample number
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0]; //result is the metadata object 
      console.log(result)
      var washingFreq = parseFloat(result.wfreq);
      //console.log(washingFreq);

      // 4. Create the trace for the gauge chart.
      var gaugeData = {
        value: washingFreq,
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range:[0,10] },
          bar: { color: "black"},
          steps: [
            {range: [0,2], color: 'red'},
            {range: [2,4], color: 'orange'},
            {range: [4,6], color: 'yellow'},
            {range: [6,8], color: 'yellowgreen'},
            {range: [8,10], color: 'green'}
          ]
        }
      };

      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
      };

      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", [gaugeData], gaugeLayout);







  });
}
