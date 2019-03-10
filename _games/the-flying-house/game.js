//-----------------------------------------------------------------------------------------------------

//
// Copyright (c) Martin Feranec 2019 - All Rights Reserved
//

//-----------------------------------------------------------------------------------------------------


//TODO - Add link to webpage once there is one: something like this: location.href = 'http://www.google.com';

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = 1152;
var HEIGHT = 648;

var mousePosX = 0;
var mousePosY = 0;
var clickTimer = 0;

var stateToTransitionTo = "";
var transitionOpacity = 0;

var pauseOpacity = 0;

var gamePlayed = false;

var Lvl1Fg = [
    [88, 88, 88, 88, 88, 88, 12, 14, 14, 14, 13, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 12, 14, 14, 14, 14, 14, 13, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 12, 14, 14, 16, 88, 17, 14, 14, 13, 88, 88, 88, 88],
    [88, 88, 88, 12, 14, 14, 16, 88, 88, 88, 17, 14, 14, 13, 88, 88, 88],
    [88, 88, 12, 14, 14, 16, 88, 88, 88, 88, 88, 17, 14, 14, 13, 88, 88],
    [88, 12, 14, 14, 16, 88, 88, 88, 88, 88, 88, 88, 17, 14, 14, 13, 88],
    [12, 14, 14, 14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 14, 14, 14, 13],
    [15, 15, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 15, 15],
    [88, 88, 88, 88, 88, 27, 27, 88, 77, 88, 88, 88, 29, 88, 88, 88, 88],
    [88, 88, 66, 88, 66, 28, 28, 88, 11, 88, 88, 66, 30, 66, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 27, 27, 88, 88, 88, 88, 88],
    [88, 88, 88, 77, 31, 32, 33, 88, 11, 88, 28, 28, 88, 77, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10, 88],
    [88, 88, 88, 88, 88, 27, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 41, 77, 88, 28, 30, 88, 11, 38, 39, 40, 34, 77, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 88]
];

var Lvl1Bg = [
    [88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 25, 25, 25, 25, 25, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 25, 25, 25, 26, 25, 25, 25, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88, 88],
    [88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88],
    [88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [99, 42, 42, 26, 26, 26, 42, 42, 42, 42, 42, 26, 26, 26, 42, 42, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [99, 42, 42, 26, 26, 26, 42, 42, 42, 42, 42, 26, 26, 26, 42, 42, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88]
];

var Lvl2Fg = [
    [88, 88, 88, 88, 12, 14, 13, 88, 88, 88, 88],
    [88, 88, 88, 12, 14, 14, 14, 13, 88, 88, 88],
    [88, 88, 12, 14, 14, 88, 14, 14, 13, 88, 88],
    [88, 88, 14, 14, 14, 88, 14, 14, 14, 88, 88],
    [88, 12, 14, 14, 14, 88, 14, 14, 14, 13, 88],
    [88, 15, 15, 15, 15, 15, 15, 15, 15, 15, 88],
    [88, 88, 27, 27, 88, 88, 88, 88, 27, 88, 88],
    [88, 88, 28, 28, 66, 88, 66, 11, 28, 88, 88],
    [88, 43, 43, 43, 43, 43, 43, 11, 43, 43, 88],
    [88, 43, 88, 88, 88, 88, 88, 11, 88, 43, 88],
    [88, 88, 88, 27, 88, 88, 88, 11, 88, 88, 88],
    [88, 88, 77, 28, 66, 88, 66, 11, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 11, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 11, 88, 10, 88],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88],
    [88, 88, 31, 32, 33, 77, 88, 11, 88, 41, 88],
    [88, 10, 10, 10, 10, 10, 10, 11, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 11, 88, 10, 88],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88],
    [88, 77, 39, 40, 34, 88, 88, 11, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 11, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 11, 88, 10, 88],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88],
    [88, 88, 35, 36, 37, 88, 77, 11, 88, 41, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 10, 10, 88]
];

