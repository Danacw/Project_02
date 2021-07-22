
console.log('plot_project2.js is running')

var apiKey = "nAWhsScxwEjhhNovu38g";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {index} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function handleSubmit() {
  // Prevent the page from refreshing
  try{
    d3.event.preventDefault();
  }
  catch{
    console.log('No event for d3.event.preventDefault - this is ok for testing')
  }

  // Select the input value from the form
  var stock = d3.select("#userInput").node().value;
  console.log(stock);

  // clear the input value
  d3.select("#userInput").node().value = "";




  // Build the plot with the new stock
  buildPlot(stock);
}

function buildPlot(stock) {
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`
  

  
  
  d3.json(url).then(function(data) {
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var openingPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates, 
      y: closingPrices,
      line: {
        color: "#ff751a"
      }
    };

    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} Closing Prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };
    
    Plotly.newPlot("plot", data, layout);


  });
}
d3.select("#submit").on("click", handleSubmit);


// For testing only, run buildPlot() with FB by default
buildPlot('FB');


//getMonthlyData();