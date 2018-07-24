// ------------------------------------------------
// Copyright (c) 2018 Makoteo (Martin Feranec). All rights reserved.
// ------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Further Information:
//
//      'Me' and 'my' refers to me, Makoteo, the creator of this website. 'You' refers to you, the user of this website.
//
//      Youtubers/Lets Players:
//
//           You MAY record my games.
//           You MUST give proper credit (Or at the very least not credit someone other than me with the creation of my games).
//
//           Do NOT claim my content as your own
//
//      Game Publishers:
//
//           You MUST give very clear and proper credit
//
//           Do NOT alter any of my games
//           Do NOT claim my content as your own
//
//      Everyone Else:
//
//           You MUST give very clear and proper credit
//
//           Do NOT alter any of my games
//           Do NOT claim my content as your own
//
//
// ---------------------------------------------------------------------------------------------------------------------

var versionCode = "1.7.3";
var WIDTH = 1200;
var HEIGHT = 675;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;

var TEMPPOINTS = 0;
var POINTS = 0;
var POLUTION = 0;

var FULLSCREEN = false;
var fullScreenTimer = 0;

var ENDTEMPTIME = 0;
var ENDTIME = 0;

var YEAR = 1;
var SEASON = "Spring";

var PAUSED = false;
var TUTORIALPAUSED = false;

var LOSSPOINT = 50;

var GAMESPEED = 1; //DEFAULT 1
var SAVEGAMESPEED = 1;

var DEBUG = false;
var GUIHIDE = false;

var GAMESTATE = "MENU";

var voxels = [];

var buttonTimers = [

    [0],
    [0]

];

var menuButtonWidths = [

    0,
    0,
    0,
    0,
    0

];

var frameCount = 0;

var levelSelectorMenuLevelSelected = 0;

var thisFrameClicked = false;
var mouseHeld = false;

var endGameTimer = 0;

var animationOffset = 160;

var timerRed = false;

var startTimer = 0;

var gameEnd = false;

var winYears = [3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
var speedUpLimits = [2, 2, 2, 3, 3, 3, 4, 4, 4, 4];

var blackScreen1Opacity = 0;
var blackScreen2Opacity = 1;
var levelNameOpacity = 0;
var transitionBlackOpacity = 1;

var stateToTransitionTo = "";

var levelNames = [

    "Tutorial Meadow",
    "Lakes Edge",
    "Forest Peak",
    "Pond CrystalMoor",
    "The Loopy Hills",
    "SharkFin Beach",
    "The Forested Isles",
    "Lake Sardine",
    "The Eerie Mountains",
    "Dragon-Tail Desert",
    "The IronShade Province"

];

var menuAnimationTimer = 0;

var mainMenuFrameCount = 0;

var GUIOpacity = 1;

var SeasonTimeSeconds = 10;

var secondTimers = [

    [0],
    [0],
    [0],
    [0]

];

var checkBoxValues = [0, 0, 0];
var bigButtonWidths = [0, 0, 0];
var arrowWidths = [0, 0];

var blockPage = 0;

var polutionPoints = [];

var menuMouseTimer = 0;

var timeSurvivedOpacity = 0;
var yearRequiredOpacity = 0;
var yearReachedOpacity = 0;
var pollutionOpacity = 0;

var endGameYearRequired = 0;
var endGameYearReached = 0;
var endGamePollution = 0;

var YearChangedAlready = false;

var LEVEL = 10; //10 - DONE

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

    [1, 3, 1, 1, 1, 3, 1, 3],
    [3, 1, 1, 2, 2, 2, 2, 1],
    [1, 3, 6, 2, 2, 1, 2, 4],
    [3, 1, 4, 2, 2, 2, 2, 4],
    [3, 2, 2, 2, 2, 2, 2, 3],
    [3, 1, 1, 2, 4, 4, 1, 3],
    [1, 3, 3, 2, 1, 1, 1, 3],
    [3, 1, 1, 3, 1, 3, 1, 1]

];

var levelEightGrid = [

    [5, 5, 5, 5, 5, 1, 1, 1],
    [5, 5, 5, 5, 1, 3, 3, 1],
    [2, 2, 2, 4, 1, 1, 3, 3],
    [5, 5, 2, 2, 1, 2, 2, 4],
    [5, 1, 4, 2, 2, 2, 1, 1],
    [1, 3, 1, 2, 1, 6, 1, 1],
    [3, 1, 1, 2, 2, 1, 1, 1],
    [1, 3, 1, 3, 4, 3, 3, 1]

];

var levelNineGrid = [

    [4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 1, 3, 3, 4, 4, 4],
    [4, 1, 3, 1, 2, 1, 4, 4],
    [4, 3, 2, 2, 2, 3, 4, 4],
    [4, 3, 2, 2, 6, 4, 4, 4],
    [4, 1, 3, 1, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4]

];

var levelTenGrid = [

    [1, 4, 2, 2, 2, 1, 3, 1],
    [3, 3, 4, 2, 3, 4, 3, 4],
    [5, 1, 1, 3, 1, 5, 6, 1],
    [5, 4, 4, 1, 5, 2, 2, 3],
    [3, 4, 4, 4, 5, 3, 2, 1],
    [3, 1, 4, 5, 1, 3, 1, 4],
    [4, 3, 6, 1, 3, 4, 1, 1],
    [4, 1, 2, 2, 4, 1, 3, 1]

];

// testGridDo = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
//for(var i = 1; i < 9; i++){for(var j = 0; j < 7; j++){testGridDo[i][j] = voxels[gridRoll[i][j]].type}}

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

var backGroundGame = new Image();
backGroundGame.src = "BackGroundVoxelGame.png";

var titleGame = new Image();
titleGame.src = "Title.png";

var buttonGUI = new Image();
buttonGUI.src = "Button.png";

var checkBoxGUI = new Image();
checkBoxGUI.src = "CheckBoxDesign.png";

var bigButtonGUI = new Image();
bigButtonGUI.src = "BigButton.png";

var glossaryGUI = new Image();
glossaryGUI.src = "GlossaryDesign.png";

var thumbNails = new Image();
thumbNails.src = "ThumbNails.png";

var currentID = 0;

var cardPage = 0;

var mousePos;
var mousePosX;
var mousePosY;
var mouseDownTimer = 0;
var tempMouseTimer = 0;

var menuMouseTimer = 0;

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
var desertFactoryPol = +10;
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

var desertFactoryDesc1 = "Apparently they";
var desertFactoryDesc2 = "make rocket parts.";
var desertFactoryDesc3 = "More Pollution!";

var forestFactoryDesc1 = "No no no...";
var forestFactoryDesc2 = "This is getting";
var forestFactoryDesc3 = "really bad...";

var MountainDesc1 = "They block cities";
var MountainDesc2 = "from spreading.";
var MountainDesc3 = "Big plus!";

var tutorial = [

    ["Welcome to Voxel Biome!! A game", "of strategy and timing"],
    ["Do you see that town in the ", "middle of your screen?"],
    ["That's your enemy."],
    ["It'll try to spread around the", "world and destroy all the", "nature on it"],
    ["You must stop that"],
    ["Do you see that blue square?"],
    ["The city is about to spread there"],
    ["Thankfully, we can stop that"],
    ["Do you see the cards at the", "bottom of your screen?"],
    ["Click on the one that shows", "the field turning into a", "mountain."],

];

var tutorialMouseTimer = 0;
var tutorialSeparationTimer = 0;

var tutorialSeen = false;
var tutorialPage = 0;
var tutorialShowing = false;

var frameTimer2 = 0;
var yearVisible = true;
var yearlength = 600;

var tempEndGameTimer = 20;

var levelStates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //0 = Not Played, 1 = Not Passed, 2 = Passed without Loss, 3 = Passed with Loss

var actionSelected = 0;

var tempMouseTimer2 = 0;
var tempMouseTimer3 = 0;

var tempTimer2 = 0;

var cardYOffset = [0, 0, 0];

var cardSelected = 0;

var seasonBleepTimer = -1;

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
    [1, 1, 0, 3, 2, 1, 2, 1, 2, 1, 99],
    [4, 1, 2, 4, 1, 0, 1, 2 ,4, 99],
    [1, 3, 1, 2, 0, 4, 2, 1, 2, 0, 2, 99],
    [0, 1, 5, 0, 2, 1, 1, 99],
    [4, 3, 1, 1, 0, 1, 3, 0, 3, 4, 7, 99],
    [3, 0, 1, 3, 8, 4, 5, 7, 3, 1, 4, 99],
    [3, 2, 1, 0, 5, 1, 5, 1, 5, 4, 5, 6, 99],
    [1, 3, 0, 1, 5, 1, 8, 1, 8, 1, 0, 2, 3, 1, 4, 5, 1, 1, 0, 99],
    [3, 2, 2, 1, 2, 3, 2, 1, 1, 3, 1, 2, 0, 9, 3, 1, 99],
    [2, 1, 5, 0, 9, 5, 3, 1, 8, 3, 2, 9, 1, 8, 5, 6, 99]

];

