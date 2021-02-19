import os
import glob
import time

sourcePath = "\\MQL5\\Include\\Expert\\"
resultsPath = "\\Results Here\\Expert\\"
returnType = ""  
name = ""
methodParams = ""
variables = ""
methods = ""
enums = ""
enumVal = ""
structs = ""
unions = ""
newString = ""
newIndex = 0
newIndexFromBool = 0
filesList = []
filesAndDirList = []
inheritList = []
CExpertList = []
CExpertBaseList = []
CExpertMoneyList = []
CExpertSignalList = []
CExpertTradeList = []
CExpertTrailingList = []
fileToConvert = None
fileWMethods = None
fileButConverted = None
fileCreated = None
fileWDeps = None

#given a name and return type, adds it to "variables" like this: -name: type
def aVariable(theName, theType):
    global variables #src: https://stackoverflow.com/questions/11904981/local-variable-referenced-before-assignment
    variables += "- " + theName + ": " + theType + "\n"

#given a name, parameter list and return type, adds it to "methods" like this: +name(type1, ..): retType
def aMethod(theName, parameters, theType):
    global methods
    methods += "+ " + theName + "(" +  parameters + "): " + theType + "\n"

#given a name and a collection of enums, add it to the enums global variable
def aEnum(name, values):
    global enums
    enums += "<<" + name + ">>\n" + values + "\n"

#pulls an enumerators values names out of the declaration
def extractEnumVals(line):
    global enumVal
    i = 0
    lineLen = len(line)
    flag = True
    while (i < lineLen and line[i] != "," and line[i] != ";" and line[i] != "+" and line[i] != "\n" and flag):   
        if (line[i] == "/"):
            i -= 1
            while (line[i] == " "):
                i -= 1
                flag = False
        i += 1
    enumVal += line[:i] + "\n"
    
#takes a string & assigns newString to the same string, skipped past every space ("  xy z" --> "xy z")
def movePastSpaces(line):
    global newString
    tempIndex = 0
    while (line[tempIndex] == " "):
        tempIndex += 1
    newString = line[tempIndex:]

#takes a string & assigns newString to the same string, skipped past const, static and virtual 
def movePastModifiers(line):
    global newString
    tempIndex = 0
    if (line[tempIndex : tempIndex+7] == "static "):
        tempIndex += 7
    if (line[tempIndex : tempIndex+6] == "const "):
        tempIndex += 6
    if (line[tempIndex : tempIndex+8] == "virtual "):
        tempIndex += 8
    if (line[tempIndex : tempIndex+6] == "input "):
        tempIndex += 6
    newString = line[tempIndex: ]

#takes a string & assigns newString to the same string, skipped past const, static and virtual
#returns true if it skipped over a keyword and false o/w
def movePastModifiersBool(line):
    global newIndexFromBool
    tempIndex = 0
    if (line[tempIndex : tempIndex+7] == "static "):
        newIndexFromBool += 7
        return True
    if (line[tempIndex : tempIndex+6] == "const "):
        newIndexFromBool += 6
        return True
    if (line[tempIndex : tempIndex+8] == "virtual "):
        newIndexFromBool += 8
        return True
    if (line[tempIndex : tempIndex+6] == "input "):
        newIndexFromBool += 6
        return True
    return False

# Takes a string and advances over the type
# PRECONDITION: string must start at a type (int, bool, ..)    
def movePastType(line):
    global newString
    movePastModifiers(line)
    tempIndex = 0
    while (line[tempIndex] != " "):
        tempIndex += 1
    newString = line[tempIndex:]

#  reads the name of a variable/method and stores it in: name
def extractName(line):
    global name
    global newIndex
    tempEndIndex = 0
    tempStartIndex = 0
    flag = False
    while (tempStartIndex < len(line)):
        if (line[tempStartIndex : tempStartIndex +2] == "::"):
            tempStartIndex += 2
            flag = True
            break
        tempStartIndex += 1
    while (line[tempEndIndex] != ";" and line[tempEndIndex] != "[" and line[tempEndIndex] != "(" and line[tempEndIndex] != "=" and line[tempEndIndex] != "\n"):
        tempEndIndex += 1
    if (flag):
        name = line[tempStartIndex : tempEndIndex]
    else:
        name = line[0 : tempEndIndex]
    newIndex = tempEndIndex

