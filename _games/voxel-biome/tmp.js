var versionCode = "Alpha 0.9";
var WIDTH = 1200;
var HEIGHT = 675;
var gameRunning = true;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;

var TEMPPOINTS = 0;
var POINTS = 0;
var POLUTION = 0;

var ENDTEMPTIME = 0;
var ENDTIME = 0;

var YEAR = 1;
var SEASON = "Spring";

var PAUSED = false;

var LOSSPOINT = 50;

var GAMESPEED = 1; //DEFAULT 1
var SAVEGAMESPEED = 1;

var DEBUG = false;

var GAMESTATE = "GAME";

var voxels = [];

var buttonTimers = [

    [0],
    [0]

];

var frameCount = 0;

var thisFrameClicked = false;
var mouseHeld = false;

var endGameTimer = 0;

var animationOffset = 160;

var timerRed = false;

var startTimer = 0;

var gameEnd = false;

var winYears = [3, 4, 3, 4, 4, 5, 4, 10];

var blackScreen1Opacity = 0;
var blackScreen2Opacity = 1;
var levelNameOpacity = 0;

var levelNames = [

    "Tutorial Meadow",
    "Lakes Edge",
    "Forest Peak",
    "Pond CrystalMoor",
    "The Loopy Hills",
    "SharkFin Beach",
    "The Forested Isles",
    "Lake Sardine"

];

var menuAnimationTimer = 0;

var GUIOpacity = 1;

var SeasonTimeSeconds = 10;

var secondTimers = [

    [0],
    [0],
    [0],
    [0]

];

var timeSurvivedOpacity = 0;
var yearRequiredOpacity = 0;
var yearReachedOpacity = 0;
var pollutionOpacity = 0;

var endGameYearRequired = 0;
var endGameYearReached = 0;
var endGamePollution = 0;

var YearChangedAlready = false;

var LEVEL = 7;

var levelZeroGrid = [

    [1, 3, 1, 1, 1],
    [1, 1, 1, 3, 3],
    [3, 1, 6, 1, 3],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 3, 3]

];

var levelOneGrid = [

    [1, 2, 2, 1, 1],
    [1, 3, 2, 1, 1],
    [1, 1, 1, 1, 1],
    [3, 6, 1, 1, 3],
    [3, 1, 1, 3, 1]

];

var levelTwoGrid = [

    [1, 3, 3, 1, 1],
    [3, 3, 5, 5, 3],
    [1, 3, 5, 3, 1],
    [1, 6, 3, 3, 1],
    [3, 1, 1, 3, 3]

];

var levelThreeGrid = [

    [3, 3, 3, 3, 3, 3],
    [1, 3, 4, 3, 4, 3],
    [3, 4, 2, 2, 3, 3],
    [4, 4, 2, 2, 3, 1],
    [1, 1, 4, 4, 6, 3],
    [3, 4, 3, 1, 3, 1]

];

var levelFourGrid = [

    [1, 3, 4, 4, 2, 5],
    [4, 2, 2, 2, 5, 3],
    [2, 5, 5, 3, 5, 1],
    [5, 3, 1, 5, 3, 1],
    [5, 1, 1, 3, 6, 3],
    [3, 1, 3, 1, 1, 1]

];

var levelFiveGrid = [

    [3, 5, 3, 1, 5, 5, 3],
    [1, 3, 3, 3, 3, 1, 3],
    [3, 1, 3, 3, 1, 3, 1],
    [1, 4, 6, 1, 1, 4, 1],
    [4, 4, 4, 4, 4, 4, 4],
    [4, 2, 4, 4, 2, 2, 4],
    [2, 2, 2, 2, 2, 2, 2]

];

var levelSixGrid = [

    [2, 2, 2, 2, 2, 4, 3],
    [2, 3, 3, 4, 2, 4, 3],
    [3, 5, 1, 1, 2, 2, 4],
    [5, 3, 6, 3, 4, 2, 2],
    [5, 1, 5, 1, 4, 4, 2],
    [2, 3, 3, 4, 3, 4, 2],
    [2, 2, 1, 3, 1, 2, 2]

];

var levelSevenGrid = [

    [1, 1, 3, 3, 3, 1, 1, 3],
    [3, 1, 1, 2, 2, 2, 2, 1],
    [1, 3, 4, 2, 2, 1, 2, 4],
    [3, 1, 4, 2, 2, 2, 2, 4],
    [1, 2, 2, 2, 2, 2, 2, 3],
    [1, 1, 1, 2, 4, 4, 1, 3],
    [1, 3, 3, 2, 1, 1, 1, 3],
    [3, 1, 1, 3, 1, 3, 1, 1]

];

var firstMapGrid = [ // It has been a privilege using this map for every test up until levels were created. It will stay here in honor of it's contribution.

    [1, 2, 2, 2, 2, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 2, 2, 2, 2, 1, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 2, 2, 2, 2, 1, 1, 1]

];

var gridRoll = [

    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []

];

var selected = [];
var clickSelected = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var voxelsG = new Image();
voxelsG.src = "BiomeGame.png";

var voxelsGUI = new Image();
voxelsGUI.src = "VoxelBiomeUI.png";

var currentID = 0;

var mousePos;
var mousePosX;
var mousePosY;
var mouseDownTimer = 0;
var tempMouseTimer = 0;

var buildType = 0;

var forests = 0;
var deserts = 0;
var fields = 0;
var seas = 0;
var towns = 0;
var cities = 0;
var oilrigs = 0;
var desertFactories = 0;
var forestFactories = 0;
var Mountains = 0;

var forestPol = -5;
var fieldPol = -2;
var seaPol = -1;
var desertPol = +1;
var townPol = +5;
var cityPol = +8;
var oilRigPol = +10;
var desertFactoryPol = +15;
var forestFactoryPol = +12;
var MountainPol = -1;

var forestDesc1 = "All those leaves";
var forestDesc2 = "are bound to ";
var forestDesc3 = "reduce pollution.";

var fieldDesc1 = "There's a few";
var fieldDesc2 = "flowers. Could ";
var fieldDesc3 = "mean something.";

var seaDesc1 = "The algae may";
var seaDesc2 = "reduce a little ";
var seaDesc3 = "of that pollution.";

var desertDesc1 = "There's not ";
var desertDesc2 = "much here, just ";
var desertDesc3 = "some sandstorms.";

var townDesc1 = "Will soon grow";
var townDesc2 = "into something";
var townDesc3 = "really bad.";

var cityDesc1 = "Your biggest";
var cityDesc2 = "enemy. A LOT ";
var cityDesc3 = "of pollution.";

var oilRigDesc1 = "They're taking";
var oilRigDesc2 = "the seas too!";
var oilRigDesc3 = "More pollution!!";

var desertFactoryDesc1 = "They're taking";
var desertFactoryDesc2 = "the deserts as";
var desertFactoryDesc3 = "well?!";

var forestFactoryDesc1 = "No no no...";
var forestFactoryDesc2 = "This is getting";
var forestFactoryDesc3 = "really bad...";

var MountainDesc1 = "They block cities";
var MountainDesc2 = "from spreading.";
var MountainDesc3 = "Big plus!";

var frameTimer2 = 0;
var yearVisible = true;
var yearlength = 600;

var tempEndGameTimer = 20;

var actionSelected = 0;

var tempMouseTimer2 = 0;
var tempMouseTimer3 = 0;

var tempTimer2 = 0;

var cardYOffset = [0, 0, 0];

var cardSelected = 0;

var cardLevelLimitation = 0;

var cardCombos = [

    [1, 2],
    [1, 3],
    [1, 5],
    [4, 1],
    [3, 5],
    [4, 5],
    [1, 3],
    [4, 1],
    [1, 3],
    [0, 0]

];

var cardNeedGiveCombos = [ // REMEMBER TO UPDATE ALONG WITH CARD COMBOS

    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [3, 2],
    [1, 1],
    [2, 1],
    [2, 1],
    [3, 2],
    [1, 1]

];

