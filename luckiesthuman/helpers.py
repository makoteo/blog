from json.encoder import INFINITY
from operator import indexOf
import random
import math
from flask import redirect, render_template, request, session
from functools import wraps

def session_required(f):
    """
    Require user Id
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/pre_game")
        return f(*args, **kwargs)
    return decorated_function

def generate_response(score):
    response = ""

    response += "<div class='container'>"
    response += "<div class='row align-items-center'>"

    response += "<div class='col-md-6'>"
    response += "<h1>Final Score: " + str(score) +"</h1>"
    response += "</div>"

    shortLines = [
        [0, "It's a bit demotivating, but not too surprising.", "Don't be too disappointed, most games end here.", "Like the grade you'll get on tomorrow's test if you don't start studying.", "I had to come up with the most responses for zero, because I knew people would stay stuck here", "I have nothing to say. Nill. Void. Zero.", "You had one job.", "It's kinda surprising you messed this up, I mean it was literally a coin flip. ", "There is a mental side to it actually. It feels like you're failing on the first throw more often than you should be..."],
        [1, "Fun fact: 1 is neither a prime nor a composite number.", "One day, you'll get more.", "Maybe you shouldn't overthink it so much", "Well I couldn't see that one coming. ", "1 kinda looks like l, and l stands for lose-", "1 is lonely, make him into a 2.", "Well we gotta start somewhere, right?", "1 is the loneliest number... ", "While it seems like getting a score of 1 should be easy, it really isn't."], # Lonely just like you
        [2, "The average game lasts 1 round, so you're already doing better.", "Two shouldn't be that difficult.", "I mean, guessing two coin flips in a row is pretty lucky. Now just do it again.", "Two makes a pair", "30ish percent chance. Not great, not terrible. ", "Better than one point.", "If you are constantly spamming the same button, it probably took you 4 button presses to get here."],
        [3, "I've found three typos in these messages so far.", "3 = pi = e = square root of g", "Three is better than two.", "Three is the magic number.", "Three sides make a triangle, the strongest shape.", "Y'know, had you gotten this score on the day I started making this app, you would be in the top 100 table."],
        [4, "4tunately, this is just a game.", "I 4got the joke. ", "You should be able to get here every 12 attempts.", "The puns all seem so 4ced.", "Appreciate the e4t.", "4 = 2 + 2 = 2 * 2 = 2 ^ 2", "I like 4."],
        [5, "High five!", "Grief has five stages, but you probably know that by now.", "Just like the amount of workdays. Although I'd rather it would be 4."],
        [6, "6 = 1 + 2 + 3 = 1 * 2 * 3", "The amount of sides on a dice."], #God made the world in 6 days and rested on the 7th. I'd have rested earlier and there would be no world.
        [7, "If you ask a person to think of a number between 1 and 10, they'll likely think of 7. However, since most people know this fact, they'll instead choose 3. But most people also know that 3 is popular and so they try to be unpredictable by choosing 1 or 10...", "Most ladybugs have 7 spots. ", "7 is perfectly balanced, at least on the pH scale. ", "There are 7 millenuim prize problems in mathematics. If you solve those, you get money. Instead you choose to play this game. ", "7 is also a magical number but it's easier to think of 3 related things.", "Lust, Envy, Greed, Pride... No one really cares about the rest.", "Not counting 0, 7 is the last digit to show up in the sequence of pi."],
        [8, "I mean, if you lay the 8 on it's side, you get infinity. So I guess you win.", "There are 8 planets in the solar system, if you don't count Pluto. I do count Pluto. ", "Scorpio is the 8th zodiac, and I don't really like them. ", "Octopuses have 8 legs... And apparently Aristotle thought they were dumb. I'm not sure if they actually are, I just found that fact funny. ", "8 coinflips makes a byte. I wonder, if you converted your choices to binary code, maybe you'd have gotten the ASCII value for 'L'. "],
        [9, "Cats have 9 lives.", "9/10 dentists recommend...", "111111111 / 9 = 12345679. Just a shame that the 8 is missing.", "There are 6 consecutive nines at the 762nd - 767th positions of pi. ", "Seven, in fact, did not eat nine."],
        [10, "There's not really many facts about 10", "If instead of the decimal system, we used the quinary system, you would have 20 points. ", "Either you've spent way too long playing this or you're pretty lucky."],
        [11, "1o1" ,"I may be wrong, but didn't WWI end at 11:00 on 11/11/1918?", "Some people believe that seeing 11:11 on a watch is a sign of spirit presence. May they... be with you, I suppose?", "Apollo 11 was the first spacecraft to land on the Moon."],
        [12, "I wanted to write a long essay on the duodecimal system, but I have to write fun facts for scores up to like 20, and that means I'm like in the middle and don't have time for such pettiness.", "Base 12 is objectively better than base 10. ", "The number of hours on a clock", "Originally, a year had 10 months but that didn't really work, so January and February were added."],
        [13, "There are actually 13 constellations in the zodiac, but Ophiuchus isn't used in astrology.", "Hotels sometimes don't include a 13th floor, although some just label it as 14, even though it is in fact the 13th, so I don't know how much that helps. ", "Well, that's unlucky.", "Maybe 13 is actually unlucky.", "Don't tempt fate. "],
        [14, "Okay, I'm starting to get bored of writing these fun facts.", "Fun fact, this was actually my high score on day 1. Although back then, every third round was a 'both answers are correct' round.", "Would be inconvenient if I deleted the database about now..."],
        [16, "I don't know what to write here. ", "Cool, good job.", "It probably took you a few thousand games to get here.", "15 actually has no fun facts, so it uses the ones that 16 has, which is why they have to be generic."],
        [17, "There are so many math facts about 17 which are just not interesting. ", "There are 17 elementary particles (with unique names), which make up everything. ", "So we talked about 7, but when you ask someone for a random number between 1 and 20, they'll most often pick 17. "],
        [18, "It's the number preceeding 19.", "So apparently 18 is the only number where the sum of it's digits is equal to half of itself (1 + 8 = 18/2 = 9).", "In most of Europe, this is the drinking age. In America, you can buy a gun. "],
        [19, "Apparently Go is played on a 19x19 grid which just seems so random.", "You were so close to 20, I feel bad.", "Oh great, 2019 is when COVID began. 19 messed everything up again. "],
        [20, "Oh hey, you got into the 20s. That's probably as far as you'll ever get. ", "D20s should be used in more games. ", "Throw initiative. "],
        [21, "Blackjack.", "Well, if you're American, welcome to the party.", "I don't know why, but one of the multiplication rules I remember is that 7 x 3 is 21. The other one is that 6 x 7 is 42."],
        [22, "As disappointed as you might be, you did very well. ", "I was reading about catch 22 and it lead me down this rabbit hole of doublethink and other stuff and now I'm in a dystopian mood.", "22 is a palindrome. Lol. "],
        [25, "This should take like a million attempts, how did you get here?", "At this point, these quotes get generic, I just got bored of writing out some for each individual number.", "Okay, that's a lot."],
        [31, "How the heck?", "What??", "You're not really expected to get this far."],
        [41, "Dang, that must suck, you were doing so well.", "I don't really understand how you got here, but good on you."],
        [42, "The answer to life, the universe, and everything."],
        [99, "Okay look, I wrote these messages for the most common scores. It's unlikely for anyone to get this far, so uh. Congrats."],
        [100, "100!"],
        [math.inf, "Cheaters never prosper"]
    ]

    # Add something like 1/1024... About the same chance as... 

    for s in shortLines:
        if s[0] >= score:
            #print(s, len(s))
            response += "<div class='col-md-6'>"
            response += "<p style='text-align: right;'><em>" + s[random.randint(1, len(s) - 1)] + "</em></p>"
            response += "</div>"
            break

    response += "</div>"
    response += "</div>"

    response += "<hr>"

    response += "<div class='d-flex justify-content-left'>"

    response += "<h3>Getting to a score of " + str(score) + " has about a <strong style='font-weight: 800'>" + calculateOdds(score) + "%</strong> chance of happening. </h3>"

    response += "</div>"

    # just to fix formatting
    if score > 1:
        response += "<div class='d-flex justify-content-left'>"
        response += "<p><em>You would assume it would be " + formatNumber(str(100/pow(2, score))) + "%, but we have to take into account all the powerups.</em></p>"
        response += "</div>"
    
    response += "<div style='border: 10px solid var(--darker-main-color); box-shadow: 12px 12px 3px rgba(0, 0, 0, 0.2);'>"
    response += "<div class='d-flex justify-content-center' style='background-color: var(--darker-main-color);'>"
    response += "<p style='color: white; font-weight: 800; margin: 20px;'>To put this into perspective <span style='font-weight: 400;'>(using some dubious sources)</span>:</p>"
    response += "</div>"

    likelyhoodTable = [
        [1, "50% is your chance of flipping tails on a coin", "50% is your chance of flipping heads on a coin", "50% is equal to your chance of getting an even number when throwing a 6 sided dice", "50% is equal to your chance of getting an odd number when throwing a dice", "50% is equal to your chance of drawing a red card from a full deck", "50% is equal to your chance of drawing a black card from a full deck"],
        [2, "30% is approximately the number of Americans who don't get enough sleep", "30% of Americans are single. "],
        [3, "22% of Europeans are at risk of poverty", "20% of a group produce 80% of the activity (Pareto principle)", "26% of people don't have access to safe drinking water"],
        [4, "16% is approximately your chance of throwing 6 on a 6 sided dice", "15% of the population lives in the southern hemisphere", "16% of the population is atheist"],
        [5, "10% of the population is left handed", "8% of the populations has blue eyes", "9.7% is your chance of currently being in Europe"],
        [6, "5% is your chance of throwing a 20 on a d20", "5% is the acceptance rate at Harvard. "],
        [7, "2.7% is your chance of throwing snake eyes (two ones on two die)"],
        [8, "2% of people have green eyes"],
        [9, "~1% of people on the internet are creators, the rest of us just consume", "1% of the richest people own about half the world's weatlh"],
        [11, "~0.6% of men in the US are named James", "~0.5% is the chance that you were born on Friday the 13th", "0.4% of pregnancies result in twins"],
        [14, "0.13% of the population is born with 11 fingers"],
        [15, "0.1% of eggs have two yolks"],
        [16, "0.06% of people were born on a leap day",],
        [17, "0.03% is yoru chance of being struck by lightning during your life"],
        [20, "0.016% of coin flips land on the side", "0.01% is your chance of finding a four leaf clover", "0.01% is your chance of correctly guessing a four digit pin code", "0.01% is your chance of being injured by a toilet"],
        [24, "1.6x10^(-3)% is your chance of dying in a skydiving accident"],
        [29, "1.5x10^(-4)% are your chances of being dealt a royal flush"],
        [43, "2.5x10^(-7)% are your chances of dying in a shark attack"],
        [45, "9x10^(-8)% is your chance of dying in a plane crash"],
        [46, "6x10^(-8)% is your chance of winning the jackpot"],
        [math.inf, "0% Past this point, it gets so unlikely, that I have no facts for you"]
    ]

    findS = 0
    for i in range(0, len(likelyhoodTable)):
        if likelyhoodTable[i][0] >= score:
            findS = i
            break

    bounds = range(max(0, findS - 2), min(findS + 3, len(likelyhoodTable)))

    response += "<div class='container'>"
    for i in bounds:
        response += "<div class='row justify-content-center align-items-center' style='background-color: white;'>"
        chosenText = likelyhoodTable[i][random.randint(1, len(likelyhoodTable[i])-1)]
        splitText = chosenText.split("%", 1)
        print(chosenText, splitText)

        if len(splitText) == 1:
            splitText = ["??"] + splitText

        if(i == findS):
            response += "<h3 class='mr-2' style='font-weight: 600; color: rgba(0, 0, 0, " + str(1-abs(findS - i)*0.3) + ")'>" + splitText[0] + "% </h3>"
            response += "<p style='font-weight: 600; color: rgba(0, 0, 0, " + str(1-abs(findS - i)*0.3) + ")'> " + splitText[1] + "</p>"
        else:
            response += "<h3 class='mr-2' style='font-weight: 400; color: rgba(0, 0, 0, " + str(1-abs(findS - i)*0.3) + ")'>" + splitText[0] + "% </h3>"  
            response += "<p style='color: rgba(0, 0, 0, " + str(1-abs(findS - i)*0.3) + ")'> " + splitText[1] + "</p>"
        response += "</div>"
    response += "</div>"

    response += "</div>"

    return response

def calculateOdds(n):
    # We need to combine all the probabilities:
    # 1/15 * 100% + 2/15*100% + 2/15*75% + 10/15*50%

    # That is 0.63333

    # default condition for 0
    if n == 0:
        return "50.0"

    return formatNumber(str(0.5*pow(0.63333, n-1)*100))
    
def formatNumber(string):
    if string.find("e") == -1:
        digits = len(string) if len(string) < 4 else 4
        string = string[0:digits]
    else:
        string = string[0:3] + "&times;10<sup>" + string[string.find("e")+1:] + "</sup>"

    return string

print(calculateOdds(10))

def generate_powerup_message(i):
    if i == 1:
        powerUpMessages = [
            "Both answers are actually correct this time",
            "No stress, both of the options are correct",
            "Hint: Just press whatever, they're both right."
        ]
        return powerUpMessages[random.randint(0, len(powerUpMessages) - 1)]
    elif i == 2:
        powerUpMessages = [
            "The first answer has a 75% chance of being right this time",
            "No pressure, but the first answer is likelier to be correct this round",
            "The first answer has a 3:1 chance of being right this time",
            "Psst, try the first one"
        ]
        return powerUpMessages[random.randint(0, len(powerUpMessages) - 1)]
    elif i == 3:
        powerUpMessages = [
            "The second answer has a 75% chance of being right this time",
            "No pressure, but the second answer is likelier to be correct this round",
            "The second answer has a 3:1 chance of being right this time",
            "Psst, try the second one"
        ]
        return powerUpMessages[random.randint(0, len(powerUpMessages) - 1)]
    elif i == 4:
        return "Hint: Next round's answer will be the same as this round's"
    elif i == 5:
        return "Hint: Next round, don't pick the option you picked this round."
    elif i == 101:
        return "So it has to be the first option now..."
    elif i == 102:
        return "So it has to be the second option now..."
    else:
        noPowerUpMessages = [
            "No power ups this round",
            "Keep going!",
            "*yawn*",
            "Tough decision you have here...",
            "Just YOLO it",
            "What's the worst thing that could happen?",
            "Maybe you lose this round",
            "Just don't jinx it",
            "Phew, close one, that last round",
            "I actually say nothing relevant, well except the hints",
            "Go go go!",
            "Nice job",
            "Which one could it be this time?",
            "Hint: Uh... It's one of them...",
            "They say you should always pick left... But maybe don't...",
            "You're half way... Somewhere...",
            "Even if I wanted, I couldn't help you much here.",
            "Is this worse than Monopoly?"
        ]
        return noPowerUpMessages[random.randint(0, len(noPowerUpMessages) - 1)]

def generate_timeline():
    timeline = {
        "0": [["The likeliest score", "As noted above, getting zero points is about as likely as getting all other scores combined."], ["But don't give up!", "Bob won't. For a while."]],
        "1": [["On the other hand, surprisingly unlikely", "Again, if we take into account what we mentioned, we find out that getting exactly 1 point only has about an 18% chance of happening."], ["A third of the time, you'll get more points", "Since 50% - 18% = 32%."]],
        "2": [["Bob will get here within a minute.", "Although, once again, it's quite likely he'll get further. "]],
        "8": [["Quite a jump", "But the fact is, a score from 1 - 8 is nothing to be too excited about, since it should take you less than 100 attempts."]],
        "10": [["Just under an hour has passed", "If Bob plays at the mentioned rate, it will take him (on average) 300 games to get here, which comes out to just over 50 minutes."]],
        "11": [["My personal best while developing this app", "Happens once every 534 attempts on average, so it's not that impressive."], ["But now, it starts to scale.", "As you will see quite soon."]],
        "16": [["About 26 hours in", "Indeed, getting to 16 points should be quite viable with enough determination"], ["Approaching 10000 Attempts", "On average, it takes about 9270 games to get here."]],
        "20": [["Over one week has passed for Bob", "That's not too long, I guess?"], ["Now, notice the exponential growth", "16 points took a day, 20 took a week."]],
        "26": [["Almost a year has passed", "And just 6 points later, we get to 1 year. While it may seem ridiculous that such a small score would take a year to achieve, that's what the math says. "], ["Almost 3 million games played", "I suppose if we got a million people playing, we could beat Bob in just a handful of attempts."]],
        "38": [["Almost 1000 years have passed", "I guess I'll start including some trivia at this point, credit goes to Wikipedia's Timeline of the far future article."], ["Polaris is no longer the northern star", "So turns out, the Earth's poles actually move around, and so Polaris, pretty soon, will not be the star directly 'above' the planet."]],
        "40": [["The Arctic World Arcive (AWA) data films are probably unreadable", "AWA is a facility close to the Svalbard Global Seed Vault, but instead of seeds, it stores open source projects from Github. One of my repositories is in fact there!"]],
        "42": [["Almost 10000 years have passed", "It's been about 10000 years since the cultivation of wheat, just to put that into perspective."], ["The Svalbard Global Seed Vaults projected lifespan ends here", "I suppose it's funny we mentioned it just 2 points back, but that was 8000 years ago."]],
        "43": [["Voyager 1 passes within 3.5 light years of Proxima Centauri.", "So, Proxima Centauri is the closest star to our Solar system, at a distance of about 4.2 light years. Thus, a 3.5 light year approach isn't too impressive, but that's also because Voyager 1 isn't really travelling towards Proxima Centauri."]],
        "45": [["The maximum 64-bit (Windows) time has been surpassed", "This is about 30000 years in the future. For context, 32-bit time will overflow in 2038. Most systems thankfully already use 64-bit time, so we got a few thousands of years before we have to deal with this again."]],
        "46": [["The lifespan of tetraflourmethane", "The most durable greenhouse gas stays in the atmosphere for 50000 years."], ["A day on Earth is one second longer", "Guess I get some more sleep."]],
        "47": [["Mars has been terraformed", "Assuming we start in the near future, it would take about 100000 years to give Mars a breathable atmosphere using plants (I'm not a botanist, I don't know how this would work)."]],
        "51": [["1 million years have passed.", "1 million seems like a lot, but it's not that much. A million seconds is only 11 and a half days, and the average person will probably touch more than a few million dollars throughout their life."], ["The Pyramids in Giza will have likely eroded",  "...as well as the footprints left on the Moon by Armstrong. And the other astronauts for that matter. "], ["Betelgeuse will have most likely exploded", "There were some rumors about this happening in 2020, but thankfully, the Universe decided there had been enough suprises that year."]],
        "52": [["The time until Earth's coral reefs recover from human caused ocean acidification.", "So I'll be honest, I'm not a biologist/chemist, but basically, CO2 in the atmosphere raises the oceans pH, and it will take about 2 million years for it to return to normal. Which is about a 52 point game away for Bob."]],
        "55": [["Estimated time until biodiversity recovers after the Holocene extinction", "Turns out, ongoing deaths of animals due to human activity are considered part of an extinction event - The Holocene extinction."]],
        "59": [["100 million years", "Once again, to put this into perspective, if we go back in time 100 million years, primates didn't yet exist."], ["Earth has probably been hit by an asteroid, possibly leading to a mass extinction", "... assuming this cannot be averted."], ["Saturns rings have probably collapsed", "Take a look at them while they are here."]],
        "60": [["The sun is getting brighter", "Well at this point, only by 1%, but a larger sun leads to higher temperatures, which are going to be a problem."], ["If time flowed backwards, we could have dinner with dinosaurs", "Or maybe they'd have dinner and we'd uh... Be eaten."]],
        "61": [["Estimated time until gamma-ray burst potentially triggers extinction event on Earth", "Stars sometimes release large quantaties of power, and if Earth happens to be in the way... Well..."]],
        "63": [["1 billion years in the future", "You know how we said that 1 million seconds is 11 and a half days? Well, 1 billion seconds is 31 years. Also, there are only a couple thousand billionaires in the world, compared to millions of millionaires."], ["Photosynthesis is no longer possible", "CO2 starts getting trapped in the ground due to high temperatures, and plant life starts dying out, which slowly leads to the death of all multicellular organisms"]],
        "65": [["All life on Earth is extinct", "And that's the higher estimate. Either way, whatever has been alive for the past few million years was only single cell organisms, probably deep under the ocean. "], ["The Andromeda Galaxy passes by Milky Way", "And they start merging into a new galaxy called... Milkdromeda? Apparently, it'll be a beautiful event. "]],
        "68": [["First estimates for the end of the Universe", "According to the big rip theory at least, which estimates the end of the universe to happen in 22 billion years, which is about the average time it would take Bob to get 68 points. However, it's unlikely to occur."]],
        "71": [["100 billion years", "If Bob got a dollar every year, he would finally be half as rich as Elon Musk (as of writing). "], ["The local group coalesces into one galaxy", "Milkdromeda basically gobbles up the dwarf galaxies around it."], ["The night sky is also getting empty", "Due to the expansion of the universe, all galaxies outside of our galaxy disappear outside of our observable universe, too far for us to see."]],
        "75": [["1 trillion years in the future", "Well, we can continue the analogy we've had up until now. 1 trillion seconds is 31000 years. So, yes, it's getting massive."], ["Star formation has ended in the Universe", "From now, it just goes downhill, since most of the events are hypothesized 'ends of the universe'. "]],
        "202": [["All matter has decayed", "And that's the longer estimate, assuming protons decay. There's a lot of quantum physics here I don't want to get into, but it's possible that the universe as we know it simply wouldn't exist anymore."], ["There's also really just black holes left", "Well that sucks... "]],
        "454": [["Black holes decay via Hawking radiation", "The black hole era ends, all that exists are subatomic particles, and the universe slowly dies in what's called the heat death."], ["There's not much sense in continuing", "The rest of the timeline is just different assumptions for when the Universe reaches it's final resting energy."]]
    }
    return timeline

def generate_short_message():
    responses = ["You lose", "That's a shame", "Wrong choice", "Try again", "Awh well", "Play again?"]
    return responses[random.randint(0, len(responses) - 1)]