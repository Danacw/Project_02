
d3.json('/api/data').then(data => {

    data.forEach(search => {
        var tbody = d3.select('#stocks_tbody');

        row = tbody.append('tr');

        Object.values(search).forEach(col => {
            row.append('td').text(col);
        });
    });
});
























