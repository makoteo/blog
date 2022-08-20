from itertools import count
import random
import time
import math
import datetime
import re
from tokenize import group

from cs50 import SQL

from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session

from helpers import session_required, generate_response, generate_powerup_message, generate_timeline, generate_short_message

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
#app.permanent_session_lifetime = datetime.timedelta(minutes=10)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///main.db")
sessionDuration = 60

@app.route("/")
@session_required
def index():
    dbsession = None
    usersession = session["user_id"]

    userhighscore = -9

    # check if user has high score
    if len(db.execute("SELECT * FROM humans WHERE user_id = ?", usersession)) > 0:
        userhighscore = int(usersession)

    print(userhighscore)
    
    if not session.get("session_id") == None:
        dbsession = get_db_session(session["session_id"], True)

    print("Getting the site")
    if dbsession == None:
        # Basic option for if there's no session
        return render_template("index.html", quote="Pick an option to begin.", message="Welcome to the game, " + session["username"] + "!", humans=get_winners(), timeline=generate_timeline(), highscore=userhighscore, counts=get_runningcounts())
    elif int(dbsession["timestamp"]) < time.time() - sessionDuration:
        # End the session if time is up... 
        end_session(dbsession["unique_id"])
        return render_template("index.html", quote="Pick an option to begin.", message="Welcome to the game, " + session["username"] + "!", humans=get_winners(), timeline=generate_timeline(), highscore=userhighscore, counts=get_runningcounts())
    else:
        timeint = math.floor(int(dbsession["timestamp"]) - time.time() + sessionDuration)
        print(timeint)
        if timeint < 0: 
            timeint = 0
        timestr = time.strftime('%M:%S', time.gmtime(timeint))[1:]
        return render_template("index.html", quote = str(dbsession["score"]) + " Points; " + timestr + " remaining", message="Let's pick up where we left off...", humans=get_winners(), timeline=generate_timeline(), highscore=userhighscore, counts=get_runningcounts())

@app.route("/the_list")
def the_list():
    usersession = session["user_id"]
    userhighscore = -9
    print("User id is: " + str(usersession))
    if len(db.execute("SELECT * FROM humans WHERE user_id = ?", usersession)) > 0:
        userhighscore = int(usersession)

    return render_template("list.html", humans=get_winners(), highscore=userhighscore)

@app.route("/pre_game", methods=["POST", "GET"])
def pre_game():
    session.clear()
    if request.method == "POST":
        #print(request.form["name"])

        pattern = re.compile("[a-zA-Z0-9-_]+")
        
        print(re.match(pattern, request.form["name"]))
        if request.form["name"] == "" or not re.fullmatch(pattern, request.form["name"]):
            return redirect("/pre_game")

        session["username"] = request.form["name"]

        #tmp_session_id = generate_session_id()
        session["user_id"] = generate_user_id()

        #if not start_session(tmp_session_id, 1):
        #    return redirect("/error")

        #session["session_id"] = tmp_session_id

        return redirect("/")
    else:
        return render_template("start.html")


@app.route("/timeout", methods=["POST"])
@session_required
def timeout():
    dbsession = get_db_session(session["session_id"])
    score = 0
    if not dbsession == None:
        score = dbsession["score"]
        end_session(session["session_id"])
    return {"message": "You seem to have run out of time...", "score": "str(score)", "long": generate_response(score)}