# reads a string and looks for ( and then checks if an if statement caused a false positive
# returns True if it contains ( and no if, false o/w
def isMethod(line):
    tempIndex = 0
    while (tempIndex < len(line) and line[tempIndex] != ";"):
        if (line[tempIndex] == "("):    # or line[tempIndex] == "{"):
            checkIndex = tempIndex      #used to check for if statements since they also use ()
            while (checkIndex >= 0):
                if (line[checkIndex : checkIndex+4] == "if (" or line[checkIndex:checkIndex+5]=="for (" or
                   (line[checkIndex : checkIndex+3] == "if(" or line[checkIndex:checkIndex+4]=="for(" or 
                    line[checkIndex:checkIndex+7]=="return(" or line[checkIndex:checkIndex+7]=="return " or line[checkIndex]=="[")):
                    return False
                checkIndex -= 1
            return True                 #src: https://www.geeksforgeeks.org/bool-in-python/
        tempIndex += 1
    return False

# reads a string and looks for ( or {
# sets a flag if it contains it, and returns false if it is tripped
def isVariable(line):
    tempIndex = 5 #moves past lines to just read name and if it contains ( or {
    methodFlag = False
    while (tempIndex < len(line)):
        if (line[tempIndex] == "(" or line[tempIndex] == "{"):
            temperIndex = tempIndex
            methodFlag = True
            while (temperIndex >= 0):
                #print(line[temperIndex : temperIndex+2])
                if (line[temperIndex : temperIndex+4] == "if (" or line[temperIndex:temperIndex+5]=="for (" or (line[temperIndex : temperIndex+3] == "if(" or line[temperIndex:temperIndex+4]=="for(")):
                    return False
                temperIndex -= 1
        if (line[tempIndex] == ";" and not methodFlag):
            return True
        tempIndex +=1
    return False

# reads the first 8 spaces of a string for //--- 
# returns True if it is present
def isComment(line):
    length = len(line)
    #return (len(newString) > 4 and newString[ : 5] == "//---") or (length >= 7 and line[ : 8] == "   //---")
    return (len(newString) > 1 and newString[ : 2] == "//") or (length >= 4 and line[ : 5] == "   //")

# looks for ~ or 15 consecutive spaces and returns True if either is present
def isConstructorOrDestructor(line):
    global newIndexFromBool
    index = 0
    storeIndex = newIndexFromBool
    length = len(line) #to not recalculate every time
    while (index < length):
        if (line[index] == "~"):
            return True
        if (line[index] != " "):
            if (line[: index] == index * " " and index > 15): #lazy check for a bunch of spaces, works constructors are autoformatted to be spaced 
                return True
        index += 1
    return False

# looks for "  };" to find the end of the class
def isEndOfClass(line):
    i = 0
    if (len(line) > 3 and line[ : 4] == "  };"):
        return True 
    else:
        return False

# runs when the keyword enums is found. If an empty string is found 5 times, it 
# returns true to denote the header contained only enums, false o/w
def isOnlyEnums(line):
    noStringCtr = 0
    while (line[ : 5] != "class"):
        line = fileWMethods.readline() #move past the ending char for enums
        if (line == ""):
            noStringCtr += 1
        else:
            noStringCtr = 0
        if (noStringCtr > 5):
            print("This header file only has enums!!")
            return True
    return False

def isImport(line):
    return line[0:7] == "#import"

# reads a string and sets returnType to what the variable/method returns
# modifies new string to start at the end of the return type
def extractReturnType(line):
    global returnType
    global newString
    endIndex = 0
    while (line[endIndex] != " " and line[endIndex] != ";"):
        endIndex += 1
    returnType = line[0: endIndex]
    newString = newString[endIndex:]

# takes a string and looks for a comma at the end to build one long method parameter
# always assigns newString to the modified string, or itself if nothing needs to be done
def buildString(line):
    global newString
    endOfOldLine = len(line)
    startOfNewLine = endOfOldLine #used to join the two lines together without a line break
    if (len(line) > 0 and line[len(line)-2] == ","):
        while (line != "" and line !="{" and line !="}" and line[len(line)-2] != ";" and line[len(line)-2] != ")" and line[len(line)-2] != "}"):
            line += fileWMethods.readline()
            while (line[startOfNewLine] == " "):
                startOfNewLine += 1
            line = line[ :endOfOldLine-1] + line[startOfNewLine : ] #endOfOldLine is subtracted by 1 to prevent a new line
            endOfOldLine = len(line)
            startOfNewLine = endOfOldLine
    newString = line

