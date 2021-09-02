from flask import Blueprint, jsonify, request
import urllib
from urllib.request import urlopen
from bs4 import BeautifulSoup
import json
from .models import Entry, Game
from app import db

main = Blueprint('main', __name__)

positions = {}

board = {}

def updateBoard(candidate, pieceType, turn, destination, attack):
    # for i in board.keys():
    #     print(board[i])

    takenPieceType = board[destination[0]][destination[1]-1]
    board[candidate[0]][candidate[1]-1] = ""
    board[destination[0]][destination[1]-1] = pieceType
    for i in range(len(positions[turn][pieceType])):
        if(positions[turn][pieceType][i] == candidate):
            positions[turn][pieceType][i] = [destination[0], destination[1]]
            break
    
    if(attack):
        if turn == "white": turn = "black"
        else: turn = "white"
        positions[turn][takenPieceType].remove(destination)


#Get manhatton distance
def distance(candidate, destination):
    return (abs(candidate[0] - destination[0]) + abs(ord(candidate[1]) - destination[1]))

### Checking for Unobstructed pathways in the has..Path methods
def hasStraightVerticalPath(candidate, destination):
    if (candidate[0] == destination[0]):
        for i in board[candidate[0]][min(candidate[1], destination[1]):max(candidate[1]-1, destination[1]-1)]:
            if not i=="": return False

        return True
    else: return False

def hasStraightHorizontalPath(candidate, destination):
    if (candidate[1] == destination[1]):

        for i in ("abcdefgh")[min(ord(candidate[0]),ord(destination[0]))-96: max(ord(candidate[0]),ord(destination[0]))-97]:
            if not board[i][candidate[1]-1]=="": return False

        return True    
    else: return False

def hasDiagonalPath(candidate, destination):
    if(not abs(ord(candidate[0]) - ord(destination[0]))== abs(candidate[1] - destination[1])): return False
    length = abs(candidate[1] - destination[1])

    if(ord(destination[0])>ord(candidate[0])):
        if(destination[1]>candidate[1]):
            #Top right
            for i in range(1, length):
                if not board[ chr(ord(candidate[0])+i)][candidate[1]-1+i]=="": return False
            return True

        else: 
            #Bottom right
            for i in range(1, length):
                if not board[ chr(ord(candidate[0])+i)][candidate[1]-1-i]=="": return False
            return True
    else:
        if(destination[1]>candidate[1]):
            #Top left
            for i in range(1, length):
                if not board[ chr(ord(candidate[0])-i)][candidate[1]-1+i]=="": return False
            return True
        else: 
            #Bottom left
            for i in range(1, length):
                if not board[ chr(ord(candidate[0])-i)][candidate[1]-1-i]=="": return False
            return True

def hasLShapePath(candidate, destination):
    return (abs(ord(candidate[0])-ord(destination[0]))==2 and abs(candidate[1] - destination[1])==1 
    or abs(candidate[1] - destination[1])==2 and abs(ord(candidate[0])-ord(destination[0]))==1)


def hasPath(pieceType, turn, candidate, destination, attack):
    if(pieceType == 'P'):
        # if(not candidate[0] == destination[0]): return False
        # #if(not distance(candidate, destination)<=2): return False
        if(turn=='white'):
            #Check if below destination
            if(destination[1]<=candidate[1]): return False
            if(attack): return hasDiagonalPath(candidate, destination)
            else: return hasStraightVerticalPath(candidate,destination)
        else:
            #Check if above destination
            if(destination[1]>=candidate[1]): return False
            if(attack): return hasDiagonalPath(candidate, destination)
            else: return hasStraightVerticalPath(candidate,destination)

    elif(pieceType == 'N'):
        return hasLShapePath(candidate, destination)
    elif(pieceType == 'B'):
        return hasDiagonalPath(candidate, destination)
    elif(pieceType == 'R'):
        return hasStraightVerticalPath(candidate, destination) or hasStraightHorizontalPath(candidate, destination)
    elif(pieceType == 'Q'):
        return (hasStraightVerticalPath(candidate, destination) or hasDiagonalPath(candidate, destination)) or hasStraightHorizontalPath(candidate, destination)
    elif(pieceType == 'K'):
        return ((hasStraightVerticalPath(candidate, destination) or hasDiagonalPath(candidate, destination)) or hasStraightHorizontalPath(candidate, destination))
    
    return True

def findCandidate(pieceType, turn, destination, attack = False, attackerColumn=""):
    attacker = None
    if not attackerColumn=="":
        for candidate in positions[turn][pieceType]:
            if(candidate[0]==attackerColumn and  hasPath(pieceType, turn, candidate, destination, attack)):
                updateBoard(candidate, pieceType, turn, destination, attack)
                return candidate
    else:
        for candidate in positions[turn][pieceType]:
            if(hasPath(pieceType, turn, candidate, destination, attack)):
                updateBoard(candidate, pieceType, turn, destination, attack)
                return candidate

