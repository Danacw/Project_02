# from requests_html import HTMLSession
from splinter import Browser, browser
from bs4 import BeautifulSoup as soup
import pandas as pd
import datetime as dt
from webdriver_manager.chrome import ChromeDriverManager



def get_news(ticker):

    executable_path = {'executable_path': ChromeDriverManager().install()}
    browser = Browser('chrome', **executable_path, headless=True)
    
    # Visit the google news with keyword
    keyword=ticker
    url=f'https://www.google.com/search?q={keyword}&tbm=nws&sxsrf=ALeKk03t5yc3UyE05CEAUuvqLpMl9hr2Qw:1626410726634&source=lnt&tbs=qdr:d&sa=X&ved=2ahUKEwjxoPqM5ObxAhWKtJ4KHZ9YC9EQpwV6BAgHECY&biw=1247&bih=698&dpr=2'
    print(url)

    browser.visit(url)

    # Optional delay for loading the page
    # browser.is_element_present_by_css('div.list_text', wait_time=1)

    # Convert the browser html to a soup object and then quit the browser
    html = browser.html
    news_soup = soup(html, 'html.parser')
      
    top3_news=[]

    for i in range(3):

        news=news_soup.findAll("div", class_="dbsr")[i]
        news_link=news.find("a").get("href")
        news_title = news.find("div", class_="JheGif nDgy9d").get_text()
        news_para = news.find("div", class_="Y3v8qd").get_text()
        news_time = news.find("div", class_="wxp1Sb")
        news_time = news_time.find("span", class_="WG9SHc").get_text()
        news_sources=news.find("div", class_="XTjFC WF4CUc").get_text()
        image_sources=news.find("img").get("src")

        data = {
            "news_title": news_title,
            "news_para": news_para,
            "news_link": news_link,
            "news_time": news_time,
            "news_sources": news_sources,
            "image_sources": image_sources
        }
        
        top3_news.append(data)

    browser.quit()

    return top3_news


