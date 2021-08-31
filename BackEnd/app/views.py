from flask import Blueprint, jsonify, request
import urllib
from urllib.request import urlopen
from bs4 import BeautifulSoup
import json

main = Blueprint('main', __name__)

positions = {
    "white": {
        "P": [["a",2],["b",2],["c",2],["d",2],["e",2],["f",2],["g",2],["h",2]],
        "N": [["b",1], ["g",1]],
        "R": [["a",1], ["h",1]],
        "B": [["c",1], ["f",1]],
        "Q": [["d",1]],
        "K": [["e",1]],
    },
    "black": {
        "P": [["a",7],["b",7],["c",7],["d",7],["e",7],["f",7],["g",7],["h",7]],
        "N": [["b",8], ["g",8]],
        "R": [["a",8], ["h",8]],
        "B": [["c",8], ["f",8]],
        "Q": [["d",8]],
        "K": [["e",8]],
    }
}

board = {
    'a': ['R', 'P', '', '', '', '', 'P', 'R'], 
    'b': ['N', 'P', '', '', '', '', 'P', 'N'], 
    'c': ['B', 'P', '', '', '', '', 'P', 'B'], 
    'd': ['Q', 'P', '', '', '', '', 'P', 'Q'], 
    'e': ['K', 'P', '', '', '', '', 'P', 'K'], 
    'f': ['B', 'P', '', '', '', '', 'P', 'B'], 
    'g': ['N', 'P', '', '', '', '', 'P', 'N'], 
    'h': ['R', 'P', '', '', '', '', 'P', 'R']
}

#Get manhatton distance
def distance(candidate, destination):
    return (abs(candidate[0] - destination[0]) + abs(ord(candidate[1]) - destination[1]))

### Checking for Unobstructed pathways in the has..Path methods
def hasStraightPath(candidate, destination):
    if (candidate[0] == destination[0]):
        for i in board[candidate[0]][min(candidate[0], destination[0]):max(candidate[0], destination[0])]:
            if not i=="": return False

        return True
    elif (candidate[1] == destination[1]):
        for i in board.keys()[min(ord(candidate[1]),ord(destination[1])): max(ord(candidate[1]),ord(destination[1]))]:
            if not i=="": return False

        return True    
    else:
        return False

def hasDiagonalPath(candidate, destination):
    if(not abs(ord(candidate[0]) - ord(destination[0]))== abs(candidate[1] - destination[1])): return False
    length = abs(candidate[1] - destination[1])-1

    if(ord(destination[0])>ord(candidate[0])):
        if(destination[1]>candidate[1]):
            #Top right
            for i in range(length):
                if not board[ chr(ord(candidate[0]+i))][candidate[1]+i]=="": return False
            return True

        else: 
            #Bottom right
            for i in range(length):
                if not board[ chr(ord(candidate[0]+i))][candidate[1]-i]=="": return False
            return True
    else:
        if(destination[1]>candidate[1]):
            #Top left
            for i in range(length):
                if not board[ chr(ord(candidate[0]-i))][candidate[1]+i]=="": return False
            return True
        else: 
            #Bottom left
            for i in range(length):
                if not board[ chr(ord(candidate[0]-i))][candidate[1]-i]=="": return False
            return True

def hasLShapePath(candidate, destination):

    return abs(ord(candidate[0])-ord(destination[0]))==3 and abs(candidate[1] - destination[1])==1

    # if(not distance(candidate, destination)==4): return False

    # if(abs(ord(destination[0])-ord(candidate[0]))==3):
    #     if(ord(destination[0])>ord(candidate[0])):
    #         if(destination[1]>candidate[1]):
    #             #Top right
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]+i))][candidate[1]+i]=="": return False
    #             return True

    #         else: 
    #             #Bottom right
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]+i))][candidate[1]-i]=="": return False
    #             return True
    #     else:
    #         if(destination[1]>candidate[1]):
    #             #Top left
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]-i))][candidate[1]+i]=="": return False
    #             return True
    #         else: 
    #             #Bottom left
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]-i))][candidate[1]-i]=="": return False
    #             return True
    # else:
    #     if(ord(destination[0])>ord(candidate[0])):
    #         if(destination[1]>candidate[1]):
    #             #Top right
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]+i))][candidate[1]+i]=="": return False
    #             return True

    #         else: 
    #             #Bottom right
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]+i))][candidate[1]-i]=="": return False
    #             return True
    #     else:
    #         if(destination[1]>candidate[1]):
    #             #Top left
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]-i))][candidate[1]+i]=="": return False
    #             return True
    #         else: 
    #             #Bottom left
    #             for i in range(length):
    #                 if not board[ chr(ord(candidate[0]-i))][candidate[1]-i]=="": return False
    #             return True   




