var apiKey = "ma3MTDpKvdLWqoWZnVnH";

var start_date = '2017-01-01';
var end_date = '2018-11-22';

var dropdown = d3.select("#selDataset");
var introduction_div = d3.select("#introduction");

// var metadatas = {'stock_codes': ['AMZN', 'NFLX']};
// metadatas.stock_codes.forEach((stock_code, index1) => {
//   var row = dropdown.append("option")
//                     .text(stock_code)
//                     .attr("value", 'option' + String(index1));
// });
nasdaq100_data.forEach((code_obj, index1) => {
  var row = dropdown.append("option")
                    .text(code_obj.stock_code)
                    .attr("value", 'option' + String(index1));
});

function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function optionChanged() {
  // Prevent the page from refreshing
  d3.event.preventDefault();
  
  // Use D3 to select the dropdown menu
  var stock = d3.selectAll("#selDataset").node().value;
  console.log(stock)

  // Assign the dropdown menu option to a variable
  // var selectedOption = stock.value;
  // var subject_id = parseInt(selectedOption.replace('option', ''))

  var stock_code = nasdaq100_data[subject_id].stock_code;

  // var introduction_div = d3.select("#introduction").node();
  introduction_div.html(
    `<a href="${nasdaq100_data[subject_id].wiki_url}">
      <h2>${nasdaq100_data[subject_id].company_name}</h2>
    </a>
    <p>${nasdaq100_data[subject_id].introduction}</p>`)

  getMonthlyData(stock_code, start_date, end_date);
};

// function unpack(rows, index) {
//   return rows.map(function(row) {
//     return row[index];
//   });
// }

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

getMonthlyData('ADBE', start_date, end_date);