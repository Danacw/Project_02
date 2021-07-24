
console.log('plot_project2.js is running')

var apiKey = "nAWhsScxwEjhhNovu38g";

var start_date = '2017-01-01';
var end_date = '2018-11-22';

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

  fetch('/send', {
    method: 'POST',
    body: JSON.stringify({
        userInput: stock.toUpperCase()
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    }
})

  // clear the input value
  d3.select("#userInput").node().value = "";

  // Build the plot with the new stock
  buildPlot(stock);

  //Build summary table
  buildSummary(stock);

  // Get the top stories
  populateTopStories(stock);

}

function populateTopStories(stock){
  // Use D3 to create an event handler
  // d3.select("#update").on("click", updatePage);

  d3.json(`/scrape/${stock}`).then(data => {

    console.log(data);

    topstories_div = d3.select('#topstories')
    topstories_div.html("")
    data.forEach(story => {

      story_div = topstories_div.append('div').attr('class', 'col-lg-4 col-md-3 col-sm-3 col-xs-3');
      thumbnail_div = story_div.append('div').attr('class', 'thumbnail');
      thumbnail_link = thumbnail_div.append('a').attr('href', story['news_link']);
      thumbnail_link_img = thumbnail_link.append('img').attr('src', story['image_sources']);
      thumbnail_link_text = thumbnail_div.append('a').attr('href', story['news_link']).text(story['news_title']);
      words_break0 = thumbnail_div.append('br');
      thumbnail_link_text = thumbnail_div.append('small').text(story['news_para']);
      words_break = thumbnail_div.append('br');
      words_break2 = thumbnail_div.append('br');
      thumbnail_news_sources = thumbnail_div.append('small').text(`${story['news_sources']} - ${story['news_time']}`).attr('id', 'sources');
    });
  });
}

function buildSummary(stock) {
  var sel_stock = stock.toUpperCase()
  var cur_stock_info = nasdaq100_data.filter(stock => stock.stock_code == sel_stock)[0]
  console.log(cur_stock_info);
  var title = d3.select("#company_profile")
  var introduction_div = d3.select("#introduction")
  console.log(cur_stock_info);
  if (cur_stock_info) {
    title.html(`<a href="${cur_stock_info.wiki_url}"><h2>${cur_stock_info.company_name} Company Profile</h2></a>`);
    if (cur_stock_info.introduction.length > 0 ) {
      introduction_div.html(`<p>${cur_stock_info.introduction}</p>`);
    }
    else {
      introduction_div.html(`<p>${cur_stock_info.company_name} introduction not found. </p>`);
    }
  }
  else {
    introduction_div.html(`<p> ${stock} Company profile not found.</p>`);
    title.html("");
  } 
  getMonthlyData(stock, start_date, end_date);
}

function getMonthlyData(stock_code, start_date, end_date) {
  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${stock_code}.json?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}`;
  console.log(queryUrl);
  d3.json(queryUrl).then(function(data) {
    console.log(data);
    var dates = unpack(data.dataset.data, 0);
    var openPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);
    var volume = unpack(data.dataset.data, 5);
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  tbody.html("");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
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
getMonthlyData('FB', start_date, end_date);
buildSummary('FB');
populateTopStories('FB');



//getMonthlyData();