var cardRiggedNum = 0;

var cardPosX = [0, 0, 0];

var cards = [];

var cardNeedGive = [];

var levelSelectors = [];

var cardOpacity = 1;

var tileSelectedByCard = [];

var tradeButtonOffset1 = 0;
var tradeButtonOffset2 = 0;

var word1 = "";
var word2 = "";

var num1 = 0;
var num2 = 0;
var cardChosen = 0;

var popUpText = "";
var popUpTimer = 0;
var popUpOpacity = 0;
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

function menuBigButton(level){

    this.pinglag = 0;
    this.pinglagposition = -1;
    this.level = level;
    this.xOffset = 0;
    this.yOffset = 0;
    this.width = 0.3*WIDTH;
    this.height = 0.3*WIDTH;
    this.moveVelocity = WIDTH/24;

    this.draw = function(){

        ctx.drawImage(bigButtonGUI, 0, 0, 400, 400, WIDTH/2 + this.xOffset - this.width/2, HEIGHT/2 - HEIGHT*0.1 + this.yOffset - this.width/2, this.width, this.height);

        if(this.position === 0){
            ctx.font = '10pt Courier New';
            ctx.fillText("(7Y8D1C3M)", this.xOffset + WIDTH/2, HEIGHT/2 + 0.1*WIDTH - HEIGHT * 0.07 - (0.3*WIDTH - this.width)/2); //FIX TEXT APPEAR EARLY
        }

        if(this.level !== 0 && !(levelStates[this.level - 1] === 2 || levelStates[this.level - 1] === 3)){
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '15pt Courier New';
            ctx.fillText("???", this.xOffset + WIDTH/2, HEIGHT/2 + 0.1*WIDTH - HEIGHT * 0.12 - (0.3*WIDTH - this.width)/2);
            ctx.font = '12pt Courier New';
            ctx.fillText("???", this.xOffset + WIDTH/2, HEIGHT/2 + 0.1*WIDTH - HEIGHT * 0.095 - (0.3*WIDTH - this.width)/2);
            ctx.font = '40pt Courier New';
            ctx.fillText("?", this.xOffset + WIDTH/2, HEIGHT/2 - HEIGHT*0.4 + (0.18*WIDTH));
            ctx.drawImage(bigButtonGUI, 0, 0, 400, 400, WIDTH/2 + this.xOffset - this.width/2, HEIGHT/2 - HEIGHT*0.1 + this.yOffset - this.width/2, this.width, this.height);
        }else{
            ctx.drawImage(thumbNails, 400 * this.level, 0, 400, 400, WIDTH/2 + this.xOffset - this.width/2, HEIGHT/2 - HEIGHT*0.5 + (0.18*WIDTH - this.width/2), this.width, this.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '15pt Courier New';
            ctx.fillText("Level " + this.level, this.xOffset + WIDTH/2, HEIGHT/2 + 0.1*WIDTH - HEIGHT * 0.12 - (0.3*WIDTH - this.width)/2);
            ctx.font = '12pt Courier New';
            ctx.fillText(levelNames[this.level], this.xOffset + WIDTH/2, HEIGHT/2 + 0.1*WIDTH - HEIGHT * 0.095 - (0.3*WIDTH - this.width)/2);
            ctx.drawImage(thumbNails, 400 * this.level, 0, 400, 400, WIDTH/2 + this.xOffset - this.width/2, HEIGHT/2 - HEIGHT*0.5 + (0.18*WIDTH - this.width/2), this.width, this.height);
        }
        //0 = Not Played, 1 = Not Passed, 2 = Passed without Loss, 3 = Passed with Loss

        if(levelStates[this.level]=== 2 || levelStates[this.level]=== 3){
            ctx.save();
            ctx.fillStyle = 'green';
            if(this.position === 0){
                ctx.translate(WIDTH/2 + this.width/3 + (this.xOffset), HEIGHT/2 - this.height/2);
                ctx.font = '40pt Courier New';
            }else{
                ctx.translate(WIDTH/2 + this.width/3 + (this.xOffset) + HEIGHT/60, HEIGHT/2 - this.height/2 - HEIGHT/25);
                ctx.font = '20pt Courier New';
            }
            ctx.rotate(Math.PI/4);
            ctx.textAlign = "center";
            ctx.fillText("Passed", 0, 0);
            ctx.restore();
        }

    }

    this.update = function(){

        this.position = this.level - levelSelectorMenuLevelSelected;

        if(this.xOffset < this.position * WIDTH/3 && (this.pinglag === 0 || this.pinglag === 1)){
            this.xOffset+=this.moveVelocity;
            this.pinglag = 1;
        }
        if(this.xOffset > (this.position) * WIDTH/3 && (this.pinglag === 0 || this.pinglag === 2)){
            this.xOffset-=this.moveVelocity;
            this.pinglag = 2;
        }

        if(this.position !== 0){
            if(this.width > WIDTH*0.2){
                this.width-=4;
                this.height-=4;
            }
        }else{
            if(this.width < WIDTH*0.3){
                this.width+=4;
                this.height+=4;
            }
        }

        if(this.pinglagposition !== this.position){
            this.pinglag = 0;
            this.pinglagposition = this.position;
        }

    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

if(localStorage.getItem(("levelStates")) === null){
    localStorage.setItem("levelStates", JSON.stringify(levelStates));
}else{
    levelStates = JSON.parse(localStorage.getItem("levelStates"));
}


var map = levelZeroGrid;
if (LEVEL === 0) {
    map = levelZeroGrid;
    cardLevelLimitation = 7; // 7
    cards = [[1, 3], [1, 5]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 1) {
    map = levelOneGrid;
    cardLevelLimitation = 6; // 6
    cards = [[1, 3], [1, 5]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 2) {
    map = levelTwoGrid;
    cardLevelLimitation = 5; // 5
    cards = [[1, 3], [1, 3]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 3) {
    map = levelThreeGrid;
    cardLevelLimitation = 4; // 4
    cards = [[1, 2], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 4) {
    map = levelFourGrid;
    cardLevelLimitation = 4; // 4
    cards = [[1, 3], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 5) {
    map = levelFiveGrid;
    cardLevelLimitation = 2; // 2
    cards = [[1, 3], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 6) {
    map = levelSixGrid;
    cardLevelLimitation = 2; // 2
    cards = [[1, 3], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 7) {
    map = levelSevenGrid;
    cardLevelLimitation = 1; // 1
    cards = [[1, 3]];
    cardNeedGive = [[1, 1]];
} else if (LEVEL === 8) {
    map = levelEightGrid;
    cardLevelLimitation = 1; // 1
    cards = [[4, 1]];
    cardNeedGive = [[1, 1]];
} else if (LEVEL === 9) {
    map = levelNineGrid;
    cardLevelLimitation = 0; // 0
    cards = [[4, 1], [4, 1]];
    cardNeedGive = [[1, 1], [1, 1]];
} else if (LEVEL === 10) {
    map = levelTenGrid;
    cardLevelLimitation = 0; // 0
    cards = [[1, 3]];
    cardNeedGive = [[1, 1]];
}

var mapSideLength = map[0].length;
var maxGridLength = map[0].length;

var downwardsOffset = (8 - mapSideLength) * HEIGHT / 28;

for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < maxGridLength; j++) {
        if (map[i][j] === 0) {

        } else if (map[i][j] === 1) {
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 1));
        } else if (map[i][j] === 2) {
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 2));
        } else if (map[i][j] === 3) {
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 3));
        } else if (map[i][j] === 4) {
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 4));
        } else if (map[i][j] === 5) {
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 5));
        } else if (map[i][j] === 6) {
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 6.1));
        }
        //voxels.push(new Voxel((WIDTH / 10 * (j + 3)) + (i * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 9) - (HEIGHT / 30 * (i + 1))), 75, 75));
    }
    //width--;
}

