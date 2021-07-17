from flask import Flask, json, jsonify, request
from flask.templating import render_template
from multiprocessing import Value 

# Creates an instance of Flask
app = Flask(__name__)

# Displays backlog page 
@app.route("/")
def backlog():
    return render_template("backlog.html")

# Processes the fetch request on our JavaScript. Takes in user input and routes it to our database.
@app.route('/api/submit', methods = ["POST"])
def predict():
    content = request.json['userInput']

    # Returns input into a new SQL database (will need to add to / modify this)
    return jsonify(content)

# Count how many times the page was visited (Review 5/15/21 Class for this...) Needs to read it from the database as well.
counter = Value("i", 0)
counter.value += 1
print(f"Times visited: (counter.value")    

# Allows Flask app to run smoothly
if __name__ == "__main__":
    app.run()