@app.route("/guess", methods=["POST"])
@session_required
def guess():
    # Get the user session
    dbsession = None
    if not session.get("session_id") == None:
        print("getting the db_session")
        dbsession = get_db_session(session["session_id"])

    # Add check to dbsession timestamp, if it's been a minute, reject the guess
    if not dbsession == None and dbsession["timestamp"] < time.time() - sessionDuration:
        score = dbsession["score"]
        end_session(dbsession["unique_id"])
        return {"message": "Kinda ran outta time there", "score": str(0), "long": generate_response(score)}

    if dbsession == None:
        new_sesh_id = generate_session_id()

        if not start_session(new_sesh_id, session["user_id"], 0):
            # TODO: Have to find different way to redirect...
            return redirect("/error")

        session["session_id"] = new_sesh_id
        dbsession = get_db_session(new_sesh_id)

    options = ["op1", "op2"]
    generated = random.uniform(0, 1)
    print("Random number is: " + str(generated))

    newmod = math.floor(random.uniform(0, 1)*15)

    # Following obscure math makes it so that a modifier of 2 makes op1 75% likely
    if dbsession["modifier"] == 2:
        generated *= 0.66
        print("Multiplied to: " + str(generated))
    # And this modifier makes op2 75% likely
    elif dbsession["modifier"] == 3:
        generated = generated*0.66 + 0.33
        print("Multiplied to: " + str(generated))

    # this modifier says that the next two flips are the same
    elif dbsession["modifier"] == 4:
        if (round(generated) == 0):
            #101 means the next option is left
            newmod = 101
        else:
            #102 meands the next option is right
            newmod = 102

    # this modifier says that the next two flips are different
    elif dbsession["modifier"] == 5:
        if (round(generated) == 0):
            #102 means the next option is right
            newmod = 102
        else:
            #101 meands the next option is left
            newmod = 101

    # these two conditions take care of that
    elif dbsession["modifier"] == 101:
        generated = 0
    elif dbsession["modifier"] == 102:
        generated = 1

    score = dbsession["score"]

    #print(request.json['option'])

    # We have to update the session timestamp to indiciate the user is active
    db.execute("UPDATE sessions SET timestamp = ? WHERE unique_id = ?", time.time(), dbsession["unique_id"])

    # modifier of 1 leads to auto correct answer
    if (options[round(generated)] == request.json['option']) or dbsession["modifier"] == 1:
        db.execute("UPDATE sessions SET score = ?, modifier = ? WHERE unique_id = ?", score+1, newmod, dbsession["unique_id"])
        return {"header": "none", "message": generate_powerup_message(newmod), "score": str(score+1), "long": ""}
    else:
        # Update the running counts
        # We just assume that slot 8 is for games with 7+
        db.execute("UPDATE runningcounts SET amount = amount + 1 WHERE score = ?", min(score, 8))

        if not check_highscore(dbsession):
            end_session(dbsession["unique_id"])
            return {"header": "none", "message": generate_short_message(), "score": str(score), "long": generate_response(score)}
        else:
            end_session(dbsession["unique_id"])
            return {"header": "winner"}
        #return {"message": "Lol noob"}
    
    #db.execute("INSERT INTO humans (name, score, timestamp) VALUES ('Cake', 3000, 2)")

@app.route("/highscore", methods=["GET"])
@session_required
def highscore():
    name = session["username"]

    getuser = db.execute("SELECT * FROM humans WHERE user_id = ? ORDER BY timestamp DESC", session["user_id"])

    if not len(getuser) == 0:
        # have to return max score, not score[0]
        score = getuser[0]["score"]
        return render_template("highscore.html", name = name, score = score)
    else:
        return render_template("nohighscore.html", name = name)

@app.route("/error")
def error():
    print("There was an error.")
    return render_template("error.html")

@app.route("/validate", methods=["GET"])
def validate():
    id = request.args.get("id")
    person = db.execute("SELECT * FROM humans WHERE user_id = ? ORDER BY score DESC", id)
    if len(person) == 0:
        return render_template("validate.html", name="-", score="-", timestamp="-", id="-")
    name = person[0]["name"]
    score = str(person[0]["score"])
    timestamp = datetime.datetime.fromtimestamp(round(int(person[0]["timestamp"]))).strftime('%Y-%m-%d %H:%M:%S')
    for i in range(1, len(person)):
        score += ", " + str(person[i]["score"])
        timestamp += ", " + datetime.datetime.fromtimestamp(round(int(person[i]["timestamp"]))).strftime('%Y-%m-%d %H:%M:%S')
    return render_template("validate.html", name=name, score=score, timestamp=timestamp, id=id)

@app.route("/options", methods=["GET", "POST"])
@session_required
def options():
    if request.method == "POST":
        # Basically the same as pre game
        pattern = re.compile("[a-zA-Z0-9-_]+")
        
        print(re.match(pattern, request.form["name"]))
        if request.form["name"] == "" or not re.fullmatch(pattern, request.form["name"]):
            print("Invalid username")
            return redirect("/options")

        session["username"] = request.form["name"]

        # Don't generate new id, just change the session name
        return redirect("/options")
    else:
        return render_template("options.html")