def hasPath(attackerType, turn, candidate, destination):
    import pdb;pdb.set_trace()
    if(attackerType == 'P'):
        # if(not candidate[0] == destination[0]): return False
        # #if(not distance(candidate, destination)<=2): return False
        if(turn=='white'):
            #Check if below destination
            if(destination[1]<=candidate[1]): return False
            return hasDiagonalPath(candidate, destination)
        else:
            #Check if above destination
            if(destination[1]>=candidate[1]): return False
            return hasDiagonalPath(candidate, destination)
    elif(attackerType == 'N'):
        return hasLShapePath(candidate, destination)
    elif(attackerType == 'B'):
        return hasDiagonalPath(candidate, destination)
    elif(attackerType == 'R'):
        return hasStraightPath(candidate, destination)
    elif(attackerType == 'Q'):
        return hasStraightPath(candidate, destination) or hasDiagonalPath(candidate, destination)
    elif(attackerType == 'K'):
        return (hasStraightPath(candidate, destination) or hasDiagonalPath(candidate, destination)) and distance(candidate, distance)==1
    return True

def findAttacker(attackerType, turn, destination, attackerColumn=""):
    attacker = None
    if not attackerColumn=="":
        for candidate in positions[turn][attackerType]:
            if(candidate[0]==attackerColumn and  hasPath(attackerType, turn, candidate, destination)):
                return candidate
    else:
        for candidate in positions[turn][attackerType]:
            if(hasPath(attackerType, turn, candidate, destination)):
                return candidate

def stepThrough(count, move, positions):
    turn = "white"
    if(count%2==1): turn = "black"

    if('x' in move):
        attack = move.split('x')
        attackerType = ''
        if((attack[0][0]).isupper()):
            attackerType = attack[0][0]
        else:
            attackerType = 'P'
            attack[0] = 'P'+attack[0]

        attacker = None
        #Ambiguous
        if(len(attack[0])>1):
            attacker = findAttacker(attackerType, turn, [attack[1][0],int(attack[1][1])], attack[0][1])
        else:
            attacker = findAttacker(attackerType, turn, [attack[1][0],int(attack[1][1])])

    elif('O' in move):
        #castling
        pass
    else:
        #move piece without taking (not castling)
        pass

    return 1


def extractMoves(query):
    # import pdb;pdb.set_trace()

    url_to_scrape = query 

    # request_page = urlopen(url_to_scrape, headers={'User-Agent': 'Mozilla/5.0'})
    # page_html = request_page.read()
    # request_page.close()

    # htmlSoup = BeautifulSoup(page_html, 'html.parser')
    # moves = htmlSoup.find_all('div', class_='move')
    url_to_scrape = query

    opener = urllib.request.Request(url_to_scrape, headers={'User-Agent': 'Mozilla/5.0'})
    request_page = urlopen(opener)
    page_html = request_page.read()
    request_page.close()

    htmlSoup = BeautifulSoup(page_html, 'html.parser')
    # f=open('file.html', 'w')
    # f.write(str(htmlSoup))
    # f.close()
   
    moves = htmlSoup.find_all("div", class_="pgn")
    moves = moves[0].text
    movesIndex = moves.find('1. ')
    moves = moves[movesIndex:]
    
    #Remove Opening
    moves = ''.join([moves[0:moves.find(' {')], moves[moves.find('}')+1:]])
    #Remove Result
    moves = moves[:moves.find('{')]
    #Split into Array
    moves = moves.split(' ')
    moves = moves[:-1]

    filterMoves = moves
    moves = []
    for i in range(len(filterMoves)):
        if((i)%3==0):
            continue
        moves.append(filterMoves[i])

    print(moves)

    for index in range(len(moves)):
        stepThrough(index, 'dxe5', positions)


    return "1"

@main.route('/parse', methods=['POST'])
def parse():
    query = request.get_json()['query']
    print(query)
    return extractMoves(query)
    return 'Done', 201