# reads a method, assigns newString to the parameters enclosed in parentheses and reads for the types of each parameter
# assigns methodParams as: type, type, ..
# PRECONDITION: passed a method
def extractParameterTypes(line): 
    global methodParams
    global newIndexFromBool
    openParenthesesIndex = 0
    closeParenthesesIndex = 0
    startType = 0
    endType = 0

    try:
        while (line[openParenthesesIndex] != "("):   #find where parameters start
            openParenthesesIndex += 1
        closeParenthesesIndex = openParenthesesIndex
        
        while (line[closeParenthesesIndex] != ")"): #find where parameters end
            closeParenthesesIndex += 1
        closeParenthesesIndex += 1 #make the closing parentheses inclusive, get OOB errors otherwise

        newString = line[openParenthesesIndex : closeParenthesesIndex] #Just the parameters in the form (type name, type name, ...)
        
        closeParenthesesIndex -= openParenthesesIndex #to prevent OOB access 
        openParenthesesIndex = 0
        startType = 1

        while(startType < closeParenthesesIndex):
            if (startType + 8 < closeParenthesesIndex and movePastModifiersBool(newString[startType:])): #will be used to check if modifiers are present in parameters
                startType += newIndexFromBool
            endType = startType
            newIndexFromBool = 0 #reset index from earlier to recheck for modifiers
            while (newString[endType] != " " and newString[endType] != ";"and newString[endType] != ")"): #get type here
                endType += 1
            methodParams += newString[startType : endType] + ", "
            while (newString[startType] != "," and newString[startType] != ")" and newString[startType] != ";"):
                startType += 1
            if (newString[startType] == " " and newString[startType + 1] != " "):
                startType += 1
            else:
                startType += 1 #move just past the comma
        methodParams = methodParams[:len(methodParams)-2] #get rid of last comma
    except:
        print("error converting file during parameter extraction")

# Resets all global variables except 'variables' and 'methods'
def reset():
    global newIndex
    global newIndexFromBool
    global returnType
    global name
    global methodParams
    global newString
    global enums
    global enumVal

    returnType = ""  
    name = ""
    methodParams = ""
    newString = ""
    enumVal = ""
    newIndex = 0
    newIndexFromBool = 0

# reads a file with multiline parameter and prints what buildString(string) made
def buildStringTest():
    giantParam = fileWMethods.readline()
    buildString(giantParam)
    print(newString)

# Contains 4 constant strings that is used to check if isConstructor is functioning properly 
def isConstuctorTest():
    a ="                  CCanvas(void);"
    b ="                 ~CCanvas(void);"
    c ="  //--- create/destroy"
    d ="   virtual bool      Create(const string name,const int width,const int height,ENUM_COLOR_FORMAT clrfmt=COLOR_FORMAT_XRGB_NOALPHA);"
    print("Should be TRUE; Actually is -->" + str(isConstructorOrDestructor(a)))
    print("Should be TRUE; Actually is -->" + str(isConstructorOrDestructor(b)))
    print("Should be FALSE; Actually is -->" + str(isConstructorOrDestructor(c)))
    print("Should be FALSE; Actually is -->" + str(isConstructorOrDestructor(d)))

# Runs each helper method in order and prints what the results were
# takes a bool to test method creation sequence
def helperMethodTest(isMethod):
    global newString
    global name
    global returnType
    global methodParams
    if (isMethod):
        newString ="    void              FillRectangle(int x1,int y1,int x2,int y2,const uint clr);"
        print("Method0-->" + newString)
        movePastSpaces(newString)
        print("Method1-->" + newString)
        movePastModifiers(newString)
        print("Method2-->" + newString)
        extractReturnType(newString)
        print("Method3-->" + newString)
        movePastSpaces(newString)
        print("Method4-->" + newString)
        extractName(newString)
        print("Method5-->" + newString)
        extractParameterTypes(newString)
        print("Method6-->" + newString)
        aMethod(name, methodParams, returnType)
        print("methodF-->" + methods)
    else:
        newString = "static uint       m_default_colors[9];      // default colors"
        #movePastType(newString)
        extractReturnType(newString)
        print("Variable0-->" + newString)
        movePastSpaces("       m_default_colors[9];      // default colors")
        print("Variable1-->" + newString)
        extractName("m_default_colors[9];      // default colors")
        print(name)
        aVariable(name, returnType)
        print("vars-->" + variables)
        
# Runs the method and variable builder to test for proper function        
def generalFormatterTest():
    aVariable("someVariable", "int")
    aMethod("genericMethod", "int, int, int", "String")
    print("Methods-->" + methods)
    print("Variables>" + variables)

# Tests if isMethod() is properly functioning
def boolMethodTest():
    print(isMethod("   void              FillRectangle(int x1,int y1,int x2,int y2,const uint clr);"))