var Lvl2Bg = [
    [88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 26, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 26, 26, 26, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 26, 88, 88, 88, 88, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 42, 42, 26, 42, 26, 42, 42, 42, 42, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [99, 42, 42, 26, 42, 26, 42, 42, 42, 42, 88],
    [88, 25, 25, 26, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [99, 42, 42, 26, 42, 26, 42, 42, 42, 42, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [99, 42, 42, 26, 42, 26, 42, 42, 42, 42, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88]
];

var Lvl3Fg = [
    [88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 11, 88, 88, 88, 88],
    [88, 43, 43, 43, 11, 43, 43, 43, 88],
    [88, 43, 88, 88, 11, 88, 88, 43, 88],
    [88, 88, 88, 88, 11, 88, 88, 88, 88],
    [88, 88, 66, 66, 11, 66, 66, 88, 88],
    [88, 43, 43, 43, 11, 43, 43, 43, 88],
    [88, 43, 88, 88, 11, 88, 88, 43, 88],
    [88, 88, 88, 88, 11, 88, 88, 88, 88],
    [88, 88, 88, 88, 11, 88, 88, 41, 88],
    [88, 43, 43, 43, 11, 43, 43, 43, 88],
    [88, 43, 88, 88, 11, 88, 88, 43, 88],
    [88, 88, 88, 88, 11, 88, 88, 88, 88],
    [88, 77, 39, 40, 11, 88, 88, 88, 88],
    [88, 43, 43, 43, 43, 43, 43, 43, 88]
];

var Lvl3Bg = [
    [88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 44, 88, 44, 88, 44, 88, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [99, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [99, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88],
    [88, 44, 44, 44, 44, 44, 44, 44, 88]
];


var playerInfos = [];

var map = Lvl2Fg.slice();
var backgroundMap = Lvl2Bg.slice();

var breakPoints = 0;
for(var i = 0; i < backgroundMap.length; i++){
    for(var j = 0; j < backgroundMap[0].length; j++){
        if(backgroundMap[i][j] === 99){
            breakPoints++;
        }
    }
}

var breakingApartFg = [];
var breakingApartBg = [];

var amountOfBreaks = 0;

var updateTimesPerTick = 1;

var playedRounds = 0;

var FULLSCREEN = false;
var fullScreenTimer = 0;
var popUpTimer = 0;
var popUpOpacity = 0;

var leftPanelOptionsWidth = WIDTH/4;
var leftPanelOptionsHeight = HEIGHT/2;
var leftPanelOptionsY = (HEIGHT - leftPanelOptionsHeight)/2;
var leftPanelOptionsX = -leftPanelOptionsWidth;
var optionsOpen = false;

var leftPanelCreditsWidth = WIDTH/4;
var leftPanelCreditsHeight = HEIGHT/2;
var leftPanelCreditsY = (HEIGHT - leftPanelOptionsHeight)/2;
var leftPanelCreditsX = -leftPanelOptionsWidth;
var creditsOpen = false;

var dragging = false;
var draggingSlider = false;

var globalVolume = 1;

var customGame = false;

/*
GUIDE TO TILE TYPES:

10 -> Wall (rewrite wallTexture to get different wall textures)

11 -> Ladder

12 - Left Roof
13 - Right Roof
14 - Full Block Roof
15 - Bottom Roof

16 - Upside Down Triangle Left
17 - Upside Down Triangle Right

25 - Wood
26 - Window 1

27 - Shelf Top
28 - Shelf Bottom

29 - Picture

30 - Small Table

31 -> Left Couch
32 -> Middle Couch
33 -> Right Couch

34 -> Seat Facing Left
38 -> Seat Facing Right

39 -> Table Left
40 -> Table Right

41 -> Plant 1

35 -> Left Table
36 -> Middle Table
37 -> Right Table

42 -> Rotated Wooden BackGround

43 -> Rock
44 -> Rock Bg

66 -> SpawnPoint
77 -> Spawner of Weapons
88 -> Empty
99 -> Break Point

 */

var tileMap = new Image();
tileMap.src = "Flying-House.png";

var tileSize;

var mapId = 2;

var tiles = [];
var players = [];
var bullets = [];
var balloons = [];
var playerStatBoxes = [];
var fallingTiles = [];
var effects = [];
var rainParticles = [];
var lightningBolts = [];
var clouds = [];
var aiBots = [];
var buttons = [];

var lightningBoltFlashOpacity = 0;

var powerUpSpawned = false;
var powerUpsSpawn = true;

var fallApartTime = 1800; //1800
var fallApartTimer = 0;

var collidableBlocks = [10, 12, 13, 14, 43, 15];

tileSize = Math.round((HEIGHT - HEIGHT/10) / map.length);

var xOffset = Math.round(WIDTH/2 - (tileSize*map[0].length)/2);
var yOffset = Math.round(HEIGHT/2 - (tileSize*map.length)/2);

var cameraGlobalX = 0;
var cameraGlobalY = 0;

var cameraGlobalYOffset = 0;
var cameraZoom = 1;
var cameraYWindOffset = 0;
var cameraYWindOffsetVel = 0;

var moveSpeed = tileSize/12;
var bulletSpeed = tileSize/6;

var GAMESTATE = "MENU";
var PAUSED = false;

var lightDetailLevel = 10;
var lightingPercision = 0.2;

var maxRainParticles = 100; //100 is good
var weatherSwitchTime = 1200; //1200
var upperrainCoefficient = 0.8; // 0.8
var lowerrainCoefficient = 0; // 0

var GlobalLives = 3;

var rainOpacity = 0;

var updateSpeed = 2; //Must be bigger than 0, should be 5

var rainCurrent = 0;

var teamPoints = [0, 0, 0, 0];
var playerPoints = [0, 0, 0, 0];
var playerAccuracy = [0, 0, 0, 0];
var playerKills = [0, 0, 0, 0];

var livesCanSpawn = true;
var potatoLauncherChance = 0.2;
var heartChance = 0.2;

var pauseTimer = 0;

repeatOften(); //Starts Game

function Tile(x, y, width, height, type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    this.spawnPointId = 0;

    this.powerUpActive = false;
    this.spawnPeriod = 900 + (Math.random()*500 - 250);
    this.spawnTimer = 0;

    this.cameraX = 0;
    this.cameraY = 0;

    this.imageX = 0;
    this.imageY = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;

    if(this.type !== 11 && this.type !== 10 && this.type !== 12 && this.type !== 13 && this.type !== 14 && this.type !== 15 &&
        this.type !== 16 && this.type !== 17 && this.type !== 77 && this.type !== 99 && this.type !== 27 && this.type !== 28
        && this.type !== 31 && this.type !== 32 && this.type !== 33 && this.type !== 35 && this.type !== 36 && this.type !== 37
        && this.type !== 34 && this.type !== 38 && this.type !== 39 && this.type !== 40 && this.type !== 43){
        this.lightLevel = 0.8;
    }else if(this.type === 10 || this.type === 14 || this.type === 16 || this.type === 17 || this.type === 77 || this.type === 43){
        this.lightLevel = Math.random()/4;
    }else if(this.type === 12 || this.type === 13 || this.type === 99 || this.type === 15){
        this.lightLevel = 0;
    }else if(this.type === 27 || this.type === 28 || this.type === 34 || this.type === 38){
        this.lightLevel = 0.2;
    }else if(this.type === 31|| this.type === 32){
        this.lightLevel = 0.1;
    }else{
        this.lightLevel = 0.5;
    }

    if(this.type !== 10 && this.type !== 12 && this.type !== 88){
        if(lightDetailLevel > 1){
            if(Math.round((this.x-xOffset)/tileSize) === 1){
                this.lightLevel = 0.3;
            }else if(Math.round((this.x-xOffset)/tileSize) === map[0].length - 2){
                this.lightLevel = 0;
            }
        }
    }

    this.screenHalfWidth = Math.round(WIDTH/2);
    this.screenHalfHeight = Math.round(HEIGHT/2);

    if(this.type === 10){
        this.imageX = 0;
        this.imageY = 0;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 11){
        this.imageX = 128;
        this.imageY = 0;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 12){
        this.imageX = 0;
        this.imageY = 64;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 13){
        this.imageX = 64;
        this.imageY = 64;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 14){
        this.imageX = 0;
        this.imageY = 128;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 15){
        this.imageX = 64;
        this.imageY = 128;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 16){
        this.imageX = 0;
        this.imageY = 192;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 17){
        this.imageX = 64;
        this.imageY = 192;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 25){
        this.imageX = 64;
        this.imageY = 0;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 26){
        this.imageX = 128;
        this.imageY = 64;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 27){
        this.imageX = 128;
        this.imageY = 208;
        this.imageWidth = 64;
        this.imageHeight = 48;
    }else if(this.type === 28){
        this.imageX = 128;
        this.imageY = 256;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 29){
        this.imageX = 0;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 30){
        this.imageX = 64;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 31){
        this.imageX = 128;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 32){
        this.imageX = 192;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 33){
        this.imageX = 256;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 34){
        this.imageX = 512;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 35){
        this.imageX = 320;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 36){
        this.imageX = 384;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 37){
        this.imageX = 448;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 38){
        this.imageX = 576;
        this.imageY = 320;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 39){
        this.imageX = 512;
        this.imageY = 256;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 40){
        this.imageX = 576;
        this.imageY = 256;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 41){
        this.imageX = 448;
        this.imageY = 256;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 42){
        this.imageX = 384;
        this.imageY = 256;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 43){
        this.imageX = 384;
        this.imageY = 192;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 44){
        this.imageX = 448;
        this.imageY = 192;
        this.imageWidth = 64;
        this.imageHeight = 64;
    }else if(this.type === 77){
        this.imageX = 128;
        this.imageY = 168;
        this.imageWidth = 40;
        this.imageHeight = 40;
    }

    this.tilePosX = Math.round(this.x-xOffset)/tileSize;
    this.tilePosY = Math.round(this.y-yOffset)/tileSize;


    this.upperRightCurve = 0;
    this.bottomRightCurve = 0;
    this.bottomLeftCurve = 0;
    this.upperLeftCurve = 0;

    this.mouseHover = false;

    this.curved = false;

    this.aiPicked = false;

    if((this.type === 10 || this.type === 25) && gameTicks < 50){
        //console.log("Here");
        if(this.type === 10 || this.type === 43){
            if(this.tilePosX > 0 && this.tilePosX < map[0].length){
                if(map[this.tilePosY][this.tilePosX - 1] !== this.type){
                    if(this.tilePosY > 0){
                        if(map[this.tilePosY - 1][this.tilePosX] !== this.type) {
                            this.upperLeftCurve = 2;
                            this.curved = true;
                        }
                    }
                    if(this.tilePosY < map.length - 1){
                        if(map[this.tilePosY + 1][this.tilePosX] !== this.type) {
                            this.bottomLeftCurve = 2;
                            this.curved = true;
                        }
                    }else{
                        this.bottomLeftCurve = 2;
                        this.curved = true;
                    }
                }
                if(map[this.tilePosY][this.tilePosX + 1] !== this.type){
                    if(this.tilePosY < map.length - 1){
                        if(map[this.tilePosY - 1][this.tilePosX] !== this.type) {
                            this.upperRightCurve = 2;
                            this.curved = true;
                        }
                    }
                    if(this.tilePosY < map.length - 1){
                        if(map[this.tilePosY + 1][this.tilePosX] !== this.type) {
                            this.bottomRightCurve = 2;
                            this.curved = true;
                        }
                    }else{
                        this.bottomRightCurve = 2;
                        this.curved = true;
                    }
                }
            }
        }

    }

    this.update = function(){
        this.cameraX = ((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = ((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);

        if(this.type === 77 && this.powerUpActive === false && powerUpSpawned === false){
            if(this.spawnTimer < this.spawnPeriod && GAMESTATE === "GAME"){
                this.spawnTimer++;
            }else if(GAMESTATE === "GAME"){
                this.powerUpActive = true;
                powerUpSpawned = true;
                effects.push(new Explosion(this.x + tileSize/2, this.y + tileSize/1.5, 0));
            }
        }
        if(GAMESTATE === "GAME SETUP" && this.type === 66 && (players.length >= this.spawnPointId)){
            if(mousePosY > this.cameraY - tileSize + tileSize/6 + cameraGlobalY && mousePosY <  this.cameraY - tileSize - tileSize/6 + cameraGlobalY + this.height){
                if(mousePosX > this.cameraX + cameraGlobalX + tileSize/6 && mousePosX < this.cameraX + this.width + cameraGlobalX - tileSize/6){
                    if(clickTimer === 0){
                        this.aiPicked = !this.aiPicked;
                        //console.log(this.spawnPointId);
                        playerInfos[this.spawnPointId - 2][1] = this.aiPicked;
                        clickSound.play();
                        //clickTimer = 1;
                    }
                }
            }
        }
        if(GAMESTATE === "GAME SETUP" && (players.length === this.spawnPointId - 1)){
            if(mousePosY > this.cameraY + cameraGlobalY + tileSize/6 && mousePosY < this.cameraY + cameraGlobalY + this.height - tileSize/6){
                if(mousePosX > this.cameraX + cameraGlobalX + tileSize/6 && mousePosX < this.cameraX + this.width + cameraGlobalX - tileSize/6){
                    this.mouseHover = true;
                    if(clickTimer === 0){
                        players.push(new Player(players.length, this.aiPicked, players.length));
                        playerInfos.push([players.length - 1, this.aiPicked, players.length - 1]);
                        clickSound.play();
                        clickTimer = 1;
                    }
                }else{
                    this.mouseHover = false;
                }
            }else{
                this.mouseHover = false;
            }
        }
    };
    this.draw = function(){
        if(this.type !== 77){
            if(this.curved === false){
                ctx.drawImage(tileMap, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
            }else{
                ctx.save();
                ctx.roundRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom, {upperLeft:this.upperLeftCurve,upperRight:this.upperRightCurve,lowerLeft:this.bottomLeftCurve,lowerRight:this.bottomRightCurve}, true, false);
                ctx.clip();
                ctx.drawImage(tileMap, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
                ctx.restore();
                //ctx.drawImage(tileMap, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
            }
            if(this.type === 66 && GAMESTATE === "GAME SETUP"){
                if((players.length === this.spawnPointId - 1)){
                    ctx.globalAlpha = 0.5;
                    if(this.mouseHover === false){
                        ctx.fillStyle = 'rgb(72, 196, 41)';
                    }else{
                        ctx.fillStyle = 'rgb(109, 237, 78)';
                    }
                    ctx.fillRect(this.cameraX + tileSize/6 + cameraGlobalX, this.cameraY + tileSize/6 + cameraGlobalY, this.width - tileSize/3, this.height - tileSize/3);
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = 'rgb(24, 86, 9)';
                    ctx.textAlign = 'center';
                    ctx.font = parseInt(tileSize) + "px Arial";
                    ctx.fillText("+", this.cameraX + this.width/2 + cameraGlobalX, this.cameraY + this.height - tileSize/8 + cameraGlobalY);
                }

                if((players.length >= this.spawnPointId) && this.spawnPointId !== 1){
                    ctx.globalAlpha = 0.5;
                    if(this.aiPicked === false){
                        ctx.fillStyle = 'rgb(237, 109, 78)';
                    }else{
                        ctx.fillStyle = 'rgb(72, 196, 41)';
                    }
                    ctx.fillRect(this.cameraX + tileSize/6 + cameraGlobalX, this.cameraY - tileSize + tileSize/6 + cameraGlobalY, this.width - tileSize/3, this.height - tileSize/3);
                    ctx.globalAlpha = 1;
                    if(this.aiPicked === false){
                        ctx.fillStyle = 'rgb(196, 109, 78)';
                    }else{
                        ctx.fillStyle = 'rgb(72, 196, 41)';
                    }
                    ctx.textAlign = 'center';
                    ctx.font = parseInt(tileSize/2) + "px Arial";
                    ctx.fillText("AI", this.cameraX + this.width/2 + cameraGlobalX, this.cameraY - tileSize*1.2 + this.height - tileSize/8 + cameraGlobalY);
                }

            }
        }else{
            if(this.powerUpActive === true){
                ctx.drawImage(tileMap, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.cameraX + this.width/8 + cameraGlobalX, this.cameraY + cameraGlobalY + this.height/16*5, this.width/8*6*cameraZoom, this.height/8*6*cameraZoom);
            }
        }
        ctx.globalAlpha = this.lightLevel/4*3;
        ctx.fillStyle = 'black';
        ctx.fillRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
        ctx.globalAlpha = 1;
    };
}

function Bullet(x, y, type, team, shooter){
    this.velY = 0;
    this.velX = 0;
    this.type = type;
    this.team = team;
    this.shooter = shooter;

    this.knockBack = 0;

    if(this.type === 0){
        this.velY = 0;
        this.velX = bulletSpeed;
        this.knockBack = bulletSpeed*2;
        this.width = tileSize/4;
        this.height = tileSize/4;
    }else if(this.type === 1){
        this.velY = 0;
        this.velX = -bulletSpeed;
        this.knockBack = -bulletSpeed*2;
        this.width = tileSize/4;
        this.height = tileSize/4;
    }else if(this.type === 2){
        this.velY = 0;
        this.velX = bulletSpeed*1.5;
        this.knockBack = bulletSpeed*3;
        this.width = tileSize/2;
        this.height = tileSize/2/3*2;
    }else if(this.type === 3){
        this.velY = 0;
        this.velX = -bulletSpeed*1.5;
        this.knockBack = -bulletSpeed*3;
        this.width = tileSize/2;
        this.height = tileSize/2/3*2;
    }else if(this.type === 4){
        this.velY = 0;
        this.velX = bulletSpeed*2;
        this.knockBack = bulletSpeed*5;
        this.width = tileSize/2.5;
        this.height = tileSize/2.5;
    }else if(this.type === 5){
        this.velY = 0;
        this.velX = -bulletSpeed*2;
        this.knockBack = -bulletSpeed*5;
        this.width = tileSize/2.5;
        this.height = tileSize/2.5;
    }

    this.x = x;
    this.y = y;

    this.frame = 0;

    this.screenHalfWidth = Math.round(WIDTH/2);
    this.screenHalfHeight = Math.round(HEIGHT/2);

    this.update = function(){
        this.x += this.velX;
        this.y += this.velY;

        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.height/2 - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);

        if(this.frame < 2 && gameTicks % 10 === 0){
            this.frame++;
        }else if(this.frame === 2){
            this.frame = 0;
        }
    };

    this.draw = function(){
        ctx.fillStyle = 'black';
        //ctx.fillRect(this.cameraX, this.cameraY, this.width * cameraZoom, this.height * cameraZoom);
        if(this.type === 0 || this.type === 1){
            ctx.drawImage(tileMap, 128 + this.frame*24, 128, 24, 24, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width * cameraZoom, this.height * cameraZoom);
        }else if(this.type === 2){
            ctx.drawImage(tileMap, 152, 152, 24, 14, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width * cameraZoom, this.height * cameraZoom);
        }else if(this.type === 3){
            ctx.drawImage(tileMap, 128, 152, 24, 14, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width * cameraZoom, this.height * cameraZoom);
        }else if(this.type === 5 || this.type === 4){
            ctx.drawImage(tileMap, 168, 168, 24, 18, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width * cameraZoom, this.height * cameraZoom);
        }

    };

}

function Balloon(x, y, tiltedX){

    this.x = x;
    this.y = y;

    this.tiltedX = tiltedX;

    this.cameraX = 0;
    this.cameraY = 0;

    this.yFloat = tileSize*6;

    this.screenHalfWidth = WIDTH/2;
    this.screenHalfHeight = HEIGHT/2;

    this.ballooncameraX = 0;
    this.ballooncameraY = 0;

    this.draw = function(){
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        for(var i = 0 ; i < 3; i++){
            ctx.beginPath();
            ctx.moveTo(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY);
            ctx.lineTo(this.cameraX + cameraGlobalX - 30*cameraZoom + i*30*cameraZoom, this.cameraY + cameraGlobalY - this.yFloat*cameraZoom);
            ctx.stroke();
        }

        if(this.x > WIDTH/2 - tileSize && this.x < WIDTH/2 + tileSize){
            for(var i = 0; i < 3; i++){
                ctx.drawImage(tileMap, 192, 0, 192, 256, this.ballooncameraX - tileSize*cameraZoom + tileSize*cameraZoom*i, this.ballooncameraY + cameraGlobalY - tileSize, tileSize*7*cameraZoom, tileSize*10*cameraZoom);
            }
        }else{
            ctx.drawImage(tileMap, 192, 0, 192, 256, this.ballooncameraX, this.ballooncameraY + cameraGlobalY, tileSize*6*cameraZoom, tileSize*8*cameraZoom);
        }
    };
    this.update = function(){
        if(tempTicks % (updateSpeed*10) === 0){
            this.yFloat += Math.round(Math.random()*3 - 1.5);

            if(this.yFloat > tileSize*6.5){
                this.yFloat =  tileSize*6.5;
            }else if(this.yFloat < tileSize*5.5){
                this.yFloat =  tileSize*5.5;
            }
        }

        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);

        this.ballooncameraX = Math.round((this.x - this.screenHalfWidth - tileSize*3) * cameraZoom + this.screenHalfWidth);
        this.ballooncameraY = Math.round((this.y - this.screenHalfHeight - this.yFloat*2) * cameraZoom + this.screenHalfHeight);
    };
}

function Player(id, ai, team){

    this.id = id;
    this.ai = ai;
    this.team = team;

    if(this.id === 0){
        this.name = "Blue";
    }else if(this.id === 1){
        this.name = "Red";
    }else if(this.id === 2){
        this.name = "Green";
    }else if(this.id === 3){
        this.name = "Yellow";
    }

    this.hitAmount = 0;
    this.totalShots = 0;

    this.tempCauseOfDeath = "Slipped Off";

    this.spawnPlacesFound = 0;

    this.width = tileSize/2;
    this.height = tileSize;

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[0].length; j++){
            if(map[i][j] === 66){
                this.spawnPlacesFound++;
                if(this.spawnPlacesFound === this.id + 1){
                    this.x = j*tileSize + xOffset + this.width/2;
                    this.y = i*tileSize + yOffset;
                }
            }
        }
    }

    this.lives = GlobalLives;

    this.spawnX = this.x;
    this.spawnY = this.y;

    this.reloadSpeed = 20;
    this.reloadTimer = 0;

    this.cameraX = 0;
    this.cameraY = 0;

    this.visible = true;
    this.opacity = 1;

    this.screenHalfWidth = Math.round(WIDTH/2);
    this.screenHalfHeight = Math.round(HEIGHT/2);

    this.xVel = 0;
    this.yVel = 0;

    this.actualXVel = 0;
    this.actualYVel = 0;

    this.tilePosXLeft = 0;
    this.tilePosXRight = 0;
    this.tilePosY = 0;

    this.gravity = 0.10;

    this.facing = 1;

    this.active = true;

    this.canJump = false;

    this.knockBackXVel = 0;

    this.walkFrame = 0;

    this.falling = false;

    this.weapon = "Crumpled Paper";
    this.bulletCount = 0;

    this.update = function(){

        this.falling = false;

        if(this.actualXVel === 0){
            this.actualXVel = this.xVel;
        }

        if(Math.abs(this.knockBackXVel) < bulletSpeed*5){
            this.actualXVel += this.knockBackXVel;
        }

        if(this.canJump === true){
            this.actualYVel = this.yVel;
        }

        this.canJump = false;

        this.tilePosXLeft = Math.round((this.x - this.width + this.width/10 - xOffset) / tileSize);
        this.tilePosXRight = Math.round((this.x - this.width/10 - xOffset) / tileSize);
        this.tilePosYTop = Math.round((this.y - this.height - yOffset) / tileSize);
        this.tilePosYBottom = Math.round((this.y - this.actualYVel - 2 - yOffset) / tileSize);

        if((this.x + this.width*2 > xOffset) && (this.x - this.width*2 < WIDTH - xOffset) && (this.y > yOffset) && (this.y - this.height < HEIGHT - yOffset)){
            if(this.tilePosYTop > 0 && this.tilePosYBottom < map.length - 1){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[this.tilePosYTop - 1][this.tilePosXLeft] === collidableBlocks[i] || map[this.tilePosYTop - 1][this.tilePosXRight] === collidableBlocks[i]) {
                        if (this.actualYVel < 0) {
                            if (this.y - this.height / 2 + this.actualYVel <= (this.tilePosYTop - 1) * tileSize + tileSize + yOffset) {
                                this.actualYVel = ((this.tilePosYTop - 1) * tileSize + tileSize + yOffset - this.y + this.height / 2);
                                console.log(1);
                                break;
                            } else {

                            }
                        } else {

                        }
                    } else {

                    }
                }
            }else{
                this.actualYVel += this.gravity;
            }

            if(Math.round((this.y + 2 - yOffset) / tileSize) < map.length){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[Math.round((this.y + 2 - yOffset) / tileSize)][this.tilePosXLeft] === collidableBlocks[i] || map[Math.round((this.y + 2 - yOffset) / tileSize)][this.tilePosXRight] === collidableBlocks[i]) {
                        this.canJump = true;
                    }
                }
            }


            if(this.tilePosYBottom < map.length - 1 && this.tilePosYTop > 0){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[this.tilePosYBottom + 1][this.tilePosXLeft] === collidableBlocks[i] || map[this.tilePosYBottom + 1][this.tilePosXRight] === collidableBlocks[i]) {
                        if (this.y + this.height / 2 + this.actualYVel >= (this.tilePosYBottom + 1) * tileSize + yOffset) {
                            this.actualYVel = ((this.tilePosYBottom + 1) * tileSize + yOffset - this.y - this.height / 2);
                            break;
                        } else {
                            if (map[this.tilePosYBottom][this.tilePosXLeft] === 11 || map[this.tilePosYBottom][this.tilePosXRight] === 11) {
                                if (map[this.tilePosYTop - 1][this.tilePosXLeft] === 11 && map[this.tilePosYTop - 1][this.tilePosXRight] === 11) {
                                    if(Math.abs(this.actualYVel) === 0){
                                        this.actualYVel = this.yVel;
                                        //this.falling = true;
                                    }
                                    if(Math.abs(this.yVel) > Math.abs(this.actualYVel)){
                                        this.actualYVel = this.yVel;
                                        //this.falling = true;
                                    }
                                }
                            } else {
                                //this.actualYVel += this.gravity;
                                this.falling = true;
                                //break;
                            }
                        }
                    } else {
                        if (map[this.tilePosYBottom][this.tilePosXLeft] === 11 || map[this.tilePosYBottom][this.tilePosXRight] === 11) {
                            if(Math.abs(this.actualYVel) < moveSpeed){
                                this.canJump = true;
                            }
                            if ((map[this.tilePosYTop - 1][this.tilePosXLeft] === 11 && map[this.tilePosYTop - 1][this.tilePosXRight] === 11)) {
                                if(Math.abs(this.actualYVel) === 0){
                                    this.actualYVel = this.yVel;
                                }
                                if(Math.abs(this.yVel) > Math.abs(this.actualYVel)){
                                    this.actualYVel = this.yVel;
                                }
                                //break;
                            }
                        } else {
                            //this.actualYVel += this.gravity;
                            this.falling = true;
                            //break;
                        }
                    }
                }
            }else{
                this.actualYVel += this.gravity;
            }

            if(this.falling === true){
                this.actualYVel += this.gravity;
            }

            if(this.tilePosXLeft > 0 && this.tilePosYBottom < map.length && this.tilePosYTop >= 0){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[this.tilePosYBottom][this.tilePosXLeft - 1] === collidableBlocks[i] || map[this.tilePosYTop][this.tilePosXLeft - 1] === collidableBlocks[i]) {
                        if (this.actualXVel < 0) {
                            if (this.x + this.actualXVel <= (this.tilePosXLeft - 1) * tileSize + tileSize + xOffset) {
                                this.actualXVel = ((this.tilePosXLeft - 1) * tileSize + tileSize + xOffset - this.x + 1.15);
                                break;
                            } else {

                            }
                        }
                    } else {

                    }
                }
            }

            if(this.tilePosXRight < map[0].length - 1 && this.tilePosYBottom < map.length && this.tilePosYTop >= 0){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[this.tilePosYBottom][this.tilePosXRight + 1] === collidableBlocks[i] || map[this.tilePosYTop][this.tilePosXRight + 1] === collidableBlocks[i]) {
                        if (this.actualXVel > 0) {
                            if (this.x + this.width + this.actualXVel >= (this.tilePosXRight + 1) * tileSize + xOffset) {
                                this.actualXVel = ((this.tilePosXRight + 1) * tileSize + xOffset - this.x - this.width - 1.15);
                                break;
                            } else {

                            }
                        }
                    } else {

                    }
                }
            }
            if(this.tilePosYTop < map.length && this.tilePosYTop >= 0){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[this.tilePosYTop][this.tilePosXRight] === collidableBlocks[i] || map[this.tilePosYTop][this.tilePosXLeft] === collidableBlocks[i]) {
                        this.y = this.tilePosYTop*tileSize + tileSize + yOffset + this.height/2;
                        console.log(5);
                    } else {

                    }
                }
            }

            if(this.tilePosYBottom < map.length && this.tilePosYBottom > 0){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[this.tilePosYBottom][this.tilePosXRight] === collidableBlocks[i] || map[this.tilePosYBottom][this.tilePosXLeft] === collidableBlocks[i]) {
                        this.y = this.tilePosYBottom*tileSize + yOffset - this.height/2;
                        console.log(5);
                    } else {

                    }
                }
            }
        }else{
            this.actualYVel += this.gravity;
        }

        if(Math.abs(this.actualYVel) < moveSpeed/1000){
            this.actualYVel = 0
        }

        if(this.actualXVel >= moveSpeed){
            this.facing = 1;
        }else if(this.actualXVel <= -moveSpeed){
            this.facing = -1;
        }

        if(this.knockBackXVel > 2){
            this.knockBackXVel-=0.75;
        }else if(this.knockBackXVel < -2){
            this.knockBackXVel+=0.75;
        }else{
            this.knockBackXVel = 0;
        }

        if(this.bulletCount === 0){
            this.weapon = "Crumpled Paper";
        }

        this.x += this.actualXVel;
        this.y += this.actualYVel;

        if(this.visible === false){
            if(this.actualXVel !== 0 || this.actualYVel !== 0){
                this.visible = true;
            }
        }

        if(GAMESTATE === "GAME" && gameTicks > countDownEndTime){
            if(this.actualXVel !== 0 && this.actualYVel === 0){
                walkSounds[this.id].play();
            }else{
                //walkSounds[this.id].stop();
            }
        }

        this.actualXVel = 0;

        if(this.reloadTimer > 0){
            this.reloadTimer--;
        }

        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.height/2 - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);

        if(this.walkFrame < 3 && gameTicks % 10 === 0 && this.xVel !== 0){
            this.walkFrame++;
        }else if(this.walkFrame === 3){
            this.walkFrame = 0;
        }else if(this.xVel === 0){
            this.walkFrame = 0;
        }

        if(this.canJump === true && this.knockBackXVel === 0){
            this.tempCauseOfDeath = "Slipped Off";
        }

        if((gameTicks % 400 === 0) && this.totalShots !== 0){
            playerAccuracy[this.id] = Math.round(this.hitAmount/this.totalShots*100);
        }

    };

    this.draw = function(){

        //ctx.fillRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
        if(this.visible === true){
            if(this.opacity < 0.95){
                this.opacity+=0.05;
            }
        }else{
            if(this.opacity > 0.05){
                this.opacity-=0.05;
            }
        }
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(tileMap, 32*this.id, 256, 32, 50, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*0.78*cameraZoom);
        ctx.drawImage(tileMap, 32*this.walkFrame, 306, 32, 14, this.cameraX + cameraGlobalX, this.cameraY + this.height*0.78*cameraZoom + cameraGlobalY, this.width*cameraZoom, this.height*0.22*cameraZoom);
        ctx.drawImage(tileMap, 96, 306, 32, 14, this.cameraX + cameraGlobalX + this.facing*2*cameraZoom, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*0.39*cameraZoom);
        ctx.textAlign = 'center';

        /*if(this.opacity - 0.5 > 0){
            ctx.globalAlpha = this.opacity - 0.5;
        }else{
            ctx.globalAlpha = 0;
        }
        ctx.fillStyle = 'white';
        ctx.font = "10px Arial";
        ctx.fillText(this.name, this.x+this.width/2, this.y - this.height + cameraGlobalY);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;*/

        ctx.globalAlpha = 1;
        this.xVel = 0;
        this.yVel = 0;
    };

    this.spawnBullet = function(){
        if(this.reloadTimer === 0){
            this.totalShots++;
            if(this.weapon === "Crumpled Paper"){
                shotSounds1[this.id].play();
                if(this.facing === 1){
                    bullets.push(new Bullet(this.x + this.width, this.y, 0, this.team, this.id));
                }else{
                    bullets.push(new Bullet(this.x - this.width, this.y, 1, this.team, this.id));
                }
                this.reloadTimer = this.reloadSpeed;
            }else if(this.weapon === "Darts"){
                shotSounds2[this.id].play();
                if(this.facing === 1){
                    bullets.push(new Bullet(this.x + this.width, this.y, 2, this.team, this.id));
                }else{
                    bullets.push(new Bullet(this.x - this.width, this.y, 3, this.team, this.id));
                }
                this.reloadTimer = this.reloadSpeed*2;
                this.bulletCount--;
            }else if(this.weapon === "Potato Launcher"){
                shotSounds3[this.id].play();
                if(this.facing === 1){
                    bullets.push(new Bullet(this.x + this.width, this.y, 4, this.team, this.id));
                }else{
                    bullets.push(new Bullet(this.x - this.width, this.y, 5, this.team, this.id));
                }
                this.reloadTimer = this.reloadSpeed*3;
                this.bulletCount--;
            }
        }
    };

    this.die = function(){
        this.lives--;
        //console.log(this.name + " " + this.tempCauseOfDeath);
        for(var i = 0; i < players.length; i++){
            if(i !== this.id){
                if((this.tempCauseOfDeath === ("Was Knocked Off By " + players[i].name)) || (this.tempCauseOfDeath === ("Was Sniped Off By " + players[i].name))){
                    playerKills[i]++;
                }
            }
        }

        if(this.lives > 0){
            this.x = this.spawnX;
            this.y = this.spawnY;
            this.knockBackXVel = 0;
            this.bulletCount = 0;
            this.weapon = "Crumpled Paper";
        }else{
            this.active = false;
        }
    }

    this.hide = function(){
        if(this.tilePosYBottom < map.length){
            if (map[this.tilePosYBottom][this.tilePosXRight] === 28 && map[this.tilePosYBottom][this.tilePosXLeft] === 28) {
                this.visible = false;
            } else {

            }
        }
    }
}

