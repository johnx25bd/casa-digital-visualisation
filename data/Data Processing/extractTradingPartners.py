import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os
import time
import re

def extractTradingPartners(basePath):
    if basePath == None:

        directory = 'Data Sources/Trading Partners (1)/'

    else:
        #basePath = C:/Users/Krist/University College London/Digital Visualisation/Final Project/'
        directory = basePath+'Data Sources/Trading Partners (1)/'

    files = os.listdir(directory)

    for i,file in enumerate(files):
        # We are only interested in the csv's and not the source text nor a potential zip-folder containing raw data.
        if '.csv' in file.lower():
            if i == 0:
                # Reading in the file using the encoding latin-1 instead of the default unicode
                # because the indicator-specifications contains characters which is included in unicode.
                # Part of on the reading is converting NaN values to zeros.
                tradingPartners = pd.read_csv(directory+file,encoding = 'latin-1').fillna(value=0)
                # Extracting the rows, which contains information on the top 5 trading partners.
                indicatorOfInterest = [indicator for indicator in tradingPartners.Indicator.unique() if 'top 5' in indicator.lower()]
                # Locating the relevant indices
                indices = [i for i,indicator in enumerate(tradingPartners.Indicator) if indicator in indicatorOfInterest]
                # Constructing the dataframe with the observations of interest
                tradingPartners = tradingPartners.loc[indices]
                tradingPartners = tradingPartners.reset_index(drop=True)

            else:
                # Reading in the file using the encoding latin-1 instead of the default unicode
                # because the indicator-specifications contains characters which is included in unicode.
                # Part of on the reading is converting NaN values to zeros.
                temp = pd.read_csv(directory+file,encoding = 'latin-1').fillna(value=0)

                # Locating the relevant indices
                indices = [i for i,indicator in enumerate(temp.Indicator) if indicator in indicatorOfInterest]

                # Constructing the dataframe with the observations of interest
                temp = temp.loc[indices]
                temp = temp.reset_index(drop=True)

                # Concate the new dataframe with the existing
                tradingPartners = pd.concat([tradingPartners,temp],axis = 0)
    # Ensuring everything is lowercased, to ease the extraction later.
    # Firstly the columns;
    columns = []
    for column in tradingPartners.columns:
        #print(column)
        try:
            column = column.lower()
        except:
            None

        columns.append(column)

    tradingPartners.columns = columns
    # Secondly the columns which can be expected to be categorical/strings
    reporter,partner,products,indicatorType,indicator = [],[],[],[],[]

    for report,part,prod,indiType,indi in zip(tradingPartners['reporter'],tradingPartners['partner'],tradingPartners['product categories'],
                                            tradingPartners['indicator type'],tradingPartners['indicator']):
            # Reporter
        try:
            report = report.lower()
        except:
            None

            # Partner
        try:
            part = part.lower()
        except:
            None

            # Product categories
        try:
            prod = prod.lower()
        except:
            None

            # Indicator type
        try:
            indiType = indiType.lower()
        except:
            None

            # Indicator
        try:
            indi = indi.lower()
        except:
            None

        reporter.append(report)
        partner.append(part)
        products.append(prod)
        indicatorType.append(indiType)
        indicator.append(indi)

    tradingPartners['reporter'] = reporter
    tradingPartners['partner'] = partner
    tradingPartners['product category'] = products
    tradingPartners['indicator type'] = indicatorType
    tradingPartners['indicator'] = indicator
    # Writing the CSV.
    tradingPartners.to_csv('TradingPartners.csv')