# Tests if isVariable() is properly functioning
def isVariableTest():
    print("Should be TRUE; actually is -->" + str(isVariable("   uint              m_style;                  // line style template")))
    print("Should be TRUE; actually is -->" + str(isVariable("   const uint        dummyVar;                  // line style template")))
    print("Should be FALSE; actually is -->" + str(isVariable("                     CCanvas(void);")))
    print("Should be FALSE; actually is -->" + str(isVariable("//--- ")))
    print("Should be FALSE; actually is -->" + str(isVariable("generic string here")))

# Reads a string and tests to see if the parameters are extracted
def extractParamTest(strToUse):
    global methodParams
    extractParameterTypes("   void              FillRectangle(int x1,int y1,int x2,int y2,const uint clr);")
    print(methodParams)

# Opens a file to read and a text file where the results are written to
def openFiles(name, dir):
    global fileToConvert
    global fileWMethods
    global fileButConverted
    global fileCreated
    global sourcePath
    global resultsPath
    fileCreated = resultsPath + dir + name [ : len(name)-4] + " Results.txt"
    fileToConvert = name
    fileWMethods = open(sourcePath + dir + name, "r")
    fileButConverted = open(fileCreated, "w")

# Takes a file and writes the results of the program to it.
def writeFiles():
    fileButConverted.write("Variables\n---------\n" + variables)
    fileButConverted.write("\nMethods\n-------\n" + methods)
    fileButConverted.write("\nEnums\n-------\n" + enums)
    fileButConverted.write("\nStructs\n-------\n" + structs)
    fileButConverted.write("\nUnions\n-------\n" + unions)
    fileButConverted.write("\n==================EOF=====================\n")
    fileWMethods.close
    fileButConverted.close

def openForDep(aFile):
    global fileToConvert
    global fileWDeps
    global name
    global sourcePath
    global resultsPath
    i = len(aFile)-1
    while (aFile[i] != "\\" and i > 0):
        i -= 1
    if (aFile[i] == "\\"):
        i += 1
    name = aFile[i:len(aFile)-4]
    fileToConvert = open(aFile, "r")
    fileWDeps = open(resultsPath + name + " dependencies.txt", "w")

def writeDeps(depList):
    for dep in depList:
        fileWDeps.write(name + "-->" + dep + "\n")
    fileToConvert.close
    fileWDeps.close

# Prints an ASCII flowchart of how the program generally works
# Does not include helper methods
# NOTE: OUTDATED; VERSION THAT WAS USED FOR MQL4
def algo():
    arrow = "--->"
    noArrow ="-N->"
    LL = chr(217)
    rj = chr(192)
    nT = chr(193)
    T = chr(195)
    line01 = arrow + "Enter" + arrow +"move past" + arrow + "get" + arrow + "Comment?" + noArrow + "Constructor?" + noArrow + "Variable/Method?" + noArrow + "Closing brace?" + "-Y->" + chr(254) #[1]
    line02 = "    Class     access   ^ line       |             |                  |                  |"
    line03 = "                       |            Y             Y                  Y                  N" 
    line04 = "                       |            |             |                  |                  |"
    line05 = "                       |            v             v                  v                  |"
    line06 = "                       "+T+"-------------          get name           get Type              |"
    line07 = "                       |                          |                  |                  |"
    line08 = "                       |                          v                  v                  |"
    line09 = "                       |                  + name(void): name      get Name              |"
    line10 = "                       |                          |                  |                  |"
    line11 = "                       |                          v                  v                  |"
    line12 = "                       "+T+"---------------------------           ----Method?------         |"
    line13 = "                       |                                      |               |         |"
    line14 = "                       |                                      Y               N         |"
    line15 = "                       |                                      |               |         |"
    line16 = "                       |                                      v               v         |"
    line17 = "                       |                                     get        -name: type     |"
    line18 = "                       |                                    params            |         |"
    line19 = "                       |                                      |               |         |"
    line20 = "                       |                                      v               |         |"
    line21 = "                       |                          + name(param1, ..): type    |         |"
    line22 = "                       |                                      |               |         |"
    line23 = "                       |                                      v               v         v"
    line24 = "                       "+rj+"----------------------------------------------------------------"+LL
    print(line01 + "\n" + line02 + "\n" + line03 + "\n" + line04 + "\n" + line05 + "\n" + line06 + "\n" + 
          line07 + "\n" + line08 + "\n" + line09 + "\n" + line10 + "\n" + line11 + "\n" + line12 + "\n" +
          line13 + "\n" + line14 + "\n" + line15 + "\n" + line16 + "\n" + line17 + "\n" + line18 + "\n" + 
          line19 + "\n" + line20 + "\n" + line21 + "\n" + line22 + "\n" + line23 + "\n" + line24 + "\n" + 
          "\n= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n")

