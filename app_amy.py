from flask import Flask, render_template, redirect, url_for
from flask_pymongo import PyMongo
import scrape_news

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/stock_db"
mongo = PyMongo(app)

@app.route("/")
def index():
    stock = mongo.db.stock.find_one()["data"]
    return render_template("index.html", stock=stock)


@app.route("/scrape/<ticker>")
def scrape(ticker):
    stock = mongo.db.stock 
    print(ticker)
    stock_data = scrape_news.get_news(ticker)
    stock.update({}, {'data': stock_data, 'ticker': ticker } , upsert=True)
    return redirect('/', code=302)


if __name__ == "__main__":
    app.run(debug=True)