function loadGame() {

    voxels = [];
    gridRoll = [];
    currentID = 0;

    reset();

    if (LEVEL === 0) {
        map = levelZeroGrid;
        cardLevelLimitation = 7; // 7
        cards = [[1, 3], [1, 5]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 1) {
        map = levelOneGrid;
        cardLevelLimitation = 6; // 6
        cards = [[1, 3], [1, 5]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 2) {
        map = levelTwoGrid;
        cardLevelLimitation = 5; // 5
        cards = [[1, 3], [1, 3]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 3) {
        map = levelThreeGrid;
        cardLevelLimitation = 4; // 4
        cards = [[1, 2], [4, 1]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 4) {
        map = levelFourGrid;
        cardLevelLimitation = 4; // 4
        cards = [[1, 3], [4, 1]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 5) {
        map = levelFiveGrid;
        cardLevelLimitation = 2; // 2
        cards = [[1, 3], [4, 1]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 6) {
        map = levelSixGrid;
        cardLevelLimitation = 2; // 2
        cards = [[1, 3], [4, 1]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 7) {
        map = levelSevenGrid;
        cardLevelLimitation = 1; // 1
        cards = [[1, 3]];
        cardNeedGive = [[1, 1]];
    } else if (LEVEL === 8) {
        map = levelEightGrid;
        cardLevelLimitation = 1; // 1
        cards = [[4, 1]];
        cardNeedGive = [[1, 1]];
    } else if (LEVEL === 9) {
        map = levelNineGrid;
        cardLevelLimitation = 0; // 0
        cards = [[4, 1], [4, 1]];
        cardNeedGive = [[1, 1], [1, 1]];
    } else if (LEVEL === 10) {
        map = levelTenGrid;
        cardLevelLimitation = 0; // 0
        cards = [[1, 3]];
        cardNeedGive = [[1, 1]];
    }

    mapSideLength = map[0].length;
    maxGridLength = map[0].length;

    var downwardsOffset = (8 - mapSideLength) * HEIGHT / 28;

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < maxGridLength; j++) {
            if (map[i][j] === 0) {

            } else if (map[i][j] === 1) {
                voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 1));
            } else if (map[i][j] === 2) {
                voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 2));
            } else if (map[i][j] === 3) {
                voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 3));
            } else if (map[i][j] === 4) {
                voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 4));
            } else if (map[i][j] === 5) {
                voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 5));
            } else if (map[i][j] === 6) {
                voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH / 50, (HEIGHT / 14 * j / 2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT / 33 * maxGridLength) + downwardsOffset, WIDTH / 16, WIDTH / 12, 6.1));
            }
            //voxels.push(new Voxel((WIDTH / 10 * (j + 3)) + (i * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 9) - (HEIGHT / 30 * (i + 1))), 75, 75));
        }
        //width--;
    }
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

