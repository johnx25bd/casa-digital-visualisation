## This file extracts table desciptions, under the assumption that the description follows immediately after the "table" line. 

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import ezodf
import re

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
