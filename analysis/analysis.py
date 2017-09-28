#gate width - default 100ms

coincidinceLevel = 4

gateWidth = 100


a = open("6865.2017.0821.1","r")
b = a.readlines()

splitText= list(map((lambda x: x.split()), b))

def parseLine(arr):
	#three types- data, ST, DS
	if arr[0]=="ST":
		#ST    1016         +350        +062          3325         175525
		return ["ST", int(arr[1]), int(arr[2]), int(arr[3]), int(arr[4]), int(arr[5]),
		#210817      A       07           2787681F        112           6431          00D4D000        000A711F
		int(arr[6]), arr[7], int(arr[8]), int(arr[9],16), int(arr[10]), int(arr[11]), int(arr[12],16), int(arr[13],16) ]
	elif arr[0]=="DS":
		#DS    000006A1        00000750        0000055E       00000678        0000015E
		return ["DS", int(arr[1],16), int(arr[2],16), int(arr[3],16), int(arr[4],16), int(arr[5],16)]
	else:
		        #AACB98EF       B8              00              3B              00              00
		return [int(arr[0],16),int(arr[1],16), int(arr[2],16), int(arr[3],16), int(arr[4],16), int(arr[5],16),
		#00            00               00              AAAD742F       182531.013 210817   A        09           8             +0064
		int(arr[6],16), int(arr[7],16), int(arr[8],16), int(arr[9],16), arr[10],  arr[11], arr[12], int(arr[13]), int(arr[14]), int(arr[15])]

parsedText= list(map(parseLine, splitText))

def isData(xs):
	return isinstance(xs[0], int)

def isST(xs):
	return xs[0]=="ST"

def isDS(xs):
	return xs[0]=="DS"

def GoesUpAndDown(xs):
	#checks if both are 0, or both are nonzero (FEx and REx)
	#individual checks return booleans, but True+True = 2
	return (((xs[1] != 0 and xs[2] != 0) or ((xs[1]==0 or xs[1]==128) and xs[2]==0)) + ((xs[3] != 0 and xs[4] != 0) or (xs[3]==0 and xs[4]==0)) +
	       ((xs[5] != 0 and xs[6] != 0) or (xs[5]==0 and xs[6]==0)) + ((xs[7] != 0 and xs[8] != 0) or (xs[7]==0 and xs[8]==0))) >= coincidince_level

def timeDiff(d1, d2):
	return abs(d1[0] - d2[0])

parsedTextFiltered = list(filter(isData, parsedText))

NumberOfData= len(parsedTextFiltered)

def addData(a1, a2):
	#a1 is the original
	return [a1[0], a1[1]+a2[1], a1[2]+a2[2],a1[3]+a2[3], a1[4]+a2[4], a1[5]+a2[5], a1[6]+a2[6], a1[7]+a2[7], a1[8]+a2[8],
	        a1[9], a1[10], a1[11], a1[12], a1[13], a1[14], a1[15]]

potentialCandidates=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]

for i in range(7,NumberOfData-7):
	localGroup = []
	j = i
	while True:
		if timeDiff(parsedTextFiltered[i], parsedTextFiltered[j]) <= gateWidth:
			localGroup.append(parsedTextFiltered[j])
			j -= 1
		else:
			break
	j = i+1
	while True:
		if timeDiff(parsedTextFiltered[i], parsedTextFiltered[j]) <= gateWidth:
			localGroup.append(parsedTextFiltered[j])
			j += 1
		else:
			break
	localGroup.sort(key=lambda x: x[0])
	if not(potentialCandidates[-1]== localGroup):
		potentialCandidates.append(localGroup)

potentialCandidates.pop(0)


def mishka(_list):
     pruned_list = []
     for i in _list:
         is_unique = True
         for j in pruned_list:
             if set(j) == set(i):
                 is_unique = False
         if is_unique:
             pruned_list.append(i)
     return pruned_list


def dataAddReduce(listoflists):
	a = listoflists[0]
	for i in range(1, len(listoflists)):
		a = addData(a, listoflists[i])
	return a

def finalmuons(listoflistsoflists):
	out=[]
	a = len(listoflistsoflists)
	for i in range(0,a):
		out.append(dataAddReduce(listoflistsoflists[i]))
	return out

a= [[[1057478783, 191, 0, 62, 0, 0, 0, 0, 0, 1049726749, '235958.004', '210817', 'A', 10, 0, 62], [1057478784, 0, 0, 0, 45, 0, 0, 0, 0, 1049726749,
'235958.004', '210817', 'A', 10, 0, 62], [1057478784, 0, 38, 0, 0, 0, 0, 0, 0, 1049726749, '235958.004', '210817', 'A', 10, 0, 62]], [[1066815996, 183, 0, 0, 0, 0,
0, 0, 0, 1049726749, '235958.004', '210817', 'A', 10, 0, 62], [1066815996, 0, 0, 58, 0, 0, 0, 0, 0, 1049726749, '235958.004', '210817', 'A', 10, 0, 62], [1066815997, 0,
34, 0, 35, 0, 0, 0, 0, 1049726749, '235958.004', '210817', 'A', 10, 0, 62]]]


#j is the final!!!!!! all muons.
j= finalmuons(potentialCandidates)