# i keep needing to look these up, just prints them instead
def vsCodeShortcuts():
    # https://stackoverflow.com/questions/39718412/visual-studio-code-keyboard-shortcuts-expand-collapse-all/39718649 [4]
    print("\nCtrl+Shift+[    Fold (collapse) region  editor.fold\nCtrl+Shift+]    Unfold (uncollapse) region  editor.unfold\nCtrl+K Ctrl+[   Fold (collapse) all subregions  editor.foldRecursively")
    print("Ctrl+K Ctrl+]   Unfold (uncollapse) all subregions  editor.unfoldRecursively\nCtrl+K Ctrl+0   Fold (collapse) all regions editor.foldAll\nCtrl+K Ctrl+J   Unfold (uncollapse) all regions\n")

# Gets all the file names and puts them into a list called filesList
def getFiles(dir):
    global filesList
    global sourcePath
    src = sourcePath
    everything = []
    everything.append(os.listdir(src + dir)) #[2]

    for i in range(len(everything)): #[3]
        for dirs in range(len(everything[i])):
            item = everything[i][dirs]
            if (item[len(item)-3 : len(item)-1] == "mq" ):
                filesList.append(item)

# Gets the directories that are stored in the mql5 include folder
def getDirs():
    global filesAndDirList
    global sourcePath
    dirList = []
    src = sourcePath
    for dir_, _, files in os.walk(src): #//[5]
        for file_name in files:
            rel_dir = os.path.relpath(dir_, src)
            rel_file = os.path.join(rel_dir, file_name)
            if (rel_file[len(rel_file)-3 : len(rel_file)-1] == "mq" ):
                if (rel_file[0] == "."):
                    filesAndDirList.append(rel_file[2:])
                else:
                    filesAndDirList.append(rel_file)
    
# Needed because lines were sometimes being read  l i k e  t h i s  a n d  i t  b r o k e  e v e r y t h i n g    
def fixSpaceBetweenChars(line):
    i = 0
    lineLen = len(line)
    oldString = line
    while (i < lineLen):
        if (ord(oldString[i]) == 0):
            if (i + 1 > lineLen and oldString[i+1] == " "):
                pass
            else:
                oldString = oldString[:i] + oldString[i+1:]
                lineLen = len(oldString)
        i += 1
    return oldString

def inheritListBuilder(line):
    global inheritList
    global name
    i = 0
    addPls = False
    newLine = fixSpaceBetweenChars(line)
    lineLen = len(newLine)
    while (i < lineLen):
        if (newLine[i] == ":"):
            if (newLine[i+1] == ":"):
                actualStartI = i
                while (newLine[actualStartI] != " " and newLine[actualStartI] != "(" and actualStartI > 0):
                    actualStartI -= 1
                if (newLine[actualStartI : i] != "" and newLine[actualStartI : i] != "or" and newLine[actualStartI : i] != "of" and newLine[0] != " " and newLine[:1] != "(!" and newLine[actualStartI] != " "):
                    inheritList.append(name + "==>" + newLine[actualStartI : i])
                '''
                for inherits in inheritList:
                    if (inherits != newLine[actualStartI : i] and inherits != ""):
                        addPls = True
                        break
                if (addPls):
                    inheritList.append(name + "-->" + newLine[actualStartI : i])
                    addPls = False
                    i = lineLen
                    '''
            elif(newLine[i+1] == " "):
                i += 2      #move past the space
                while (newLine[i] != " " and i < lineLen-1):
                    i += 1  #move past access spec
                i += 1      #move to first letter
                j = i
                while (j < lineLen - 1 and ((newLine[j] >= 'a' and newLine[j] <= 'z') or (newLine[j] >= 'A' and newLine[j] <= 'Z') or (newLine[j] >= '0' and newLine[j] <= '9'))):
                    j += 1
                    #print(newLine[i:j] + "<---("+ name + ")")
                if (newLine[i : j] != "" and newLine[i : j] != "or" and newLine[i : j] != "of" and newLine[0] != " " and newLine[:1] != "(!" and newLine[:5] != "class" ):
                    inheritList.append(name + "-->" + newLine[i:j])
                ''' 
                for inherits in inheritList:
                    if (inherits != newLine[i:j] and inherits != ""):
                        addPls = True
                        break
                    if (addPls):
                        inheritList.append(name + "-->" + newLine[i:j])
                        i = lineLen
                        addPls = False
                        '''
        i += 1

