function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  //buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0]; //result is the metadata object 
    console.log(result)
    var PANEL = d3.select("#sample-metadata");

    var allResults = Object.entries(result); //array with values for given id number
    console.log("all results:" , allResults); 
    //var allData = allResults.map( value => console.log(value));

    //add to demographics panel 
    PANEL.html(""); //clears panel
    allResults.forEach( ([key, value]) =>{
        PANEL.append("h6").text(key.toUpperCase() + ": " + value);
    });
  });
}
