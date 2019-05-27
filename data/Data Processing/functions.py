import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import ezodf
import re
from UN_Comtrade import download_trade_data
from UN_Comtrade import search_product_code, product_codes_with_parent

def extractDescription(folderFiles,pathOfFile,verbose = False):
    uniqueIdentifiers = []
    contentOfFiles = []

    for i,file in enumerate(folderFiles):
        if i == 0 and verbose:
            print('The number of files in this folder are: %i' % len(folderFiles),'\n')
            # Opening the file
        if '.ods' in file:
            doc = ezodf.opendoc(pathOfFile+'/'+file)
            # Locating the correct sheet
            sheetOfInterest = [(i,sheet.name) for i,sheet in enumerate(doc.sheets) if sheet.name.lower() in file]
            if len(sheetOfInterest) != 0:

                sheetLocation = sheetOfInterest[0][0]
                sheetName = sheetOfInterest[0][1]

                # Extract the name of that table
                sheet = doc.sheets[int(sheetLocation)]
                rowOfInterest = 0
                rowContent = []
                # Extract
                for i, row in enumerate(sheet.rows()):
                    for cell in row:
                        # A lot of empty cells occur, which is why try/except is used.
                        if rowOfInterest == 0:
                            try:
                                tempcell = cell.value.lower()
                                # The name of the tabel always occurs after the 'table', which is why the location of table is stored (or
                                # actually the actual location of the name through 'i', which is the location of the 'table')
                                if 'table' in tempcell:
                                    rowOfInterest = i + 1

                                # Another way of locating the description of the content is through the similiary in the unique inden-
                                # tifiers.
                                else:
                                    tempContent = tempcell.split()
                                    tempContent = [re.sub('[.,]','',word) for word in tempContent]
                                    similarity = sum([1 for word in tempContent if word in uniqueIdentifiers])
                                    if similarity > 0.75*len(tempContent):
                                        rowOfInterest = i
                            except:
                                None

                        # The two if-statements prints ensures the printing of the content of interest
                        if i == rowOfInterest and rowOfInterest != 0:
                            rowContent.append(row[0].value)
                            break
                    if rowContent != []:
                        # Stores the unique words
                        try:
                            tempContent = rowContent[0].split()
                        except:
                            print(rowContent[0])
                        # A bit of cleaning
                        tempContent = [re.sub('[.,]','',word) for word in tempContent]
                        # Add content
                        uniqueIdentifiers = uniqueIdentifiers + tempContent
                        uniqueIdentifiers = list(set(uniqueIdentifiers))
                        # printing what we found
                        if verbose:
                            print(file,': ',rowContent)
                        contentOfFiles.append(((str(file)+': '),rowContent))
                        break
            else:
                if verbose:
                    print('This file appears to be different from the usual format - have a look at it for investigation')
                contentOfFiles.append(str(file)+': This file appears to be different from the usual format - have a look at it for investigation')
    return contentOfFiles

def extractTradingPartners():

    directory = '../Data Sources/Trading Partners (1)/'

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