def cexpertListBuilder(line, fileName):
    global inheritList
    global name
    global methodParams
    global newIndexFromBool
    i = 0
    startOfC = 0
    endOfName = 0
    addPls = False
    newLine = fixSpaceBetweenChars(line)
    lineLen = len(newLine)
    while (i < lineLen):
        if (newLine[i] == ":"):
            if (newLine[i+1] == ":"):
                while (newLine[startOfC] != "C" and startOfC < i):
                    startOfC += 1
                #print(newLine[startOfC:startOfC+7])
                if (newLine[startOfC:startOfC+7] == "CExpert"):
                    endOfName = startOfC
                    while (newLine[endOfName] != "(" and endOfName < lineLen):
                        endOfName += 1
                    extractParameterTypes(newLine[endOfName:])
                    if (newLine[startOfC: startOfC + 11] == "CExpertBase"):
                        CExpertBaseList.append(newLine[startOfC+13:endOfName] + "(" + methodParams + ")" + "<--" + fileName)
                    elif (newLine[startOfC: startOfC + 12] == "CExpertMoney"):
                        CExpertMoneyList.append(newLine[startOfC+14:endOfName] + "(" + methodParams + ")" + "<--" + fileName)
                    elif (newLine[startOfC: startOfC + 13] == "CExpertSignal"):
                        CExpertSignalList.append(newLine[startOfC+15:endOfName] + "(" + methodParams + ")" + "<--" + fileName)
                    elif (newLine[startOfC: startOfC + 15] == "CExpertTrailing"):
                        CExpertTrailingList.append(newLine[startOfC+17:endOfName] + "(" + methodParams + ")" + "<--" + fileName)
                    elif (newLine[startOfC:startOfC + 8] == "CExpert:"):
                        CExpertList.append(newLine[startOfC+9:endOfName] + "(" + methodParams + ")" + "<--" + fileName)
                    #inheritList.append(newLine[startOfC:endOfName] + "(" + methodParams + ")")
        i += 1
        methodParams = ""
        name = ""
        newIndexFromBool = 0 #modified in extractParameterTypes(), resetting for safety 

# This is a version that will work when converting mql4 files. They are being stored here 
# so that I can make a version that works with mql5. Most of the code will work the 
# but occasionally, header files are written as .mq4 files hence the need to make
# a version that will work with mql5
def mql4Converter():
    for files in filesList:
        openFiles(files, subDir)
    methods = ""
    variables = ""
    flagCounter = 0
    if (fileToConvert[len(fileToConvert)-4:] == ".mqh"): #this section converts header files
        while True:
            newString = fixSpaceBetweenChars(fileWMethods.readline())
            onlyEnumsFlag = False
            importFlag = False
            while (newString[0 : 3] != "   " and newString[ : 4] != "  };" and not onlyEnumsFlag and not importFlag and flagCounter < 4): #goes into class and goes past access specifiers/make into a try catch block later
                newString = fileWMethods.readline()
                #print("NS------------->" + newString)
                if (len(newString) >= 4 and newString[0] != " " and newString[1] == " " and newString[2] != " " and newString[3] == " "):
                    newString = fixSpaceBetweenChars(newString)
                if (newString[ :4] == "enum"): #ran into an enum, needs to move past it since they end with "  };" just like the class definition does
                    #newString = fileWMethods.readline() #move past the ending char for enums
                    #onlyEnumsFlag = isOnlyEnums(newString)
                    extractName(newString[5:])
                    while (newString[ : 4] != "  };"):
                        while (newString[0 : 3] != "   "):
                            newString = fixSpaceBetweenChars(fileWMethods.readline())
                        movePastSpaces(newString)
                        extractEnumVals(newString)
                        newString = fixSpaceBetweenChars(fileWMethods.readline())
                    aEnum(name, enumVal)
                    newString = fixSpaceBetweenChars(fileWMethods.readline())
                    #while (newString[0:5] != "class" and newString[0:7] != "#import" and newString != ""):
                     #   newString = fileWMethods.readline()
                if (isImport(newString)):
                    importFlag = True
                if (newString == ""):
                    flagCounter += 1
            buildString(newString) #used to take multiline definitions into one big readable string
            endOfClassFlag = newString == ""
            comment = isComment(newString)
            method = isMethod(newString)
            variable = isVariable(newString)
            xstructor = isConstructorOrDestructor(newString)
            lastLine = isEndOfClass(newString)
            if (comment):
                pass
            elif(xstructor):
                movePastSpaces(newString)
                extractName(newString)
                aMethod(name, "void", name)
            elif (variable or method):
                movePastSpaces(newString)
                movePastModifiers(newString)
                extractReturnType(newString)
                movePastSpaces(newString)
                extractName(newString)
                if (method):
                    extractParameterTypes(newString)
                    aMethod(name, methodParams, returnType)
                else:
                    aVariable(name, returnType)
            elif (importFlag):
                newString = fileWMethods.readline()
                while (newString[:7] != "#import" and not isComment(newString)):
                    #print(newString[:len(newString)-1])
                    extractReturnType(newString)
                    movePastSpaces(newString)
                    extractName(newString)
                    extractParameterTypes(newString)
                    aMethod(name, methodParams, returnType)
                    reset()
                    newString = fileWMethods.readline()
                importFlag = False
            elif(endOfClassFlag):
                flagCounter += 1
                if (flagCounter > 6):
                    break
            elif(lastLine):# or onlyEnumsFlag):
                break
            reset()
        writeFiles()
        print("\nFinished converting " + fileToConvert + "!\nThe results are in " + fileCreated)
    elif (fileToConvert[len(fileToConvert)-4:] == ".mq4"): #this section converts class files
    #elif (fileToConvert[len(fileToConvert)-4:] == ".mqh"): #this section converts annoying header files that the devs thought were class files
        flagCounter = 0
        while True:
            newString = fileWMethods.readline()
            while ((newString != "") and (newString[0] < 'a' or newString[0] > 'z')):
                newString = fixSpaceBetweenChars(fileWMethods.readline())
            buildString(newString)
            method = isMethod(newString)
            variable = isVariable(newString)
            endOfClassFlag = newString == ""
            comment = isComment(newString)
            if (comment):
                pass
            elif(variable or method):
                movePastModifiers(newString)
                extractReturnType(newString)
                movePastSpaces(newString)
                extractName(newString)
                if(method):
                    extractParameterTypes(newString)
                    aMethod(name, methodParams, returnType)
                else:
                    aVariable(name, returnType)
            elif(endOfClassFlag):
                flagCounter += 1
                if (flagCounter > 3):
                    break
            reset()
        writeFiles()
        print("\nFinished converting " + fileToConvert + "!\nThe results are in " + fileCreated)
    else:
        print("sorry, can only convert mqh or mq4 files")
        fileWMethods.close
        fileButConverted.close