def QueenSideCastle(turn):
    if turn == "white":
        #After castling -> Rf1 and Kg1
        for i in range(len(positions[turn]['R'])):
            if positions[turn]['R'][i] == ['a', 1]:
                positions[turn]['R'][i] = ['d',1]
                positions[turn]['K'] = [['c',1]]
                board['d'][0] = 'R'
                board['c'][0] = 'K'
                board['e'][0] = ""
                board['a'][0] = ""
                break

    else:
        for i in range(len(positions[turn]['R'])):
            if positions[turn]['R'][i] == ['a', 8]:
                positions[turn]['R'][i] = ['d',8]
                positions[turn]['K'] = [['c',8]]
                board['d'][7] = 'R'
                board['c'][7] = 'K'
                board['e'][7] = ""
                board['a'][7] = ""
                break

    # for i in board.keys():
    #     print(board[i])


def KingSideCastle(turn):
    if turn == "white":
        #After castling -> Rf1 and Kg1
        for i in range(len(positions[turn]['R'])):
            if positions[turn]['R'][i] == ['h', 1]:
                positions[turn]['R'][i] = ['f',1]
                positions[turn]['K'] = [['g',1]]
                board['f'][0] = 'R'
                board['g'][0] = 'K'
                board['e'][0] = ""
                board['h'][0] = ""
                break

    else:
        for i in range(len(positions[turn]['R'])):
            if positions[turn]['R'][i] == ['h', 8]:
                positions[turn]['R'][i] = ['f',8]
                positions[turn]['K'] = [['g',8]]
                board['f'][7] = 'R'
                board['g'][7] = 'K'
                board['e'][7] = ""
                board['h'][7] = ""
                break

    # for i in board.keys():
    #     print(board[i])

def stepThrough(count, move):
    turn = "white"
    if(count%2==1): turn = "black"

    if('#' in move or '+' in move): move = move[:-1]

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
            attacker = findCandidate(attackerType, turn, [attack[1][0],int(attack[1][1])], True, attack[0][1])
        else:
            attacker = findCandidate(attackerType, turn, [attack[1][0],int(attack[1][1])], True, "")

    elif('O' in move):
        #castling
        NumofO = move.count('O')
        if NumofO == 2:
            KingSideCastle(turn)
        else:
            QueenSideCastle(turn)

    else:
        #move piece without taking (not castling)
        Piece = ''
        if((move[0]).isupper()):
            Piece = move[0]
        else:
            Piece = 'P'
            move = 'P'+move
        
        if(len(move)==4):
            attacker = findCandidate(Piece, turn, [move[2], int(move[3])], False, move[1])        
        else:
            #length is 3
            assert(len(move) == 3)
            attacker = findCandidate(Piece, turn, [move[1], int(move[2])], False)        


        pass

    return (positions, board)

def extractMoves(query):
    global positions, board
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
    url_to_scrape = query 


    url_to_scrape = query

    opener = urllib.request.Request(url_to_scrape, headers={'User-Agent': 'Mozilla/5.0'})
    request_page = urlopen(opener)
    page_html = request_page.read()
    request_page.close()

    htmlSoup = BeautifulSoup(page_html, 'html.parser')

    moves = htmlSoup.find_all("div", class_="pgn")
    moves = moves[0].text
    movesIndex = moves.find('1. ')
    moves = moves[movesIndex:]
    # print(moves)
    
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

    # print(moves)
    for index in range(len(moves)-3):
        print("MOVE: "+moves[index])
        stepThrough(index, moves[index])

        for i in board.keys():
            print(board[i])
        # print(json.dumps(positions))
        turn1 = "white"
        if(index%2==1): turn1 = "black" 
        if('x' in moves[index+3]):
            new_Entry = Entry(positions=json.dumps(positions),board=json.dumps(board), nextSteps=json.dumps(moves[index+1:index+4]), turn=turn1)
            db.session.add(new_Entry)
            db.session.commit()


    return board

@main.route('/parse', methods=['POST'])
def parse():

    query = request.get_json()['query']
    print(query)
    games_list = Game.query.all()
    print(games_list)
    for game in games_list:
        if query == game.link:
            return "Game Already Processed"

    db.session.add(Game(link=query))
    db.session.commit()

    return extractMoves(query)

@main.route('/fc', methods=['GET'])
def getFlashCards():
    fc_list = Entry.query.all()
    fc = []

    for card in fc_list:
        fc.append({'board':card.board,'positions':card.positions, 'nextSteps': card.nextSteps, 'turn': card.turn})

    return jsonify(fc)

@main.route('/clear', methods=['GET'])
def delete():
    db.session.query(Entry).delete()
    db.session.commit()
    db.session.query(Game).delete()
    db.session.commit()
    
    return "deleted"

@main.route('/positions', methods=['POST'])
def getPositions():
    print(request.get_json())
    moves = request.get_json()['moves']
    step = request.get_json()['step']
    board1 = request.get_json()['board1']
    positions1 = request.get_json()['positions1']
    turn = request.get_json()['turn']
    offset = 0
    if(turn == "white"):
        offset = 1


    global positions, board
    positions = positions1
    board = board1

    count=0
    while(count<step):
        stepThrough(count+offset, moves[count])
        count+=1
    
    return positions