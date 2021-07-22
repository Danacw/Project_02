// Use D3 to create an event handler
d3.select("#update").on("click", updatePage);

function updatePage() {
    
    d3.event.preventDefault();
  // Use D3 to select the dropdown menu
    var search = d3.select("#userInput").node().value;
    console.log(search);
    d3.select("#userInput").node().value = "";
    window.location.href = `/scrape/${search}`

}