# Reads a file and looks for methods that are in mql5's 5 main base classes
# meant to be ran alone, put in a function for storage
def baseClassConverter():
    file2Open = open("wat are you doing.txt", "w")
    aString = ""
    #inheritList.sort()
    CExpertBaseList.sort()
    CExpertMoneyList.sort()
    CExpertSignalList.sort()
    CExpertTrailingList.sort()
    CExpertList.sort()

    file2Open.write("CExpertBase" + "\n-----------\n")
    for x in CExpertBaseList:
        aString += x + "\n"
    file2Open.write(aString + "\n")
    aString = ""

    file2Open.write("CExpertMoney" + "\n-----------\n")
    for x in CExpertMoneyList:
        aString += x + "\n"
    file2Open.write(aString + "\n")
    aString = ""

    file2Open.write("CExpertSignal" + "\n-----------\n")
    for x in CExpertSignalList:
        aString += x + "\n"
    file2Open.write(aString + "\n")
    aString = ""

    file2Open.write("CExpertTrailing" + "\n-----------\n")
    for x in CExpertTrailingList:
        aString += x + "\n"
    file2Open.write(aString + "\n")
    aString = ""

    file2Open.write("CExpert" + "\n-----------\n")
    for x in CExpertList:
        aString += x + "\n"
    file2Open.write(aString + "\n")
    aString = ""

    file2Open.close

# reads a file and looks for what dependencies it needs
# meant to be ran alone, put in a function for storage
def dependencyConverter():
    #openForDep(src)
    global sourcePath
    src = sourcePath
    blankLineCtr = 0
    for files in filesAndDirList:
        if (files[:6] == "Expert"):
            amt = 1
            openForDep(src + files)
            depList = []
            blankLineCtr = 0
            newString = fixSpaceBetweenChars(fileToConvert.readline())
            while (blankLineCtr < 50):
                amt += 1
                newString = fixSpaceBetweenChars(fileToConvert.readline())
                if (newString[3:9] == "switch"):
                    while (newString[:3] != "  }"):
                        newString = fixSpaceBetweenChars(fileToConvert.readline())
                        amt += 1
                if (newString == ""):
                    blankLineCtr += 1
                    
                #inheritListBuilder(newString)
                cexpertListBuilder(newString, files)
            print(files[7:] + " has been processed")


        while (newString[:8] == "#include"):
            depList.append(newString[10: len(newString)-2])
            newString = fixSpaceBetweenChars(fileToConvert.readline())
        if (blankLineCtr < 20):
            writeDeps(depList)
        else:
            print(name + " has no dependencies")