var cardRig = [ // 99 = Pause

    [2, 0, 1, 2, 1, 1, 2, 99],
    [1, 0, 3, 2, 1, 2, 1, 2, 1, 99],
    [4, 1, 2, 4, 1, 0, 1, 2 ,4, 99],
    [1, 3, 1, 2, 0, 4, 2, 1, 2, 0, 2, 99],
    [0, 1, 5, 0, 2, 1, 1, 99],
    [4, 3, 1, 1, 0, 1, 3, 0, 3, 4, 7, 99],
    [3, 0, 1, 3, 8, 4, 5, 7, 3, 1, 4, 99],
    [99]

];

var cardRiggedNum = 0;

var cardPosX = [0, 0, 0];

var cards = [];

var cardNeedGive = [];

var cardOpacity = 1;

var tileSelectedByCard = [];

var tradeButtonOffset1 = 0;
var tradeButtonOffset2 = 0;

var word1 = "";
var word2 = "";

var num1 = 0;
var num2 = 0;
var cardChosen = 0;
// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Voxel(x, y, width, height, type){
    this.x = x;
    this.startY = y;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    this.id = currentID;

    this.internalTimer = yearlength;

    this.turnToCityTerritory = false;

    this.cityProperty = false;

    if(this.id/mapSideLength !== 0) {
        if(this.id/mapSideLength === 1) {
            gridRoll[Math.ceil(this.id / (mapSideLength) + 1)].push(this.id);
        }else{
            gridRoll[Math.ceil(this.id / (mapSideLength) + 0.1)].push(this.id);
        }
    }else{
        gridRoll[1].push(this.id);
    }

    currentID++;

    this.movingUp = false;

    this.maxHeight = 5;

    this.randomChance = Math.random();

    this.opac1 = 1;
    this.opac2 = 0;
    this.opac3 = 0;

    this.falling = false;
    this.typeToChangeTo = 0;
    this.hasFallen = false;

    this.cardSelected = false;

    this.toBeDestroyed = false;

    this.draw = function(){
        //DRAW EXAMPLE
        //ctx.fillStyle = "rgb(30, 20, 40)";
        //ctx.fillRect(x - width/2, y - height/2, width, height);
        if(this.type === 1) { //FIELD
            if(SEASON === "Spring" || SEASON === "Fall") {
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
                if(this.opac3 > 0.05 && this.opac1 > 0.8){
                    this.opac3 -= 0.05;
                }
            }else if (SEASON === "Summer"){
                if(this.opac3 < 0.95){
                    this.opac3 += 0.05;
                }
                if(this.opac1 > 0.05 && this.opac3 > 0.8){
                    this.opac1 -= 0.05;
                }
            }else{
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
                if(this.opac3 > 0.05){
                    this.opac3 -= 0.05;
                }
            }

            ctx.drawImage(voxelsG, 0, 801, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 0, 1, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac3;
            ctx.drawImage(voxelsG, 0, 401, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

            if(this.randomChance < 0.1){
                ctx.drawImage(voxelsG, 1500, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }else if(this.randomChance < 0.2){
                ctx.drawImage(voxelsG, 1500, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }

        }else if(this.type === 2) { //SEA

            if(SEASON === "Spring" || SEASON === "Summer" || SEASON === "Fall" ) {
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
            }
            /*else{
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
            }*/

            ctx.drawImage(voxelsG, 300, 1, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 300, 801, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

        }else if(this.type === 2.1) { //SEA

            ctx.drawImage(voxelsG, 300, 401, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 3) { //FOREST

            if(SEASON === "Spring" || SEASON === "Summer") {
                if(this.opac1 > 0.05){
                    this.opac1 = 0;
                }
                if(this.opac3 > 0.05){
                    this.opac3 -= 0.05;
                }
            }else if (SEASON === "Fall"){
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
                if(this.opac3 > 0.05){
                    this.opac3 -= 0.05;
                }
            }else{
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
                if(this.opac3 < 0.95){
                    this.opac3 += 0.05;
                }
            }

            ctx.drawImage(voxelsG, 600, 1, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 600, 801, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac3;
            ctx.drawImage(voxelsG, 900, 801, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

        }else if(this.type === 3.1) { // FOREST FACTORY
            ctx.drawImage(voxelsG, 600, 401, 298, 399, this.x - width / 2, this.y - height / 2, width, height);
        }else if(this.type === 4) { //DESERT

            if(SEASON === "Spring" || SEASON === "Summer" || SEASON === "Fall" ) {
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
            }else{
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
            }

            ctx.drawImage(voxelsG, 900, 1, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 1800, 801, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

            if(this.randomChance < 0.2){
                ctx.drawImage(voxelsG, 1500, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }
        }else if(this.type === 4.1) { //DESERT
            ctx.drawImage(voxelsG, 900, 401, 298, 399, this.x - width / 2, this.y - height / 2, width, height);
        }else if(this.type === 5) { //MOUNTAIN

            ctx.drawImage(voxelsG, 1500, 801, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 6) { //TOWN

            ctx.drawImage(voxelsG, 1200, 401, 298, 399, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 6.1) {
            this.internalTimer = 0; //---------------------------------------- REMEMBER TO MOVE THIS LINE ALONG...

            if(SEASON === "Spring" || SEASON === "Summer" || SEASON === "Fall") {
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
            }else{
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
            }

            ctx.drawImage(voxelsG, 1200, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 1200, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

        }

        if(this.turnToCityTerritory === true && this.type !== 0 && this.type !== 5) {
            ctx.drawImage(voxelsG, 1800, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }

        if(this.toBeDestroyed === true && this.type !== 0){
            ctx.drawImage(voxelsG, 1800, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }

        if(DEBUG === true) {
            ctx.font = '20pt Courier New';
            ctx.textAlign = "center";
            ctx.fillText(this.id, this.x, this.y);
        }

    };
    this.update = function(){

        if(this.type === 6.1 && this.opac1 > 0 && SEASON !== "Winter"){
            this.opac1 = 0;
        }

        if(this.movingUp === false) {
            if(this.y < this.startY){
                this.y++;
            }
        }else{
            if(this.y > this.startY - this.maxHeight){
                this.y--;
            }
        }

        if(this.turnToCityTerritory === true){
            if(this.internalTimer > 0) {
                this.internalTimer-=GAMESPEED;
            }else{
                this.turnToCityTerritory = false;
            }
        }

        if(this.type === 6 || this.type === 6.1){
            this.internalTimer = 0;
        }

        if(this.falling === true){

            this.fallSpeed = 5;

            if(this.hasFallen === false){
                this.y += this.fallSpeed;
                this.hasFallen = true;
            }

            if(this.y % y <= 4){
                this.y+=this.fallSpeed;
            }else{
                this.y = y;
                this.type = this.typeToChangeTo;
                this.falling = false;
            }
        }

        if(this.internalTimer <= 0){

            this.cityProperty = true;
            if(this.type === 1){
                this.type = 6.1;
            }else if(this.type === 2){
                this.type = 2.1;
            }else if(this.type === 4){
                this.type = 4.1;
            }else if(this.type === 3){
                this.type = 3.1;
            }
            this.turnToCityTerritory = false;

        }

        if(tileSelectedByCard.length > 0){
            for(var t = 0; t < tileSelectedByCard.length; t++){
                if(tileSelectedByCard[t] === this.id){
                    this.animateUp(2);
                    this.cardSelected = true;
                    break;
                }
            }
        }else{
            this.cardSelected = false;
        }

        if(this.cardSelected === false){
            this.toBeDestroyed = false;
        }

        this.animateUp = function(up){
            if(up === 0) {
                this.movingUp = true;
                this.maxHeight = 5;
            }else if(up === 1){
                this.movingUp = false;
            }else {
                this.movingUp = true;
                this.maxHeight = 20;
            }
        }

        this.fallAwayAndReplace = function(changeType){
            this.falling = true;
            this.typeToChangeTo = changeType;
        }

        if(this.type === 0 || this.type === 5){
            this.cityProperty = false;
        }
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

var map = levelZeroGrid;

if(LEVEL === 0){
    map = levelZeroGrid;
    cardLevelLimitation = 7; // 7
    cards = [[1, 3], [1, 5]];
    cardNeedGive = [[1, 1], [1, 1]];
}else if(LEVEL === 1){
    map = levelOneGrid;
    cardLevelLimitation = 6; // 6
    cards = [[1, 3], [1, 5]];
    cardNeedGive = [[1, 1], [1, 1]];
}else if(LEVEL === 2){
    map = levelTwoGrid;
    cardLevelLimitation = 5; // 5
    cards = [[1, 3], [1, 3]];
    cardNeedGive = [[1, 1], [1, 1]];
}else if(LEVEL === 3){
    map = levelThreeGrid;
    cardLevelLimitation = 4; // 4
    cards = [[1, 2], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
}else if(LEVEL === 4){
    map = levelFourGrid;
    cardLevelLimitation = 4; // 4
    cards = [[1, 3], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
}else if(LEVEL === 5){
    map = levelFiveGrid;
    cardLevelLimitation = 2; // 2
    cards = [[1, 3], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
}else if(LEVEL === 6){
    map = levelSixGrid;
    cardLevelLimitation = 2; // 2
    cards = [[1, 3], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
}else if(LEVEL === 7){
    map = levelSevenGrid;
    cardLevelLimitation = 1; // 2
    cards = [[1, 2], [1, 3]];
    cardNeedGive = [[1, 1], [1, 1]];
}

var mapSideLength = map[0].length;
var maxGridLength = map[0].length;

var downwardsOffset = (8 - mapSideLength) * HEIGHT/28;

for(var i = 0; i < map.length; i++) {
    for(var j = 0; j < maxGridLength; j++) {
        if(map[i][j] === 0){

        }else if(map[i][j] === 1){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength) + downwardsOffset, WIDTH/16, WIDTH/12, 1));
        }else if(map[i][j] === 2){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength) + downwardsOffset, WIDTH/16, WIDTH/12, 2));
        }else if(map[i][j] === 3){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength) + downwardsOffset, WIDTH/16, WIDTH/12, 3));
        }else if(map[i][j] === 4){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength) + downwardsOffset, WIDTH/16, WIDTH/12, 4));
        }else if(map[i][j] === 5){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength) + downwardsOffset, WIDTH/16, WIDTH/12, 5));
        }else if(map[i][j] === 6){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength) + downwardsOffset, WIDTH/16, WIDTH/12, 6.1));
        }
        //voxels.push(new Voxel((WIDTH / 10 * (j + 3)) + (i * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 9) - (HEIGHT / 30 * (i + 1))), 75, 75));
    }
    //width--;
}

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function onClick(xObj, yObj, widthObj, heightObj){
    if((((mousePosX - WIDTH/30) > xObj)) && ((mousePosX - WIDTH/30 < (xObj + widthObj))) && (((mousePosY - WIDTH/30) > yObj)) && (((mousePosY - WIDTH/30) < (yObj + heightObj)))) {
        return true;
    }
}

function switchUpCards(cardNumber){
    //cards[cardNumber] = cardCombos[randomx];

    cards.splice(cardNumber, 1);
    cardNeedGive.splice(cardSelected - 1, 1);

    cardSelected = 0;

}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){

    if(GAMESTATE === "GAME"){
        gameRunning = true;
        blackScreen2Opacity = 0;
        /*gameRunning = false;
        startTimer++;

        if(startTimer < 100){
            levelNameOpacity += 0.005;
        }else if(startTimer > 200){
            if(levelNameOpacity > 0.005){
                levelNameOpacity -= 0.005;
            }
            gameRunning = true;
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '15pt Courier New';

        ctx.globalAlpha = levelNameOpacity;
        ctx.fillText("Level " + LEVEL + " - " + levelNames[LEVEL], WIDTH/2, HEIGHT/2);
        ctx.globalAlpha = 1;*/
    }

    if(gameEnd === true){
        GAMESPEED = 0;
    }

    if(gameRunning === true) {

        if(PAUSED === true){
            if(GAMESPEED !== 0){
                SAVEGAMESPEED = GAMESPEED;
            }
            GAMESPEED = 0;
        }else{
            GAMESPEED = SAVEGAMESPEED;
        }
        if(PAUSED === false){
            frameCount += GAMESPEED;
        }

        if (tempMouseTimer2 > 0) {
            tempMouseTimer2--;
        }

        if (cardSelected !== 0) {
            if (animationOffset < 200) {
                animationOffset += 5;
            }
        } else if(blackScreen2Opacity < 0.5){
            if (animationOffset > 0) {
                animationOffset -= 5;
            }
        }

        //SKY FILL
        ctx.fillStyle = "rgb(5, 8, 15)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < voxels.length; i++) {

            var voxel = voxels[i];

            if(PAUSED === false){
                voxel.update();
            }
            voxel.draw();

            if (voxels[i].type === 1) {
                fields++;
            } else if (voxel.type === 2) {
                seas++;
            } else if (voxel.type === 2.1) {
                oilrigs++;
            } else if (voxel.type === 3) {
                forests++;
            } else if (voxel.type === 3.1) {
                forestFactories++;
            } else if (voxel.type === 4) {
                deserts++;
            } else if (voxel.type === 4.1) {
                desertFactories++;
            } else if (voxel.type === 5) {
                Mountains++;
            } else if (voxel.type === 6) {
                cities++;
            } else if (voxel.type === 6.1) {
                towns++;
            }

            if (selected.length > 0) {
                if (voxel.id === selected[0]) {
                    if (voxel.id === clickSelected[0]) {
                        voxel.animateUp(2);
                    } else {
                        if (voxel.cardSelected === false) {
                            voxel.animateUp(0);
                        }
                    }
                } else {
                    if (voxel.id === clickSelected[0]) {
                        voxel.animateUp(2);
                    } else {
                        if (voxel.cardSelected === false) {
                            voxel.animateUp(1);
                        }
                    }
                }
            }

            if (voxels[i].id !== selected[0]) {
                if (((mousePosX > voxels[i].x + voxels[i].width / 3)) &&
                    ((mousePosX < voxels[i].x + voxels[i].width - voxels[i].width / 3)) &&
                    ((mousePosY > voxels[i].y + voxels[i].height / 8)) &&
                    ((mousePosY < voxels[i].y + voxels[i].height - voxels[i].height / 3))) {

                    //voxels[i].animateUp(0);

                    selected.unshift(voxels[i].id);

                    if (thisFrameClicked === true && tempMouseTimer < 1) {
                        if (voxels[i].id === clickSelected[0]) {
                            clickSelected = [];
                        } else {
                            if (cardSelected !== 0 && tileSelectedByCard.length < cardNeedGive[cardSelected - 1][0]) {
                                clickSelected.unshift(voxels[i].id);
                            }
                            if (cardSelected !== 0) {
                                if (cards[cardSelected - 1][0] === voxels[i].type) {
                                    tileSelectedByCard.unshift(voxels[i].id);
                                    //voxels[i].fallAwayAndReplace(cards[cardSelected - 1][1]);
                                    //switchUpCards(cardSelected - 1);
                                }
                            }
                        }
                        tempMouseTimer = 10;
                    }

                } else {
                    if (thisFrameClicked === true) {
                        if (voxels[i].id === clickSelected[0]) {
                            clickSelected.unshift(999);
                        }
                    }
                }
            } else {
                if (((mousePosX > voxels[i].x + voxels[i].width / 3)) &&
                    ((mousePosX < voxels[i].x + voxels[i].width - voxels[i].width / 3)) &&
                    ((mousePosY > voxels[i].y + voxels[i].height / 8)) &&
                    ((mousePosY < voxels[i].y + voxels[i].height - voxels[i].height / 8))) {

                    if (thisFrameClicked === true && tempMouseTimer < 1) {
                        if (voxels[i].id === clickSelected[0]) {
                            clickSelected = [];
                        } else {
                            if (cardSelected === 0) {
                                clickSelected.unshift(voxels[i].id);
                            }
                            if (cardSelected !== 0) {
                                if (cards[cardSelected - 1][0] === voxels[i].type) {
                                    if (tileSelectedByCard.length >= cardNeedGive[cardSelected - 1][1] && tileSelectedByCard.length <= cardNeedGive[cardSelected - 1][0] - 1) {
                                        voxels[i].toBeDestroyed = true;
                                    }
                                    tileSelectedByCard.unshift(voxels[i].id);
                                    //voxels[i].fallAwayAndReplace(cards[cardSelected - 1][1]);
                                    //switchUpCards(cardSelected - 1);
                                }
                                if (cards[cardSelected - 1][0] === 0) {
                                    if (tileSelectedByCard.length >= cardNeedGive[cardSelected - 1][1] - 1 && tileSelectedByCard.length <= cardNeedGive[cardSelected - 1][0] - 1) {
                                        voxels[i].toBeDestroyed = true;
                                    }
                                    tileSelectedByCard.unshift(voxels[i].id);
                                }
                            }
                            if (buildType !== 0) {
                                voxels[i].type = buildType;
                            }
                        }
                        tempMouseTimer = 10;
                    } else if (mouseHeld === true) {
                        if (buildType !== 0) {
                            voxels[i].type = buildType;
                        }
                    }

                } else {
                    selected.unshift(999);

                }
            }

        }

        POLUTION = (fields * fieldPol) + (seas * seaPol) + (forests * forestPol) + (deserts * desertPol)
            + (cities * cityPol) + (oilrigs * oilRigPol) + (towns * townPol) + (forestFactories * forestFactoryPol) + (Mountains * MountainPol);

        // PLAYER TURN ---------------------------------------------------------------------------------------------------------------------------------------------------

        /*if(frameCount % yearlength === 0){
            if(cards.length < 2){
                for(var m = 0; m < 2; m++){
                    var randomx = Math.floor(Math.random() * (cardCombos.length - cardLevelLimitation));

                    cards.push(cardCombos[randomx]);
                    cardNeedGive.push(cardNeedGiveCombos[randomx]);

                    cardYOffset[cards.length - 1] = 50;
                }
            }else if(cards.length < 3){
                var randomx = Math.floor(Math.random() * (cardCombos.length - cardLevelLimitation));

                cards.push(cardCombos[randomx]);
                cardNeedGive.push(cardNeedGiveCombos[randomx]);

                cardYOffset[cards.length - 1] = 50;
            }

        }*/

        for(var oof = 0; oof < secondTimers.length - 1; oof++){
            if(secondTimers[oof] > 0 && gameEnd === false){
                secondTimers[oof]--;
            }
        }

        if (TEMPPOINTS % SeasonTimeSeconds === 0 && TEMPPOINTS !== 0 && (cards.length < 3) && (gameEnd === false) && secondTimers[0] < 1) {
            if(cardRig[LEVEL][cardRiggedNum] !== 99){
                cards.push(cardCombos[cardRig[LEVEL][cardRiggedNum]]);
                cardNeedGive.push(cardNeedGiveCombos[cardRig[LEVEL][cardRiggedNum]]);

                cardRiggedNum++;

                cardYOffset[cards.length - 1] = 50;
            }else {
                var randomx = Math.floor(Math.random() * (cardCombos.length - cardLevelLimitation));

                cards.push(cardCombos[randomx]);
                cardNeedGive.push(cardNeedGiveCombos[randomx]);

                cardYOffset[cards.length - 1] = 50;
            }
            secondTimers[0] = 100;
        }

        var xPosCard = [0, 0, 0];
        var yPosCard = [0, 0, 0];
        var cardWidth = WIDTH / 8;
        var cardHalfWidth = cardWidth / 2;
        var cardHeight = HEIGHT / 3.375;
        var cardOffset = WIDTH / 10;
        var cardMoveSpeed = 5;

        if (tempMouseTimer2 > 0) {
            tempMouseTimer2--;
        }

        if (cardSelected !== 0 && tileSelectedByCard.length > cardNeedGive[cardSelected - 1][0]) {
            tileSelectedByCard.splice(0, 1);
        }

        //CARD CLICK/MOUSEOVER --------------------------------------------------------------------------------------------------------

        if(PAUSED === false) {
            if (POLUTION >= LOSSPOINT) {
                tileSelectedByCard = [];
                cardSelected = 0;
            }

            var clickCheck = false;
            var opaqueCheck = false;

            if (onClick(WIDTH / 2 - 150, (-100) + animationOffset + tradeButtonOffset1, 150, 40)) {
                tradeButtonOffset1 = 5;
            } else {
                tradeButtonOffset1 = 0;
            }

            if (onClick(WIDTH / 2, (-100) + animationOffset + tradeButtonOffset2, 150, 40)) {
                tradeButtonOffset2 = 5;
            } else {
                tradeButtonOffset2 = 0;
            }

            if (cardSelected !== 0 && (thisFrameClicked) && (tempMouseTimer3 < 1) && mouseHeld === false && tileSelectedByCard.length === cardNeedGive[cardSelected - 1][0]) {
                var biomesTraded = 0;
                if (onClick(WIDTH / 2 - 150, (-100) + animationOffset + tradeButtonOffset1, 150, 40)) {
                    for (var z = 0; z < tileSelectedByCard.length; z++) {
                        for (var p = 0; p < voxels.length; p++) {
                            if (voxels[p].id === tileSelectedByCard[z]) {
                                if ((voxels[p].type === cards[cardSelected - 1][0])) {
                                    if (voxels[p].toBeDestroyed === false) {
                                        voxels[p].type = (cards[cardSelected - 1][1]);
                                    } else {
                                        voxels[p].type = 0;
                                        voxels[p].toBeDestroyed = false;
                                    }
                                    //cardSelected = 0;
                                    biomesTraded++;
                                } else if (cards[cardSelected - 1][0] === 0) {

                                    voxels[p].type = 0;
                                    voxels[p].toBeDestroyed = false;

                                } else if (voxels[p].type !== cards[cardSelected - 1][0]) {

                                    tileSelectedByCard = [];
                                    cardSelected = 0;

                                }
                            }
                        }
                    }
                    cardNeedGive.splice(cardSelected - 1, 1);
                    cards.splice(cardSelected - 1, 1);
                    tempMouseTimer3 = 1;
                    tileSelectedByCard = [];
                    cardSelected = 0;
                }
            }

            if (tempMouseTimer3 > 0) {
                tempMouseTimer3--;
            }

            if (cardSelected !== 0 && (thisFrameClicked) && (tempMouseTimer2 < 1) && mouseHeld === false && tileSelectedByCard.length === cardNeedGive[cardSelected - 1][0]) {
                if (onClick(WIDTH / 2, (-100) + animationOffset + tradeButtonOffset2, 150, 40)) {
                    tileSelectedByCard = [];
                    cardSelected = 0;
                }
            }

            for (var g = 0; g < cards.length; g++) {

                if (cardYOffset[g] < 0 && gameEnd === false) {
                    cardYOffset[g] += cardMoveSpeed;
                } else if (gameEnd === true) {
                    cardYOffset[g] -= cardMoveSpeed;
                }

                if (onClick(cardPosX[g], HEIGHT - HEIGHT / 8 - cardYOffset[g], WIDTH / 8, HEIGHT / 3.375)) {
                    if (g + 1 === cardSelected) {
                        cardOpacity = 0.3;
                    }
                    opaqueCheck = true;
                } else {
                    if (opaqueCheck === false) {
                        cardOpacity = 1;
                    }
                }

                if (onClick(cardPosX[g], HEIGHT - HEIGHT / 8 - cardYOffset[g] + animationOffset, cardOffset, cardHeight)) {
                    if (cardYOffset[g] < 100 && gameEnd === false) {
                        cardYOffset[g] += cardMoveSpeed;
                    }
                } else if (cardYOffset[g] > 0 && cardSelected !== (g + 1) && gameEnd === false) {
                    cardYOffset[g] -= cardMoveSpeed;
                }

                if ((thisFrameClicked) && (tempMouseTimer2 < 1) && mouseHeld === false && gameEnd === false) {
                    if (onClick(cardPosX[g], HEIGHT - HEIGHT / 8 - cardYOffset[g] + animationOffset, WIDTH / 10, HEIGHT / 3.375)) {
                        clickCheck = true;
                        if (cardSelected !== (g + 1) && tempMouseTimer2 < 1) {
                            cardSelected = g + 1;
                        } else {
                            cardSelected = 0;
                            tileSelectedByCard = [];
                        }
                        tempMouseTimer2 = 20;
                        cardYOffset[g] = 100;
                    } else {
                        if (clickCheck === false && cardSelected !== 0 && (tileSelectedByCard.length > cardNeedGive[cardSelected - 1][0] || tileSelectedByCard.length === 0)) {
                            //tileSelectedByCard = [];
                            //cardSelected = 0;
                        }
                    }

                    if (onClick(cardPosX[g], HEIGHT + HEIGHT / 7 - cardYOffset[g] + animationOffset - HEIGHT / 90, WIDTH / 10, HEIGHT / 45)) {
                        switchUpCards(g);
                    }
                }
            }
        }

        //CARDMOUSEOVER END ---------------------------------------------------------------------------------------------------

        // CITY TURN ---------------------------------------------------------------------------------------------------------------------------------

        if (frameCount % (60 / GAMESPEED) === 0 && gameEnd === false) {
            TEMPPOINTS += 1;
            YearChangedAlready = false;
        }

        if (TEMPPOINTS % 60 === 0 && TEMPPOINTS !== 0 && tempTimer2 === 0 && gameEnd === false) {
            POINTS++;
            tempTimer2 = 62;
        }

        if ((TEMPPOINTS % SeasonTimeSeconds === 0) && TEMPPOINTS !== 0 && (gameEnd === false) && YearChangedAlready === false && secondTimers[1] < 1) {
            yearVisible = true;
            if (SEASON === "Spring") {
                SEASON = "Summer";
            } else if (SEASON === "Summer") {
                SEASON = "Fall";
            } else if (SEASON === "Fall") {
                SEASON = "Winter";
            } else if (SEASON === "Winter") {
                SEASON = "Spring";
                YEAR++;
            }
            YearChangedAlready = true;
            secondTimers[1] = 100;
        }

        for (var b = 0; b < 4; b++) {
            if ((frameCount % yearlength === yearlength - 100/GAMESPEED + (b * 25 / GAMESPEED) && gameEnd === false)) {
                if (yearVisible === false) {
                    yearVisible = true;
                } else {
                    yearVisible = false;
                }
            }
        }

        if (tempTimer2 > 0) {
            tempTimer2--;
        }

        if (TEMPPOINTS % SeasonTimeSeconds === 0 && secondTimers[2] < 1 && TEMPPOINTS !== 0 && PAUSED === false) {

            for (var f = 0; f < voxels.length; f++) {

                if (voxels[f].type === 6 || voxels[f].type === 3.1 || voxels[f].type === 4.1 || voxels[f].type === 6.1) {
                    var diceRollCity = Math.random();

                    if (diceRollCity < 0.3) {
                        if (voxels[f].type === 6.1) {
                            voxels[f].type = 6;
                        } else {
                            diceRollCity = 0.4;
                        }
                    }

                    if (diceRollCity >= 0.3) {

                        for (var m = 0; m < gridRoll.length; m++) {
                            for (var n = 0; n < gridRoll[1].length; n++) {
                                if (gridRoll[m][n] === voxels[f].id) {

                                    var diceRollCity2 = Math.floor(Math.random() * 4) + 1;

                                    if (diceRollCity2 === 1) {
                                        if ((m > 1) && (voxels[gridRoll[m - 1][n]].type) !== 5 && (voxels[gridRoll[m - 1][n]].type !== 0)) {
                                            voxels[gridRoll[m - 1][n]].turnToCityTerritory = true;
                                        } else {
                                            diceRollCity2 = 2;
                                        }
                                    }

                                    if (diceRollCity2 === 2) {
                                        if ((n > 0) && (voxels[gridRoll[m][n - 1]].type !== 5) && (voxels[gridRoll[m][n - 1]].type !== 0)) {
                                            voxels[gridRoll[m][n - 1]].turnToCityTerritory = true;
                                        } else {
                                            diceRollCity2 = 3;
                                        }
                                    }

                                    if (diceRollCity2 === 3) {
                                        if ((m < mapSideLength) && (voxels[gridRoll[m + 1][n]].type !== 5) && (voxels[gridRoll[m + 1][n]].type !== 0)) {
                                            voxels[gridRoll[m + 1][n]].turnToCityTerritory = true;
                                        } else {
                                            diceRollCity2 = 4;
                                        }
                                    }

                                    if (diceRollCity2 === 4) {
                                        if ((n < mapSideLength - 1) && (voxels[gridRoll[m][n + 1]].type !== 5) && (voxels[gridRoll[m][n + 1]].type !== 0)) {
                                            voxels[gridRoll[m][n + 1]].turnToCityTerritory = true;
                                        } else {
                                            diceRollCity2 = 1;
                                        }
                                    }

                                    if (diceRollCity2 === 1) {
                                        if ((m > 1) && (voxels[gridRoll[m - 1][n]].type !== 5) && (voxels[gridRoll[m - 1][n]].type !== 0)) {
                                            voxels[gridRoll[m - 1][n]].turnToCityTerritory = true;
                                        } else {
                                            diceRollCity2 = 2;
                                        }
                                    }

                                    if (diceRollCity2 === 2) {
                                        if ((n > 0) && (voxels[gridRoll[m][n - 1]].type !== 5) && (voxels[gridRoll[m][n - 1]].type !== 0)) {
                                            voxels[gridRoll[m][n - 1]].turnToCityTerritory = true;
                                        } else {
                                            diceRollCity2 = 3;
                                        }
                                    }

                                    if (diceRollCity2 === 3) {
                                        if ((m < mapSideLength) && (voxels[gridRoll[m + 1][n]].type !== 5) && voxels[gridRoll[m + 1][n]].type !== 0) {
                                            voxels[gridRoll[m + 1][n]].turnToCityTerritory = true;
                                        } else {

                                        }
                                    }

                                }
                            }
                        }

                    }

                }
            }
            secondTimers[2] = 100;
        }

        if (selected.length > 1) {
            selected.splice(1, 1);
        }

        if (clickSelected.length > 1) {
            clickSelected.splice(1, 1);
        }

        window.onmousemove = logMouseMove;

        if (tempMouseTimer > 0) {
            tempMouseTimer--;
        }

        if (thisFrameClicked === true) {
            if (mouseDownTimer < 20) {
                mouseDownTimer++;
            } else {
                mouseHeld = true;
            }

        } else {
            mouseDownTimer = 0;
        }

        if (keys && keys[49]) {
            buildType = 1;
        }
        if (keys && keys[50]) {
            buildType = 2;
        }
        if (keys && keys[51]) {
            buildType = 3;
        }
        if (keys && keys[52]) {
            buildType = 4;
        }
        if (keys && keys[53]) {
            buildType = 5;
        }
        if (keys && keys[54]) {
            buildType = 6.1;
        }
        if (keys && keys[48]) {
            buildType = 0;
        }

        if (keys && keys[81]) { // Q FOR FASTT FORWARD
            if(buttonTimers[0] < 1){
                if(SAVEGAMESPEED === 1){
                    SAVEGAMESPEED = 5;
                }else if(SAVEGAMESPEED === 5){
                    SAVEGAMESPEED = 1;
                }
                buttonTimers[0] = 20;
            }
        }

        if(buttonTimers[0] > 0){
            buttonTimers[0]--;
        }

        if (keys && keys[114] && frameTimer2 < 1) {

            if (DEBUG === false) {
                DEBUG = true;
                frameTimer2 = 15;
            } else {
                DEBUG = false;
                frameTimer2 = 15;
            }

        }

        if (keys && keys[27]) {
            cardSelected = 0;
            tileSelectedByCard = [];
        }

        if (frameTimer2 > 0) {
            frameTimer2--;
        }


        // DRAWING ---------------------------------------------------------------------------------------------------------------------------------

        if (POLUTION < 10) {
            ctx.fillStyle = "rgba(51, 13, 13, 0)";
        } else if (POLUTION < 25) {
            ctx.fillStyle = "rgba(51, 13, 13, 0.1)";
        } else if (POLUTION < 40) {
            ctx.fillStyle = "rgba(51, 13, 13, 0.2)";
        } else if (POLUTION < 50) {
            ctx.fillStyle = "rgba(51, 13, 13, 0.3)";
        } else {
            ctx.fillStyle = "rgba(51, 13, 13, 0.4)";
        }

        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.font = '20pt Courier New';
        ctx.fillStyle = "rgb(255, 255, 255)";

        ctx.textAlign = "center";

        if (endGameTimer % 25 === 0 && endGameTimer > 0) {
            if (timerRed === false) {
                timerRed = true;
            } else {
                timerRed = false;
            }
        }

        if(timerRed === true){
            ctx.fillStyle = 'red';
        }else{
            ctx.fillStyle = 'white';
        }

        if (POINTS > 9) {
            if (TEMPPOINTS % 60 > 9 && TEMPPOINTS !== 0) {
                ctx.fillText(POINTS + ":" + (TEMPPOINTS % (60)), WIDTH / 2, HEIGHT / 10 - animationOffset);
            } else {
                ctx.fillText(POINTS + ":0" + (TEMPPOINTS % (60)), WIDTH / 2, HEIGHT / 10 - animationOffset);
            }
        } else {
            if (TEMPPOINTS % 60 > 9 && TEMPPOINTS !== 0) {
                ctx.fillText("0" + POINTS + ":" + (TEMPPOINTS % (60)), WIDTH / 2, HEIGHT / 10 - animationOffset);
            } else {
                ctx.fillText("0" + POINTS + ":0" + (TEMPPOINTS % (60)), WIDTH / 2, HEIGHT / 10 - animationOffset);
            }
        }

        ctx.globalAlpha = GUIOpacity;

        if (POLUTION < 0) {
            ctx.fillStyle = "rgb(0, 200, 0)";
        } else if (POLUTION < 50) {
            ctx.fillStyle = "rgb(255, 140, 0)";
        } else {
            ctx.fillStyle = "rgb(200, 0, 0)";
        }
        ctx.fillText("Pollution: " + POLUTION + "%", WIDTH / 2, HEIGHT / 6 - animationOffset);

        ctx.font = '15pt Courier New';
        ctx.fillStyle = "rgb(255, 255, 255)";

        ctx.textAlign = "left";
        ctx.fillText("Fields: " + fields, WIDTH / 90 - animationOffset, HEIGHT / 10);
        ctx.fillText("Seas: " + seas, WIDTH / 90 - animationOffset, HEIGHT / 10 + (HEIGHT / 15));
        ctx.fillText("Forests: " + forests, WIDTH / 90 - animationOffset, HEIGHT / 10 + (HEIGHT / 15) * 2);
        ctx.fillText("Deserts: " + deserts, WIDTH / 90 - animationOffset, HEIGHT / 10 + (HEIGHT / 15) * 3);
        ctx.fillText("Mountains: " + Mountains, WIDTH / 90 - animationOffset, HEIGHT / 10 + (HEIGHT / 15) * 4);
        ctx.fillText("Cities: " + cities, WIDTH / 90 - animationOffset, HEIGHT / 10 + (HEIGHT / 15) * 5);

        if (yearVisible === true) {
            ctx.fillStyle = "rgb(255, 255, 255)";
        } else {
            ctx.fillStyle = "rgb(200, 0, 0)";
        }

        ctx.textAlign = "center";
        ctx.fillText("Year " + YEAR + " - " + SEASON, WIDTH / 2, HEIGHT / 4 - HEIGHT / 50 - animationOffset);

        ctx.fillStyle = "rgba(30, 30, 30, 0.5)";
        ctx.fillRect(WIDTH - WIDTH / 7 + animationOffset, HEIGHT / 20, WIDTH / 8, HEIGHT / 2.5);

        ctx.globalAlpha = 1;

        //GUI -------------------------------------------------------------------------------------------------------------------------------------------

        for (var b = 0; b < cards.length; b++) {
            if (cards[b][0] === 1 && cards[b][1] === 3) {
                xPosCard[b] = 0;
                if (cardNeedGive[b][0] === 2) {
                    yPosCard[b] = 400;
                } else if (cardNeedGive[b][0] === 3) {
                    yPosCard[b] = 400;
                    xPosCard[b] = 900;
                }
            } else if (cards[b][0] === 1 && cards[b][1] === 2) {
                xPosCard[b] = 900;
            } else if (cards[b][0] === 1 && cards[b][1] === 5) {
                xPosCard[b] = 1200;
            } else if (cards[b][0] === 4 && cards[b][1] === 1) {
                xPosCard[b] = 300;
                if (cardNeedGive[b][0] > 1) {
                    yPosCard[b] = 400;
                    xPosCard[b] = 600;
                }
            } else if (cards[b][0] === 4 && cards[b][1] === 5) {
                xPosCard[b] = 600;
            } else if (cards[b][0] === 3 && cards[b][1] === 5) {
                xPosCard[b] = 300;
                yPosCard[b] = 400;
            } else if (cards[b][0] === 0 && cards[b][1] === 0) {
                xPosCard[b] = 1200;
                yPosCard[b] = 400;
            } else {
                xPosCard[b] = 0;
            }
        }

        for (var q = 0; q < cards.length; q++) {
            cardPosX[q] = WIDTH / 2 - cardHalfWidth - cardOffset * ((cards.length) / 2) + 2 * (WIDTH / 8 - WIDTH / 10) + cardOffset * q;
        }

        for (var l = 0; l < cards.length; l++) {
            if (cardSelected !== (l + 1) || cardSelected === 0) {
                ctx.drawImage(voxelsGUI, xPosCard[l], yPosCard[l], 300, 400, cardPosX[l], HEIGHT - HEIGHT / 8 - cardYOffset[l] + animationOffset, WIDTH / 8, cardHeight);
                ctx.textAlign = "center";
                ctx.font = "bold 8pt Courier";
                ctx.fillStyle = "red";
                ctx.fillText("Discard", cardPosX[l] + cardHalfWidth, HEIGHT + HEIGHT / 7 - cardYOffset[l] + animationOffset);
            } else {
                ctx.globalAlpha = cardOpacity;
                ctx.drawImage(voxelsGUI, xPosCard[l], yPosCard[l], 300, 400, cardPosX[l], HEIGHT - HEIGHT / 8 - cardYOffset[l], WIDTH / 8, cardHeight);
                ctx.globalAlpha = 1;
            }
        }

        if (cardSelected !== 0 && !(cards.length < 1)) {
            if ((cards[cardSelected - 1][0]) === 1) {
                word1 = "Field";
            }else if (cards[cardSelected - 1][0] === 3) {
                word1 = "Forest";
            }else if ((cards[cardSelected - 1][0]) === 4) {
                word1 = "Desert";
            }

            if (cards[cardSelected - 1][1] === 1) {
                word2 = "Field";
            } else if (cards[cardSelected - 1][1] === 2) {
                word2 = "Sea";
            } else if (cards[cardSelected - 1][1] === 3) {
                word2 = "Forest";
            } else if (cards[cardSelected - 1][1] === 5) {
                word2 = "Mountain";
            }
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = '15pt Courier New';

        if (cardSelected !== 0) {
            num1 = cardNeedGive[cardSelected - 1][0];
            num2 = cardNeedGive[cardSelected - 1][1];
            cardChosen = cards[cardSelected - 1][0];
        }
        if (cardChosen !== 0) {
            ctx.fillText("Pick " + num1 + " " + word1 + "(s) to turn into " + num2 + " " + word2 + "(s)", WIDTH / 2, (-170) + animationOffset);
        } else {
            ctx.fillText("Pick any tile to destroy", WIDTH / 2, (-170) + animationOffset);
        }

        if (num2 - num1 !== 0) {
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = '10pt Courier New';
            ctx.fillText("The last tile you pick (the one with the red cross) will be destroyed.", WIDTH / 2, (-130) + animationOffset);
        }


        if (cardSelected !== 0 && tileSelectedByCard.length === cardNeedGive[cardSelected - 1][0]) {
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = '15pt Courier New';
            var rectWidth = 150;
            var rectHeight = 40;
            ctx.fillStyle = "gray";
            ctx.fillRect(WIDTH / 2 - rectWidth, (-100) + animationOffset + tradeButtonOffset1, rectWidth, rectHeight);
            ctx.fillStyle = "rgb(35, 35, 35)";
            ctx.fillRect(WIDTH / 2 - rectWidth + 2, (-100) + animationOffset + 2 + tradeButtonOffset1, rectWidth - 4, rectHeight - 4);

            ctx.fillStyle = "white";
            ctx.fillText("Accept", WIDTH / 2 - rectWidth / 2, (-100) + animationOffset + 2 + rectHeight / 2 + tradeButtonOffset1);

            ctx.fillStyle = "gray";
            ctx.fillRect(WIDTH / 2, (-100) + animationOffset + tradeButtonOffset2, rectWidth, rectHeight);
            ctx.fillStyle = "rgb(35, 35, 35)";
            ctx.fillRect(WIDTH / 2 + 2, (-100) + animationOffset + 2 + tradeButtonOffset2, rectWidth - 4, rectHeight - 4);

            ctx.fillStyle = "white";
            ctx.fillText("Decline", WIDTH / 2 + rectWidth / 2, (-100) + animationOffset + 2 + rectHeight / 2 + tradeButtonOffset2);
        }

        //TOOLTIP -----------------------------------------------------------------------------------------------------------------------------------------

        ctx.globalAlpha = GUIOpacity;

        if (clickSelected.length > 0 && PAUSED === false) {
            for (i = 0; i < voxels.length; i++) {

                var selectedVoxelType;

                if (voxels[i].id === clickSelected[0]) {
                    selectedVoxelType = voxels[i].type;
                    //break;
                }
                if (selectedVoxelType === 1) {

                    ctx.drawImage(voxelsG, 0, 0, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Fields", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(fieldDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(fieldDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(fieldDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (fieldPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + fieldPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                } else if (selectedVoxelType === 2) {
                    ctx.drawImage(voxelsG, 300, 0, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Sea", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(seaDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(seaDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(seaDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (seaPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + seaPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);
                } else if (selectedVoxelType === 2.1) {
                    ctx.drawImage(voxelsG, 300, 400, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Oil Rig", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(oilRigDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(oilRigDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(oilRigDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (oilRigPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + oilRigPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);
                } else if (selectedVoxelType === 3) {

                    ctx.drawImage(voxelsG, 600, 0, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Forest", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(forestDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(forestDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(forestDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (forestPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + forestPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                } else if (selectedVoxelType === 3.1) {

                    ctx.drawImage(voxelsG, 600, 400, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Industrial Unit", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(forestFactoryDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(forestFactoryDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(forestFactoryDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (forestFactoryPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + forestFactoryPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                } else if (selectedVoxelType === 4) {

                    ctx.drawImage(voxelsG, 900, 0, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Desert", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(desertDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(desertDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(desertDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (desertPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + desertPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                } else if (selectedVoxelType === 4.1) {

                    ctx.drawImage(voxelsG, 900, 400, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Factory", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(desertFactoryDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(desertFactoryDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(desertFactoryDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (desertFactoryPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + desertFactoryPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                } else if (selectedVoxelType === 5) {

                    ctx.drawImage(voxelsG, 1500, 800, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Mountains", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(MountainDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(MountainDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(MountainDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (MountainPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + MountainPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                } else if (selectedVoxelType === 6) {

                    ctx.drawImage(voxelsG, 1200, 400, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("City", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(cityDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(cityDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(cityDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (cityPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + cityPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                } else if (selectedVoxelType === 6.1) {

                    ctx.drawImage(voxelsG, 1200, 0, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                    ctx.font = '12pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.textAlign = "center";
                    ctx.fillText("Town", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                    ctx.font = '9pt Courier New';
                    ctx.fillStyle = "rgb(255, 255, 255)";

                    ctx.fillText(townDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                    ctx.fillText(townDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                    ctx.fillText(townDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                    ctx.font = '10pt Courier New';
                    if (townPol <= 0) {
                        ctx.fillStyle = "rgb(0, 200, 0)";
                    } else {
                        ctx.fillStyle = "rgb(200, 0, 0)";
                    }

                    ctx.fillText("Pollution: " + townPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

                }
            }
        }

        ctx.globalAlpha = 1;

        ctx.fillStyle = "rgb(0, 0, 0)";
        if(blackScreen2Opacity > 0.005){
            blackScreen2Opacity -= 0.005;
        }

        ctx.globalAlpha = blackScreen2Opacity;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;

        ctx.fillStyle = 'white';
        ctx.globalAlpha = levelNameOpacity;
        ctx.fillText("Level " + LEVEL + " - " + levelNames[LEVEL], WIDTH/2, HEIGHT/2);
        ctx.globalAlpha = 1;


        if(GAMESPEED > 1){
            ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.textAlign = "right";
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.font = '20pt Courier New';
            ctx.fillText("Speed x5", WIDTH - WIDTH/30, HEIGHT - HEIGHT / 30);
        }

        if(POLUTION >= 50){
            endGameTimer++;
            gameEnd = true;
            SAVEGAMESPEED = 1;
            PAUSED = false;
            if(GUIOpacity > 0.005){
                GUIOpacity -= 0.005;
            }

            if(endGameTimer === 300){
                gameRunning = false;
                GAMESTATE = "LOSS";
            }
        }

        if(winYears[LEVEL] === YEAR && !(POLUTION >= LOSSPOINT)){
            endGameTimer++;
            gameEnd = true;
            SAVEGAMESPEED = 1;
            PAUSED = false;
            if(GUIOpacity > 0.005){
                GUIOpacity -= 0.005;
            }

            if(endGameTimer === 300){
                gameRunning = false;
                GAMESTATE = "WIN";
            }
        }

        forests = 0;
        deserts = 0;
        fields = 0;
        seas = 0;
        cities = 0;
        oilrigs = 0;
        towns = 0;
        desertFactories = 0;
        forestFactories = 0;
        Mountains = 0;

    }else{

        menuAnimationTimer++;

        ctx.fillStyle = "rgb(5, 8, 15)";
        ctx.globalAlpha = blackScreen1Opacity;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;

        if(GAMESTATE === "LOSS"){

            if(blackScreen1Opacity < 0.8){
                blackScreen1Opacity+= 0.005;
            }

            ctx.font = '25pt Courier New';
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", WIDTH/2, HEIGHT/3);

            if(timeSurvivedOpacity >= 0.7 && ENDTEMPTIME !== TEMPPOINTS){
                ENDTEMPTIME += 2;
            }else if(blackScreen1Opacity >= 0.7){
                timeSurvivedOpacity += 0.005
            }

            if(ENDTEMPTIME === TEMPPOINTS){

                if(pollutionOpacity < 0.995){
                    pollutionOpacity += 0.005
                }

                if(pollutionOpacity >= 0.8){
                    if(endGamePollution < POLUTION && POLUTION > 0){
                        endGamePollution++;
                    }else if(endGamePollution > POLUTION && POLUTION < 0){
                        endGamePollution--;
                    }

                }

            }

            if(endGamePollution === POLUTION){

                if(yearRequiredOpacity < 0.995){
                    yearRequiredOpacity += 0.005
                }

                if(yearRequiredOpacity >= 0.8){

                    if(menuAnimationTimer % 10 === 0){
                        if(endGameYearRequired < winYears[LEVEL]){
                            endGameYearRequired++;
                        }
                    }

                }
            }

            if(endGameYearRequired === winYears[LEVEL]){

                if(yearReachedOpacity < 0.995){
                    yearReachedOpacity += 0.005
                }

                if(yearReachedOpacity >= 0.8){
                    if(menuAnimationTimer % 10 === 0) {
                        if(YEAR === winYears[LEVEL]){
                            if (endGameYearReached < YEAR - 1) {
                                endGameYearReached++;
                            }
                        }else{
                            if (endGameYearReached < YEAR) {
                                endGameYearReached++;
                            }
                        }
                    }

                }

            }

            if(ENDTEMPTIME > TEMPPOINTS){
                ENDTEMPTIME = TEMPPOINTS;
                ENDTIME = POINTS;
            }

            if (ENDTEMPTIME % 60 === 0 && ENDTEMPTIME !== 0) {
                if(ENDTIME < POINTS) {
                    ENDTIME++;
                }
                tempTimer2 = 62;
            }

            if (tempTimer2 > 0) {
                tempTimer2--;
            }

            ctx.globalAlpha = timeSurvivedOpacity;

            ctx.font = '15pt Courier New';

            if (ENDTIME > 9) {
                if (ENDTEMPTIME % 60 > 9 && ENDTEMPTIME !== 0) {
                    ctx.fillText("Time Survived - " + ENDTIME + ":" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                } else {
                    ctx.fillText("Time Survived - " + ENDTIME + ":0" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                }
            } else {
                if (ENDTEMPTIME % 60 > 9 && ENDTEMPTIME !== 0) {
                    ctx.fillText("Time Survived - " + "0" + ENDTIME + ":" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                } else {
                    ctx.fillText("Time Survived - " + "0" + ENDTIME + ":0" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                }
            }

            ctx.globalAlpha = pollutionOpacity;
            ctx.fillText("Pollution - " + endGamePollution + "%", WIDTH / 2, HEIGHT / 2 - HEIGHT/20);

            ctx.globalAlpha = yearRequiredOpacity;
            ctx.fillText("Year Required - " + endGameYearRequired, WIDTH / 2, HEIGHT / 2);

            ctx.globalAlpha = yearReachedOpacity;
            ctx.fillText("Year Reached - " + endGameYearReached, WIDTH / 2, HEIGHT / 2 + HEIGHT/20);

            ctx.globalAlpha = 1;


            if(thisFrameClicked === true){
                ENDTEMPTIME = TEMPPOINTS;
                ENDTIME = POINTS;
                endGamePollution = POLUTION;
                endGameYearRequired = winYears[LEVEL];
                endGameYearReached = YEAR;

                timeSurvivedOpacity = 1;
                pollutionOpacity = 1;
                yearReachedOpacity = 1;
                yearRequiredOpacity = 1;
            }




        }else if(GAMESTATE === "WIN"){

            if(blackScreen1Opacity < 0.8){
                blackScreen1Opacity+= 0.005;
            }

            ctx.font = '25pt Courier New';
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("You Win!", WIDTH/2, HEIGHT/3);

            if(timeSurvivedOpacity >= 0.7 && ENDTEMPTIME !== TEMPPOINTS){
                ENDTEMPTIME += 2;
            }else if(blackScreen1Opacity >= 0.7){
                timeSurvivedOpacity += 0.005
            }

            if(ENDTEMPTIME === TEMPPOINTS){

                if(pollutionOpacity < 0.995){
                    pollutionOpacity += 0.005
                }

                if(pollutionOpacity >= 0.8){
                    if(endGamePollution < POLUTION && POLUTION > 0){
                        endGamePollution++;
                    }else if(endGamePollution > POLUTION && POLUTION < 0){
                        endGamePollution--;
                    }

                    if(tempEndGameTimer > 0){
                        tempEndGameTimer--;
                    }
                }

            }

            if(endGamePollution === POLUTION && ENDTEMPTIME === TEMPPOINTS && tempEndGameTimer === 0){

                if(yearRequiredOpacity < 0.995){
                    yearRequiredOpacity += 0.005
                }

                if(yearRequiredOpacity >= 0.8){

                    if(menuAnimationTimer % 10 === 0){
                        if(endGameYearRequired < winYears[LEVEL]){
                            endGameYearRequired++;
                        }
                    }

                }
            }

            if(endGameYearRequired === winYears[LEVEL]){

                if(yearReachedOpacity < 0.995){
                    yearReachedOpacity += 0.005
                }

                if(yearReachedOpacity >= 0.8){
                    if(menuAnimationTimer % 10 === 0) {
                        if (endGameYearReached < YEAR) {
                            endGameYearReached++;
                        }
                    }

                }

            }

            if(ENDTEMPTIME > TEMPPOINTS){
                ENDTEMPTIME = TEMPPOINTS;
                ENDTIME = POINTS;
            }

            if (ENDTEMPTIME % 60 === 0 && ENDTEMPTIME !== 0) {
                if(ENDTIME !== POINTS) {
                    ENDTIME++;
                }
                tempTimer2 = 62;
            }

            if (tempTimer2 > 0) {
                tempTimer2--;
            }

            ctx.globalAlpha = timeSurvivedOpacity;

            ctx.font = '15pt Courier New';

            if (ENDTIME > 9) {
                if (ENDTEMPTIME % 60 > 9 && ENDTEMPTIME !== 0) {
                    ctx.fillText("Time Survived - " + ENDTIME + ":" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                } else {
                    ctx.fillText("Time Survived - " + ENDTIME + ":0" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                }
            } else {
                if (ENDTEMPTIME % 60 > 9 && ENDTEMPTIME !== 0) {
                    ctx.fillText("Time Survived - " + "0" + ENDTIME + ":" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                } else {
                    ctx.fillText("Time Survived - " + "0" + ENDTIME + ":0" + (ENDTEMPTIME % (60)), WIDTH / 2, HEIGHT / 2 - HEIGHT/10);
                }
            }

            ctx.globalAlpha = pollutionOpacity;
            ctx.fillText("Pollution - " + endGamePollution + "%", WIDTH / 2, HEIGHT / 2 - HEIGHT/20);

            ctx.globalAlpha = yearRequiredOpacity;
            ctx.fillText("Year Required - " + endGameYearRequired, WIDTH / 2, HEIGHT / 2);

            ctx.globalAlpha = yearReachedOpacity;
            ctx.fillText("Year Reached - " + endGameYearReached, WIDTH / 2, HEIGHT / 2 + HEIGHT/20);

            ctx.globalAlpha = 1;


            if(thisFrameClicked === true){
                ENDTEMPTIME = TEMPPOINTS;
                ENDTIME = POINTS;
                endGamePollution = POLUTION;
                endGameYearRequired = winYears[LEVEL];
                endGameYearReached = YEAR;

                timeSurvivedOpacity = 1;
                pollutionOpacity = 1;
                yearReachedOpacity = 1;
                yearRequiredOpacity = 1;
            }
        }

    }

    if (keys && keys[32]) {
        if(buttonTimers[1] < 1){
            if(PAUSED === true){
                PAUSED = false;
            }else{
                PAUSED = true;
            }
            buttonTimers[1] = 20;
        }
    }

    if(buttonTimers[1] > 0){
        buttonTimers[1]--;
    }

    if(PAUSED === true && gameRunning === true && endGameTimer === 0){
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = '20pt Courier New';
        ctx.fillText("Paused", WIDTH - WIDTH/30, HEIGHT - HEIGHT / 30);
    }

        /* ON LOSS
        if(Lose condition){
            gameRunning = false;
            localStorage.setItem('HighScoreBusiness', HIGHSCORE);
        }
        */

}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function Start(){
    if(gameRunning === false){
        SCORE = 0;
        frameCount = 0;

        /* RESET ARRAYS (EXAMPLE)
        coins = [];
        */

        //document.getElementById("score").innerHTML = "" + SCORE;
        //document.getElementById("gamescore").innerHTML = "" + GAMESCORE;
        //document.getElementById("scorediv").removeAttribute("hidden");
        //document.getElementById("gamescorediv").removeAttribute("hidden");
        HIGHSCORE = localStorage.getItem("HighScoreBusiness");
        gameRunning = true;
    }
}

/* EXAMPLE DIV HIDE
function ShowInstructions(){
    document.getElementById("startMenu").setAttribute("hidden", "hidden");
    document.getElementById("resetMenu").setAttribute("hidden", "hidden");
    document.getElementById("instructionsMenu").removeAttribute("hidden");
}
*/

var keys;

// ---------------------------------------------------------- KEY LISTENERS ------------------------------------------------------------------------ //

window.addEventListener('keydown', function (e) {
    keys = (keys || []);
    keys[e.keyCode] = (e.type == "keydown");

    if([32, 37, 38, 39, 40, 114].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

}, false);
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.type == "keydown");
}, false);

function logMouseMove(e) {
    e = event || window.event;

    var rect = canvas.getBoundingClientRect();

    mousePosX = e.clientX - rect.left + WIDTH/30;
    mousePosY = e.clientY - rect.top + WIDTH/30;
    //console.log(mousePosX + ", " + mousePosY);
}

document.addEventListener("mousedown", clickedTrue);

document.addEventListener("mouseup", clickedFalse);

function clickedTrue(){
    thisFrameClicked = true;
}

function clickedFalse(){
    thisFrameClicked = false;
    mouseHeld = false;
}

// ---------------------------------------------------------- RELOAD FUNCTION ------------------------------------------------------------------------ //

function Reload() {
    localStorage.setItem("HighScoreBusiness", 0);
    //localStorage.clear();
}

// ---------------------------------------------------------- GAME LOOP ------------------------------------------------------------------------ //

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);