#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jul 20 20:37:11 2021

@author: Tina
"""

from splinter import Browser
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager
import json
# Setup splinter
executable_path = {'executable_path': ChromeDriverManager().install()}
browser = Browser('chrome', **executable_path, headless=False)

url = 'https://en.wikipedia.org/wiki/Nasdaq-100'
browser.visit(url)
html = browser.html
soup = BeautifulSoup(html, 'html.parser')

results = soup.find_all('table', id ='constituents')[0]

trs = results.find_all('tr')

base_url = 'https://en.wikipedia.org'
res_ls = []
for tr in trs:
    # tr = trs[1]
    tds = tr.find_all('td')
    if len(tds) > 0:
        wiki_url = base_url + tds[0].find('a').get('href')

        browser.visit(wiki_url)
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')
        
        try:
            a1 = soup.find('div', class_='mw-parser-output')\
                     .find('div', id = 'toc')\
                     .previous_siblings
            a1_ls = []
            for item in a1:
                if item.name == 'p':
                    a1_ls.append(item.text)
            introduction = ''.join(a1_ls)
            introduction = BeautifulSoup(introduction, 'html.parser').text
        except:
            introduction = ''
        
        res_ls.append({
            'stock_code': tds[1].text,
            'wiki_url': wiki_url, 
            'company_name': tds[0].text,
            'introduction': introduction})
with open('/Users/charles/Downloads/project02/Project_02-Tina/nasdaq100.js', 
          'w') as f:
    json.dump(res_ls, f)