function playerStat(id){
    this.x = 0;
    this.y = 0;
    this.id = id;

    this.idPlusOne = this.id+1;

    this.width = WIDTH/8;
    this.height = HEIGHT/6;

    this.titleX = 0;
    this.titleY = 0;

    this.profileWidth = WIDTH/20;
    this.profileHeight = WIDTH/20;

    this.name = "Player " + this.idPlusOne;
    this.weapon = "Crumpled Paper";
    this.bulletCount = 0;
    this.lives = GlobalLives;

    if(this.id === 0){
        this.x = this.width/10;
        this.y = HEIGHT - 2*this.height - 2*this.height/10;
    }else if(this.id === 1){
        this.x = this.width/10;
        this.y = HEIGHT - this.height - this.height/10;
    }else if(this.id === 2){
        this.x = WIDTH - this.width - this.width/10;
        this.y = HEIGHT - 2*this.height - 2*this.height/10;
    }else if(this.id === 3){
        this.x = WIDTH - this.width - this.width/10;
        this.y = HEIGHT - this.height - this.height/10;
    }

    this.titleX = this.x + WIDTH/100;
    this.titleY = this.y + HEIGHT/30;

    this.weaponX = this.x + WIDTH/100;
    this.weaponY = this.y + HEIGHT/7;

    this.profileX = this.x + WIDTH/100;
    this.profileY = this.y + HEIGHT/20;

    this.lifeNumX = this.x + WIDTH/13;
    this.lifeNumY = this.y + HEIGHT/11;

    this.draw = function(){
        ctx.lineWidth = 2;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'gray';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'black';
        ctx.font = '20px Calibri';
        ctx.fillText(this.name, this.titleX, this.titleY);

        ctx.drawImage(tileMap, 32*this.id, 256, 32, 32, this.profileX, this.profileY, this.profileWidth, this.profileHeight*0.7);
        ctx.drawImage(tileMap, 96, 306, 30, 14, this.profileX + 5, this.profileY, this.profileWidth, this.profileHeight*0.7);

        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.profileX, this.profileY, this.profileWidth, this.profileHeight*0.7);
        ctx.globalAlpha = 1;

        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        if(this.bulletCount > 0){
            ctx.fillText("Weapon: " + this.weapon + " (" + this.bulletCount + ")", this.weaponX, this.weaponY);
        }else{
            ctx.fillText("Weapon: " + this.weapon + " \u221e", this.weaponX, this.weaponY);
        }

        ctx.font = '30px Arial';
        ctx.fillText(parseInt(this.lives), this.lifeNumX, this.lifeNumY);
    };

    this.update = function(){
        if(tempTicks % 60 === 1){
            this.lives = players[this.id].lives;
            this.weapon = players[this.id].weapon;
            this.name = players[this.id].name;
        }
        this.bulletCount = players[this.id].bulletCount;
    };
}

function Slider(x, y, width, type, text){
    this.x = x;
    this.y = y;
    this.width = width;
    this.type = type;
    this.text = text;

    this.value = 1;

    if(this.type === 10){
        this.slideX = this.width/15*GlobalLives;
        this.value = GlobalLives;
    }else if(this.type === 11){
        this.slideX = this.width/105*(fallApartTime/60-15);
        this.value = fallApartTime/60;
    }else if(this.type === 12){
        this.slideX = this.width/15*RoundAmount;
        this.value = RoundAmount;
    }else{
        this.slideX = this.width;
    }

    if(this.type === 0){
        this.slideX = this.width*globalVolume;
    }else if(this.type === 1){
        this.slideX = Math.round((maxRainParticles - 25)*this.width/75);
    }else if(this.type === 2){
        this.slideX = this.width - (updateSpeed - 1)*this.width/4;
    }


    if(this.type === 0 || this.type === 1 || this.type === 2){
        this.dependancy = this.x - leftPanelOptionsX;
    }else{
        this.dependancy = 0;
    }


    this.sliding = false;

    this.update = function(){
        if(this.type === 0 || this.type === 1 || this.type === 2){
            this.x = leftPanelOptionsX + this.dependancy;
        }else{

        }


        if(mousePosY > this.y - HEIGHT/100 && mousePosY < this.y + HEIGHT/100 + HEIGHT/100) {
            if (mousePosX > this.x - this.width/2 - WIDTH/100 && mousePosX < this.x + this.width/2) {
                if(dragging && draggingSlider === false){
                    this.sliding = true;
                    draggingSlider = true;
                }
            }
        }

        if(!dragging){
            this.sliding = false;
            draggingSlider = false;
        }

        if(this.sliding === true){
            if(mousePosX > this.x + this.width/2){ //
                this.slideX = this.width;
            }else if(mousePosX < this.x - this.width/2){
                this.slideX = 0;
            }else{
                this.slideX = mousePosX - this.x + this.width/2;
            }

            //PASS IN ALL SOUNDS HERE --------------------------------------------------------------------------------------------------------------

            if(this.type === 0 && globalVolume !== this.slideX/this.width){
                globalVolume = this.slideX/this.width;
                for(var i = 0; i < walkSounds.length; i++){
                    walkSounds[i].changeVolume();
                }
                for(var i = 0; i < shotSounds1.length; i++){
                    shotSounds1[i].changeVolume();
                }
                for(var i = 0; i < shotSounds2.length; i++){
                    shotSounds2[i].changeVolume();
                }
                for(var i = 0; i < shotSounds3.length; i++){
                    shotSounds3[i].changeVolume();
                }
                clickSound.changeVolume();
                clickSound2.changeVolume();
                dingSound1.changeVolume();
                toneSound1.changeVolume();
                toneSound2.changeVolume();
                toneSound3.changeVolume();
            }

            if(this.type === 1 && maxRainParticles !== Math.round(this.slideX/this.width*75)+25){
                maxRainParticles = Math.round(this.slideX/this.width*75)+25;
            }

            if(this.type === 2 && updateSpeed !== Math.round(((this.x + this.width - this.slideX)/this.width)*10 + 1)){
                updateSpeed = Math.round((this.width - this.slideX)/this.width*4);
                if(updateSpeed <= 0){
                    updateSpeed = 1;
                }
            }

            if(this.type === 10 && this.value !== Math.round((this.slideX/this.width*14)+1)){
                this.value = Math.round((this.slideX/this.width*14)+1);
                GlobalLives = this.value;
            }else if(this.type === 11 && this.value !== Math.round((this.slideX/this.width*105)+15)){
                this.value = Math.round((this.slideX/this.width*105)+15);
                fallApartTime = this.value*60;
            }else if(this.type === 12 && this.value !== Math.round((this.slideX/this.width*14)+1)){
                this.value = Math.round((this.slideX/this.width*14)+1);
                RoundAmount = this.value;
            }

        }

    }
    this.draw = function(){
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb(63, 63, 63)';
        ctx.fillRect(this.x - this.width/2, this.y, this.width, HEIGHT/100);

        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - this.width/2 + this.slideX, this.y - HEIGHT/60, WIDTH/200, HEIGHT/25);

        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        if(this.type === 10 || this.type === 11 || this.type === 12){
            ctx.fillText(this.text + " (" + this.value + ")", this.x, this.y + WIDTH/40);
        }else{
            ctx.fillText(this.text, this.x, this.y + WIDTH/40);
        }

        ctx.textAlign = 'left';
    }
}

