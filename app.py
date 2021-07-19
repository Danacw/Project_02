#%%
from flask import Flask, json, jsonify, request, redirect
from flask.templating import render_template
from multiprocessing import Value 
from config import db_user, db_password, db_host, db_port, db_name
from sqlalchemy import create_engine
import pandas as pd 


#%%
################ FLASK SETUP

# Postgres Database set up or maybe I could create a csv or JSON file in my flask app... and then do ETL on it?
engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')

# Creates an instance of Flask
app = Flask(__name__)

#%%
################ DATABASE SETUP
engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')

#%%
################ DEFINE FLASK ROUTS

#%%
################ ROUTE #1: Default route to display backlog
@app.route("/")
def backlog():
    return render_template("backlog.html")

#%%
################ ROUTE #2: Route to generate the form and/or POST data. Takes in user input and routes it to our database.
@app.route('/send', methods = ["GET", "POST"])
def send():
    
    # connect to our database
    conn = engine.connect()

        # evaluate if the this is a POST request
    if request.method == "POST":

    # # Returns input into a new SQL database (will need to add to / modify this)
    conn = engine.connect()
    
        #use `request.form` to pull form attributes
        id = request.form["id"]
        userInput = request.form["userInput"]
        timestamp = request.form["timestamp"]
        
        # convert to a DataFrame so that we can use to_sql
        searches_df = pd.DataFrame({
            'id':[id],
            'userInput':[userInput],
            'timestamp':[timestamp]
        })

        # post the update to the DB
        searches_df.to_sql('stocks_crypto', con=conn, if_exists='append', index=False)

        # close our database connection
        conn.close()

        # send the user to the endpoint that contains the data listing
        return redirect('/')

    # if the method is NOT POST (otherwise, GET, then send the user to the app)
    conn.close()
    return render_template("index.html")

#%%
################ ROUTE #3: Route to view the data
@app.route("/api/data")
def searches_list():

    # connect to db engine
    conn = engine.connect()

    # query the database using Pandas
    stocks_crypto_df = pd.read_sql('SELECT * FROM stocks_crypto', con=conn)

    #convert results to json
    stocks_crypto_json = stocks_crypto_df.to_json(orient='records')

    #close connection
    conn.close()

    #return json to the client
    return stocks_crypto_json

#%%
##################### RUN APP: Run in debug mode
if __name__ == "__main":
    app.run(debug=True)

