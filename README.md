![Screen Shot 2021-07-23 at 12 00 26 PM](https://user-images.githubusercontent.com/26308909/126829056-0c3b7e56-6d40-42ec-b5de-a5cf05fb9bbb.png)
# Project_02
**Stocks Market Analysis**

For our second project, we used the Quandl API, MongoDB, and the Plotly JavaScript Library to obtain stock market data and create a dynamic flask application. The intereative dashboard allows users to search for stock codes to review company profiles, closing prices over time, annual market summaries, and top stories on any stock of their choosing.

**app.py**
  - Our final python application that routes to display user input on the frontend. The application also includes a /backlog route that collects userInput data and timestamps for each stock searched and returns the data to a JSON file and SQL database.
  
**scrape_news.py**
  - Our news scraping application that accesses mongoDB to scrape data from Google top stories on each stock code searched.
  
**queries**
  - Contatins query.sql which creates a backend SQL database of all user searches and timestamps. 

**static**
  - css
    - Contains our css files that style the frontend of the application and the clock at the bottom of the page.
  - js
    - Contains all our JavaScript files used to dynamically update the page. 
      -  plot_project2.js: includes functions to route data to the backend, build a company profile section, populate the top stories, and build our Plotly graphs.
      -  nasdaq100.js: contatins data from wikipedia on the nasdaq100 stocks. The data was scraped through MongoDB to create a JSON file.
      -  main.js: the JavaScript file that allows our clock to run coninually.  
 - images
    - our initial storyboard used to conceptualize each part of the application.
    
**templates**
  - Contains our frontend index.html file, and our backlog.html file that collects user data on the backend. 

![Screen Shot 2021-07-23 at 11 16 37 AM](https://user-images.githubusercontent.com/26308909/126828734-720446b6-52fb-46b5-a1c8-884695038198.png)
![Screen Shot 2021-07-23 at 12 01 29 PM](https://user-images.githubusercontent.com/26308909/126829172-94bb7909-5377-45cb-89d7-58b06d9eee77.png)