function Button(text, x, y, width, height){
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.growthX = 0;

    this.radius = HEIGHT/120;

    this.type = 0;

    if(this.text === "Skip (No points are added)"){
        this.type = 99;
    }

    this.update = function(){
        if(mousePosY > this.y && mousePosY < this.y + this.height){
            if(mousePosX > this.x - this.growthX && mousePosX < this.x + this.width + this.growthX*2){
                if(this.growthX < 10){
                    this.growthX++;
                }
                if(clickTimer === 0){
                    //THIS MUST UPDATE BEFORE CLICKTIMER IS SUBTRACTED
                    if(this.text === "Play"){
                        customGame = false;
                        stateToTransitionTo = "GAME SETUP";
                    }else if(this.text === "Custom Game"){
                        customGame = true;
                        stateToTransitionTo = "GAME SETUP";
                    }else if(this.text === "Options"){
                        if(optionsOpen === false){
                            optionsOpen = true;
                            creditsOpen = false;
                        }else{
                            optionsOpen = false;
                        }
                    }else if(this.text === "Credits"){
                        if(creditsOpen === false){
                            creditsOpen = true;
                            optionsOpen = false;
                        }else{
                            creditsOpen = false;
                        }
                    }else if(this.text === "Begin" && players.length > 1){
                        stateToTransitionTo = "GAME";
                    }else if(this.text === "1 Round"){
                        RoundAmount = 1;
                    }else if(this.text === "3 Rounds"){
                        RoundAmount = 3;
                    }else if(this.text === "5 Rounds"){
                        RoundAmount = 5;
                    }

                    if(this.text === "Skip (No points are added)"){
                        playedRounds++;
                        buttons = [];
                        if(playedRounds === RoundAmount){
                            stateToTransitionTo = "GAME OVER";
                        }else{
                            Setup(true, true);
                        }
                    }

                    if(this.text === "Begin" && players.length <= 1){
                        clickSound2.play();
                    }else{
                        clickSound.play();
                    }

                    if(this.text === "Menu"){
                        stateToTransitionTo = "MENU";
                        PAUSED = false;
                    }else if(this.text === "Play Again"){
                        stateToTransitionTo = "GAME SETUP";
                    }

                }
            }else{
                if(this.growthX > 0){
                    this.growthX--;
                }
            }
        }else{
            if(this.growthX > 0){
                this.growthX--;
            }
        }

    };
    this.draw = function(){
        if(this.text.length < 27 && this.text !== "Skip (No Points are added)"){
            ctx.fillStyle = 'white';
            ctx.globalAlpha = 0.2;
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.roundRect(this.x - this.growthX, this.y, this.width + this.growthX*2, this.height, {upperLeft:this.radius,lowerLeft:this.radius,upperRight:this.radius,lowerRight:this.radius}, true, false);
            ctx.globalAlpha = 0.7;
            ctx.textAlign = 'center';
            if(this.text === "Begin" && players.length <= 1){
                ctx.fillStyle = 'black';
                ctx.globalAlpha = 0.3;
                //ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.roundRect(this.x - this.growthX, this.y, this.width + this.growthX*2, this.height, {upperLeft:this.radius,lowerLeft:this.radius,upperRight:this.radius,lowerRight:this.radius}, true, false);
            }
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText(this.text, this.x + this.width/2, this.y + this.height - this.height/4);
            ctx.textAlign = 'left';
            ctx.globalAlpha = 1;

            if(this.text === "1 Round" && !(RoundAmount === 1)){
                ctx.fillStyle = 'gray';
                ctx.globalAlpha = 0.2;
                //ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.roundRect(this.x - this.growthX, this.y, this.width + this.growthX*2, this.height, {upperLeft:this.radius,lowerLeft:this.radius,upperRight:this.radius,lowerRight:this.radius}, true, false);
                ctx.globalAlpha = 1;
            }else if(this.text === "3 Rounds" && !(RoundAmount === 3)){
                ctx.fillStyle = 'gray';
                ctx.globalAlpha = 0.2;
                //ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.roundRect(this.x - this.growthX, this.y, this.width + this.growthX*2, this.height, {upperLeft:this.radius,lowerLeft:this.radius,upperRight:this.radius,lowerRight:this.radius}, true, false);
                ctx.globalAlpha = 1;
            }if(this.text === "5 Rounds" && !(RoundAmount === 5)){
                ctx.fillStyle = 'gray';
                ctx.globalAlpha = 0.2;
                //ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.roundRect(this.x - this.growthX, this.y, this.width + this.growthX*2, this.height, {upperLeft:this.radius,lowerLeft:this.radius,upperRight:this.radius,lowerRight:this.radius}, true, false);
                ctx.globalAlpha = 1;
            }
        }else{
            ctx.fillStyle = 'white';
            ctx.font = '15px Arial';
            ctx.textAlign = 'end';
            ctx.fillText(this.text, this.x, this.y);
            ctx.textAlign = 'left';
            ctx.globalAlpha = 1;
        }
    };
}