function reset(){

    gameRunning = false;
    SCORE = 0;
    GAMESCORE = 0;
    HIGHSCORE = 0;

    TEMPPOINTS = 0;
    POINTS = 0;
    POLUTION = 0;

    ENDTEMPTIME = 0;
    ENDTIME = 0;

    YEAR = 1;
    SEASON = "Spring";

    polutionPoints = [];

    PAUSED = false;

    GAMESPEED = 1; //DEFAULT 1
    SAVEGAMESPEED = 1;

    DEBUG = false;

    GAMESTATE = "GAME";

    voxels = [];

    frameCount = 0;

    thisFrameClicked = false;
    mouseHeld = false;

    endGameTimer = 0;

    animationOffset = 160;

    timerRed = false;

    startTimer = 0;

    gameEnd = false;

    winYears = [3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];

    blackScreen1Opacity = 0;
    blackScreen2Opacity = 1;
    levelNameOpacity = 0;

    menuAnimationTimer = 0;

    GUIOpacity = 1;

    SeasonTimeSeconds = 10;

    timeSurvivedOpacity = 0;
    yearRequiredOpacity = 0;
    yearReachedOpacity = 0;
    pollutionOpacity = 0;

    endGameYearRequired = 0;
    endGameYearReached = 0;
    endGamePollution = 0;

    YearChangedAlready = false;

    gridRoll = [

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

    selected = [];
    clickSelected = [];

    currentID = 0;

    mouseDownTimer = 0;
    tempMouseTimer = 0;

    buildType = 0;

    forests = 0;
    deserts = 0;
    fields = 0;
    seas = 0;
    towns = 0;
    cities = 0;
    oilrigs = 0;
    desertFactories = 0;
    forestFactories = 0;
    Mountains = 0;

    frameTimer2 = 0;
    yearVisible = true;
    yearlength = 600;

    tempEndGameTimer = 20;

    actionSelected = 0;

    tempMouseTimer2 = 0;
    tempMouseTimer3 = 0;

    tempTimer2 = 0;

    cardYOffset = [0, 0, 0];

    cardSelected = 0;

    cardRiggedNum = 0;

    cardPosX = [0, 0, 0];

    cards = [];

    cardNeedGive = [];

    cardOpacity = 1;

    tileSelectedByCard = [];

    tradeButtonOffset1 = 0;
    tradeButtonOffset2 = 0;

    word1 = "";
    word2 = "";

    num1 = 0;
    num2 = 0;
    cardChosen = 0;

}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    if(GAMESTATE === "GAME"){
        //gameRunning = true;
        //blackScreen2Opacity = 0;
        //gameRunning = false;
        startTimer++;

        if(startTimer < 100){
            levelNameOpacity += 0.005;
            gameRunning = false;
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
        ctx.globalAlpha = 1;
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
            if ((animationOffset < 200 && FULLSCREEN === false) || (animationOffset < WIDTH/6 + WIDTH/50 && FULLSCREEN === true)) {
                animationOffset += 5;
            }
        } else if(blackScreen2Opacity < 0.5){
            if (animationOffset > 0) {
                animationOffset -= 5;
            }
        }

        //SKY FILL
        //ctx.fillStyle = "rgb(5, 8, 15)";
        ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

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
            + (cities * cityPol) + (oilrigs * oilRigPol) + (towns * townPol) + (forestFactories * forestFactoryPol) + (Mountains * MountainPol) + (desertFactories * desertFactoryPol);

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

        if (TEMPPOINTS % SeasonTimeSeconds === 0 && TEMPPOINTS !== 0 && (cards.length < 3) && (gameEnd === false) && secondTimers[0] < 1 && PAUSED === false) {
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

        if(PAUSED === false || TUTORIALPAUSED === true) {
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

        if (TEMPPOINTS % 60 === 0 && TEMPPOINTS !== 0 && tempTimer2 === 0 && gameEnd === false && PAUSED === false) {
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

        if(TEMPPOINTS > 10 && TEMPPOINTS <= 100){
            if(TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length) === "8" || TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length) === "9"){
                seasonBleepTimer += GAMESPEED;
                if(seasonBleepTimer % 5 <= 4 && seasonBleepTimer !== -1 && GAMESPEED > 1){
                    seasonBleepTimer = Math.round(seasonBleepTimer / 10) * 10;
                }
            }
        }else if(TEMPPOINTS <= 10){
            if(TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length - 1) === "8" || TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length - 1) === "9"){
                seasonBleepTimer += GAMESPEED;
                if(seasonBleepTimer % 5 <= 4 && seasonBleepTimer !== -1 && GAMESPEED > 1){
                    seasonBleepTimer = Math.round(seasonBleepTimer / 10) * 10;
                }
            }
        }else if(TEMPPOINTS > 100){
            if(TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length + 1) === "8" || TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length + 1) === "9"){
                seasonBleepTimer += GAMESPEED;
                if(seasonBleepTimer % 5 <= 4 && seasonBleepTimer !== -1 && GAMESPEED > 1){
                    seasonBleepTimer = Math.round(seasonBleepTimer / 10) * 10;
                }
            }
        }

        if(frameCount === 1){
            polutionPoints.push(POLUTION);
        }

        //seasonBleepTimer
        for (var b = 0; b < 4; b++) {
            if ((seasonBleepTimer === b * 30 && gameEnd === false)) {
                if (yearVisible === false) {
                    yearVisible = true;
                } else {
                    yearVisible = false;
                }
            }
        }
        if(TEMPPOINTS <= 100){
            if(TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length) === "0"){
                seasonBleepTimer = -1;
            }
        }else {
            if (TEMPPOINTS.toString().charAt(TEMPPOINTS.toString.length + 1) === "0") {
                seasonBleepTimer = -1;
            }
        }

        if (tempTimer2 > 0 && PAUSED === false) {
            tempTimer2--;
        }

        if (TEMPPOINTS % SeasonTimeSeconds === 0 && secondTimers[2] < 1 && TEMPPOINTS !== 0 && PAUSED === false) {

            polutionPoints.push(POLUTION);

            for (var f = 0; f < voxels.length; f++) {

                if (voxels[f].type === 6 || voxels[f].type === 3.1 || voxels[f].type === 4.1 || voxels[f].type === 6.1) {
                    var diceRollCity = Math.random();

                    if(LEVEL === 0 && TEMPPOINTS === 10 && voxels[f].id === 12) {
                        diceRollCity = 1;
                    }else if(LEVEL === 1 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30) && voxels[f].id === 16){
                        diceRollCity = 1;
                    }else if(LEVEL === 2 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30) && voxels[f].id === 16){
                        diceRollCity = 1;
                    }else if(LEVEL === 3 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30) && voxels[f].id === 28){
                        diceRollCity = 1;
                    }else if(LEVEL === 4 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30) && voxels[f].id === 28){
                        diceRollCity = 1;
                    }else if(LEVEL === 5 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30) && voxels[f].id === 23){
                        diceRollCity = 1;
                    }else if(LEVEL === 6 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30) && voxels[f].id === 23){
                        diceRollCity = 1;
                    }else if(LEVEL === 7 && TEMPPOINTS === 30 && voxels[f].id === 18){
                        diceRollCity = 1;
                    }else if(LEVEL === 8 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30) && voxels[f].id === 45){
                        diceRollCity = 1;
                    }else if(LEVEL === 8 && (TEMPPOINTS === 40 || TEMPPOINTS === 50 || TEMPPOINTS === 30 || TEMPPOINTS === 60) && voxels[f].id === 38){
                        diceRollCity = 1;
                    }else if(LEVEL === 8 && (TEMPPOINTS === 40 || TEMPPOINTS === 50 || TEMPPOINTS === 30) && voxels[f].id === 46){
                        diceRollCity = 1;
                    }else if(LEVEL === 8 && (TEMPPOINTS === 40 || TEMPPOINTS === 50 || TEMPPOINTS === 30 || TEMPPOINTS === 60) && voxels[f].id === 39){
                        diceRollCity = 1;
                    }else if(LEVEL === 9 && (TEMPPOINTS === 20 || TEMPPOINTS === 10 || TEMPPOINTS === 30) && voxels[f].id === 36){
                        diceRollCity = 1;
                    }else if(LEVEL === 9 && (TEMPPOINTS === 20 || TEMPPOINTS === 10 || TEMPPOINTS === 30 || TEMPPOINTS === 40 || TEMPPOINTS === 50) && voxels[f].id === 44){
                        diceRollCity = 1;
                    }else if(LEVEL === 10 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30 || TEMPPOINTS === 40 || TEMPPOINTS === 50) && voxels[f].id === 50){
                        diceRollCity = 1;
                    }else if(LEVEL === 10 && (TEMPPOINTS === 10 || TEMPPOINTS === 20 || TEMPPOINTS === 30 || TEMPPOINTS === 40 || TEMPPOINTS === 50) && voxels[f].id === 22){
                        diceRollCity = 1;
                    }

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


                                    // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                    if(LEVEL === 0){//TUTORIAL

                                        //FIRST MOVE HAS TO BE MOUNTAIN ON TOWNS 4 (BY TUTORIAL)

                                        if(voxels[f].id === 12 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 12 && TEMPPOINTS < 29 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 12 && TEMPPOINTS < 39 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }

                                    }else if(LEVEL === 1){

                                        //FIRST MOVE HAS TO BE MOUNTAIN ON TOWNS 4 -- Least Pollution Option... Basically an Easy Level where you follow instructions

                                        //00:10 - Mountain on #17
                                        //00:30 - Water on #22
                                        //00:50 - Mountain on #13

                                        if(voxels[f].id === 16 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 16 && TEMPPOINTS < 29 && TEMPPOINTS > 19 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 12 && POINTS < 1){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 16 && TEMPPOINTS < 39 && TEMPPOINTS > 29 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 16 && TEMPPOINTS < 19 && POINTS === 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 11 && TEMPPOINTS < 39 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 17 && TEMPPOINTS < 39 && POINTS < 1){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 17 && TEMPPOINTS < 49 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 21){
                                            if(TEMPPOINTS < 50 && TEMPPOINTS > 30 && POINTS < 1){
                                                diceRollCity2 = 4;
                                            }else{
                                                diceRollCity2 = 0;
                                            }
                                        }else if(voxels[f].id === 18 && TEMPPOINTS < 19 && POINTS === 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 19 && TEMPPOINTS < 39 && POINTS === 1){
                                            diceRollCity2 = 1;
                                        }

                                    }else if(LEVEL === 2){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        //Mostly a tutorial for how to trade multiple blocks... Not any big strategy...

                                        if(voxels[f].id === 16 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 16 && TEMPPOINTS < 29 && TEMPPOINTS > 19 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 16 && TEMPPOINTS < 39 && TEMPPOINTS > 29 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 15 && TEMPPOINTS < 49 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }

                                    }else if(LEVEL === 3){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        //Whole point is to trade #10 for grass on 00:20

                                        //00:00 - #27 Desert to Field, Field to Water
                                        //00:20 - #10 to field

                                        if(voxels[f].id === 28 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 28 && TEMPPOINTS < 29 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 28 && POINTS < 1){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 22 && TEMPPOINTS < 49 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 16 && TEMPPOINTS < 59 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 10 && TEMPPOINTS < 59 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 10 && TEMPPOINTS < 69 && POINTS === 1){
                                            diceRollCity2 = 1;
                                        }

                                    }else if(LEVEL === 4){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        //Place Water on #26 on 00:10 to block path...
                                        //Depends on situation, Usually block #23 and #33

                                        if(voxels[f].id === 28 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 28 && TEMPPOINTS < 29 && TEMPPOINTS > 19 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 22 && POINTS < 1){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 27 && TEMPPOINTS < 39 && TEMPPOINTS > 29 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 26 && TEMPPOINTS < 49 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }

                                    }else if(LEVEL === 5){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        //3-2, D-F, F-Fo

                                        //Whole point is to trade #14 for empty on 00:10 on the 3 tree to 2 mountain trade (16 and 15 as mountains) and #32 to Lake on 00:50 requiring 00:20 to be
                                        // #32 from desert to grass

                                        if(voxels[f].id === 23 && POINTS < 5){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 30 && TEMPPOINTS < 49 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 21 && TEMPPOINTS < 39 && TEMPPOINTS > 29 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 14 && TEMPPOINTS < 49 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 31 && TEMPPOINTS < 59 && TEMPPOINTS > 49 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 31 && POINTS >= 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 22 && TEMPPOINTS < 59 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 22 && TEMPPOINTS < 29 && TEMPPOINTS > 19 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 37){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 35){
                                            diceRollCity2 = 0;
                                        }

                                        if(TEMPPOINTS < 30 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }

                                    }else if(LEVEL === 6){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        //Whole point is to block city on #29 by placing lake on #29

                                        if(voxels[f].id === 23 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 23 && TEMPPOINTS < 29 && TEMPPOINTS > 19 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 22 && TEMPPOINTS < 39 && TEMPPOINTS > 19 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 36 && TEMPPOINTS < 49 && TEMPPOINTS > 49 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 29 && TEMPPOINTS < 49 && TEMPPOINTS > 29 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 24 && TEMPPOINTS < 49 && TEMPPOINTS > 29 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 31 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 38 && POINTS < 1){
                                            diceRollCity2 = 0;
                                        }

                                    }else if(LEVEL === 7){

                                        //Place mountain on 00:20 on #25 instead of the obvious #2... On 00:40, place lake on #16 and you should be okay

                                        if(voxels[f].id === 18 && TEMPPOINTS < 29 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 18 && TEMPPOINTS >= 30 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 17 && TEMPPOINTS < 59 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 17 && TEMPPOINTS >= 60 && POINTS === 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 25 && TEMPPOINTS <= 90 && POINTS === 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 16 && TEMPPOINTS <= 80 && POINTS === 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 24 && TEMPPOINTS <= 90  && POINTS === 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 32 && TEMPPOINTS <= 110  && POINTS === 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 2  && POINTS <= 1 && TEMPPOINTS <= 30){
                                            diceRollCity2 = 0;
                                        }
                                    }else if(LEVEL === 8){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        //Whole point is to not use the 2nd DESERT - FIELD card because you'll later get a DESERT - MOUNATIN (the other one is gonna be FIELD - WATER)...

                                        // DESTROY #44 on 01:10 is also a good move

                                        if(voxels[f].id === 45 && TEMPPOINTS < 29 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 46 && TEMPPOINTS < 39 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 46 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 54 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 62 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 61 && TEMPPOINTS > 39 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 38 && TEMPPOINTS > 29 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 38 && TEMPPOINTS < 19 && POINTS === 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 39 && TEMPPOINTS < 89 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 39 && TEMPPOINTS < 89 && POINTS === 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 31 && TEMPPOINTS < 99 && POINTS === 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 53 && TEMPPOINTS < 99 && POINTS <= 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 61 && TEMPPOINTS < 99 && POINTS <= 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 60 && TEMPPOINTS < 109 && POINTS <= 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 59 && TEMPPOINTS < 119 && POINTS <= 1){
                                            diceRollCity2 = 2;
                                        }


                                    }else if(LEVEL === 9){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        // Trade #37, #44 and #52 for fields asap... City on #45 only moves to #46!!

                                        if(voxels[f].id === 36 && TEMPPOINTS < 29 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 36 && TEMPPOINTS < 38 && TEMPPOINTS > 28 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 44 && TEMPPOINTS < 28 && TEMPPOINTS > 17 && POINTS < 1){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 44 && TEMPPOINTS < 17 && POINTS < 1){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 44 && TEMPPOINTS > 28 && TEMPPOINTS < 48 && POINTS < 1){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 44 && TEMPPOINTS > 48 && POINTS < 1 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 44 && TEMPPOINTS > 88 && TEMPPOINTS < 98 && POINTS === 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 45 && POINTS === 1){
                                            diceRollCity2 = 4;
                                        }


                                    }else if(LEVEL === 10){

                                        // 1 = LEFT, 2 = UP, 3 = RIGHT, 4 = DOWN

                                        // Ignore mountain trade on 00:10
                                        // 00:20 - #51 Field to Mountain
                                        // 00:30 - #13 to Mountain
                                        // 00:40 - #41 to Water
                                        // 00:50 - Destroy #31
                                        // 01:00 - #42 to Mountain
                                        // Continue in a Low Pollution Style

                                        if(voxels[f].id === 22 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 23 && POINTS < 1 && TEMPPOINTS < 48){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 23 && POINTS < 1 && TEMPPOINTS > 48){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 31 && POINTS === 1 && TEMPPOINTS < 69){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 13){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 50 && TEMPPOINTS < 19 && POINTS < 1){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 50 && POINTS < 1 && TEMPPOINTS > 19  && TEMPPOINTS < 28){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 50 && POINTS < 1 && TEMPPOINTS > 28  && TEMPPOINTS < 39){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 50 && POINTS < 1 && TEMPPOINTS > 38){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 49 && POINTS < 1 && TEMPPOINTS > 38  && TEMPPOINTS < 49){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 33 && POINTS < 1){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 22 && POINTS < 1 && TEMPPOINTS > 38  && TEMPPOINTS < 49){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 14 && POINTS < 1 && TEMPPOINTS > 48  && TEMPPOINTS < 59){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 14 && POINTS === 1){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 41 && POINTS < 1 && TEMPPOINTS > 48  && TEMPPOINTS < 59){
                                            diceRollCity2 = 0;
                                        }else if(voxels[f].id === 41 && POINTS === 1 && TEMPPOINTS < 69){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 50 && POINTS === 1 && TEMPPOINTS < 79 && TEMPPOINTS > 69){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 22 && POINTS < 1 && TEMPPOINTS > 19  && TEMPPOINTS < 29){
                                            diceRollCity2 = 2;
                                        }else if(voxels[f].id === 42 && POINTS < 1 && TEMPPOINTS > 19  && TEMPPOINTS < 29){
                                            diceRollCity2 = 1;
                                        }else if(voxels[f].id === 48){
                                            diceRollCity2 = 3;
                                        }else if(voxels[f].id === 51 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }else if(voxels[f].id === 52 && POINTS < 1){
                                            diceRollCity2 = 4;
                                        }

                                    }

                                    // CITY MOVE SCRIPT -------------------------------------------------------------------------------------------------------------------

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

        if (keys && keys[81]) { // Q FOR FAST FORWARD
            if(buttonTimers[0] < 1){
                if(SAVEGAMESPEED === 1 && speedUpLimits[LEVEL] <= YEAR){
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

        if (keys && keys[112] && frameTimer2 < 1) {
            if (GUIHIDE === false) {
                GUIHIDE = true;
                frameTimer2 = 15;
            } else {
                GUIHIDE = false;
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

        if(GUIHIDE === false){
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
        }


        //GUI -------------------------------------------------------------------------------------------------------------------------------------------

        if(DEBUG === true){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.font = '10pt Courier New';
            ctx.fillRect(WIDTH - WIDTH/3.5, HEIGHT - HEIGHT/3.5, WIDTH/4, HEIGHT/4);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.fillText("Pollution over time: ", WIDTH - WIDTH/3.5 + WIDTH/40, HEIGHT - HEIGHT/3.5 + HEIGHT/20);

            ctx.font = '5pt Courier New';
            ctx.fillText("0", WIDTH - WIDTH/3.5 + WIDTH/100, HEIGHT - HEIGHT/3.5 + HEIGHT/8 + HEIGHT/40);
            ctx.fillText("100", WIDTH - WIDTH/3.5 + WIDTH/100, HEIGHT - HEIGHT/3.5 + HEIGHT/8 - (HEIGHT/4 / 600)*100 + HEIGHT/50);
            ctx.fillText("-100", WIDTH - WIDTH/3.5 + WIDTH/100, HEIGHT - HEIGHT/3.5 + HEIGHT/8 - (HEIGHT/4 / 600)*-100 + HEIGHT/50);

            for(var t = 0; t <= polutionPoints.length; t++){
                ctx.strokeStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(WIDTH - WIDTH/3.5 + WIDTH/30 + (t)*(WIDTH/5/(polutionPoints.length - 1)), HEIGHT - HEIGHT/3.5 + HEIGHT/8 - (HEIGHT/4 / 600)*polutionPoints[t] + HEIGHT/55);
                ctx.lineTo(WIDTH - WIDTH/3.5 + WIDTH/30 + (t+1)*(WIDTH/5/(polutionPoints.length - 1)), HEIGHT - HEIGHT/3.5 + HEIGHT/8 - (HEIGHT/4 / 600)*polutionPoints[t+1] + HEIGHT/55);
                ctx.stroke();
            }
        }

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

        if(GUIHIDE === false){
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

        if (clickSelected.length > 0 && PAUSED === false && GUIHIDE === false) {
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
                //0 = Not Played, 1 = Not Passed, 2 = Passed without Loss, 3 = Passed with Loss
                if(levelStates[LEVEL] === 2){
                    levelStates[LEVEL] = 3;
                }else {
                    levelStates[LEVEL] = 1;
                }
                localStorage.setItem("levelStates", JSON.stringify(levelStates));
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
                //0 = Not Played, 1 = Not Passed, 2 = Passed without Loss, 3 = Passed with Loss
                if(levelStates[LEVEL] === 0){
                    levelStates[LEVEL] = 2;
                }else if(levelStates[LEVEL] === 1){
                    levelStates[LEVEL] = 3;
                }
                localStorage.setItem("levelStates", JSON.stringify(levelStates));
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

        if(GAMESTATE === "LOSS" || GAMESTATE === "WIN"){
            menuAnimationTimer++;
        }

        ctx.globalAlpha = blackScreen1Opacity;
        //ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);
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
        }else if(GAMESTATE === "MENU"){

            window.onmousemove = logMouseMove;

            var menugraphicY = Math.sin(mainMenuFrameCount);
            mainMenuFrameCount += 0.03;

            gameRunning = false;
            PAUSED = true;
            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);
            ctx.drawImage(titleGame, 0, 0, 1020, 300, WIDTH/2 - WIDTH*0.53125/2, HEIGHT/9 + menugraphicY * 5, WIDTH*0.53125, HEIGHT*0.277);

            ctx.font = '25pt Courier New';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';

            for(var gi = 0; gi < menuButtonWidths.length; gi++){
                if(onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[gi]/2, HEIGHT/2.2 + gi * (HEIGHT/8), (WIDTH/4)*0.85 + menuButtonWidths[gi], HEIGHT/12*0.85)){
                    if(menuButtonWidths[gi] < 96){
                        menuButtonWidths[gi]+=8;
                    }
                }else if(menuButtonWidths[gi] > 0){
                    menuButtonWidths[gi]-=6;
                }

                if(thisFrameClicked === true && onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[gi]/2, HEIGHT/2.2 + gi * (HEIGHT/8), (WIDTH/4)*0.85 + menuButtonWidths[gi], HEIGHT/12*0.85)){
                    console.log(gi);
                    if(gi === 0){
                        stateToTransitionTo = "LEVEL PICK";
                    }else if(gi === 1){
                        stateToTransitionTo = "OPTIONS";
                    }else if(gi === 2){
                        stateToTransitionTo = "ACHIEVEMENTS";
                    }else if(gi === 3){
                        stateToTransitionTo = "GLOSSARY";
                    }
                    menuMouseTimer = 20;
                }
            }

            ctx.drawImage(buttonGUI, 0, 0, 400, 75, WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[0]/2, HEIGHT/2.2, (WIDTH/4)*0.85 + menuButtonWidths[0], HEIGHT/12*0.85);
            ctx.fillText("Play", WIDTH/2, HEIGHT/2.2 + HEIGHT/20);

            ctx.drawImage(buttonGUI, 0, 0, 400, 75, WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[1]/2, HEIGHT/2.2 + HEIGHT/8, WIDTH/4*0.85 + menuButtonWidths[1], HEIGHT/12*0.85);
            ctx.fillText("Options", WIDTH/2, HEIGHT/2.2 + HEIGHT/20 + HEIGHT/8);

            ctx.drawImage(buttonGUI, 0, 0, 400, 75, WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[2]/2, HEIGHT/2.2 + (HEIGHT/8)*2, WIDTH/4*0.85 + menuButtonWidths[2], HEIGHT/12*0.85);
            ctx.fillText("Achievements", WIDTH/2, HEIGHT/2.2 + HEIGHT/20 + (HEIGHT/8)*2);

            ctx.drawImage(buttonGUI, 0, 0, 400, 75, WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + (HEIGHT/8)*3, WIDTH/4*0.85 + menuButtonWidths[3], HEIGHT/12*0.85);
            ctx.fillText("Glossary", WIDTH/2, HEIGHT/2.2 + HEIGHT/20 + (HEIGHT/8)*3);

            ctx.textAlign = 'left';
            ctx.font = '15pt Courier New';
            ctx.fillText("\u00A9" + " 2018 Martin Feranec", WIDTH/60, HEIGHT - HEIGHT/25);
            ctx.font = '10pt Courier New';
            ctx.fillText("All rights reserved", WIDTH/20, HEIGHT - HEIGHT/45);
            ctx.textAlign = 'right';
            ctx.font = '15pt Courier New';
            ctx.fillText("1.7.3", WIDTH - WIDTH/60, HEIGHT - HEIGHT/45);

            thisFrameClicked = false;
        }else if(GAMESTATE === "LEVEL PICK"){

            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

            if(levelSelectors.length < 2){
                for(i = 0; i <= 10; i++){
                    levelSelectors.push(new menuBigButton(i));
                }
            }

            for(var i = 0; i < levelSelectors.length; i++){
                levelSelectors[i].draw();
                levelSelectors[i].update();
            }

            if(onClick(WIDTH/15 - arrowWidths[0]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[0]/2, WIDTH/24 + arrowWidths[0], HEIGHT/6.75 + arrowWidths[0])){
                if(arrowWidths[0] < 16){
                    arrowWidths[0]+=8;
                }
                if(thisFrameClicked === true && menuMouseTimer < 1){
                    if(levelSelectorMenuLevelSelected > 0){
                        levelSelectorMenuLevelSelected--;
                    }
                    menuMouseTimer = 20;
                }
            }else if(arrowWidths[0] > 0){
                arrowWidths[0]-=6;
            }
            if(onClick(WIDTH - WIDTH/15 - WIDTH/24 - arrowWidths[1]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[1]/2, WIDTH/24 + arrowWidths[1], HEIGHT/6.75 + arrowWidths[1])){
                if(arrowWidths[1] < 16){
                    arrowWidths[1]+=8;
                }
                if(thisFrameClicked === true && menuMouseTimer < 1){
                    if(levelSelectorMenuLevelSelected < 10){
                        levelSelectorMenuLevelSelected++;
                    }
                    menuMouseTimer = 20;
                }
            }else if(arrowWidths[1] > 0){
                arrowWidths[1]-=6;
            }

            if(onClick(WIDTH/2 - levelSelectors[levelSelectorMenuLevelSelected].width/2, HEIGHT/2 - HEIGHT*0.1 + levelSelectors[levelSelectorMenuLevelSelected].yOffset - levelSelectors[levelSelectorMenuLevelSelected].width/2,
                    levelSelectors[levelSelectorMenuLevelSelected].width, levelSelectors[levelSelectorMenuLevelSelected].height) && thisFrameClicked === true){
                if(levelSelectors[levelSelectorMenuLevelSelected].level === 0 || (levelStates[levelSelectors[levelSelectorMenuLevelSelected].level - 1] === 2 || levelStates[levelSelectors[levelSelectorMenuLevelSelected].level - 1] === 3)) {
                    LEVEL = levelSelectorMenuLevelSelected;

                    stateToTransitionTo = "GAME";
                }

            }

            if(levelSelectorMenuLevelSelected > 0){
                ctx.drawImage(glossaryGUI, 0, 0, 100, 100, WIDTH/15 - arrowWidths[0]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[0]/2, WIDTH/24 + arrowWidths[0], HEIGHT/6.75 + arrowWidths[0]);
            }
            if(levelSelectorMenuLevelSelected < 10){
                ctx.drawImage(glossaryGUI, 0, 100, 100, 100, WIDTH - WIDTH / 15 - WIDTH / 24 - arrowWidths[1] / 2, HEIGHT / 2 - HEIGHT / 7.75 - arrowWidths[1] / 2, WIDTH / 24 + arrowWidths[1], HEIGHT / 6.75 + arrowWidths[1]);
            }

            if(menuMouseTimer > 0){
                menuMouseTimer--;
            }

        }else if(GAMESTATE === "OPTIONS"){
            ctx.font = '25pt Courier New';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

            ctx.fillText("CheckBox 1", WIDTH/2 + HEIGHT/12, HEIGHT/2.2 + HEIGHT/20 - HEIGHT/8*2);
            ctx.drawImage(checkBoxGUI, 75 * checkBoxValues[0], 0, 75, 75, WIDTH/2 + HEIGHT/12*2, HEIGHT/2.2 + HEIGHT/20 - HEIGHT/8*2 - HEIGHT/18, HEIGHT/12, HEIGHT/12);

            ctx.fillText("CheckBox 2", WIDTH/2 + HEIGHT/12, HEIGHT/2.2 + HEIGHT/20 - HEIGHT/8);
            ctx.drawImage(checkBoxGUI, 75 * checkBoxValues[1], 0, 75, 75, WIDTH/2 + HEIGHT/12*2, HEIGHT/2.2 + HEIGHT/20 - HEIGHT/8 - HEIGHT/18, HEIGHT/12, HEIGHT/12);

            ctx.fillText("CheckBox 3", WIDTH/2 + HEIGHT/12, HEIGHT/2.2 + HEIGHT/20);
            ctx.drawImage(checkBoxGUI, 75 * checkBoxValues[2], 0, 75, 75, WIDTH/2 + HEIGHT/12*2, HEIGHT/2.2 + HEIGHT/20 - HEIGHT/18, HEIGHT/12, HEIGHT/12);

            ctx.textAlign = 'center';
            ctx.font = '18pt Courier New'
            ctx.fillText("(Press F11 to enter full screen mode)", WIDTH/2, HEIGHT/2.2 + HEIGHT/20 + HEIGHT/8);

            for(var hi = -2; hi < checkBoxValues.length - 2; hi++){
                if(thisFrameClicked === true && onClick(WIDTH/2 + HEIGHT/12*2, HEIGHT/2.2 + HEIGHT/20 + HEIGHT/8*hi - HEIGHT/18, HEIGHT/12, HEIGHT/12)){
                    if(menuMouseTimer < 1){
                        if(checkBoxValues[hi+2] === 0){
                            checkBoxValues[hi+2] = 1;
                        }else{
                            checkBoxValues[hi+2] = 0;
                        }
                        menuMouseTimer = 20;
                    }
                }
            }

        }else if(GAMESTATE === "ACHIEVEMENTS"){

            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

        }else if(GAMESTATE === "GLOSSARY"){

            if(onClick(WIDTH/2 - WIDTH/30 - WIDTH*0.2 - bigButtonWidths[0]/2, HEIGHT/2 - WIDTH*0.15 - bigButtonWidths[0]/2, WIDTH*0.2 + bigButtonWidths[0], WIDTH*0.2 + bigButtonWidths[0])){
                if(bigButtonWidths[0] < 48){
                    bigButtonWidths[0]+=8;
                }
                if(thisFrameClicked === true){
                    stateToTransitionTo = "BLOCK GLOSSARY";
                }
            }else if(bigButtonWidths[0] > 0){
                bigButtonWidths[0]-=6;
            }

            if(onClick(WIDTH/2 + WIDTH/30 - bigButtonWidths[1]/2, HEIGHT/2 - WIDTH*0.15 - bigButtonWidths[1]/2, WIDTH*0.2 + bigButtonWidths[1], WIDTH*0.2 + bigButtonWidths[1])){
                if(bigButtonWidths[1] < 48){
                    bigButtonWidths[1]+=8;
                }
                if(thisFrameClicked === true){
                    stateToTransitionTo = "CARD GLOSSARY";
                }
            }else if(bigButtonWidths[1] > 0){
                bigButtonWidths[1]-=6;
            }

            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

            ctx.font = '25pt Courier New';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';

            ctx.drawImage(bigButtonGUI, 0, 0, 400, 400, WIDTH/2 - WIDTH/30 - WIDTH*0.2 - bigButtonWidths[0]/2, HEIGHT/2 - WIDTH*0.15 - bigButtonWidths[0]/2, WIDTH*0.2 + bigButtonWidths[0], WIDTH*0.2 + bigButtonWidths[0]);
            ctx.fillText("Blocks", WIDTH/2 - WIDTH/30 - WIDTH*0.1, HEIGHT/2 + WIDTH*0.03 + bigButtonWidths[0]/2, WIDTH*0.2);
            ctx.drawImage(voxelsG, 0, 0, 299, 400, WIDTH/2 - WIDTH/30 - WIDTH*0.14 - bigButtonWidths[0]/4, HEIGHT/2 - WIDTH*0.14 + bigButtonWidths[0]/4 - bigButtonWidths[0]/2, WIDTH/11.5 + bigButtonWidths[0]/2, HEIGHT/4.6875 + bigButtonWidths[0]/2);

            ctx.drawImage(bigButtonGUI, 0, 0, 400, 400, WIDTH/2 + WIDTH/30 - bigButtonWidths[1]/2, HEIGHT/2 - WIDTH*0.15 - bigButtonWidths[1]/2, WIDTH*0.2 + bigButtonWidths[1], WIDTH*0.2 + bigButtonWidths[1]);
            ctx.fillText("Cards", WIDTH/2 + WIDTH/30 + WIDTH*0.1, HEIGHT/2 + WIDTH*0.03 + bigButtonWidths[1]/2, WIDTH*0.2);
            ctx.drawImage(voxelsGUI, 0, 0, 300, 400, WIDTH/2 + WIDTH/30 + WIDTH*0.1 - WIDTH/24 - bigButtonWidths[1]/4, HEIGHT/2 - WIDTH*0.12 + bigButtonWidths[1]/4 - bigButtonWidths[1]/2, WIDTH/11.5 + bigButtonWidths[1]/2, HEIGHT/4.6875 + bigButtonWidths[1]/2);

        }else if(GAMESTATE === "BLOCK GLOSSARY"){

            if(onClick(WIDTH/15 - arrowWidths[0]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[0]/2, WIDTH/24 + arrowWidths[0], HEIGHT/6.75 + arrowWidths[0])){
                if(arrowWidths[0] < 16){
                    arrowWidths[0]+=8;
                }
                if(thisFrameClicked === true){
                    blockPage = 0;
                }
            }else if(arrowWidths[0] > 0){
                arrowWidths[0]-=6;
            }
            if(onClick(WIDTH - WIDTH/15 - WIDTH/24 - arrowWidths[1]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[1]/2, WIDTH/24 + arrowWidths[1], HEIGHT/6.75 + arrowWidths[1])){
                if(arrowWidths[1] < 16){
                    arrowWidths[1]+=8;
                }
                if(thisFrameClicked === true){
                    blockPage = 1;
                }
            }else if(arrowWidths[1] > 0){
                arrowWidths[1]-=6;
            }

            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

            if(blockPage === 1){
                ctx.drawImage(glossaryGUI, 0, 0, 100, 100, WIDTH/15 - arrowWidths[0]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[0]/2, WIDTH/24 + arrowWidths[0], HEIGHT/6.75 + arrowWidths[0]);
            }else {
                ctx.drawImage(glossaryGUI, 0, 100, 100, 100, WIDTH - WIDTH / 15 - WIDTH / 24 - arrowWidths[1] / 2, HEIGHT / 2 - HEIGHT / 7.75 - arrowWidths[1] / 2, WIDTH / 24 + arrowWidths[1], HEIGHT / 6.75 + arrowWidths[1]);
            }

            if(blockPage === 0){
                ctx.drawImage(glossaryGUI, 100, 0, 1200, 800, WIDTH/2 - WIDTH*0.35, HEIGHT/2 - HEIGHT*0.45, WIDTH *0.7, HEIGHT*0.8);
            }else{
                ctx.drawImage(glossaryGUI, 1300, 0, 1200, 800, WIDTH/2 - WIDTH*0.35, HEIGHT/2 - HEIGHT*0.45, WIDTH *0.7, HEIGHT*0.8);
            }

        }else if(GAMESTATE === "CARD GLOSSARY"){

            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

            if(onClick(WIDTH/15 - arrowWidths[0]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[0]/2, WIDTH/24 + arrowWidths[0], HEIGHT/6.75 + arrowWidths[0])){
                if(arrowWidths[0] < 16){
                    arrowWidths[0]+=8;
                }
                if(thisFrameClicked === true){
                    cardPage = 0;
                }
            }else if(arrowWidths[0] > 0){
                arrowWidths[0]-=6;
            }
            if(onClick(WIDTH - WIDTH/15 - WIDTH/24 - arrowWidths[1]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[1]/2, WIDTH/24 + arrowWidths[1], HEIGHT/6.75 + arrowWidths[1])){
                if(arrowWidths[1] < 16){
                    arrowWidths[1]+=8;
                }
                if(thisFrameClicked === true){
                    cardPage = 1;
                }
            }else if(arrowWidths[1] > 0){
                arrowWidths[1]-=6;
            }

            ctx.drawImage(backGroundGame, 0, 0, 1920, 1080, 0, 0, WIDTH, HEIGHT);

            if(cardPage === 1){
                ctx.drawImage(glossaryGUI, 0, 0, 100, 100, WIDTH/15 - arrowWidths[0]/2, HEIGHT/2 - HEIGHT/7.75 - arrowWidths[0]/2, WIDTH/24 + arrowWidths[0], HEIGHT/6.75 + arrowWidths[0]);
            }else {
                ctx.drawImage(glossaryGUI, 0, 100, 100, 100, WIDTH - WIDTH / 15 - WIDTH / 24 - arrowWidths[1] / 2, HEIGHT / 2 - HEIGHT / 7.75 - arrowWidths[1] / 2, WIDTH / 24 + arrowWidths[1], HEIGHT / 6.75 + arrowWidths[1]);
            }

            if(cardPage === 0){
                ctx.drawImage(glossaryGUI, 100, 800, 1200, 800, WIDTH/2 - WIDTH*0.35, HEIGHT/2 - HEIGHT*0.45, WIDTH *0.7, HEIGHT*0.8);
            }else{
                ctx.drawImage(glossaryGUI, 1300, 800, 1200, 800, WIDTH/2 - WIDTH*0.35, HEIGHT/2 - HEIGHT*0.45, WIDTH *0.7, HEIGHT*0.8);
            }

        }

        if(GAMESTATE !== "GAME" && GAMESTATE !== "LOSS" && GAMESTATE !== "WIN" && GAMESTATE !== "MENU" && GAMESTATE !== "BLOCK GLOSSARY" && GAMESTATE !== "CARD GLOSSARY"){
            if(onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + 3 * (HEIGHT/8), (WIDTH/4)*0.85 + menuButtonWidths[3], HEIGHT/12*0.85)){
                if(menuButtonWidths[3] < 96){
                    menuButtonWidths[3]+=8;
                }
            }else if(menuButtonWidths[3] > 0){
                menuButtonWidths[3]-=6;
            }
            if(thisFrameClicked === true && onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + 3 * (HEIGHT/8), (WIDTH/4)*0.85 + menuButtonWidths[3], HEIGHT/12*0.85)){
                stateToTransitionTo = "MENU";
            }
            ctx.font = '25pt Courier New';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';

            ctx.drawImage(buttonGUI, 0, 0, 400, 75, WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + (HEIGHT/8)*3, WIDTH/4*0.85 + menuButtonWidths[3], HEIGHT/12*0.85);
            ctx.fillText("Back", WIDTH/2, HEIGHT/2.2 + HEIGHT/20 + (HEIGHT/8)*3);
        }else if( GAMESTATE === "BLOCK GLOSSARY" || GAMESTATE === "CARD GLOSSARY"){

            if(onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + 3 * (HEIGHT/8) + HEIGHT/24, (WIDTH/4)*0.85 + menuButtonWidths[3], HEIGHT/12*0.85)){
                if(menuButtonWidths[3] < 96){
                    menuButtonWidths[3]+=8;
                }
            }else if(menuButtonWidths[3] > 0){
                menuButtonWidths[3]-=6;
            }
            if(thisFrameClicked === true && onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + 3 * (HEIGHT/8) + HEIGHT/24, (WIDTH/4)*0.85 + menuButtonWidths[3], HEIGHT/12*0.85)){
                stateToTransitionTo = "GLOSSARY";
            }
            ctx.font = '25pt Courier New';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';

            ctx.drawImage(buttonGUI, 0, 0, 400, 75, WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + (HEIGHT/8)*3  + HEIGHT/24, WIDTH/4*0.85 + menuButtonWidths[3], HEIGHT/12*0.85);
            ctx.fillText("Back", WIDTH/2, HEIGHT/2.2 + HEIGHT/20 + (HEIGHT/8)*3 + HEIGHT/24);

        }else if((GAMESTATE === "WIN" || GAMESTATE === "LOSS") && endGameYearReached === YEAR){

            if(onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + 3 * (HEIGHT/8) + HEIGHT/24, (WIDTH/4)*0.85 + menuButtonWidths[3], HEIGHT/12*0.85)){
                if(menuButtonWidths[3] < 96){
                    menuButtonWidths[3]+=8;
                }
            }else if(menuButtonWidths[3] > 0){
                menuButtonWidths[3]-=6;
            }
            if(thisFrameClicked === true && onClick(WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + 3 * (HEIGHT/8) + HEIGHT/24, (WIDTH/4)*0.85 + menuButtonWidths[3], HEIGHT/12*0.85)){
                stateToTransitionTo = "LEVEL PICK";
            }
            ctx.font = '25pt Courier New';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';

            ctx.drawImage(buttonGUI, 0, 0, 400, 75, WIDTH/2 - (WIDTH/8*0.85) - menuButtonWidths[3]/2, HEIGHT/2.2 + (HEIGHT/8)*3  + HEIGHT/24, WIDTH/4*0.85 + menuButtonWidths[3], HEIGHT/12*0.85);
            ctx.fillText("Levels", WIDTH/2, HEIGHT/2.2 + HEIGHT/20 + (HEIGHT/8)*3 + HEIGHT/24);

        }

        if(GAMESTATE !== "GAME"){
            if(menuMouseTimer > 0){
                menuMouseTimer--;
            }
        }

        if(stateToTransitionTo !== ""){
            if(transitionBlackOpacity < 0.98){
                transitionBlackOpacity += 0.02
            }else{
                GAMESTATE = stateToTransitionTo;
                if(stateToTransitionTo === "GAME"){
                    PAUSED = false;
                    loadGame();
                }else{
                    PAUSED = true;
                }
                stateToTransitionTo = "";
            }
        }else{
            if(transitionBlackOpacity > 0.02){
                transitionBlackOpacity -= 0.02;
            }
        }

        ctx.globalAlpha = transitionBlackOpacity;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;

    }

    if (keys && keys[32]) {
        if(buttonTimers[1] < 1 && gameRunning === true){
            if(PAUSED === true && tutorialShowing === false){
                secondTimers[0] = 62;
                PAUSED = false;
            }else if(LEVEL !== 0 || (LEVEL === 0 && POINTS >= 1)){
                PAUSED = true;
            }
            buttonTimers[1] = 20;
        }
    }

    if(buttonTimers[1] > 0){
        buttonTimers[1]--;
    }

    if(PAUSED === true && gameRunning === true && endGameTimer === 0 && tutorialShowing === false && TUTORIALPAUSED === false){
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = '20pt Courier New';
        ctx.fillText("Paused", WIDTH - WIDTH/30, HEIGHT - HEIGHT / 30);
    }


    if(gameRunning === true){
        if(tutorialShowing === false && LEVEL === 0 && tutorialSeen === false){
            if((TEMPPOINTS === 3 || TEMPPOINTS === 4 || TEMPPOINTS === 6 || TEMPPOINTS === 7
                || TEMPPOINTS === 11 || TEMPPOINTS === 13 || TEMPPOINTS === 14
                || TEMPPOINTS === 15) && tutorialSeparationTimer < 1){
                tutorialShowing = true;
                PAUSED = true;
            }
        }

        if(tutorialShowing === true){
            console.log("Tutorial!");
            ctx.fillStyle = "rgba(10, 10, 10, 0.8)";
            ctx.fillRect(WIDTH/2 - WIDTH/6, HEIGHT/2 - HEIGHT/6 - WIDTH/64*(tutorial[tutorialPage].length/2), WIDTH/3, HEIGHT/3 + WIDTH/64*(tutorial[tutorialPage].length));
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.font = '18px Courier New';
            for(var i = 0; i < tutorial[tutorialPage].length; i++){
                ctx.fillText(tutorial[tutorialPage][i], WIDTH/2, HEIGHT/2 - WIDTH/64*(tutorial[tutorialPage].length/2) + i*HEIGHT/32);
            }
            ctx.textAlign = 'center';
            if(onClick(WIDTH/2 - WIDTH/32, HEIGHT/2 - WIDTH/64*(tutorial[tutorialPage].length/2) - WIDTH/64*(tutorial[tutorialPage].length/2) + (tutorial[tutorialPage].length + 2)*HEIGHT/32 - HEIGHT/64, WIDTH/16, HEIGHT/32)){
                ctx.fillStyle = 'rgb(200, 200, 255)';
                if(thisFrameClicked === true && tutorialMouseTimer === 0){
                    tempMouseTimer = 10;
                    if(tutorialPage !== 8){
                        tutorialShowing = false;
                        PAUSED = false;
                    }
                    if(tutorialPage !== 8){
                        tutorialPage++;
                    }else{
                        TUTORIALPAUSED = true;
                        PAUSED = false;
                        if(cardSelected === 1 || cardSelected === 2){
                            tutorialPage++;
                        }
                    }
                    tutorialMouseTimer = 20;
                    tempMouseTimer = 20;
                    clickSelected = [];
                    if(tutorialPage !== 3 && tutorialPage !== 7){
                        tutorialSeparationTimer = 61;
                    }
                }
            }else{
                ctx.fillStyle = 'rgb(150, 150, 150)';
            }
            ctx.fillText("Next", WIDTH/2 , HEIGHT/2 - WIDTH/64*(tutorial[tutorialPage].length/2) - WIDTH/64*(tutorial[tutorialPage].length/2) + (tutorial[tutorialPage].length + 2)*HEIGHT/32);
        }

        if(tutorialMouseTimer > 0){
            tutorialMouseTimer--;
        }
        if(tutorialSeparationTimer > 0){
            tutorialSeparationTimer--;
        }
    }
    var tempCanvas = document.getElementById("myCanvas");

    if(fullScreenTimer > 0){
        fullScreenTimer--;
    }

    if(popUpTimer > 0){
        popUpTimer--;
        popUpOpacity = 1
    }
    if(popUpOpacity > 0.01){
        popUpOpacity -= 0.01;
        ctx.globalAlpha = popUpOpacity;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, HEIGHT/2 - HEIGHT/16, WIDTH, HEIGHT/8);
        ctx.textAlign = 'center';
        ctx.font = '25pt Courier New';
        ctx.fillStyle = 'white';
        ctx.fillText("Press F11 to exit full screen mode.", WIDTH/2, HEIGHT/2);
        ctx.globalAlpha = 1;
    }
    var height = document.documentElement.clientHeight;

    if (height === screen.height && FULLSCREEN === false) {
        popUpTimer = 100;
        unloadScrollBars();
        tempCanvas.width = document.body.clientWidth;
        tempCanvas.height = tempCanvas.width*0.5625;
        WIDTH = tempCanvas.width;
        HEIGHT = tempCanvas.height;
        document.getElementById("canvasHolder").style.position = "absolute";
        document.getElementById("canvasHolder").style.left = '0px';
        document.getElementById("canvasHolder").style.top = '0px';
        document.getElementById("canvasHolder").style.border ='0px solid lightgray';
        if(document.getElementById("foo-pop") !== null) {
            document.getElementById("foo-pop").setAttribute('hidden', true);
            document.getElementById("foo-boring").setAttribute('hidden', true);
        }
        FULLSCREEN = true;
    }

    if (height !== screen.height && FULLSCREEN === true) {
        reloadScrollBars();
        tempCanvas.width = 1200;
        tempCanvas.height = 675;
        WIDTH = tempCanvas.width;
        HEIGHT = tempCanvas.height;
        document.getElementById("canvasHolder").style.position = "relative";
        document.getElementById("canvasHolder").style.border ='3px solid lightgray';
        if(document.getElementById("foo-pop") !== null){
            document.getElementById("foo-pop").removeAttribute('hidden');
            document.getElementById("foo-boring").removeAttribute('hidden');
        }
        FULLSCREEN = false;
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

    if([32, 37, 38, 39, 40, 114, 112].indexOf(e.keyCode) > -1) {
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


// ---------------------------------------------------------- GAME LOOP ------------------------------------------------------------------------ //

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}


function loadPage() {
    setTimeout(function(){ showPage()}, 2000);
}

function showPage() {
    document.getElementById("loader").className += "fading";
    setTimeout(function(){ deleteLoader()}, 100);
    requestAnimationFrame(repeatOften);
}

function deleteLoader(){
    document.getElementById("loader").setAttribute('hidden', true);
}

loadPage();

function reloadScrollBars() {
    document.documentElement.style.overflow = 'auto';  // firefox, chrome
    document.body.scroll = "yes"; // ie only
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}