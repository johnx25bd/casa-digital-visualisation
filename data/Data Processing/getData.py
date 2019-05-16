import pandas as pd
import numpy as np
import os
from UN_Comtrade import download_trade_data
from UN_Comtrade import search_product_code, product_codes_with_parent
from extractTradingPartners import extractTradingPartners

def getTradingPartners(reporter,year='latest',indicatorType = 'all',basePath=None):

    # Loading in the data if necessary
    if 'tradingPartners' not in locals():
        if 'TradingPartners.csv' in os.listdir():
            tradingPartners = pd.read_csv('TradingPartners.csv',index_col = 0)
        else:

            if basePath == None:

                extractTradingPartners()

            else:
                extractTradingPartners(basePath)

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

    # Making sure that the specified reporter and 'indicator type' is in the correct format (Starting with a capital letter, and the rest being
    # lowercase characters).
    # Reporter
    #characters = [i.upper() if j == 0 else i.lower() for j,i in enumerate(reporter)]
    #reporter = ''.join(characters)
    reporter = reporter.lower()
    # Indicator Type
    #characters = [i.upper() if j == 0 else i.lower() for j,i in enumerate(indicatorType)]
    #indicatorType = ''.join(characters)
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