def getTradingPartners(reporter,year='latest',indicatorType = 'all'):

    # Loading in the data if necessary
    if 'tradingPartners' not in locals():
        if 'TradingPartners.csv' in os.listdir():
            tradingPartners = pd.read_csv('TradingPartners.csv',index_col = 0)
        else:

            extractTradingPartners()

            tradingPartners = pd.read_csv('TradingPartners.csv',index_col = 0)

    years = [int(column) for column in tradingPartners.columns if column.isnumeric()]

    # Checking the year provided

    if year == 'latest':
        year = max(years)
    else:
        if isinstance(year,str):
            year = int(year)
        if year not in years:
            raise ValueError('The year is not included in the range of possible values')

    # Making sure that the specified reporter and 'indicator type' is in the correct format (lowercase characters).

    # Reporter
    reporter = reporter.lower()

    # Indicator Type
    indicatorType = indicatorType.lower()
    # Checking that the specified reporter is part of the available reporters.
    if reporter not in tradingPartners.reporter.unique():
        raise ValueError ('The specified reporter is not in the available set of reporters.')

    countryPartners = tradingPartners[tradingPartners.reporter==reporter]
    countryPartners = countryPartners.reset_index(drop=True)

    # Creating a subset of interest
    subsettedFrame = pd.concat([countryPartners.iloc[:,0:5],countryPartners[str(year)]],axis=1)

    # Useful for later
    indicators = subsettedFrame.indicator.unique()
    whereAreYouAmount = [i for i,element in enumerate(indicators) if 'share' not in element.lower()]
    whereAreYouShare = [i for i,element in enumerate(indicators) if 'share' in element.lower()]

    # Extracting the partners based on the indicator type specified.

    if (indicatorType =='all') or (indicatorType == 'All'):

        # We are only interested in the data with actual amounts of value listed, not share data.
        subsettedFrameActualAmounts = subsettedFrame[(subsettedFrame.indicator == indicators[whereAreYouAmount[0]])|\
                                                     (subsettedFrame.indicator == indicators[whereAreYouAmount[1]])]

        # Adding imports and exports together
        aggregatedData = {country:round(sum(subsettedFrameActualAmounts[subsettedFrameActualAmounts.partner==country]\
                                            [str(year)]),3) for country in subsettedFrameActualAmounts.partner.unique()}

        # Sorted highest to lowest
        sortedAggregatedData = sorted(aggregatedData.items(), key = lambda kv: kv[1],reverse = True)

        # Only keeping top five
        sortedDataTopFive = sortedAggregatedData[0:5]

    elif (indicatorType == 'import') or (indicatorType == 'export'):
        # Subsetting the data
        subsettedFrameActualAmountsEither = subsettedFrame[((subsettedFrame.indicator == indicators[whereAreYouAmount[0]])|\
                                                            (subsettedFrame.indicator == indicators[whereAreYouAmount[1]])) & \
                                                            (subsettedFrame['indicator type'] == indicatorType)]
        # Sorting the subsetted data
        sortedData = subsettedFrameActualAmountsEither.sort_values(by=[str(year)],ascending = False).round({str(year):3})
        sortedData = sortedData.reset_index(drop=True)
        # Getting top-five
        sortedDataTopFive = [(sortedData.loc[obs].partner,(sortedData[str(year)].loc[obs]/100)) for obs in np.arange(5)]
    else:
        raise ValueError ('The indicator type specified is not known.')

    # Getting the shares of the trading partners
    if (indicatorType == 'import') or (indicatorType == 'export'):
        subsettedFrameShares = subsettedFrame[((subsettedFrame.indicator == indicators[whereAreYouShare[0]])|\
                                              (subsettedFrame.indicator == indicators[whereAreYouShare[1]])) & \
                                             (subsettedFrame[str(year)]) & (subsettedFrame['indicator type'] == indicatorType)]
        # Sorted in share-frame
        sortedShares = subsettedFrameShares.sort_values(by=[str(year)],ascending = False).round({str(year):3})
        sortedShares = sortedShares.reset_index(drop=True)

        # Arranging top five properly
        sortedSharesTopFive = [(sortedShares.loc[obs].partner,(sortedShares[str(year)].loc[obs]/100)) for obs in np.arange(5)]
    else:

        # Export
        exportAmount = [i for i,element in enumerate(indicators) if ('share' not in element.lower()) \
                        & ('export' in element.lower())]
        exportShare = [i for i,element in enumerate(indicators) if ('share' in element.lower()) \
                        & ('export' in element.lower())]

        eAmount = np.array([a for a in subsettedFrame[subsettedFrame.indicator==indicators[exportAmount[0]]][str(year)]\
                          if a > 0])
        eShare = np.array([a for a in subsettedFrame[subsettedFrame.indicator==indicators[exportShare[0]]][str(year)]\
                          if a > 0])

        totalExport = np.mean(eAmount / (eShare / 100))

        # Import

        importAmount = [i for i,element in enumerate(indicators) if ('share' not in element.lower()) \
                        & ('import' in element.lower())]
        importShare = [i for i,element in enumerate(indicators) if ('share' in element.lower()) \
                        & ('import' in element.lower())]

        iAmount = np.array([a for a in subsettedFrame[subsettedFrame.indicator==indicators[importAmount[0]]][str(year)]\
                          if a > 0])
        iShare = np.array([a for a in subsettedFrame[subsettedFrame.indicator==indicators[importShare[0]]][str(year)]\
                          if a > 0])

        totalImport = np.mean(iAmount / (iShare / 100))

        # Aggregated

        sortedSharesTopFive = [(country[0],(country[1]/(totalExport+totalImport))) for country in sortedDataTopFive]

    return sortedDataTopFive,sortedSharesTopFive

# Period: either YYYY or YYYYMM format, specify start/end period in one string, separated by a hyphen (Ex. YYYYMM-YYYYMM or
# YYYY-YYYY).
# Year: YYYY format or 'latest'
# indType: 'all', 'Export' or 'Import'
# Freq: 'M' or 'Y'
# Reporter: Any country
# Products: 'TOTAL' or a valid HS code

def getData(reporter, period,partners,products ='TOTAL',year='latest', indType='all',freq = 'Y'):
    ########################################## Getting cleaned data ##########################################
    if reporter.lower() != 'all':
    # Getting top five trading partners
        topFiveAmount,topFiveShares = getTradingPartners(reporter=reporter,year=year,indicatorType=indType)

        # Pulling out the data received
        amounts = [partner[1] for partner in topFiveAmount]
        partners = [partner[0] for partner in topFiveAmount]

        # Extracting data from ComTrade API
        download_trade_data('tempoaryFile.csv', period=period, frequency=freq.upper(), reporter=reporter,
                        partner=partners, product=products, tradeflow=indType)

    else:
        download_trade_data('tempoaryFile.csv', period=period, frequency=freq.upper(), reporter=reporter,
                        partner=partners, product=products, tradeflow=indType)

    # Reading in the data, to structure it properly.
    cleanData = pd.read_csv('tempoaryFile.csv',index_col=0,parse_dates=['periodDesc'])

    # Keeping only the relevant columns
    cleanData = cleanData[['TradeValue','cmdCode','cmdDescE','periodDesc','ptTitle','rgDesc','rtTitle','rt3ISO']]

    # Renaming
    cleanData.columns = ['trade_value','product','product_description','date','partner','indicator_type','reporter','reporter_ISO']

    # Convert the unit to 'millions' USD
    cleanData['trade_value'] = cleanData.trade_value/1000000
    # Structuring the data correctly
    cleanData = cleanData.sort_values(by=['partner','indicator_type','date','product'])
    cleanData = cleanData.reset_index(drop=True)

    # Saving the structured data
    cleanData.to_csv('StructuredData.csv')


##### Example #####
# Outcomment to try it out

#getData('Denmark','201401-201512',freq='m')