function TextBox(x, y, type, text){
    this.x = x;
    this.y = y;
    this.type = type;
    this.yVel = -0.5;
    this.lifeSpan = 100;
    this.opacity = 1;
    this.text = text;
    this.screenHalfHeight = HEIGHT/2;
    this.screenHalfWidth = WIDTH/2;

    this.update = function(){
        if(this.type !== 3){
            this.y += this.yVel;
            if(this.opacity > 0){
                this.opacity -= 0.01
            }
            this.lifeSpan--;
        }else{
            if(this.opacity > 0){
                this.opacity -= 0.02
            }
            this.lifeSpan--;
        }

        if(this.opacity <= 0){
            this.lifeSpan = 0;
        }

        this.cameraX = ((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = ((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };

    this.draw = function(){
        if(this.opacity > 0) {
            if (this.type !== 3) {
                ctx.font = "15px Arial";
            } else {
                ctx.font = "150px Arial";
            }
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.globalAlpha = this.opacity;
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.x, this.y + cameraGlobalY);
            ctx.globalAlpha = 1;
        }
    };
}

function Explosion(x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 0.1;
    this.opacity = 1;
    this.expandSpeed = 0.2;
    this.lifeSpan = 100;
    this.screenHalfHeight = HEIGHT/2;
    this.screenHalfWidth = WIDTH/2;

    this.update = function(){
        if(this.opacity > 0.01){
            this.opacity -= 0.01
        }
        this.radius+=this.expandSpeed;
        if(this.lifeSpan > 0){
            this.lifeSpan--;
        }
        this.cameraX = ((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = ((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };

    this.draw = function(){
        ctx.fillStyle = 'white';
        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.cameraX, this.cameraY + cameraGlobalY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
    };
}

function RainParticle() {
    this.x = Math.round(Math.random()*WIDTH);
    this.y = 0;
    this.length = Math.round((Math.random() + 1) * HEIGHT/100 * tileSize/32);
    this.velY = Math.round((Math.random() + 2)*3);
    this.velX = Math.round((Math.random() - 0.5) * 3);

    this.update = function(){
        this.x += this.velX * (updateSpeed + 1);
        this.y += this.velY * (updateSpeed + 1);
    };

    this.draw = function(){
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.velX, this.y + this.length);
        ctx.stroke();
    };
}

function LightningBolt() {
    this.x = Math.round(Math.random()*WIDTH - WIDTH/5) + WIDTH/10;
    this.y = 0;
    this.length = Math.round((Math.random()) * 20);
    this.segmentsDrawn = 0;

    this.xPoses = [];
    this.yPoses = [];

    this.xPoses.push(this.x);
    this.yPoses.push(this.y);

    this.opacity = 1;

    for(var i = 1; i < this.length; i++){
        this.xPoses.push(this.xPoses[i-1] + (Math.random()*WIDTH/20) - WIDTH/40);
        this.yPoses.push(this.yPoses[i-1] + (Math.random()*HEIGHT/10) - HEIGHT/100);
    }

    this.update = function(){
        if(this.segmentsDrawn < this.length){
            this.segmentsDrawn+=1;
        }
        if(this.opacity > 0){
            this.opacity-=0.02;
        }
    };

    this.draw = function(){
        ctx.globalAlpha = this.opacity;
        for(var i = 0; i < this.segmentsDrawn - 1; i++){
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(200, 255, 225)';
            ctx.lineWidth = 1;
            ctx.moveTo(this.xPoses[i], this.yPoses[i]);
            ctx.lineTo(this.xPoses[i + 1], this.yPoses[i + 1]);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    };
}

function Cloud(){
    this.width = Math.round(Math.random()*(rainCurrent+0.5)*100);
    this.segments = Math.round(Math.random()*6) + 4;

    this.x = Math.round(WIDTH + (this.width * 4));
    this.y = Math.round(Math.random()*HEIGHT);

    this.xPoses = [];
    this.yPoses = [];
    this.widths = [];

    this.xVel = Math.round(Math.random()*(3*rainCurrent)*-1) - 1;

    this.xPoses.push(this.x);
    this.yPoses.push(this.y);
    this.widths.push(this.width);

    for(var i = 1; i < this.segments; i++){
        this.widths.push(Math.round(Math.random()*(rainCurrent+0.5)*100));
        this.xPoses.push(this.xPoses[i - 1] + Math.round(Math.random()*this.widths[i]/2) + this.widths[i]/2);
        this.yPoses.push(this.yPoses[i - 1] + Math.round(Math.random()*this.widths[i]) - this.widths[i]/2);
    }

    this.update = function(){
        for(var i = 0; i < this.xPoses.length; i++){
            this.xPoses[i] += this.xVel;
        }
    };
    this.draw = function(){
        ctx.fillStyle = 'rgb(170, 223, 242)';
        for(var c = 0; c < this.xPoses.length; c++){
            ctx.beginPath();
            ctx.arc(this.xPoses[c], this.yPoses[c], this.widths[c], 0, Math.PI*2, false);
            ctx.fill();

        }
    }
}

function AiBot(player, difficulty){
    this.player = player;
    this.difficulty = difficulty;

    this.minAttackChance = Math.round(Math.random()*100); //Bigger Is Worse
    this.intelligence = Math.round(Math.random()*50);
    this.reactionSpeed = Math.round(Math.random()*50);

    this.timer = 0;
    this.shootTimer = 0;

    this.currentAttackChance = this.minAttackChance;

    //DIFFICULTY FROM 1-10

    this.savedXVel = 0;
    this.savedYVel = 0;
    this.shooting = false;

    this.powerUpPosY = 0;
    this.powerUpPosX = 0;

    this.state = "None";

    this.shootDelay = 0;

    this.update = function(){

        if(gameTicks % updateSpeed*2 === 0 && gameTicks > this.reactionSpeed) {

            this.savedXVel = 0;
            this.savedYVel = 0;
            this.shooting = false;

            if (this.currentAttackChance < 100) {
                this.currentAttackChance++;
            }

            if (this.timer > 0) {
                this.timer--;
            } else {
                this.timer = 0;
            }

            if(amountOfBreaks === breakPoints){ //ONLY LAST FLOOR REMAINS, OR ONLY TOP FLOORS ARE LEFT
                if (players[this.player].tilePosXLeft > map[0].length - Math.round(map[0].length/10) - Math.round(this.intelligence/20)) {
                    this.state = "Jumping Over To Left";
                    this.timer = Math.round(Math.random()*10);
                } else if (players[this.player].tilePosXRight < Math.round(map[0].length/10) + Math.round(this.intelligence/20)) {
                    this.state = "Jumping Over To Right";
                    this.timer = Math.round(Math.random()*10);
                }

                if (players[this.player].tilePosXLeft > map[0].length - Math.round(map[0].length/4) - Math.round(this.intelligence/20)) {
                    this.state = "LastFloorRight";
                } else if (players[this.player].tilePosXRight < Math.round(map[0].length/4) + Math.round(this.intelligence/20)) {
                    this.state = "LastFloorLeft";
                }else{
                    if(this.timer === 0){
                        this.state = "Idle";
                    }
                }
            }else{
                if (players[this.player].tilePosXLeft > map[0].length - Math.round(map[0].length/10) - Math.round(this.intelligence/20)) {
                    this.state = "Jumping Over To Left";
                    this.timer = Math.round(Math.random()*10);
                } else if (players[this.player].tilePosXRight < Math.round(map[0].length/10) + Math.round(this.intelligence/20)) {
                    this.state = "Jumping Over To Right";
                    this.timer = Math.round(Math.random()*10);
                }else{
                    if(this.timer === 0){
                        this.state = "Idle";
                    }
                }
            }

            if (powerUpSpawned === true && ((fallApartTimer < fallApartTime - 200 && this.intelligence > 1) || this.intelligence === 1) && players[this.player].weapon !== "Potato Launcher") {
                if (this.powerUpPosX === 0) {
                    for (var b = 0; b < tiles.length; b++) {
                        if (tiles[b].type === 77 && tiles[b].powerUpActive === true) {
                            this.powerUpPosX = tiles[b].x + tileSize / 2;
                            this.powerUpPosY = tiles[b].y;
                        }
                    }
                    this.timer = this.reactionSpeed;
                }else{
                    if (players[this.player].y + players[this.player].height > this.powerUpPosY && players[this.player].y - players[this.player].height < this.powerUpPosY) {
                        if (players[this.player].x + players[this.player].width < this.powerUpPosX) {
                            this.state = "Wandering Right";
                        } else {
                            this.state = "Wandering Left";
                        }
                        if (this.intelligence > 2) {
                            this.savedYVel = -moveSpeed;
                        }
                    } else if (this.powerUpPosY < players[this.player].y - players[this.player].height) {
                        if (players[this.player].tilePosYBottom < map.length) {
                            for (var t = 0; t < map.length; t++) {
                                if (map[players[this.player].tilePosYBottom][t] === 11) {
                                    if (players[this.player].x > xOffset + t * tileSize && players[this.player].x < xOffset + t * tileSize + tileSize / 2) {
                                        this.savedXVel = 0;
                                        break;
                                    } else if (players[this.player].x < xOffset + t * tileSize) {
                                        this.state = "Wandering Right";
                                    } else if (players[this.player].x - players[this.player].height / 4 > xOffset + t * tileSize) {
                                        this.state = "Wandering Left";
                                    }
                                }
                            }
                            if (map[players[this.player].tilePosYBottom][players[this.player].tilePosXRight] === 11 && map[players[this.player].tilePosYBottom][players[this.player].tilePosXLeft] === 11) {
                                this.state = "Up Ladder";
                            }
                        }
                    } else if (this.powerUpPosY > players[this.player].y) {
                        if (players[this.player].tilePosYBottom < map.length) {
                            for (var t = 0; t < map.length; t++) {
                                if (map[players[this.player].tilePosYBottom][t] === 11) {
                                    if (players[this.player].x > xOffset + t * tileSize && players[this.player].x < xOffset + t * tileSize + tileSize / 2) {
                                        this.savedXVel = 0;
                                        break;
                                    } else if (players[this.player].x < xOffset + t * tileSize) {
                                        this.state = "Wandering Right";
                                    } else if (players[this.player].x - players[this.player].height / 4 > xOffset + t * tileSize) {
                                        this.state = "Wandering Left";
                                    }
                                }
                            }
                            if (map[players[this.player].tilePosYBottom][players[this.player].tilePosXRight] === 11 && map[players[this.player].tilePosYBottom][players[this.player].tilePosXLeft] === 11) {
                                this.state = "Down Ladder";
                            }
                        }
                    }
                }
            }else if(powerUpSpawned === false){
                this.powerUpPosY = 0;
                this.powerUpPosX = 0;
            }

            if (this.currentAttackChance > this.minAttackChance && this.shootTimer === 0 && (this.state === "Idle" || this.state === "LastFloorRight" || this.state === "LastFloorLeft") && this.timer === 0) {
                for (var i = 0; i < players.length; i++) {
                    if (i !== this.player && players[i].team !== players[this.player].team) {
                        if ((players[this.player].tilePosYBottom === players[i].tilePosYBottom ||
                            players[this.player].tilePosYBottom - 1 === players[i].tilePosYBottom)) {
                            if(players[this.player].x < players[i].x && players[i].x - players[this.player].x > tileSize){
                                this.state = "Shooting Right";
                            }else if(players[this.player].x <= players[i].x && players[i].x - players[this.player].x <= tileSize*2 && players[i].x - players[this.player].x >= 0){
                                this.state = "Wandering Left";
                                this.timer = Math.round(Math.random()*5)+5;
                            }else if(players[this.player].x > players[i].x && players[this.player].x - players[i].x > tileSize){
                                this.state = "Shooting Left"
                            }else if(players[this.player].x > players[i].x && players[this.player].x - players[i].x <= tileSize*2 && players[i].x - players[this.player].x > 0){
                                this.state = "Wandering Right";
                                this.timer = Math.round(Math.random()*5)+5;
                            }else{
                                this.state = "Idle";
                            }
                        }else if(players[this.player].tilePosYBottom - 2 === players[i].tilePosYBottom){
                            if(players[this.player].x < players[i].x && players[i].x - players[this.player].x > tileSize){
                                this.state = "Shooting Right";
                            }else if(players[this.player].x < players[i].x && players[i].x - players[this.player].x <= tileSize*2){
                                this.state = "Wandering Left";
                                this.timer = Math.round(Math.random()*5)+5;
                            }else if(players[this.player].x > players[i].x && players[this.player].x - players[i].x > tileSize){
                                this.state = "Shooting Left";
                            }else if(players[this.player].x > players[i].x && players[this.player].x - players[i].x <= tileSize*2){
                                this.state = "Wandering Right";
                                this.timer = Math.round(Math.random()*5)+5;
                            }else{
                                this.state = "Idle";
                            }
                            this.savedYVel = -moveSpeed;
                        }

                    }
                }
            }

            if(players[this.player].tilePosYBottom === map.length - 2 && (map[players[this.player].tilePosYBottom][players[this.player].tilePosXRight] === 11
                || map[players[this.player].tilePosYBottom][players[this.player].tilePosXLeft] === 11) && amountOfBreaks > 0 && this.powerUpPosX === 0){
                this.state = "Up Ladder";
            }

            if (fallApartTimer >= fallApartTime - 200 && this.intelligence > 1) {
                if (players[this.player].tilePosYBottom === map.length - 2 || players[this.player].tilePosYBottom === map.length - 1) {
                    for (var t = 0; t < map.length; t++) {
                        if (map[players[this.player].tilePosYBottom][t] === 11) {
                            if (players[this.player].x > xOffset + t * tileSize && players[this.player].x < xOffset + t * tileSize + tileSize / 2) {
                                this.savedXVel = 0;
                                break;
                            } else if (players[this.player].x < xOffset + t * tileSize) {
                                this.state = "Wandering Right"
                            } else if (players[this.player].x - players[this.player].height / 4 > xOffset + t * tileSize) {
                                this.state = "Wandering Left"
                            }
                        }else{

                        }
                    }
                    if (map[players[this.player].tilePosYBottom][players[this.player].tilePosXRight] === 11 && map[players[this.player].tilePosYBottom][players[this.player].tilePosXLeft] === 11) {
                        this.state = "Up Ladder";
                    }
                }
            }



            if(this.state === "LastFloorRight"){
                this.savedXVel = -moveSpeed;
                this.shooting = true;
            }else if(this.state === "LastFloorLeft"){
                this.savedXVel = moveSpeed;
                this.shooting = true;
            }else if(this.state === "Jumping Over To Right"){
                this.savedXVel = moveSpeed;
                this.savedYVel = -moveSpeed;
            }else if(this.state === "Jumping Over To Left"){
                this.savedXVel = -moveSpeed;
                this.savedYVel = -moveSpeed;
            }else if(this.state === "Shooting Right"){
                this.savedXVel = moveSpeed;
                this.shooting = true;
            }else if(this.state === "Shooting Left"){
                this.savedXVel = -moveSpeed;
                this.shooting = true;
            }else if(this.state === "Shooting"){
                this.shooting = true;
            }else if(this.state === "Wandering Right"){
                this.savedXVel = moveSpeed;
                this.shooting = true;
            }else if(this.state === "Wandering Left"){
                this.savedXVel = -moveSpeed;
                this.shooting = true;
            }

            if(this.state === "Up Ladder"){
                this.savedYVel = -moveSpeed;
            }else if(this.state === "Down Ladder"){
                this.savedYVel = moveSpeed;
            }

        }
        players[this.player].xVel = this.savedXVel;
        players[this.player].yVel = this.savedYVel;

        if(this.shooting){
            players[this.player].spawnBullet();
        }
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;

    this.sound.volume = globalVolume;


    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
    this.delete = function(){
        this.sound.parentNode.removeChild(this.sound);
    }
    this.changeVolume = function(){
        this.sound.volume = globalVolume;
    }
}

//CREATE TILES

var gameTicks = 0;

var clickSound;
clickSound = new sound("ClickSound1.wav");

var clickSound2;
clickSound2 = new sound("ClickSound2.wav");

var dingSound1;
dingSound1 = new sound("Ding1.wav");

var toneSound1;
toneSound1 = new sound("EStartTone.wav");

var toneSound2;
toneSound2 = new sound("CStartTone.wav");

var toneSound3;
toneSound3 = new sound("EStartTone.wav");

var walkSounds = [];
var shotSounds1 = [];
var shotSounds2 = [];
var shotSounds3 = [];

var fallingApartLine = 0;
var wallTilesToDelete = 0;
var totalTiles = 0;
var bgTilesToDelete = 0;

var fallVelocity = 0;

var justFell = false;

var RoundAmount = 1;

function checkGameState(){
    buttons = [];
    if(GAMESTATE === "MENU"){
        playerInfos = [];
        Setup(false, true);
        cameraZoom = 0.35;
        buttons.push(new Button("Play", WIDTH - WIDTH/5 - WIDTH/20, HEIGHT - HEIGHT/15*5, WIDTH/5, HEIGHT/20));
        buttons.push(new Button("Custom Game", WIDTH - WIDTH/5 - WIDTH/20, HEIGHT - HEIGHT/15*4, WIDTH/5, HEIGHT/20));
        buttons.push(new Button("Options", WIDTH - WIDTH/5 - WIDTH/20, HEIGHT - HEIGHT/15*3, WIDTH/5, HEIGHT/20));
        buttons.push(new Button("Credits", WIDTH - WIDTH/5 - WIDTH/20, HEIGHT - HEIGHT/15*2, WIDTH/5, HEIGHT/20));

        buttons.push(new Slider(leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10*3, leftPanelOptionsWidth*0.8, 0, ""));
        buttons.push(new Slider(leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10*5, leftPanelOptionsWidth*0.8, 1, ""));
        buttons.push(new Slider(leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10*7, leftPanelOptionsWidth*0.8, 2, ""));
    }else if(GAMESTATE === "GAME"){
        playedRounds = 0;
        buttons = [];
        Setup(true, false);
        for(var i = 0; i < players.length; i++){
            playerStatBoxes.push(new playerStat(i));
        }
        for(var i = 0; i < walkSounds.length; i++){
            walkSounds[i].delete();
        }
        walkSounds = [];
        for(var i = 0; i < players.length; i++){
            walkSounds.push(new sound("Walking1.wav"));
        }

        for(var i = 0; i < shotSounds1.length; i++){
            shotSounds1[i].delete();
        }
        shotSounds1 = [];
        for(var i = 0; i < players.length; i++){
            shotSounds1.push(new sound("ShotSound1.wav"));
        }

        for(var i = 0; i < shotSounds2.length; i++){
            shotSounds2[i].delete();
        }
        shotSounds2 = [];
        for(var i = 0; i < players.length; i++){
            shotSounds2.push(new sound("ShotSound2.wav"));
        }

        for(var i = 0; i < shotSounds3.length; i++){
            shotSounds3[i].delete();
        }
        shotSounds3 = [];
        for(var i = 0; i < players.length; i++){
            shotSounds3.push(new sound("ShotSound3.wav"));
        }

        playerPointsNoSort = [];
        Order = [99, 99, 99, 99];
        sorted = false;
        EndGamePoints = [];
        displayedTexts = 0;
        displayedTextTimer = 0;
        playerAccuracy = [0, 0, 0, 0];
        playerPoints = [0, 0, 0, 0];
        teamPoints = [0, 0, 0, 0];
        playerKills = [0, 0, 0, 0];

    }else if(GAMESTATE === "GAME SETUP"){
        playerStatBoxes = [];
        if(gamePlayed === false){
            Setup(true, false);
        }else{
            Setup(true, true);
        }
        buttons.push(new Button("Begin", WIDTH - WIDTH/5 - WIDTH/20, HEIGHT - HEIGHT/15*2, WIDTH/5, HEIGHT/20));
        buttons.push(new Button("Tap on the green icon with a plus to add a player.", WIDTH - WIDTH/20, HEIGHT/30));
        buttons.push(new Button("Tap the AI icon on to make the player an AI.", WIDTH - WIDTH/20, HEIGHT/30 + HEIGHT/30));
        if(customGame === false) {
            buttons.push(new Button("1 Round", WIDTH / 20, HEIGHT / 2 - HEIGHT / 10, WIDTH / 5, HEIGHT / 20));
            buttons.push(new Button("3 Rounds", WIDTH / 20, HEIGHT / 2, WIDTH / 5, HEIGHT / 20));
            buttons.push(new Button("5 Rounds", WIDTH / 20, HEIGHT / 2 + HEIGHT / 10, WIDTH / 5, HEIGHT / 20));
        }
        buttons.push(new Button("Menu", WIDTH/20, HEIGHT - HEIGHT/15*2, WIDTH/5, HEIGHT/20));

        if(customGame === true){
            buttons.push(new Slider(WIDTH-WIDTH/8, HEIGHT/10*3, WIDTH/5, 10, "Lives"));
            buttons.push(new Slider(WIDTH-WIDTH/8, HEIGHT/10*4, WIDTH/5, 11, "Floor Fall Off Time"));
            buttons.push(new Slider(WIDTH-WIDTH/8, HEIGHT/10*5, WIDTH/5, 12, "Rounds"));
        }
    }else if(GAMESTATE === "GAME OVER"){
        playerStatBoxes = [];
        gamePlayed = true;
    }
}

var grd;
var stormgrd;

grd = ctx.createLinearGradient(0, 0, 0, HEIGHT/1.2);
grd.addColorStop(0, "rgb(86, 136, 216)");
grd.addColorStop(1, "rgb(100, 183, 249)");

stormgrd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, HEIGHT/120, WIDTH/2, HEIGHT/2, WIDTH/2);

stormgrd.addColorStop(0, "rgba(5, 5, 5, 0.4)");
stormgrd.addColorStop(1, "rgba(33, 32, 33, 1)");

function Setup(game, newHouse){

    gameTicks = 0;
    tempTicks = 0;

    fallingApartLine = 0;
    wallTilesToDelete = 0;
    totalTiles = 0;
    bgTilesToDelete = 0;

    fallVelocity = 0;

    justFell = false;

    fallApartTimer = 0;

    if(newHouse === true){
        tiles = [];
        amountOfBreaks = 0;
        breakPoints = 0;
    }

    players = [];
    bullets = [];
    balloons = [];
    playerStatBoxes = [];
    fallingTiles = [];
    effects = [];
    rainParticles = [];
    lightningBolts = [];
    clouds = [];
    aiBots = [];

    breakingApartBg = [];
    breakingApartFg = [];

    cameraGlobalX = 0;
    cameraGlobalY = 0;

    cameraGlobalYOffset = 0;
    cameraZoom = 1;
    cameraYWindOffset = 0;
    cameraYWindOffsetVel = 0;
    rainOpacity = 0;

    rainCurrent = 0;

    powerUpSpawned = false;

    if(newHouse === true){
        var mapRandom = Math.random();
        if(mapRandom < 0.3){
            map = Lvl2Fg.slice();
            backgroundMap = Lvl2Bg.slice();
            mapId = 2;
        }else if(mapRandom < 0.6){
            mapId = 3;
            map = Lvl3Fg.slice();
            backgroundMap = Lvl3Bg.slice();
        }else{
            map = Lvl1Fg.slice();
            backgroundMap = Lvl1Bg.slice();
            mapId = 1;
        }

        for(var i = 0; i < backgroundMap.length; i++){
            for(var j = 0; j < backgroundMap[0].length; j++){
                if(backgroundMap[i][j] === 99){
                    breakPoints++;
                }
            }
        }

        tileSize = Math.round((HEIGHT - HEIGHT/10) / map.length);

        xOffset = Math.round(WIDTH/2 - (tileSize*map[0].length)/2);
        yOffset = Math.round(HEIGHT/2 - (tileSize*map.length)/2);

        moveSpeed = tileSize/12;
        bulletSpeed = tileSize/6;

        var tileSpawnPointNum = 1;

        for(var i = 0; i < backgroundMap.length; i++){
            for(var j = 0; j < backgroundMap[0].length; j++){
                if(backgroundMap[i][j] !== 88){
                    tiles.push(new Tile(xOffset + tileSize*j, yOffset + tileSize*i, tileSize, tileSize, backgroundMap[i][j]));
                }

            }
        }

        //REMEMBER THAT PART OF THE MAP IS NOW GONE LOL

        for(var i = 0; i < map.length; i++){
            for(var j = 0; j < map[0].length; j++){
                if(map[i][j] !== 88){
                    tiles.push(new Tile(xOffset + tileSize*j, yOffset + tileSize*i, tileSize, tileSize, map[i][j]));
                }
                if(map[i][j] === 66){
                    tiles[tiles.length - 1].spawnPointId = tileSpawnPointNum;
                    tileSpawnPointNum++;
                }
            }
        }
    }

    if(game === true){
        players = [];
        players.push(new Player(0, false, 0));
        if(GAMESTATE === "GAME"){
            playerStatBoxes.push(new playerStat(0));
        }


        for(var i = 0; i < playerInfos.length; i++){
            players.push(new Player(playerInfos[i][0], playerInfos[i][1], playerInfos[i][2]));
            if(playerInfos[i][1] === true){
                aiBots.push(new AiBot(playerInfos[i][0], 10));
            }
            if(GAMESTATE === "GAME") {
                playerStatBoxes.push(new playerStat(playerInfos[i][0]));
            }
        }


    }


    if(mapId !== 3){
        balloons.push(new Balloon(WIDTH/2, yOffset, 0));
        balloons.push(new Balloon(xOffset + tileSize, yOffset + tileSize*6, 0));
        balloons.push(new Balloon(WIDTH - xOffset - tileSize, yOffset + tileSize*6, 0));
    }else{
        balloons.push(new Balloon(xOffset + tileSize, yOffset + tileSize*2, 0));
        balloons.push(new Balloon(WIDTH - xOffset - tileSize, yOffset + tileSize*2, 0));
    }
}

Setup(false, true);
checkGameState();

var countDownStartTime = 50;
var countDownEndTime = 250;
var startDelay = 50;

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}

var teams = [];
var firstTeam = 0;
var moreTeams = false;

var tempTicks = 0;

var playerPointsNoSort = [];
var Order = [99, 99, 99, 99];
var sorted = false;
var EndGamePoints = [];
var displayedTexts = 0;
var displayedTextTimer = 0;

var columns = 4;
var columnWidth = WIDTH/8
var startColumnX = (WIDTH - WIDTH/8*columns)/2;
var columnXs = [];

for(var i = 0; i < columns; i++){
    columnXs.push(startColumnX + i*columnWidth);
}

var noRealHumans = true;
var alivePlayers = 0;

function game(){

    if(GAMESTATE === "GAME" || GAMESTATE === "MENU" || GAMESTATE === "GAME SETUP" || GAMESTATE === "GAME OVER") {
        for (var ticks = 0; ticks < updateTimesPerTick; ticks++) {

            if (GAMESTATE === "GAME") {
                alivePlayers = 0;
                noRealHumans = true;
                for (var i = 0; i < players.length; i++) {
                    if (players[i].active === true) {
                        alivePlayers++;
                        if (players[i].ai === true) {

                        } else {
                            noRealHumans = false;
                        }
                    }
                }

                if ((gameTicks % (amountOfBreaks * fallApartTime + fallApartTime) === 0 && buttons.length < 1 && gameTicks !== 0) || ((noRealHumans === true) && buttons.length < 1 && alivePlayers > 1)) {
                    buttons.push(new Button("Skip (No points are added)", WIDTH - WIDTH / 3, HEIGHT / 25, WIDTH / 4, HEIGHT / 20));
                }
            }

            if (PAUSED === false && GAMESTATE === "GAME") {
                gameTicks++;
                tempTicks = gameTicks;
                if (gameTicks === countDownStartTime) {
                    effects.push(new TextBox(WIDTH / 2, HEIGHT / 2, 3, "3"));
                    toneSound1.play();
                } else if (gameTicks === countDownStartTime + Math.round((countDownEndTime - countDownStartTime) / 3)) {
                    effects.push(new TextBox(WIDTH / 2, HEIGHT / 2, 3, "2"));
                    toneSound3.play();
                } else if (gameTicks === countDownStartTime + Math.round((countDownEndTime - countDownStartTime) / 3 * 2)) {
                    effects.push(new TextBox(WIDTH / 2, HEIGHT / 2, 3, "1"));
                    toneSound1.play();
                } else if (gameTicks === countDownStartTime + Math.round((countDownEndTime - countDownStartTime) / 3 * 3)) {
                    effects.push(new TextBox(WIDTH / 2, HEIGHT / 2, 3, "Start!"));
                    toneSound2.play();
                }
                if (gameTicks % 50 === 0) {
                    for (var p = 0; p < players.length; p++) {
                        if (players[p].active === true) {
                            teams.push(players[p].team);
                        }
                    }

                    if (teams.length > 0) {
                        firstTeam = teams[0];
                    }

                    for (var t = 0; t < teams.length; t++) {
                        if (firstTeam !== teams[t]) {
                            moreTeams = true;
                            break;
                        }
                    }

                    if (moreTeams === false) {
                        teamPoints[firstTeam] += 1;
                        playedRounds++;
                        buttons = [];
                        if (playedRounds === RoundAmount) {
                            stateToTransitionTo = "GAME OVER";
                        } else {
                            Setup(true, true);
                        }
                    }

                    moreTeams = false;
                    firstTeam = 0;
                    teams = [];
                }
            } else {
                tempTicks++;
            }

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

// Fill with gradient
            ctx.fillStyle = grd;
            ctx.globalAlpha = 1;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = 'white';
            ctx.globalAlpha = 1;

            if (PAUSED === false) {
                if (tempTicks % Math.round(600 - 500 * rainCurrent) === 0) {
                    clouds.push(new Cloud());
                }
            }

            for (var c = 0; c < clouds.length; c++) {
                if (PAUSED === false) {
                    clouds[c].update();
                }
                clouds[c].draw();
                if (clouds[c].xPoses[clouds[c].xPoses.length] + clouds[c].widths[clouds[c].widths.length] < 0) {
                    clouds.splice(c, 1);
                }
            }

            if (gameTicks % weatherSwitchTime === 0) {
                rainCurrent = rainOpacity + (Math.round(Math.random() * 0.6) - 0.3);
            }

            // NEGATIVE RAINCOEFFICIENT = MORE RAIN

            if (PAUSED === false) {
                if (rainCurrent > upperrainCoefficient) {
                    rainCurrent = upperrainCoefficient;
                } else if (rainCurrent < lowerrainCoefficient) {
                    rainCurrent = lowerrainCoefficient;
                }

                if (rainCurrent > rainOpacity) {
                    rainOpacity += 0.005;
                } else if (rainCurrent < rainOpacity) {
                    rainOpacity -= 0.005;
                }

                if (rainOpacity < 0) {
                    rainOpacity = 0;
                } else if (rainOpacity > 1) {
                    rainOpacity = 1;
                }

                if (rainOpacity > 0.5) {
                    if (tempTicks % updateSpeed === 0) {
                        if (rainParticles.length < maxRainParticles * rainOpacity) {
                            rainParticles.push(new RainParticle());
                        }
                    }
                } else {

                }

                if (rainOpacity > 0.7) {
                    if (tempTicks % 600 - Math.round(rainOpacity * 500) === 0) {
                        lightningBolts.push(new LightningBolt());
                        lightningBoltFlashOpacity = 1;
                    }
                }

                if (rainParticles.length > 0) {
                    if (tempTicks % (updateSpeed + 1) === 0) {
                        for (var r = 0; r < rainParticles.length; r++) {
                            rainParticles[r].update();
                            if (rainParticles[r].y > HEIGHT) {
                                rainParticles.splice(r, 1);
                            }
                        }
                    }
                }
            }

            if (lightningBolts.length > 0) {
                for (var l = 0; l < lightningBolts.length; l++) {
                    if (PAUSED === false) {
                        lightningBolts[l].update();
                    }
                    lightningBolts[l].draw();
                    if (lightningBolts[l].opacity < 0.2) {
                        lightningBolts.splice(l, 1);
                    }
                }
            }

            ctx.globalAlpha = rainOpacity;
            for (var r = 0; r < rainParticles.length; r++) {
                rainParticles[r].draw();
            }
            ctx.globalAlpha = 1;

            if (justFell === true) {
                if (yOffset + cameraGlobalYOffset + tileSize * map.length < HEIGHT - yOffset - cameraGlobalYOffset) {
                    cameraGlobalYOffset += 0.1;
                } else {
                    justFell = false;
                }
            }

            if (PAUSED === false && GAMESTATE === "GAME") {
                if (fallApartTimer < fallApartTime && amountOfBreaks < breakPoints) {
                    fallApartTimer++;
                } else {
                    fallApartTimer = 0;
                }
            }

            for (var i = 0; i < backgroundMap.length; i++) {
                for (var j = 0; j < backgroundMap[0].length; j++) {
                    if (backgroundMap[i][j] === 99) {
                        fallingApartLine = i;
                    }
                }
            }

            if (fallApartTimer === fallApartTime - 1 && fallingApartLine !== 0) {
                for (var m = fallingApartLine - 1; m < backgroundMap.length; m++) {
                    breakingApartBg.push(backgroundMap[m]);
                }
                for (var a = 0; a < map.length; a++) {
                    for (var b = 0; b < map[0].length; b++) {
                        if (map[a][b] === 99) {
                            fallingApartLine = i;
                        }
                    }
                }
                for (var m = fallingApartLine - 1; m < map.length; m++) {
                    breakingApartFg.push(map[m]);
                }
                for (var n = 0; n < breakingApartFg.length; n++) {
                    for (var t = 0; t < breakingApartFg[0].length; t++) {
                        if (breakingApartFg[n][t] !== 88) {
                            wallTilesToDelete++;
                        } else {

                        }
                    }
                }
                for (var n = 0; n < map.length; n++) {
                    for (var t = 0; t < map[0].length; t++) {
                        if (map[n][t] !== 88) {
                            totalTiles++;
                        } else {

                        }
                    }
                }

                for (var n = fallingApartLine - 1; n < backgroundMap.length; n++) {
                    for (var t = 0; t < backgroundMap[0].length; t++) {
                        if (backgroundMap[n][t] !== 88) {
                            bgTilesToDelete++;
                        } else {

                        }
                    }
                }

                tiles.splice(tiles.length - totalTiles - bgTilesToDelete, bgTilesToDelete);
                tiles.splice(tiles.length - wallTilesToDelete, wallTilesToDelete);

                map.splice(fallingApartLine - 1, map.length - fallingApartLine + 1);
                backgroundMap.splice(fallingApartLine - 1, backgroundMap.length - fallingApartLine + 1);

                for (var i = 0; i < breakingApartBg.length; i++) {
                    for (var j = 0; j < breakingApartBg[0].length; j++) {
                        if (breakingApartBg[i][j] !== 88) {
                            fallingTiles.push(new Tile(xOffset + tileSize * j, yOffset + tileSize * i + tileSize * (fallingApartLine - 1), tileSize, tileSize, breakingApartBg[i][j]));
                        }
                    }
                }
                for (var i = 0; i < breakingApartFg.length; i++) {
                    for (var j = 0; j < breakingApartFg[0].length; j++) {
                        if (breakingApartFg[i][j] !== 88) {
                            fallingTiles.push(new Tile(xOffset + tileSize * j, yOffset + tileSize * i + tileSize * (fallingApartLine - 1), tileSize, tileSize, breakingApartFg[i][j]));
                        }
                    }
                }

                fallingApartLine = 0;
                bgTilesToDelete = 0;
                wallTilesToDelete = 0;
                totalTiles = 0;
                amountOfBreaks++;

            }

            for (var i = 0, len = fallingTiles.length; i < len; ++i) {
                if (PAUSED === false) {
                    fallingTiles[i].update();
                }
                fallingTiles[i].draw();
                if (PAUSED === false) {
                    fallingTiles[i].y += fallVelocity;
                }
                if (fallingTiles[i].type !== 10 && fallingTiles[i].type !== 12 && fallingTiles[i].type !== 13 && fallingTiles[i].type !== 14 && fallingTiles[i].type !== 15) {
                    if (i > 0) {
                        if (fallingTiles[i - 1].lightLevel < fallingTiles[i].lightLevel) {
                            fallingTiles[i].lightLevel = fallingTiles[i - 1].lightLevel + lightingPercision;
                        }
                    }
                    if (i < fallingTiles.length - 1) {
                        if (fallingTiles[i + 1].lightLevel < fallingTiles[i].lightLevel) {
                            fallingTiles[i].lightLevel = fallingTiles[i + 1].lightLevel + lightingPercision;
                        }
                    }
                    if (i > map[0].length && i < fallingTiles.length / 2) {
                        if (fallingTiles[i - map[0].length].lightLevel < tiles[i].lightLevel) {
                            fallingTiles[i].lightLevel = fallingTiles[i - map[0].length].lightLevel + lightingPercision;
                        }
                    }
                    if (i < fallingTiles.length / 2 - map[0].length) {
                        if (fallingTiles[i + map[0].length].lightLevel < fallingTiles[i].lightLevel) {
                            fallingTiles[i].lightLevel = fallingTiles[i + map[0].length].lightLevel + lightingPercision;
                        }
                    }
                }
            }

            if (fallingTiles.length > 0) {
                fallVelocity += 0.1;
            }

            if (fallVelocity > 10) {
                powerUpSpawned = false;
                breakingApartBg = [];
                breakingApartFg = [];
                fallingTiles = [];
                fallVelocity = 0;
                justFell = true;
            }

            for (var i = 0, len = tiles.length; i < len; ++i) {
                if (tiles[i].type !== 10 && tiles[i].type !== 12 && tiles[i].type !== 13 && tiles[i].type !== 14 && tiles[i].type !== 15) {
                    if (PAUSED === false) {
                        tiles[i].update();
                    }
                    tiles[i].draw();
                    if (tempTicks < lightDetailLevel && tempTicks > 1) {
                        if (i > 0) {
                            if (tiles[i - 1].lightLevel < tiles[i].lightLevel) {
                                tiles[i].lightLevel = tiles[i - 1].lightLevel + lightingPercision;
                            }
                        }
                        if (i < tiles.length - 1) {
                            if (tiles[i + 1].lightLevel < tiles[i].lightLevel) {
                                tiles[i].lightLevel = tiles[i + 1].lightLevel + lightingPercision;
                            }
                        }
                        if (i > map[0].length && i < tiles.length / 2) {
                            if (tiles[i - map[0].length].lightLevel < tiles[i].lightLevel) {
                                tiles[i].lightLevel = tiles[i - map[0].length].lightLevel + lightingPercision;
                            }
                        }
                        if (i < tiles.length / 2 - map[0].length) {
                            if (tiles[i + map[0].length].lightLevel < tiles[i].lightLevel) {
                                tiles[i].lightLevel = tiles[i + map[0].length].lightLevel + lightingPercision;
                            }
                        }
                    }
                }
                if (tiles[i].type === 77) {
                    if (tiles[i].powerUpActive === true) {
                        for (var j = 0; j < players.length; j++) {
                            if (players[j].x + players[j].width > tiles[i].x && players[j].x < tiles[i].x + tiles[i].width) {
                                if (players[j].y + players[j].height / 2 > tiles[i].y && players[j].y < tiles[i].y + tiles[i].height) {
                                    tiles[i].powerUpActive = false;
                                    tiles[i].spawnTimer = 0;
                                    var random = Math.random();
                                    if (random > 1 - potatoLauncherChance) {
                                        effects.push(new TextBox(tiles[i].x + tiles[i].width / 2, tiles[i].y - tiles[i].height / 2, 0, "Potato Launcher!!"));
                                        players[j].weapon = "Potato Launcher";
                                        players[j].bulletCount = 3;
                                        if(GAMESTATE === "GAME"){
                                            playerPoints[j] += 90;
                                        }
                                    } else {
                                        if (livesCanSpawn === false) {
                                            effects.push(new TextBox(tiles[i].x + tiles[i].width / 2, tiles[i].y - tiles[i].height / 2, 0, "Darts!"));
                                            players[j].weapon = "Darts";
                                            players[j].bulletCount = 20;
                                            if(GAMESTATE === "GAME") {
                                                playerPoints[j] += 50;
                                            }
                                        } else {
                                            if (random > 1 - potatoLauncherChance - heartChance) {
                                                effects.push(new TextBox(tiles[i].x + tiles[i].width / 2, tiles[i].y - tiles[i].height / 2, 0, "+1 Life!!"));
                                                players[j].lives++;
                                                if(GAMESTATE === "GAME") {
                                                    playerPoints[j] += 70;
                                                }
                                            } else {
                                                effects.push(new TextBox(tiles[i].x + tiles[i].width / 2, tiles[i].y - tiles[i].height / 2, 0, "Darts!"));
                                                players[j].weapon = "Darts";
                                                players[j].bulletCount = 20;
                                                if(GAMESTATE === "GAME") {
                                                    playerPoints[j] += 50;
                                                }
                                            }

                                        }
                                    }
                                    dingSound1.play();
                                    powerUpSpawned = false;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            var i = bullets.length;

            while(i--){
                if (PAUSED === false) {
                    bullets[i].update();
                }
                bullets[i].draw();

                var destroy = false;

                for (var j = 0; j < players.length; j++) {
                    if (bullets[i].x < players[j].x + players[j].width && bullets[i].x + bullets[i].velX + bullets[i].width > players[j].x) {
                        if (bullets[i].y > players[j].y - players[j].height / 2 && bullets[i].y < players[j].y + players[j].height / 2) {
                            if (players[j].team !== bullets[i].team) {
                                players[j].knockBackXVel = bullets[i].knockBack;
                                players[bullets[i].shooter].hitAmount++;
                                if (bullets[i].type === 4 || bullets[i].type === 5) {
                                    players[j].tempCauseOfDeath = "Was Sniped Off By " + players[bullets[i].shooter].name;
                                    if(GAMESTATE === "GAME") {
                                        playerPoints[bullets[i].shooter] += 200;
                                    }
                                } else {
                                    players[j].tempCauseOfDeath = "Was Knocked Off By " + players[bullets[i].shooter].name;
                                    if(GAMESTATE === "GAME") {
                                        playerPoints[bullets[i].shooter] += 100;
                                    }
                                }

                                destroy = true;
                            }

                        }
                    }
                }

                if (bullets.length > 0 && i !== bullets.length) {
                    if (bullets[i].x < 10 || bullets[i].x > WIDTH + 10) {
                        destroy = true;
                    }
                }

                if (bullets.length > 0 && i !== bullets.length) {
                    for (var j = 0; j < collidableBlocks.length; j++) {
                        if (Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize) < map.length) {
                            if (map[Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize)][Math.round((bullets[i].x - xOffset) / tileSize)] === collidableBlocks[j]) {
                                destroy = true;
                                break;
                            }
                        }
                    }
                } else {

                }

                if (destroy === true) {
                    bullets.splice(i, 1);
                }
            }

            /*for (var i = 0; i < bullets.length; i++) {
                if (PAUSED === false) {
                    bullets[i].update();
                }
                bullets[i].draw();

                var destroy = false;

                for (var j = 0; j < players.length; j++) {
                    if (bullets[i].x < players[j].x + players[j].width && bullets[i].x + bullets[i].velX + bullets[i].width > players[j].x) {
                        if (bullets[i].y > players[j].y - players[j].height / 2 && bullets[i].y < players[j].y + players[j].height / 2) {
                            if (players[j].team !== bullets[i].team) {
                                players[j].knockBackXVel = bullets[i].knockBack;
                                players[bullets[i].shooter].hitAmount++;
                                if (bullets[i].type === 4 || bullets[i].type === 5) {
                                    players[j].tempCauseOfDeath = "Was Sniped Off By " + players[bullets[i].shooter].name;
                                    if(GAMESTATE === "GAME") {
                                        playerPoints[bullets[i].shooter] += 200;
                                    }
                                } else {
                                    players[j].tempCauseOfDeath = "Was Knocked Off By " + players[bullets[i].shooter].name;
                                    if(GAMESTATE === "GAME") {
                                        playerPoints[bullets[i].shooter] += 100;
                                    }
                                }

                                destroy = true;
                            }

                        }
                    }
                }

                if (bullets.length > 0 && i !== bullets.length) {
                    if (bullets[i].x < 10 || bullets[i].x > WIDTH + 10) {
                        destroy = true;
                    }
                }

                if (bullets.length > 0 && i !== bullets.length) {
                    for (var j = 0; j < collidableBlocks.length; j++) {
                        if (Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize) < map.length) {
                            if (map[Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize)][Math.round((bullets[i].x - xOffset) / tileSize)] === collidableBlocks[j]) {
                                destroy = true;
                                break;
                            }
                        }
                    }
                } else {

                }

                if (destroy === true) {
                    bullets.splice(i, 1);
                }
            }*/

            //CONTROLS
            //PLAYER 1
            if (gameTicks > countDownEndTime + startDelay && PAUSED === false && GAMESTATE !== "GAME OVER") {
                if (players.length > 0) {
                    if (players[0].ai === false) {
                        if ((keys && keys[40]) && (keys && keys[38])) {

                        } else if (keys && keys[38]) {
                            players[0].yVel = -moveSpeed;
                        }
                        else if (keys && keys[40]) {
                            players[0].yVel = moveSpeed;
                            players[0].hide();
                        } else {

                        }

                        if ((keys && keys[37]) && (keys && keys[39])) {

                        } else if (keys && keys[37]) {
                            players[0].xVel = -moveSpeed;
                        }
                        else if (keys && keys[39]) {
                            players[0].xVel = moveSpeed;
                        } else {

                        }

                        if (keys && keys[77]) {
                            if (players[0].y + players[0].height < HEIGHT && players[0].y > 0) {
                                players[0].spawnBullet();
                            }
                        }
                    }
                }

                //PLAYER 2
                if (players.length > 1) {
                    if (players[1].ai === false) {
                        if ((keys && keys[69]) && (keys && keys[68])) {

                        } else if (keys && keys[69]) {
                            players[1].yVel = -moveSpeed;
                        }
                        else if (keys && keys[68]) {
                            players[1].yVel = moveSpeed;
                            players[1].hide();
                        }

                        if ((keys && keys[83]) && (keys && keys[70])) {

                        } else if (keys && keys[83]) {
                            players[1].xVel = -moveSpeed;
                        }
                        else if (keys && keys[70]) {
                            players[1].xVel = moveSpeed;
                        }

                        if (keys && keys[81]) {
                            if (players[1].y + players[1].height < HEIGHT && players[1].y > 0) {
                                players[1].spawnBullet();
                            }
                        }
                    }
                }

                //PLAYER 3
                if (players.length > 2) {
                    if (players[2].ai === false) {
                        if ((keys && keys[73]) && (keys && keys[75])) {

                        } else if (keys && keys[73]) {
                            players[2].yVel = -moveSpeed;
                        }
                        else if (keys && keys[75]) {
                            players[2].yVel = moveSpeed;
                            players[2].hide();
                        }

                        if ((keys && keys[74]) && (keys && keys[76])) {

                        } else if (keys && keys[74]) {
                            players[2].xVel = -moveSpeed;
                        }
                        else if (keys && keys[76]) {
                            players[2].xVel = moveSpeed;
                        }

                        if (keys && keys[89]) {
                            if (players[2].y + players[2].height < HEIGHT && players[2].y > 0) {
                                players[2].spawnBullet();
                            }
                        }
                    }

                }

                if (players.length > 3) {
                    if (players[3].ai === false) {
                        if ((keys && keys[104]) && (keys && keys[101])) {

                        } else if (keys && keys[104]) {
                            players[3].yVel = -moveSpeed;
                        }
                        else if (keys && keys[101]) {
                            players[3].yVel = moveSpeed;
                            players[3].hide();
                        }

                        if ((keys && keys[100]) && (keys && keys[102])) {

                        } else if (keys && keys[100]) {
                            players[3].xVel = -moveSpeed;
                        }
                        else if (keys && keys[102]) {
                            players[3].xVel = moveSpeed;
                        }

                        if (keys && keys[109]) {
                            if (players[3].y + players[3].height < HEIGHT && players[3].y > 0) {
                                players[3].spawnBullet();
                            }
                        }
                    }

                }

                if (aiBots.length > 0) {
                    for (var i = 0; i < aiBots.length; i++) {
                        aiBots[i].update();
                    }
                }
            }

            var i = players.length;

            while(i--){
                if (players[i].active === true) {
                    if (PAUSED === false) {
                        players[i].update();
                    }
                    players[i].draw();

                    if (players[i].x < -200 || players[i].x > WIDTH + 200 || players[i].y < -200 || players[i].y > HEIGHT + 200) {
                        if (players[i].lives - 1 === 0) {
                            for (var a = 0; a < aiBots.length; a++) {
                                if (aiBots[a].player === i) {
                                    aiBots.splice(a, 1);
                                }
                            }
                        }

                        players[i].die();
                    }
                }
            }

            /*for (var i = 0; i < players.length; i++) {
                if (players[i].active === true) {
                    if (PAUSED === false) {
                        players[i].update();
                    }
                    players[i].draw();

                    if (players[i].x < -200 || players[i].x > WIDTH + 200 || players[i].y < -200 || players[i].y > HEIGHT + 200) {
                        if (players[i].lives - 1 === 0) {
                            for (var a = 0; a < aiBots.length; a++) {
                                if (aiBots[a].player === i) {
                                    aiBots.splice(a, 1);
                                }
                            }
                        }

                        players[i].die();
                    }
                }
            }*/

            for (var i = 0; i < balloons.length; i++) {
                if (PAUSED === false) {
                    balloons[i].update();
                }
                balloons[i].draw();
            }

            for (var i = 0; i < tiles.length; i++) {
                if (tiles[i].type === 10 || tiles[i].type === 12 || tiles[i].type === 13 || tiles[i].type === 14 || tiles[i].type === 15) {
                    if (PAUSED === false) {
                        tiles[i].update();
                    }
                    tiles[i].draw();
                }
            }

            for (var i = 0; i < effects.length; i++) {
                if (PAUSED === false) {
                    effects[i].update();
                }
                effects[i].draw();
                if (effects[i].lifeSpan === 0) {
                    effects.splice(i, 1);
                }
            }

            ctx.globalAlpha = rainOpacity;
            ctx.fillStyle = stormgrd;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = 'white';
            ctx.globalAlpha = 1;

            if (lightningBoltFlashOpacity > 0) {
                ctx.fillStyle = 'white';
                ctx.globalAlpha = lightningBoltFlashOpacity;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                ctx.globalAlpha = 1;
                lightningBoltFlashOpacity -= 0.2;
            }

            for (var i = 0; i < playerStatBoxes.length; i++) {
                if (PAUSED === false) {
                    playerStatBoxes[i].update();
                }
                playerStatBoxes[i].draw();
            }
            if (tempTicks % updateSpeed === 0) {
                cameraYWindOffsetVel += (Math.random() * rainOpacity / 2 - rainOpacity / 4);
                cameraYWindOffset += cameraYWindOffsetVel;
                if (cameraYWindOffset > HEIGHT / 50) {
                    cameraYWindOffset = HEIGHT / 50;
                } else if (cameraYWindOffset < -HEIGHT / 50) {
                    cameraYWindOffset = -HEIGHT / 50;
                }
                if (cameraYWindOffsetVel > 2) {
                    cameraYWindOffsetVel = 2;
                } else if (cameraYWindOffsetVel < -2) {
                    cameraYWindOffsetVel = -2;
                }
                cameraGlobalY = Math.round(Math.sin(tempTicks / 50) * 3 + cameraGlobalYOffset + cameraYWindOffset);
            }

        }

        if (PAUSED === true) {
            if (pauseOpacity < 0.8) {
                pauseOpacity += 0.1;
            }
        } else {
            if (pauseOpacity > 0.1) {
                pauseOpacity -= 0.1;
            } else {
                pauseOpacity = 0;
            }
        }

        if (pauseOpacity > 0.1) {
            ctx.globalAlpha = pauseOpacity;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.font = '50px Arial';
            ctx.fillText("Paused", WIDTH / 2, HEIGHT / 3);
            ctx.globalAlpha = 1;
        }


    }

    if ((keys && keys[32]) && GAMESTATE === "GAME") {
        if(pauseTimer === 0){
            PAUSED = !PAUSED;
            if(PAUSED === true){
                buttons.push(new Slider(WIDTH/2, leftPanelOptionsY + leftPanelOptionsHeight/10*3, leftPanelOptionsWidth*0.8, 0, "Sound Volume"));
                buttons.push(new Slider(WIDTH/2, leftPanelOptionsY + leftPanelOptionsHeight/10*5, leftPanelOptionsWidth*0.8, 1, "Particles"));
                buttons.push(new Slider(WIDTH/2, leftPanelOptionsY + leftPanelOptionsHeight/10*7, leftPanelOptionsWidth*0.8, 2, "Update Speed"));
                buttons.push(new Button("Menu", WIDTH/2 - WIDTH/10, HEIGHT - HEIGHT/15*2, WIDTH/5, HEIGHT/20));
            }else{
                var i = buttons.length;
                while(i--){
                    if (buttons[i].type !== 99) {
                        buttons.splice(i, 1);
                    }
                }
            }
        }
        pauseTimer = 10;
    }

    if(stateToTransitionTo !== ""){
        if(stateToTransitionTo !== "GAME" && stateToTransitionTo !== "GAME OVER"){
            if(transitionOpacity < 1){
                transitionOpacity += 0.05;
            }else{
                GAMESTATE = stateToTransitionTo;
                checkGameState();
                stateToTransitionTo = "";
            }
        }else if(stateToTransitionTo === "GAME"){
            GAMESTATE = stateToTransitionTo;
            checkGameState();
            stateToTransitionTo = "";
        }else if(stateToTransitionTo === "GAME OVER"){
            if(transitionOpacity < 0.8){
                transitionOpacity += 0.02;
            }else{
                GAMESTATE = stateToTransitionTo;
                checkGameState();
                stateToTransitionTo = "";
            }
        }

    }else if(GAMESTATE !== "GAME OVER"){
        if(transitionOpacity > 0.05){
            transitionOpacity -= 0.05;
        }else{
            transitionOpacity = 0;
        }
    }

    ctx.globalAlpha = transitionOpacity;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = 1;

    if(GAMESTATE === "MENU" || GAMESTATE === "GAME SETUP" || GAMESTATE === "GAME" || GAMESTATE === "GAME OVER"){
        window.onmousemove = logMouseMove;
        for(var b = 0; b < buttons.length; b++){
            buttons[b].update();
            if(buttons.length > 0){
                buttons[b].draw();
            }
        }
    }

    if(pauseTimer > 0){
        pauseTimer--;
    }

    if(clickTimer < 1){
        clickTimer++;
    }

    if(GAMESTATE === "GAME OVER"){

        if(sorted === false){

            for(var i = 0; i < players.length; i++){
                if(players[i].lives > 0){
                    playerPoints[i] += 1000;
                    break;
                }
            }

            for(var i = 0 ; i < playerPoints.length; i++){
                playerPointsNoSort.push(playerPoints[i]);
            }
            playerPoints.sort(function(a, b){return b-a;});

            for(var i = 0; i < playerPointsNoSort.length; i++){
                if(playerPointsNoSort[i] === playerPoints[0]){
                    Order[0] = i;
                    break;
                }
            }

            if(players.length > 1){
                for(var i = 0; i < playerPointsNoSort.length; i++){
                    if(playerPointsNoSort[i] === playerPoints[1] && i !== Order[0]){
                        Order[1] = i;
                        break;
                    }
                }
            }

            if(players.length > 2) {
                for (var i = 0; i < playerPointsNoSort.length; i++) {
                    if (playerPointsNoSort[i] === playerPoints[2] && i !== Order[1]) {
                        Order[2] = i;
                        break;
                    }
                }
            }

            if(players.length > 3) {
                for (var i = 0; i < playerPointsNoSort.length; i++) {
                    if (playerPointsNoSort[i] === playerPoints[3] && i !== Order[2]) {
                        Order[3] = i;
                        break;
                    }
                }
            }

            sorted = true;
        }else{
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial'
            ctx.textAlign = 'center';
            ctx.fillText(players[Order[0]].name + " Wins!!", WIDTH/2, HEIGHT/5);

            ctx.font = '30px Arial';
            ctx.globalAlpha = 0.4;
            for(var i = 0; i < columnXs.length; i++){
                if(i % 2 === 0){
                    ctx.fillStyle = 'white';
                }else{
                    ctx.fillStyle = 'gray';
                }
                ctx.fillRect(columnXs[i], HEIGHT/4, columnWidth, HEIGHT/2);
            }

            for(var i = 0; i < 5; i++){
                ctx.globalAlpha = 0.1;
                if(i % 2 === 0){
                    ctx.fillStyle = 'black';
                }else{
                    ctx.fillStyle = 'gray';
                }
                ctx.fillRect(columnXs[0], HEIGHT/4 + i*HEIGHT/2/5, columnWidth*columns, HEIGHT/2/5);
            }
            ctx.globalAlpha = 1;

            ctx.fillStyle = 'white';
            ctx.font = '25px Arial';

            displayedTextTimer++;

            if(displayedTextTimer % 5 === 0){
                if(displayedTexts < players.length){
                    displayedTexts++;
                }else{
                    if(buttons.length === 0){
                        buttons.push(new Button("Menu", WIDTH/4, HEIGHT - HEIGHT/10, WIDTH/5, HEIGHT/20));
                        buttons.push(new Button("Play Again", WIDTH/2 + WIDTH/4 - WIDTH/5, HEIGHT - HEIGHT/10, WIDTH/5, HEIGHT/20));
                    }
                }
            }

            ctx.fillText("Player", startColumnX + columnWidth/2, HEIGHT/4 + HEIGHT/20);
            ctx.fillText("Points", startColumnX + columnWidth/2 + columnWidth, HEIGHT/4 + HEIGHT/20);
            ctx.fillText("Accuracy", startColumnX + columnWidth/2 + columnWidth*2, HEIGHT/4 + HEIGHT/20);
            ctx.fillText("Kills", startColumnX + columnWidth/2 + columnWidth*3, HEIGHT/4 + HEIGHT/20);

            ctx.font = '20px Arial';
            for(var i = 0; i < displayedTexts; i++){
                if(!(Order[i] > players.length - 1)){
                    ctx.globalAlpha = 1;
                    ctx.fillText(players[Order[i]].name, startColumnX + columnWidth/2, HEIGHT/4 + HEIGHT/20 + HEIGHT/10*(i+1));
                    ctx.fillText(playerPointsNoSort[Order[i]], startColumnX + columnWidth/2 + columnWidth, HEIGHT/4 + HEIGHT/20 + HEIGHT/10*(i+1));
                    ctx.fillText(playerAccuracy[Order[i]] + "%", startColumnX + columnWidth/2 + columnWidth*2, HEIGHT/4 + HEIGHT/20 + HEIGHT/10*(i+1));
                    ctx.fillText(parseInt(playerKills[Order[i]]), startColumnX + columnWidth/2 + columnWidth*3, HEIGHT/4 + HEIGHT/20 + HEIGHT/10*(i+1));
                }
            }
        }

    }else if(GAMESTATE === "MENU"){
        if(optionsOpen === true){
            if(leftPanelOptionsX < leftPanelOptionsWidth*0.1){
                leftPanelOptionsX+=50;
            }
        }else{
            if(leftPanelOptionsX > -leftPanelOptionsWidth){
                leftPanelOptionsX-=50;
            }
        }

        if(creditsOpen === true){
            if(leftPanelCreditsX < leftPanelCreditsWidth*0.1){
                leftPanelCreditsX+=50;
            }
        }else{
            if(leftPanelCreditsX > -leftPanelCreditsWidth){
                leftPanelCreditsX-=50;
            }
        }
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = 'white';
        ctx.fillRect(leftPanelOptionsX, leftPanelOptionsY, leftPanelOptionsWidth, leftPanelOptionsHeight);
        ctx.font = '30px Arial';
        ctx.globalAlpha = 0.8;
        ctx.textAlign = 'center';
        ctx.fillText("Options", leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10);
        ctx.font = '20px Arial';
        ctx.fillText("Sounds", leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10*4);
        ctx.fillText("Particles", leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10*6);
        ctx.fillText("Update Speed", leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10*8);
        ctx.font = '15px Arial';
        ctx.fillText("(Lower is better on slower computers)", leftPanelOptionsX + leftPanelOptionsWidth/2, leftPanelOptionsY + leftPanelOptionsHeight/10*8.5);

        ctx.globalAlpha = 0.2;
        ctx.fillStyle = 'white';
        ctx.fillRect(leftPanelCreditsX, leftPanelCreditsY, leftPanelCreditsWidth, leftPanelCreditsHeight);
        ctx.font = '30px Arial';
        ctx.globalAlpha = 0.8;
        ctx.textAlign = 'center';
        ctx.fillText("Credits", leftPanelCreditsX + leftPanelCreditsWidth/2, leftPanelCreditsY + leftPanelCreditsHeight/10);
        ctx.font = '15px Arial';
        ctx.fillText("All Art, Code and Music made by:", leftPanelCreditsX + leftPanelCreditsWidth/2, leftPanelCreditsY + leftPanelCreditsHeight/10*3);
        ctx.font = '20px Arial';
        ctx.fillText("Martin Feranec", leftPanelCreditsX + leftPanelCreditsWidth/2, leftPanelCreditsY + leftPanelCreditsHeight/10*4);
    }

    if (fullScreenTimer > 0) {
        fullScreenTimer--;
    }

    if (popUpTimer > 0) {
        popUpTimer--;
        popUpOpacity = 1
    }
    if (popUpOpacity > 0.01) {
        popUpOpacity -= 0.01;
        ctx.globalAlpha = popUpOpacity;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, HEIGHT / 2 - HEIGHT / 16, WIDTH, HEIGHT / 8);
        ctx.textAlign = 'center';
        ctx.font = '25pt Courier New';
        ctx.fillStyle = 'white';
        ctx.fillText("Press F11 to exit full screen mode.", WIDTH / 2, HEIGHT / 2);
        ctx.globalAlpha = 1;
    }

    if(GAMESTATE === "MENU") {
        var tempCanvas = document.getElementById("myCanvas");

        var height = document.documentElement.clientHeight;

        if (height === screen.height && FULLSCREEN === false) {
            popUpTimer = 100;
            unloadScrollBars();
            tempCanvas.width = document.body.clientWidth;
            tempCanvas.height = tempCanvas.width * 0.5625;
            document.getElementById("canvasHolder").style.position = "absolute";
            document.getElementById("canvasHolder").style.left = '0px';
            document.getElementById("canvasHolder").style.top = '0px';
            document.getElementById("canvasHolder").style.border = '0px solid lightgray';
            if (document.getElementById("foo-pop") !== null) {
                document.getElementById("foo-pop").setAttribute('hidden', true);
                document.getElementById("foo-boring").setAttribute('hidden', true);
            }
            FULLSCREEN = true;
            stateToTransitionTo = GAMESTATE;
            tileSize = Math.round((HEIGHT - HEIGHT / 10) / map.length);

            xOffset = Math.round(WIDTH / 2 - (tileSize * map[0].length) / 2);
            yOffset = Math.round(HEIGHT / 2 - (tileSize * map.length) / 2);

            moveSpeed = tileSize / 12;
            bulletSpeed = tileSize / 6;

            WIDTH = tempCanvas.width;
            HEIGHT = tempCanvas.height;

            grd = ctx.createLinearGradient(0, 0, 0, HEIGHT/1.2);
            grd.addColorStop(0, "rgb(86, 136, 216)");
            grd.addColorStop(1, "rgb(100, 183, 249)");

            stormgrd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, HEIGHT/120, WIDTH/2, HEIGHT/2, WIDTH/2);

            stormgrd.addColorStop(0, "rgba(5, 5, 5, 0.4)");
            stormgrd.addColorStop(1, "rgba(33, 32, 33, 1)");
        }

        if (height !== screen.height && FULLSCREEN === true) {
            reloadScrollBars();
            tempCanvas.width = 1152;
            tempCanvas.height = 648;
            document.getElementById("canvasHolder").style.position = "relative";
            document.getElementById("canvasHolder").style.border = '3px solid lightgray';
            if (document.getElementById("foo-pop") !== null) {
                document.getElementById("foo-pop").removeAttribute('hidden');
                document.getElementById("foo-boring").removeAttribute('hidden');
            }
            FULLSCREEN = false;
            stateToTransitionTo = GAMESTATE;
            tileSize = Math.round((HEIGHT - HEIGHT / 10) / map.length);

            xOffset = Math.round(WIDTH / 2 - (tileSize * map[0].length) / 2);
            yOffset = Math.round(HEIGHT / 2 - (tileSize * map.length) / 2);

            moveSpeed = tileSize / 12;
            bulletSpeed = tileSize / 6;

            WIDTH = tempCanvas.width;
            HEIGHT = tempCanvas.height;

            grd = ctx.createLinearGradient(0, 0, 0, HEIGHT/1.2);
            grd.addColorStop(0, "rgb(86, 136, 216)");
            grd.addColorStop(1, "rgb(100, 183, 249)");

            stormgrd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, HEIGHT/120, WIDTH/2, HEIGHT/2, WIDTH/2);

            stormgrd.addColorStop(0, "rgba(5, 5, 5, 0.4)");
            stormgrd.addColorStop(1, "rgba(33, 32, 33, 1)");
        }
    }

}

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}

function logMouseMove(e) {
    e = event || window.event;

    var rect = canvas.getBoundingClientRect();

    mousePosX = e.clientX - rect.left;
    mousePosY = e.clientY - rect.top;
}

document.addEventListener("mouseup", clickedNow);
document.addEventListener("mousedown", draggedNow);

function clickedNow(){
    if(clickTimer === 1){
        clickTimer = 0;
        dragging = false;
    }
}

function draggedNow(){
    dragging = true;
}

var keys;

window.addEventListener('keydown', function (e) {
    keys = (keys || []);
    keys[e.keyCode] = (e.type === "keydown");

    if([32, 37, 38, 39, 40, 114, 112].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

}, false);
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.type === "keydown");
}, false);

function reloadScrollBars() {
    document.documentElement.style.overflow = 'auto';  // firefox, chrome
    document.body.scroll = "yes"; // ie only
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}