NCR = "Bears.mq4"
Legion = "Bulls.mq4"
CObj = "ChartObject.mqh"
NLTest = "NewLineTest.txt"
downloads = "Downloads\\"
effort = "EForT\\"
examples = "Examples\\"
subDir = ""#Expert\\"

#vsCodeShortcuts()
#getFiles(subDir)
getDirs()

for files in filesAndDirList:
    openFiles(files, subDir)
    methods = ""
    variables = ""
    flagCounter = 0

    if (fileToConvert[len(fileToConvert)-4:] == ".mqh "): #this section converts header files
        while True:
            newString = fixSpaceBetweenChars(fileWMethods.readline())
            importFlag = False
            while (newString[0 : 3] != "   " and newString[ : 4] != "  };" and flagCounter < 4): #goes into class and goes past access specifiers/make into a try catch block later
                newString = fixSpaceBetweenChars(fileWMethods.readline())
                
                if (newString[ :4] == "enum"): 
                    extractName(newString[5:])
                    while (newString[ : 4] != "  };"):
                        while (newString[0 : 3] != "   "):
                            newString = fixSpaceBetweenChars(fileWMethods.readline())
                        movePastSpaces(newString)
                        extractEnumVals(newString)
                        newString = fixSpaceBetweenChars(fileWMethods.readline())
                    aEnum(name, enumVal)
                    newString = fixSpaceBetweenChars(fileWMethods.readline())
                if (isImport(newString)):
                    importFlag = True
                if (newString == ""):
                    flagCounter += 1
                
            buildString(newString) #used to take multiline definitions into one big readable string
            endOfClassFlag = newString == ""
            comment = isComment(newString)
            method = isMethod(newString)
            variable = isVariable(newString)
            xstructor = isConstructorOrDestructor(newString)
            lastLine = isEndOfClass(newString)
            if (comment):
                pass
            elif(xstructor):
                movePastSpaces(newString)
                extractName(newString)
                aMethod(name, "void", name)
            elif (variable or method):
                #print(newString[:len(newString)-1])
                #time.sleep(0.2)
                movePastSpaces(newString)
                movePastModifiers(newString)
                extractReturnType(newString)
                movePastSpaces(newString)
                extractName(newString)
                if (method):
                    extractParameterTypes(newString)
                    aMethod(name, methodParams, returnType)
                else:
                    aVariable(name, returnType)
            elif(endOfClassFlag):
                flagCounter += 1
                if (flagCounter > 20):
                    break
            elif(lastLine):
                break
            reset()
        writeFiles()
        enums = ""
        print("\nFinished converting " + fileToConvert + "!\nThe results are in " + fileCreated)
    #elif (fileToConvert[len(fileToConvert)-4:] == ".mq5"): #this section converts class files
    elif (fileToConvert[len(fileToConvert)-4:] == ".mqh"): #this section converts annoying header files that the devs thought were class files
        flagCounter = 0
        while True:
            newString = fileWMethods.readline()
            while ((newString != "") and (newString[0] < 'a' or newString[0] > 'z')):
                newString = fixSpaceBetweenChars(fileWMethods.readline())
            buildString(newString)
            method = isMethod(newString)
            variable = isVariable(newString)
            endOfClassFlag = newString == ""
            comment = isComment(newString)
            if (comment):
                pass
            elif(variable or method):
                movePastModifiers(newString)
                extractReturnType(newString)
                movePastSpaces(newString)
                extractName(newString)
                if(method):
                    extractParameterTypes(newString)
                    aMethod(name, methodParams, returnType)
                else:
                    aVariable(name, returnType)
            elif(endOfClassFlag):
                flagCounter += 1
                if (flagCounter > 3):
                    break
            reset()
        writeFiles()
        print("\nFinished converting " + fileToConvert + "!\nThe results are in " + fileCreated)
    else:
        print("sorry, can only convert .mqh or .mq5 files")
        fileWMethods.close
        fileButConverted.close


print("\nF I N I S H E D ! !\n")

#print(filesList)
#algo()
#vsCodeShortcuts()


#sources
#[1] https://stackoverflow.com/questions/227459/how-to-get-the-ascii-value-of-a-character
#[2] https://www.geeksforgeeks.org/os-walk-python/
#[3] https://stackoverflow.com/questions/16548668/iterating-over-a-2-dimensional-python-list
#[4] https://stackoverflow.com/questions/39718412/visual-studio-code-keyboard-shortcuts-expand-collapse-all/39718649
#[5] https://stackoverflow.com/questions/1192978/python-get-relative-path-of-all-files-and-subfolders-in-a-directory
