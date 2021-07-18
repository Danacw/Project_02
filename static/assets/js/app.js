// grab elements from HTML page // Could use D3 for walking though document object model (DOM)
var alertDiv = document.getElementById("myChart");
var textArea = document.getElementById("userInput");
var timeStamp = document.getElementById("timestamp");

// run function when user presses submit button
function submitUserInformation() {

    // clean user input with textArea.value - capitalize 
    var userText = textArea.value.toUpperCase() 

    // send a post request to the Flask API
    fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({
            userInput: userText
        })
    // process the response from Flask
    }).then(response => {
        return response.text();
    }) // log the response from Flask and add to div
    .then(data => {
        console.log(data)
        alertDiv.classList =
        alertDiv.classList = "row alert alert-success";
        alertDiv.innerHTML =`<p>${data}</p>`
    // catch errors
    }).catch (err => {
        alertDiv.innerHTML =`Error: ${err}`
    }); 
}