@app.route("/background", methods=["GET"])
def background():
    return render_template("background.html")

@app.route("/backstory", methods=["GET"])
def backstory():
    return render_template("backstory.html")

def get_db_session(sesh_id, delete=False):
    # Handle fail condition here too tbh, also need to make unique_id UNIQUE
    if delete:
        db.execute("DELETE FROM sessions WHERE timestamp < ?", time.time() - sessionDuration)

    tmp = db.execute("SELECT * FROM sessions WHERE unique_id = ?", sesh_id)

    if (len(tmp) == 0): return None

    return tmp[0]

def generate_session_id():
    generated_id = round(random.uniform(0, 1)*1000000000000)

    # I mean, this while loop should never get called but just in case

    while not list(db.execute("SELECT COUNT(*) FROM sessions WHERE unique_id = ?", generated_id)[0].values())[0] == 0:
        generated_id = round(random.uniform(0, 1)*1000000000000)

    return generated_id

def generate_user_id():
    generated_id = round(random.uniform(0, 1)*1000000000000)

    # Once again, this while loop should never get called but just in case
    while not list(db.execute("SELECT COUNT(*) FROM sessions WHERE user_id = ?", generated_id)[0].values())[0] == 0 or not list(db.execute("SELECT COUNT(*) FROM humans WHERE user_id = ?", generated_id)[0].values())[0] == 0 :
        generated_id = round(random.uniform(0, 1)*1000000000000)

    return generated_id

def start_session(sesh_id, user_id, force_correct):
    # Drop inactive sessions, aka sessions where user hasn't done anything for more than a minute
    # Maybe you could also only drop them when there's too many? 
    db.execute("DELETE FROM sessions WHERE timestamp < ?", time.time() - sessionDuration)
    db.execute("DELETE FROM sessions WHERE user_id = ?", user_id)

    max_sessions = 10

    # We also need to check the session count
    session_count = list(db.execute("SELECT COUNT(*) FROM sessions")[0].values())[0]
    print("There are " + str(session_count) + " sessions at the moment. Max is " + str(max_sessions))

    # if there are too many sessions going on
    if(session_count >= max_sessions):
        return False

    db.execute("INSERT INTO sessions (unique_id, score, modifier, timestamp, user_id) VALUES (?, 0, ?, ?, ?)", sesh_id, force_correct, time.time(), session["user_id"])

    return True

def end_session(sesh_id):
    db.execute("DELETE FROM sessions WHERE unique_id = ?", sesh_id)

def get_winners():
    tmp = db.execute("SELECT * FROM humans ORDER BY score DESC, timestamp DESC")
    #for i in tmp:
    #    i["timestamp"] = str(datetime.datetime.fromtimestamp(round(i["timestamp"])))

    grouped = {}
    for i in tmp:
        if not str(i["score"]) in grouped:
            grouped[str(i["score"])] = [[i["name"], i["user_id"]]]
        else:
            grouped[str(i["score"])].append([i["name"], i["user_id"]])

    return grouped

def check_highscore(dbsession):
    score = dbsession["score"]

    #print(db.execute("SELECT COUNT(DISTINCT score) FROM humans"))

    #Okay so we want to have 100 highest scores saved.
    #Which means we will have to go through the scores and that's not too fun but here goes

    humans_length = list(db.execute("SELECT COUNT(*) FROM humans")[0].values())[0]

    #print(humans_length)

    table_limit = 10
    
    #we have to remove one human in case the table is getting too long
    if humans_length >= table_limit:
        min_score = list(db.execute("SELECT MIN(score) FROM humans")[0].values())[0]
        if score < min_score:
            return False
        
        #max_score = db.execute("SELECT MAX(score) FROM humans")

        # delete the person with the oldest and lowest score
        db.execute("DELETE FROM humans WHERE timestamp = (SELECT MIN(timestamp) FROM (SELECT * FROM humans WHERE score = ?));", min_score)

    # add current person to the database
    db.execute("INSERT INTO humans (name, score, timestamp, user_id) VALUES (?, ?, ?, ?)", session["username"], score, time.time(), session["user_id"])

    return True

def get_runningcounts():
    tmp = db.execute("SELECT * FROM runningcounts")
    counts = []
    for i in tmp:
        counts.append(i["amount"])

    return counts