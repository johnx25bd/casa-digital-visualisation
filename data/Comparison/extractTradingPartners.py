import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os
import time
import re

def extractTradingPartners():
    directory = 'Data Sources/Trading Partners (1)/'
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

    tradingPartners.to_csv('TradingPartners.csv')
