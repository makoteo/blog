//Copyright (c) Martin Feranec - 2020

var versionCode = "Alpha 0.97 Menu Update";
var WIDTH = 1024;//800
var HEIGHT = 576;//450
var gameRunning = true;
var TIME = 0;

var frameCount = 0;

var map = [];

// 0 = empty, 1 = wall, 2 = door, 3 = permawall, 4 = loot, 5 = innerroom, 6 = lockedDoor

var mapdimensions = 70; //70, 90, 110

var mapwidth = mapdimensions;
var mapheight = mapdimensions;

var roomsize = 8; //8

var room2size = 36; //36, 40, 40
var room2 = true; //true, true, true

var room3size = 72; //null, null, 72
var room3 = false; //false, false, true

var tileSize = 72; //Math.floor(72*(WIDTH/1024))
var defTileSize = 72;
var offset = 0;

var textureSize = 24*5; //Scale factor is 5 for whatever reason, but it's not 16 lol... Messes up the game haha... Note from later, I think I was drunk while writing this

var cameraX = tileSize*(mapwidth-10)/2;
var cameraY = tileSize*(mapheight-6)/2;

var cameraZoom = 1;

//var cameraX = 0;
//var cameraY = 0;

var playerSpeedsList = [5, 3];
var playerSpeed = playerSpeedsList[0]*(WIDTH/800); //5

var doorsGenerated = false;

var lootChances = 0.042; //0.03

var creators = [];
var enemies = [];
//KICKSTART GAME
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var tileMap = new Image();
//tileMap.onload = generateMap();
tileMap.src = "TileSetMazeScaled.png";

var backgrounds = new Image();
backgrounds.src = "backgrounds.png";

// EXAMPLE ARRAY coins = [];

//LIGHTING
var rayseg = 1;
var seglength = tileSize/10;

var lightmap = [];
var temprowlm = [];
for(var i = 0; i < 9; i++){
    temprowlm = [];
    for(var j = 0; j < 13; j++){
        temprowlm.push(0);
    }
    lightmap.push(temprowlm);
}

var currentLight = 0;
var lightConstant = 0.1;

var xCameraOffset = 0;
var yCameraOffset = 0;

var DIFFICULTY = 0.03;

var HIGHSCORE = 0;

/*
setInterval(function(){tileSize*=0.995; cameraX = player.gameX*0.995-player.x+player.width*tileSize/2; cameraY = player.gameY*0.995-player.y+player.height*tileSize/2; seglength = tileSize/10;}, 100);
 */

var ORIGINALSEED = Math.floor(Math.random()*Math.pow(10, 10)); //COPY THIS IF YOU WANT TO PLAY THE SAME MAZE
//8468407084; - Dunno, I think this one takes long to generate and has a path that's too long so it regenerates again
//2936916693; - Checking that mobs can't go through walls
//955920860; - Walls being weird
//7899284295; - nothing generates?
//5459613113; - so much food
//5214141823; - easy win
var SEED = ORIGINALSEED;
SEED = 5214141823;

var showMap = false;
var mapTileSize = 3;

var player;

var maxTunnelLength = 7;

var mousePosX = 0;
var mousePosY = 0;

var clicked = false;

var itemNames = ["SWORD", "BREAD", "KEY", "CHICKEN", "CLUB", "SPIKY CLUB", "BAT WING", "WIDE SWORD", "DOUBLE AXE", "RAT MEAT", "BERRIES", "HEALTH POTION", "SPIDER GLAND", "Not"]; //ADD ITEM ID WHEN ADDING ITEM
var itemIDs = [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.01, 4.11, 4.21, 4.31, 4.41, 4.51, 4.61, 4.71, 4.81, 4.91, 4.02];
var nutritionValues = [0, 20, 0, 50, 0, 0, 15, 0, 0, 25, 20, 15, 40];
var itemSacrificeValues = [45, 20, 70, 30, 30, 40, 20, 55, 35, 25, 15, 65, 35];
var itemDamageValues = [20, 0, 0, 0, 10, 18, 0, 24, 15, 0, 0, 0];

var itemSpawnRate = [3, 16, 1, 14, 7, 4, 0, 2, 3, 0, 19, 2, 0];
var enemyRates = [4, 2, 1];

var spikesAnimFrame = 0;

var GODSATISFACTION = 100;
var MAXGODSATISFACTION = 200;

var godDecreasePerSecond = 0.6;

var mobSpawnChance = 0.04; //0.02
var mobSpawnRate = 90;
var maxMobCount = 2;

var fontSize1 = WIDTH/23;
var fontSize2 = WIDTH/13.3;
var fontSize3 = WIDTH/26.6;

var DEBUG = false;

var GAMESTATE = "MENU";
var SWIPEVALUE = 0;

var buttons = [];

var sacrificedItem = -1;
var sacrificedAnimationFrame = 0;

var FULLSCREEN = false;
var SETDIFFICULTY = "e";
var MAPSIZE = "sml";
var SCARCELOOT = false;
var MADGODS = 0;

var SFX = true;
var MUSIC = true;

var GUI = true;

var BGRANDOMS = [0, 0];

var sounds = [];

var MUSICCHANCE = 0.04;

//TEST

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Player(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.gameX = 0;
    this.gameY = 0;

    this.tileX = 0;
    this.tileY = 0;

    this.topMargin = 1/2; //2/5

    this.dir = 0;

    this.animationFrame = 0;
    this.animationTimer = 0;

    this.movingX = false;
    this.movingY = false;

    this.frozen = false;

    this.inventory = [];

    this.ereleased = true;
    this.spaceReleased = true;
    this.qreleased = true;

    this.inventorySelected = 0;

    this.inventoryX = WIDTH - WIDTH/3;
    this.inventoryY = HEIGHT- HEIGHT/5;
    this.inventorySize = WIDTH/10;
    this.inventoryOffset = WIDTH/100;

    this.inventoryItemOffset = WIDTH/100;

    this.previousGameX = 0;
    this.previousGameY = 0;

    this.maxHealth = 100;
    this.maxHunger = 100;
    this.saturation = 0.2;

    this.health = this.maxHealth;
    this.hunger = this.maxHunger;

    this.saturationList = [0.2, 0.8];

    this.moveAnimSpeed = 7;

    this.attackAnimation = 0;

    this.weaponOffset = 0;
    this.weaponOffsetY = 0;

    this.weaponScaleY = 1;

    this.attackTimer = 0;
    this.attacking = false;
    this.stunTimer = 0;
    this.stunY = 0;

    this.moveCycle = 1;

    this.noclip = false;

    this.visible = true;

    this.update = function(){
        if(!this.frozen){this.winStateCheck();}

        if(this.stunTimer > 0){
            this.stunTimer--;
        }
        if(this.stunY < 0){
            this.stunY+=2;
        }

        this.gameX = cameraX - this.width/2*tileSize + WIDTH/2;
        this.gameY = cameraY - this.height/2*tileSize + HEIGHT/2;

        this.movingX = false;
        if(this.previousGameX !== this.gameX){this.movingX = true;}

        this.movingY = false;
        if(this.previousGameY !== this.gameY){this.movingY = true;}

        if(this.previousGameX !== this.gameX || this.previousGameY !== this.gameY){
            this.moveCycle++;
            if(document.getElementById("walkingAudioGame") === null && TIME !== 0){
                if(playerSpeed === (playerSpeedsList[0]*(WIDTH/800))){
                    sounds.push(new sound("walking.wav", true, "walkingAudioGame"));
                }else{
                    sounds.push(new sound("walkingSlow.wav", true, "walkingAudioGame"));
                }
                sounds[sounds.length-1].sound.volume = 0.2;
                sounds[sounds.length-1].play();
            }
        }else{
            if(cameraZoom < 1) {
                //cameraZoom += 0.001;
            }
        }

        this.previousGameX = this.gameX;
        this.previousGameY = this.gameY;

        this.tileX = Math.floor(this.gameX/tileSize);
        this.tileY = Math.floor(this.gameY/tileSize);

        this.tileY3 = Math.floor((this.gameY+this.height*this.topMargin*tileSize)/tileSize);

        this.tileX2 = Math.floor((this.gameX+this.width*tileSize)/tileSize);
        this.tileY2 = Math.floor((this.gameY+this.height*tileSize)/tileSize);

        this.tileX3 = Math.floor((this.gameX+this.width/2*tileSize)/tileSize);
        this.tileY4 = Math.floor((this.gameY+this.height/3*2*tileSize)/tileSize);

        if(this.frozen === false && this.attacking === false && this.stunTimer === 0){
            if(!this.noclip){this.checkCollisions(1);}else{this.checkCollisions(-1);}
            this.actionButtonCheck();
        }

        this.saturation = this.saturationList[0]; //RESET BEFORE FUNCTION SEES IF PLAYER IS MOVING
        this.calculateCamera(); //CAUSE THIS FUNCTION ALSO SETS SATURATION IF PLAYER MOVES
        if(frameCount % 60 === 0){
            this.countBars();
        }
        this.countHealth();

        if(this.attackTimer > 0){this.attackTimer--;}
        if(this.attackTimer === 0){
            this.attacking = false;
        }

        if(this.attacking === true){
            if(this.dir === 0 || this.dir === 1){
                if(this.weaponAngle > 0){
                    this.weaponAngle += 15;
                }else if(this.weaponAngle < 0){
                    this.weaponAngle -= 15;
                }
                if(Math.abs(this.weaponAngle) >= 100){
                    this.attacking = false;
                }else{
                    this.animationFrame = 2;
                }
            }else{
                this.weaponScaleY -= 0.2;

                this.weaponAngle += 5;
                if(this.weaponScaleY <= 0.2){
                    this.attacking = false;
                }
            }
        }else{
            this.weaponScaleY = 1;
            this.handOffset = 0;
            if(this.dir === 0){
                this.weaponAngle = -5;
                this.handOffset = -tileSize*0.7;
            }else if(this.dir === 1){
                this.weaponAngle = 5;
                this.handOffset = -tileSize*0.7;
            }else if(this.dir === 2){
                this.weaponAngle = 0;
                this.handOffset = -tileSize*0.7;
            }else{
                this.weaponAngle = 0;
            }

            if(this.animationFrame === 3){
                this.weaponOffset = 0;
                this.weaponOffsetY = -tileSize/4;
            }else if(this.animationFrame === 0){
                if(this.dir === 1 || this.dir === 3){
                    this.weaponOffset = -tileSize/20;
                }else if(this.dir === 0 || this.dir === 2){
                    this.weaponOffset = tileSize/20;
                }else{
                    this.weaponOffset = 0;
                }
                this.weaponOffsetY = -tileSize/3;

            }else if(this.animationFrame === 1){
                this.weaponOffset = 0;
                this.weaponOffsetY = -tileSize/4;
            }else{
                if(this.dir === 1 || this.dir === 3){
                    this.weaponOffset = tileSize/20;
                }else if(this.dir === 0 || this.dir === 2){
                    this.weaponOffset = -tileSize/20;
                }else{
                    this.weaponOffset = 0;
                }
                this.weaponOffsetY = -tileSize/3;
            }
        }

    };

    this.countBars = function(){
        if(this.hunger  > 0){
            this.hunger = Math.max(0, this.hunger - this.saturation);
        }

        if(this.hunger < 30){
            playerSpeed = playerSpeedsList[1]*(WIDTH/800);
            this.moveAnimSpeed = 12;
        }else{
            playerSpeed = playerSpeedsList[0]*(WIDTH/800);
            this.moveAnimSpeed = 7;
        }

        if(this.hunger < 10){
            if(this.health > 0){
                this.health = Math.max(0, this.health - 10);
            }
        }

        if(this.hunger > 45){
            this.health = Math.min(this.health + 0.3, this.maxHealth);
        }

        GODSATISFACTION = Math.max(GODSATISFACTION - godDecreasePerSecond, 0.1);
        mobSpawnChance = DIFFICULTY*(1/Math.pow((GODSATISFACTION/10)/10000, 0.25) - 0.25*18)+TIME/200000;
        maxMobCount = Math.floor(1/Math.pow((GODSATISFACTION/10)/10000, 0.25) - 0.25*18);
        //console.log(maxMobCount, mobSpawnChance);
    };

    this.countHealth = function(){
        if(map[this.tileY2][this.tileX3] === 0.63){
            this.health = Math.max(this.health - 1, 0);
            if(document.getElementById("oof") === null) {
                sounds.push(new sound("oof.wav", true, "oof"));
                sounds[sounds.length - 1].sound.volume = 0.3;
                sounds[sounds.length - 1].play();
            }
        }
        if(map[this.tileY2][this.tileX3] === 0.7){
            playerSpeed = playerSpeedsList[1]*(WIDTH/1600);
        }
    }

    this.calculateCamera = function(){
        if((keys && keys[68] || keys && keys[39] || keys && keys[40] || keys && keys[83] || keys && keys[65] || keys && keys[37] || keys && keys[38] || keys && keys[87])){
            this.saturation = this.saturationList[1];
            switch(this.dir) {
                case 0:
                    if(xCameraOffset > -20 && this.movingX === true){
                        xCameraOffset-=2;
                    }
                    break;
                case 1:
                    if(xCameraOffset < 20 && this.movingX === true){
                        xCameraOffset+=2;
                    }
                    break;
                case 2:
                    if(yCameraOffset < 20 && this.movingY === true){
                        yCameraOffset+=2;
                    }
                    break;
                case 3:
                    if(yCameraOffset > -20 && this.movingY === true){
                        yCameraOffset-=2;
                    }
                    break;
            }
        }
        if(!this.movingX) {
            /*if (xCameraOffset > 0) {
                xCameraOffset -= 1;
            } else if (xCameraOffset < 0) {
                xCameraOffset += 1;
            }*/
            xCameraOffset=0.9*Math.round(10*xCameraOffset)/10;
            if(Math.abs(xCameraOffset) < 0.5){
                xCameraOffset = 0;
            }
        }
        if(!this.movingY){
            if(yCameraOffset > 0){
                yCameraOffset -= 1;
            }else if(yCameraOffset < 0){
                yCameraOffset += 1;
            }
        }
    };

    this.checkCollisions = function(block){
        if(Math.floor((this.gameY + this.height*this.topMargin*tileSize - playerSpeed)/tileSize) !== this.tileY3){
            if(Math.floor(map[this.tileY3 - 1][this.tileX]) === block || Math.floor(map[this.tileY3 - 1][this.tileX2]) === block){
                if (keys && keys[38] || keys && keys[87]) {cameraY+=Math.round((this.tileY3)*tileSize+1-(this.gameY)-(this.height*this.topMargin*tileSize)); this.dir = 3;}
            }else{
                if (keys && keys[38] || keys && keys[87]) {cameraY-=playerSpeed; this.dir = 3;}
            }
        }else{
            if (keys && keys[38] || keys && keys[87]) {cameraY-=playerSpeed; this.dir = 3;}
        }

        if(Math.floor((this.gameY + this.height*tileSize + playerSpeed)/tileSize) !== this.tileY2){
            if(Math.floor(map[this.tileY2 + 1][this.tileX]) === block || Math.floor(map[this.tileY2 + 1][this.tileX2]) === block){
                if (keys && keys[40] || keys && keys[83]) {cameraY+=Math.round(((this.tileY2+1)*tileSize - (this.gameY + this.height*tileSize)))-1; this.dir = 2;}
            }else{
                if (keys && keys[40] || keys && keys[83]) {cameraY+=playerSpeed; this.dir = 2;}
            }
        }else{
            if (keys && keys[40] || keys && keys[83]) {cameraY+=playerSpeed; this.dir = 2;}
        }

        this.gameX = cameraX - this.width/2*tileSize + WIDTH/2;
        this.gameY = cameraY - this.height/2*tileSize + HEIGHT/2;

        this.tileX = Math.floor(this.gameX/tileSize);
        this.tileY = Math.floor(this.gameY/tileSize);

        this.tileY3 = Math.floor((this.gameY+this.height*this.topMargin*tileSize)/tileSize);

        this.tileX2 = Math.floor((this.gameX+this.width*tileSize)/tileSize);
        this.tileY2 = Math.floor((this.gameY+this.height*tileSize)/tileSize);

        this.tileX3 = Math.floor((this.gameX+this.width/2*tileSize)/tileSize);
        this.tileY4 = Math.floor((this.gameY+this.height/3*2*tileSize)/tileSize);

        //THE ABOVE SOLVES THE ISSUE WITH COLLISIONS NOT WORKING ON CORNERS

        if(Math.floor((this.gameX - playerSpeed)/tileSize) !== this.tileX){
            if(Math.floor(map[this.tileY3][this.tileX - 1]) === block || Math.floor(map[this.tileY2][this.tileX - 1]) === block){
                if (keys && keys[65] || keys && keys[37]) {cameraX+=Math.round((this.tileX)*tileSize+1-(this.gameX)); this.dir = 0;}
            }else{
                if (keys && keys[65] || keys && keys[37]) {cameraX-=playerSpeed; this.dir = 0;}
            }
        }else{
            if (keys && keys[65] || keys && keys[37]) {cameraX-=playerSpeed; this.dir = 0;}
        }

        if(Math.floor((this.gameX + this.width*tileSize + playerSpeed)/tileSize) !== this.tileX2){
            if(Math.floor(map[this.tileY3][this.tileX2 + 1]) === block || Math.floor(map[this.tileY2][this.tileX2 + 1]) === block){
                if (keys && keys[68] || keys && keys[39]) {cameraX+=Math.round(((this.tileX2+1)*tileSize - (this.gameX + this.width*tileSize))-1); this.dir = 1;}
            }else{
                if (keys && keys[68] || keys && keys[39]) {cameraX+=playerSpeed; this.dir = 1;}
            }
        }else{
            if (keys && keys[68] || keys && keys[39]) {cameraX+=playerSpeed; this.dir = 1;}
        }
    };

    this.draw = function(){

        this.breathCycle = Math.round(Math.sin(frameCount/30)*2) + 2;

        if(this.movingX === true || this.movingY === true){
            this.animationTimer++;
            if(this.animationTimer >= this.moveAnimSpeed){
                this.animationFrame++;
                this.animationTimer = 0;
            }
            if(this.animationFrame > 3){
                this.animationFrame = 0;
            }
        }else{
            if(!this.attacking) {
                this.animationFrame = 3;
            }
        }

        /* OPPOSITE HANDED
         if(this.animationFrame === 3){
         this.weaponOffset = 0;
         this.weaponOffsetY = 0;
         }else if(this.animationFrame === 0){
         if(this.dir === 1){
         this.weaponOffset = tileSize/28;
         }else if(this.dir === 0){
         this.weaponOffset = tileSize/28;
         }else{
         this.weaponOffset = 0;
         }
         this.weaponOffsetY = -tileSize/50;

         }else if(this.animationFrame === 1){
         this.weaponOffset = 0;
         this.weaponOffsetY = 0;
         }else{
         if(this.dir === 1){
         this.weaponOffset = -tileSize/28;
         }else if(this.dir === 0){
         this.weaponOffset = -tileSize/28;
         }else{
         this.weaponOffset = 0;
         }
         this.weaponOffsetY = -tileSize/50;
         }
       */

        if(this.dir === 3){
            this.drawWeapon();
        }

        //SHADOW

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';

        ctx.beginPath();
        ctx.arc(this.x + xCameraOffset, this.y+this.height*tileSize*0.4 + yCameraOffset, this.width*tileSize*0.4, 0, Math.PI*2, false);
        ctx.fill();

        //END SHADOW

        ctx.drawImage(tileMap, textureSize*4+textureSize*this.animationFrame, textureSize*this.dir, textureSize, textureSize, this.x - tileSize/2 + xCameraOffset, this.y - this.height/2*tileSize + yCameraOffset - this.breathCycle + this.stunY, tileSize, this.height*tileSize + this.breathCycle); //NORMAL

        //THIS IS FUNNY AHAH - ctx.drawImage(tileMap, Math.floor(this.inventory[this.inventorySelected])*textureSize, textureSize*5.5, textureSize, textureSize, this.x - this.width/2*tileSize + xCameraOffset, this.y - this.height/2*tileSize + yCameraOffset - this.breathCycle, this.width*tileSize, this.height*tileSize + this.breathCycle); //NORMAL
        if(this.dir !== 3){
            this.drawWeapon();
        }
    };

    this.getItemSelectedName = function(){
        return itemNames[Math.floor(this.inventory[this.inventorySelected]) + 10*(Math.floor(this.inventory[this.inventorySelected]*10)-Math.floor(this.inventory[this.inventorySelected])*10)];
    };
    this.getItemSelectedNutrition = function(){
        return nutritionValues[Math.floor(this.inventory[this.inventorySelected]) + 10*(Math.floor(this.inventory[this.inventorySelected]*10)-Math.floor(this.inventory[this.inventorySelected])*10)];
    };
    this.getItemSelectedSacrificeValue = function(){
        return itemSacrificeValues[Math.floor(this.inventory[this.inventorySelected]) + 10*(Math.floor(this.inventory[this.inventorySelected]*10)-Math.floor(this.inventory[this.inventorySelected])*10)];
    };
    this.getItemSelectedDamageValue = function(){
        return itemDamageValues[Math.floor(this.inventory[this.inventorySelected]) + 10*(Math.floor(this.inventory[this.inventorySelected]*10)-Math.floor(this.inventory[this.inventorySelected])*10)];
    };
    this.drawWeapon = function(){
        if(this.getItemSelectedName() === "SWORD" || this.getItemSelectedName() === "CLUB" || this.getItemSelectedName() === "SPIKY CLUB" || this.getItemSelectedName() === "WIDE SWORD" || this.getItemSelectedName() === "DOUBLE AXE"){
            ctx.save();
            ctx.translate(this.x - this.width/4*tileSize + xCameraOffset + this.weaponOffset + tileSize/2 + this.handOffset, this.y - this.height/2*tileSize + yCameraOffset + this.weaponOffsetY + tileSize - this.breathCycle/2);
            ctx.rotate(this.weaponAngle*Math.PI/180);
            ctx.drawImage(tileMap, Math.floor(this.inventory[this.inventorySelected])*textureSize, textureSize*5.5 + (this.inventory[this.inventorySelected] - Math.floor(this.inventory[this.inventorySelected]))*10*textureSize, textureSize, textureSize, -tileSize/6*3, -tileSize + (1-this.weaponScaleY)*tileSize/4*3 + this.stunY, tileSize, Math.abs(tileSize*this.weaponScaleY)); //NORMAL
            //DRAW BODY PORTION OF PLAYER TO COVER SWORD
            ctx.restore();
        }
    };

    this.renderGUI = function(){
        if(this.tileY3 < mapheight && this.tileY3 > -1 && map[this.tileY3][this.tileX3] === 0.5){
            if(this.inventory.length > 0 && this.inventorySelected < this.inventory.length){
                ctx.font = fontSize2 + 'px quickPixel';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText("Press E to SACRIFICE " + this.getItemSelectedName(), WIDTH/2, HEIGHT*0.6);
            }
        }
        if((this.tileY < mapheight && this.tileY > -1 && map[this.tileY][this.tileX] === 1.8 && this.tileY < mapheight/2) || (this.tileY+2 < mapheight && map[this.tileY + 2][this.tileX] === 1.8 && this.tileY > mapheight/2)){
            if(this.getItemSelectedName() === "KEY"){
                ctx.font = fontSize1 + 'px quickPixel';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText("Press E to OPEN DOOR", WIDTH/2, HEIGHT*0.7);
            }else{
                ctx.font = fontSize1 + 'px quickPixel';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText("You need a KEY to open this door", WIDTH/2, HEIGHT*0.7);
            }
        }
        if(this.tileY4 < mapheight && this.tileY4 > -1 && Math.floor(map[this.tileY4][this.tileX3]) === 4){
            ctx.font = fontSize1 + 'px quickPixel';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            if(this.inventory.length < 3){
                ctx.fillText("Press E to PICK UP", WIDTH/2, HEIGHT*0.6);
            }else{
                ctx.fillText("INVENTORY FULL", WIDTH/2, HEIGHT*0.6);
            }
        }

        if(this.getItemSelectedNutrition() > 0 && this.hunger !== this.maxHunger){
            ctx.font = fontSize3 + 'px quickPixel';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'right';
            ctx.fillText("Press SPACE to CONSUME " + this.getItemSelectedName(), WIDTH/2 + WIDTH/7, HEIGHT - HEIGHT/10);
        }else if(this.getItemSelectedName() === "SWORD" || this.getItemSelectedName() === "CLUB"  || this.getItemSelectedName() === "SPIKY CLUB" || this.getItemSelectedName() === "WIDE SWORD" || this.getItemSelectedName() === "DOUBLE AXE"){
            ctx.font = fontSize3 + 'px quickPixel';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText("Press SPACE to ATTACK", WIDTH/2, HEIGHT - HEIGHT/10);
        }

        if(this.inventory.length > this.inventorySelected && this.tileY3 < mapheight && this.tileY3 > -1 && map[this.tileY3][this.tileX3] === 0) {
            ctx.font = fontSize3 + 'px quickPixel';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgb(50, 50, 50)';
            ctx.fillText("Press Q to DROP ITEM", WIDTH/2 + WIDTH/7, HEIGHT - HEIGHT/25);
        }

        //INVENTORY
        for(var inv = 0; inv < 3; inv++){
            if(inv === this.inventorySelected){
                ctx.drawImage(tileMap, textureSize, textureSize*8.5, textureSize, textureSize, this.inventoryX + this.inventorySize*inv + this.inventoryOffset*inv, this.inventoryY, this.inventorySize, this.inventorySize); //NORMAL
            }else{
                ctx.drawImage(tileMap, 0, textureSize*8.5, textureSize, textureSize, this.inventoryX + this.inventorySize*inv + this.inventoryOffset*inv, this.inventoryY, this.inventorySize, this.inventorySize); //NORMAL
            }
        }

        for(var sl = 0; sl < this.inventory.length; sl++){
            ctx.drawImage(tileMap, Math.floor(this.inventory[sl])*textureSize, textureSize*5.5 + (this.inventory[sl] - Math.floor(this.inventory[sl]))*10*textureSize, textureSize, textureSize, this.inventoryX + this.inventorySize*sl + this.inventoryOffset*sl + this.inventoryItemOffset/2, this.inventoryY + this.inventoryItemOffset/2, this.inventorySize - this.inventoryItemOffset, this.inventorySize - this.inventoryItemOffset); //NORMAL
        }

        //HEALTH AND HUNGER

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40, this.maxHealth*2*WIDTH/1024, HEIGHT/20);
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40 + HEIGHT/20 + HEIGHT/100, this.maxHunger*2*WIDTH/1024, HEIGHT/20);

        ctx.fillStyle = 'rgba(150, 0, 0, 0.8)';
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40, this.health*2*WIDTH/1024, HEIGHT/20);

        ctx.fillStyle = 'rgba(0, 100, 0, 0.8)';
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40 + HEIGHT/20 + HEIGHT/100, this.hunger*2*WIDTH/1024, HEIGHT/20);


        ctx.font = HEIGHT/18 + 'px quickPixel';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(200, 200, 200)';
        ctx.fillText("HEALTH", WIDTH/100 + this.maxHealth, this.inventoryY + HEIGHT/17);
        ctx.fillText("HUNGER", WIDTH/100 + this.maxHunger, this.inventoryY + HEIGHT/17 + HEIGHT/20 + HEIGHT/100);

        //GOD SATISFACTION

        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.fillRect(WIDTH/2 - MAXGODSATISFACTION*1.5*WIDTH/1024, HEIGHT/40, MAXGODSATISFACTION*3*WIDTH/1024, HEIGHT/15);

        ctx.fillStyle = 'rgba(240, 240, 240, 0.8)';
        ctx.fillRect(WIDTH/2 - MAXGODSATISFACTION*1.5*WIDTH/1024, HEIGHT/40, GODSATISFACTION*3*WIDTH/1024, HEIGHT/15);

        ctx.font = HEIGHT/10 + 'px quickPixel';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0)';
        ctx.fillText("GODS' SATISFACTION", WIDTH/2, HEIGHT/13);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.translate(WIDTH/2, HEIGHT/2);
        var tmptheta = Math.atan2(this.gameY - mapwidth/2*tileSize, this.gameX - mapheight/2*tileSize) - Math.PI/2;
        ctx.rotate(tmptheta);
        ctx.beginPath();
        ctx.lineTo(-WIDTH/100, -WIDTH/6);
        ctx.lineTo(0, -WIDTH/40-WIDTH/6);
        ctx.lineTo(WIDTH/100, -WIDTH/6);
        ctx.lineTo(0, -WIDTH/6);
        ctx.fill();
        ctx.rotate(-tmptheta);
        ctx.translate(-WIDTH/2, -HEIGHT/2);

    };

    this.attack = function(){
        this.attacking = true;
        this.attackTimer = 20; //MUST ALWAYS BE 20
    };

    this.actionButtonCheck = function(){
        if(keys && keys[69]){
            //DOORS
            if((map[this.tileY][this.tileX] === 1.8 && this.tileY < mapheight/2) && this.getItemSelectedName() === "KEY"){
                map[this.tileY][this.tileX] = 6.1;
                sounds.push(new sound("release.wav", true, "rel"));
                sounds[sounds.length-1].sound.volume = 0.5;
                sounds[sounds.length-1].play();
                sounds.push(new sound("sigh.wav", true, "rel"));
                sounds[sounds.length-1].sound.volume = 0.5;
                sounds[sounds.length-1].play();
                this.inventory.splice(this.inventorySelected, 1);
            }else if(map[this.tileY + 2][this.tileX] === 1.8 && this.tileY > mapheight/2 && this.getItemSelectedName() === "KEY"){
                map[this.tileY + 2][this.tileX] = 6.1;
                sounds.push(new sound("release.wav", true, "rel"));
                sounds[sounds.length-1].sound.volume = 0.5;
                sounds[sounds.length-1].play();
                sounds.push(new sound("sigh.wav", true, "rel"));
                sounds[sounds.length-1].sound.volume = 0.5;
                sounds[sounds.length-1].play();
                this.inventory.splice(this.inventorySelected, 1);
            }
            //ITEM PICK UP
            else if(this.tileY4 < mapheight && this.tileY4 > -1 && Math.floor(map[this.tileY4][this.tileX3]) === 4){
                if(this.inventory.length < 3){
                    this.inventory.push(Math.round((map[this.tileY4][this.tileX3] - 4)*100)/10);
                    map[this.tileY4][this.tileX3] = 0;
                    sounds.push(new sound("pickup.wav", true, "attack"));
                    sounds[sounds.length-1].sound.volume = 0.3;
                    sounds[sounds.length-1].play();
                }else{
                    //DISPLAY INVENTORY FULL MESSAGE OR SWAP ITEM IDK
                }
            }
            //SACRIFICE
            else if(this.tileY3 < mapheight && this.tileY3 > -1 && map[this.tileY3][this.tileX3] === 0.5 && this.ereleased === true){
                if(this.inventorySelected < this.inventory.length){
                    GODSATISFACTION = Math.min(GODSATISFACTION + this.getItemSelectedSacrificeValue()*1.3 - 0.3*MADGODS, MAXGODSATISFACTION);
                    var tmpItem = Math.floor(Math.floor(this.inventory[this.inventorySelected]) + 100*(this.inventory[this.inventorySelected]%1));
                    sacrificedItem = itemIDs[tmpItem];
                    sacrificedAnimationFrame = 0.01;
                    sounds.push(new sound("choirSac.wav", true, "attack"));
                    sounds[sounds.length-1].sound.volume = 0.6;
                    sounds[sounds.length-1].play();
                    this.inventory.splice(this.inventorySelected, 1);
                    this.ereleased = false;
                }
            }
        }else{
            this.ereleased = true;
        }

        //Q KEY
        if(keys && keys[81] && this.qreleased === true){
            if(this.inventory.length > this.inventorySelected && map[this.tileY4][this.tileX3] === 0) {
                var tmpItem = Math.floor(Math.floor(this.inventory[this.inventorySelected]) + 100*(this.inventory[this.inventorySelected]%1));
                //console.log(tmpItem);
                map[this.tileY4][this.tileX3] = itemIDs[tmpItem];
                this.inventory.splice(this.inventorySelected, 1);
                sounds.push(new sound("pickup.wav", true, "attack"));
                sounds[sounds.length-1].sound.volume = 0.15;
                sounds[sounds.length-1].play();
            }
            this.qreleased = false;
        }else{
            this.qreleased = true;
        }

        //SPACE KEY

        //EATING FOOD

        if(keys && keys[32]){
            if(this.getItemSelectedNutrition() > 0 && this.spaceReleased === true && this.hunger !== this.maxHunger){
                this.hunger = Math.min(this.hunger + this.getItemSelectedNutrition(), this.maxHunger);
                if(this.getItemSelectedName() === "SPIDER GLAND"){
                    this.health = Math.min(this.health + this.getItemSelectedNutrition()*0.8, this.maxHealth);
                }else if(this.getItemSelectedName() === "HEALTH POTION"){
                    this.health = Math.min(this.health + this.getItemSelectedNutrition()*5, this.maxHealth);
                }else{
                    this.health = Math.min(this.health + this.getItemSelectedNutrition()/10, this.maxHealth);
                }
                this.inventory.splice(this.inventorySelected, 1);
                sounds.push(new sound("hardSwipe.wav", true, "attack"));
                sounds[sounds.length-1].sound.volume = 0.2;
                sounds[sounds.length-1].play();
                this.spaceReleased = false;
            }
            if((this.getItemSelectedName() === "SWORD" || this.getItemSelectedName() === "CLUB"  || this.getItemSelectedName() === "SPIKY CLUB"  || this.getItemSelectedName() === "WIDE SWORD" || this.getItemSelectedName() === "DOUBLE AXE") && this.spaceReleased === true && this.attackTimer === 0){
                this.attack();
                sounds.push(new sound("weapon.wav", true, "attack"));
                sounds[sounds.length-1].sound.volume = 0.5;
                sounds[sounds.length-1].play();

                this.spaceReleased = false;
            }
        }else{
            this.spaceReleased = true;
        }

        if(clicked === true){
            for(var invs = 0; invs < 3; invs++){
                if(mousePosX > this.inventoryX + this.inventorySize*invs + this.inventoryOffset*invs && mousePosX < this.inventoryX + this.inventorySize*invs + this.inventoryOffset*invs + this.inventorySize &&
                    mousePosY > this.inventoryY && mousePosY < this.inventoryY + this.inventorySize){
                    if(this.inventorySelected !== invs){
                        sounds.push(new sound("clickBass.wav", true, "clickBass"));
                        sounds[sounds.length-1].sound.volume = 0.2;
                        sounds[sounds.length-1].play();
                    }
                    this.inventorySelected = invs;
                    break;
                }
            }
        }

        //Could be done through for loop... Oh I fixed it lol
        for(var idk = 49; idk < 52; idk++){
            if(keys && keys[idk] && this.inventorySelected !== idk-49){
                this.inventorySelected = idk-49;
                sounds.push(new sound("clickBass.wav", true, "clickBass"));
                sounds[sounds.length-1].sound.volume = 0.2;
                sounds[sounds.length-1].play();
                break;
            }
        }

    };

    this.winStateCheck = function(){
        if(this.tileY < 0 || this.tileY === mapheight - 1){
            console.log("YOU WIN!");
            trMaker.nextState = "WIN";
            trMaker.transitioning = true;
            var tmpHScore = localStorage.getItem("HighScoreMaze");
            if(TIME < tmpHScore || tmpHScore === 0){
                localStorage.setItem("HighScoreMaze", TIME.toString());
                HIGHSCORE = TIME;
            }
            this.frozen = true;
            sounds.push(new sound("backSwish.wav", true, "oof"));
            sounds[sounds.length - 1].sound.volume = 0.1;
            sounds[sounds.length - 1].play();
        }
        if(this.health <= 0){
            console.log("YOU LOSE!");
            trMaker.nextState = "LOSS";
            trMaker.transitioning = true;
            this.frozen = true;
            sounds.push(new sound("backSwish.wav", true, "oof"));
            sounds[sounds.length - 1].sound.volume = 0.1;
            sounds[sounds.length - 1].play();
        }
    };

}

function Creator(x, y, killable){
    this.x = x;
    this.y = y;
    this.dir = 1;
    this.previousdir = 0;
    this.dead = false;
    this.killable = killable;
    this.aliveTime = 0;
    this.update = function() {
        //CHECK DIRECTIONS
        if(this.killable === false){
            this.aliveTime++;
        }

        this.possibleDirections = [];
        this.spawnNew = randomNum();
        this.die = randomNum();

        if(this.spawnNew < 0.26){
            creators.push(new Creator(this.x, this.y, true));
        }

        if(this.die < 0.025 && this.killable === true){
            this.dead = true;
        }

        if(this.y > 2){
            if(map[this.y - 2][this.x] === 1){
                this.possibleDirections.push(0);
            }
        }
        if(this.x < map.length - 2){
            if(map[this.y][this.x + 2] === 1){
                this.possibleDirections.push(1);
            }
        }
        if(this.y < map[0].length - 2){
            if(map[this.y+2][this.x] === 1){
                this.possibleDirections.push(2);
            }
        }
        if(this.x > 2){
            if(map[this.y][this.x - 2] === 1){
                this.possibleDirections.push(3);
            }
        }
        if(this.possibleDirections.length > 0){
            this.dir = this.possibleDirections[Math.floor(randomNum()*this.possibleDirections.length)];
        }else{
            //BACKTRACKER


            if((this.possibleDirections.length <= 3 && this.killable === true) || (this.possibleDirections.length === 0 && this.killable === false && this.aliveTime > 100)) {
                this.dead = true;
                //The following creates so many junctions:
                if(randomNum() < 0.3) {
                    if(this.y > 2 && map[this.y - 2][this.x] !== 3){
                        this.possibleDirections.push(0);
                    }
                    if(this.x < map.length - 2  && map[this.y][this.x + 2] !== 3){
                        this.possibleDirections.push(1);
                    }
                    if(this.y < map[0].length - 2  && map[this.y + 2][this.x] !== 3){
                        this.possibleDirections.push(2);
                    }
                    if(this.x > 2  && map[this.y][this.x - 2] !== 3){
                        this.possibleDirections.push(3);
                    }
                }
            }
            this.dir = this.possibleDirections[Math.floor(randomNum()*this.possibleDirections.length)];
        }

        map[this.y][this.x] = 0;
        if(this.dir === 0){
            map[this.y - 1][this.x] = 0;
            map[this.y - 2][this.x] = 0;
            this.y-=2;
        }else if(this.dir === 1){
            map[this.y][this.x + 1] = 0;
            map[this.y][this.x + 2] = 0;
            this.x+=2;
        }else if(this.dir === 2){
            map[this.y + 1][this.x] = 0;
            map[this.y + 2][this.x] = 0;
            this.y+=2;
        }else if(this.dir === 3){
            map[this.y][this.x - 1] = 0;
            map[this.y][this.x - 2] = 0;
            this.x-=2;
        }
    };
    this.draw = function(){
        if(this.killable) {
            ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
            ctx.fillRect(this.x * 20, this.y * 20, tileSize * 0.5, tileSize * 0.5);
        }
    }
}

function Enemy(tileX, tileY, type){
    this.tileX = tileX;
    this.tileY = tileY;
    this.type = type;

    this.size = tileSize;

    this.despawnDistance = 10;

    this.gameX = this.tileX*tileSize - cameraX;
    this.gameY = this.tileY*tileSize - cameraY;

    this.xOffSet = 0;
    this.yOffSet = 0;

    //Should probably be switch
    if(this.type === 0) {// BAT
        this.moveSpeed = 3*(WIDTH/800);
        this.attackSpeed = 40;
        this.paralysisTime = 25;
        this.damage = 5;
        this.attackDelayer = 5;
        this.health = 50;
    }else if(this.type === 1) { //RAT
        this.moveSpeed = 4*(WIDTH/800);
        this.attackSpeed = 30;
        this.paralysisTime = 10;
        this.damage = 10;
        this.attackDelayer = 4;
        this.health = 60;
    }else if(this.type === 2) { //RAT
        this.moveSpeed = 2.5*(WIDTH/800);
        this.attackSpeed = 40;
        this.paralysisTime = 20;
        this.damage = 25;
        this.attackDelayer = 4;
        this.health = 80;
    }

    this.moveDirX = 0;
    this.moveDirY = 0;

    this.aliveTimer = 0;

    this.dead = false;

    this.path = [];
    this.followingPlayer = false;

    this.paralysisTimer = 0;

    this.attackTimer = 0;

    this.animationFrame = 0;

    this.animationDir = 1;

    this.attackOffsetX = 0;
    this.attackOffsetY = 0;

    this.dir = 0;

    this.animDir = 0; //I think this is which direction it's is pointing

    this.animationRunning = true;

    this.update = function(){
        this.aliveTimer++;

        //if(this.type === 1){if(this.moveDirX === 0 && this.moveDirY === 0){this.animationRunning = false;}else{this.animationRunning = true;}}
        this.animationRunning = !(this.moveDirX === 0 && this.moveDirY === 0);

        //PATHFINDING, DON'T MESS WITH IT PLS, IT TOOK SO LONG TO DO
        if(this.paralysisTimer === 0){
            for(var l = 0; l < this.path.length; l++) {
                if(this.path[l].y !== this.tileY || this.path[l].x !== this.tileX){
                    if(this.path[l].y < this.tileY && (Math.floor(map[this.tileY - 1][this.tileX]) === 0 || Math.floor(map[this.tileY - 1][this.tileX]) === 4)){
                        this.moveDirY = -1;
                    }else if(this.path[l].y > this.tileY && (Math.floor(map[this.tileY + 1][this.tileX]) === 0 || Math.floor(map[this.tileY + 1][this.tileX]) === 4)){
                        this.moveDirY = 1;
                    }else{
                        this.moveDirY = 0;
                        this.yOffset = 0;
                    }

                    this.yOffSet += this.moveDirY*this.moveSpeed;
                    if(Math.abs(this.yOffSet) >= tileSize){
                        this.tileY += this.moveDirY;
                        this.yOffSet = 0;
                    }
                    if(this.moveDirY === 0){
                        if(this.path[l].x < this.tileX && (((Math.floor(map[this.tileY][this.tileX - 1]) === 0 || Math.floor(map[this.tileY][this.tileX - 1]) === 4)) ||
                            ((Math.floor(map[this.tileY + 1][this.tileX - 1]) === 0 || Math.floor(map[this.tileY + 1][this.tileX - 1]) === 4) && this.moveDirY === 1) ||
                            ((Math.floor(map[this.tileY - 1][this.tileX - 1]) === 0 || Math.floor(map[this.tileY - 1][this.tileX - 1]) === 4) && this.moveDirY === -1))){
                            this.moveDirX = -1;
                            this.animDir = -1;
                        }else if(this.path[l].x > this.tileX && (((Math.floor(map[this.tileY][this.tileX + 1]) === 0 || Math.floor(map[this.tileY][this.tileX + 1]) === 4)) ||
                            ((Math.floor(map[this.tileY + 1][this.tileX + 1]) === 0 || Math.floor(map[this.tileY + 1][this.tileX + 1]) === 4) && this.moveDirY === 1) ||
                            ((Math.floor(map[this.tileY - 1][this.tileX + 1]) === 0 || Math.floor(map[this.tileY - 1][this.tileX + 1]) === 4) && this.moveDirY === -1))){
                            this.moveDirX = 1;
                            this.animDir = 1;
                        }else{
                            this.moveDirX = 0;
                            this.xOffset = 0;
                        }

                        this.xOffSet += this.moveDirX*this.moveSpeed;

                        if(Math.abs(this.xOffSet) >= tileSize){
                            this.tileX += this.moveDirX;
                            this.xOffSet = 0;
                        }
                    }else{
                        this.moveDirX = 0;
                        this.xOffset = 0;
                    }

                    break;
                }else{
                    if(this.path[l].y === this.tileY && this.path[l].x === this.tileX){
                        this.path.splice(l, 1);
                    }
                }
            }
            if(this.moveDirX === 0) {
                //This is basically to finish step so it doesn't get stuck in walls.
                if (Math.abs(this.xOffSet) > 0 + this.moveSpeed) {
                    this.xOffSet -= sign(this.xOffSet) * this.moveSpeed;
                } else {
                    this.xOffSet = 0;
                }
            }
            if(this.moveDirY === 0){
                if(Math.abs(this.yOffSet) > 0 + this.moveSpeed){
                    this.yOffSet-=sign(this.yOffSet)*this.moveSpeed;
                }else{
                    this.yOffSet = 0;
                }
            }

        }else{
            this.paralysisTimer--;
        }

        //Spikes do damage
        if((this.type !== 0) && map[this.tileY][this.tileX] === 0.63){
            this.health-=1;
            this.animationFrame = 3;
        }

        if(this.attackTimer > 0){
            this.attackTimer--;
        }

        if(this.attackOffsetX !== 0){
            this.attackOffsetX -= this.attackOffsetX/Math.abs(this.attackOffsetX);
        }
        if(this.attackOffsetY !== 0){
            this.attackOffsetY -= this.attackOffsetY/Math.abs(this.attackOffsetY);
        }

        if(this.attackTimer === 1){
            this.dealDamage();
            if(this.type === 2){
                if(map[this.tileY][this.tileX] === 0){
                    map[this.tileY][this.tileX] = 0.7;
                }
            }
        }

        this.gameX = this.tileX*tileSize - cameraX + this.xOffSet + this.size/2;
        this.gameY = this.tileY*tileSize - cameraY + this.yOffSet + this.size/2;

        //Item drops
        if(this.health <= 0){
            this.dead = true;
            if((map[this.tileY][this.tileX]) === 0){
                var rnd = randomNum();
                if(this.type === 0){
                    if(rnd < 1){
                        map[this.tileY][this.tileX] = 4.6;
                    }
                }else if(this.type === 1){
                    if(rnd < 1){
                        map[this.tileY][this.tileX] = 4.9;
                    }
                }else if(this.type === 2){
                    if(rnd < 1){
                        map[this.tileY][this.tileX] = 4.21;
                    }
                }
            }
        }

        if(Math.sqrt((player.gameX + player.width*tileSize/2 - (this.gameX + cameraX))*(player.gameX + player.width*tileSize/2 - (this.gameX + cameraX)) + (player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY))*(player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY))) < tileSize && this.attackTimer === 0 && this.followingPlayer === true && this.xOffSet === 0 && this.yOffSet === 0){
            this.startAttack();
        }


        if(frameCount % 5 === 0) {
            if (this.followingPlayer === false) {
                this.checkPlayerVisible();
            } else if(!player.frozen){
                this.path = pathFinding([this.tileX, this.tileY], [player.tileX3, player.tileY2]);
                //console.log(this.path);
            }
            //console.log(this.xOffSet, this.yOffSet)
        }

        if(Math.abs(player.tileX - this.tileX) > this.despawnDistance || Math.abs(player.tileY - this.tileY) > this.despawnDistance){
            this.dead = true;
        }

        this.checkDamage();

    };

    this.checkDamage = function(){
        if(player.attackTimer === 19){
            if(Math.sqrt((player.gameX + player.width*tileSize/2 - (this.gameX + cameraX))*(player.gameX + player.width*tileSize/2 - (this.gameX + cameraX)) + (player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY))*(player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY))) < tileSize){
                //playerSpeed = 1;
                if((this.tileX === player.tileX3 && this.tileY === player.tileY4) || (this.tileY >= player.tileY4 && player.dir === 2) || (this.tileY <= player.tileY4 && player.dir === 3) ||
                    (this.tileX <= player.tileX3 && player.dir === 0) || (this.tileX >= player.tileX3 && player.dir === 1)){
                    this.paralysisTimer = this.paralysisTime;
                    this.health -= player.getItemSelectedDamageValue();
                    sounds.push(new sound("sigh.wav", true, "attack"));
                    sounds[sounds.length-1].sound.volume = 0.5;
                    sounds[sounds.length-1].play();
                    this.animationFrame = 3; //Red hit frame
                    this.animationDir = 0;
                    this.aliveTimer -= this.aliveTimer%7 + 1; //Probably resetting frame
                    if(this.attackTimer > 0){
                        this.attackTimer += this.attackDelayer;
                    }
                    this.path = [];
                }
            }
        }else{
            var distanceTmp = Math.sqrt((player.gameX + player.width*tileSize/2 - (this.gameX + cameraX))*(player.gameX + player.width*tileSize/2 - (this.gameX + cameraX)) + (player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY))*(player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY)));
            if(distanceTmp < tileSize) {
                playerSpeed = playerSpeedsList[1]*(WIDTH/800); //Slow down player when passing by
            }else if(distanceTmp < tileSize*0.5){
                this.path = [];
                this.xOffSet = 0;
                this.yOffSet = 0;
                //console.log("Deleted");
            }

            if(this.aliveTimer%30 === 0){
                if(this.type === 0) {
                    sounds.push(new sound("release.wav", true, "batSounds"));
                    sounds[sounds.length - 1].sound.playbackRate = 1.1;
                    sounds[sounds.length - 1].sound.volume = 0.4 / Math.sqrt(Math.max(distanceTmp, 0.5));
                    sounds[sounds.length - 1].play();
                }else if(this.type === 1 && this.animationRunning){
                    sounds.push(new sound("walking.wav", true, "ratSounds"));
                    sounds[sounds.length - 1].sound.playbackRate = 1.4;
                    sounds[sounds.length - 1].sound.volume = 0.7 / Math.sqrt(Math.max(distanceTmp, 0.5));
                    sounds[sounds.length - 1].play();
                }else if(this.type === 2 && this.animationRunning){
                    sounds.push(new sound("walkingSlow.wav", true, "SpiderSounds"));
                    sounds[sounds.length - 1].sound.playbackRate = 0.95;
                    sounds[sounds.length - 1].sound.volume = 0.7 / Math.sqrt(Math.max(distanceTmp, 0.5));
                    sounds[sounds.length - 1].play();
                }
            }
        }
    };

    this.startAttack = function(){
        this.attackTimer = this.attackSpeed;
        this.paralysisTimer = this.attackSpeed;
    };

    this.dealDamage = function(){
        if(Math.sqrt((player.gameX + player.width*tileSize/2 - (this.gameX + cameraX))*(player.gameX + player.width*tileSize/2 - (this.gameX + cameraX)) + (player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY))*(player.gameY + player.height*tileSize/3*2 - (this.gameY - this.size/2 + cameraY))) < tileSize*1.5) {
            if(DEBUG === false){
                player.health = Math.max(0, player.health - this.damage);
                sounds.push(new sound("oof.wav", true, "oof"));
                sounds[sounds.length-1].sound.volume = 0.3;
                sounds[sounds.length-1].play();
            }
            this.attackOffsetX+=20*this.moveDirX;
            this.attackOffsetY+=20*this.moveDirY;
            player.stunTimer = 8;
            player.stunY = -8;
        }
    };

    this.draw = function(){
        //ctx.fillStyle = 'rgba(200, 0, 0, 0.9)';

        //ctx.fillRect(this.gameX + xCameraOffset - this.size/2 + this.attackOffsetX, this.gameY + yCameraOffset - this.size/2 - this.size/2 + this.attackOffsetY, tileSize, tileSize);

        if(this.type === 0) {
            if(this.aliveTimer % 7 === 0) {
                this.animationFrame += this.animationDir;
                if(this.animationFrame >= 2){//2
                    this.animationDir = -1;
                }else if(this.animationFrame === 0){
                    this.animationDir = 1;
                }
            }
            if(this.animDir === 1){
                ctx.drawImage(tileMap, textureSize*8 + textureSize*this.animationFrame, 0, textureSize, textureSize, this.gameX + xCameraOffset - this.size/2 + this.attackOffsetX, this.gameY + yCameraOffset - this.size/2 - this.size/2 + this.attackOffsetY, tileSize, tileSize); //NORMAL
            }else{
                ctx.drawImage(tileMap, textureSize*8 + textureSize*this.animationFrame, textureSize, textureSize, textureSize, this.gameX + xCameraOffset - this.size/2 + this.attackOffsetX, this.gameY + yCameraOffset - this.size/2 - this.size/2 + this.attackOffsetY, tileSize, tileSize); //NORMAL
            }
            //ctx.fillStyle = 'red';
            //ctx.fillRect(this.tileX*tileSize - cameraX, this.tileY*tileSize - cameraY, tileSize, tileSize);
        }else if(this.type === 1){
            if(this.aliveTimer % 9 === 0 && this.animationRunning === true && this.attackTimer < 15 && this.paralysisTimer === 0) {
                this.animationFrame += this.animationDir;
                if(this.animationFrame >= 3){//3
                    //this.animationDir = -1;
                    this.animationFrame = 0;
                }
                this.animationDir = 1;

            }else if(this.aliveTimer % 9 === 0 && this.animationRunning === false){
                this.animationFrame = 0;
            }
            if(this.animDir === 1){
                ctx.drawImage(tileMap, textureSize*8 + textureSize*this.animationFrame, textureSize*2, textureSize, textureSize, this.gameX + xCameraOffset - this.size/2 + this.attackOffsetX, this.gameY + yCameraOffset - this.size/2 - this.size/2 + this.attackOffsetY, tileSize, tileSize); //NORMAL
            }else{
                ctx.drawImage(tileMap, textureSize*8 + textureSize*this.animationFrame, textureSize*3, textureSize, textureSize, this.gameX + xCameraOffset - this.size/2 + this.attackOffsetX, this.gameY + yCameraOffset - this.size/2 - this.size/2 + this.attackOffsetY, tileSize, tileSize); //NORMAL
            }
            //ctx.fillStyle = 'red';
            //ctx.fillRect(this.tileX*tileSize - cameraX, this.tileY*tileSize - cameraY, tileSize, tileSize);
        }else if(this.type === 2){
            if(this.aliveTimer % 8 === 0 && this.animationRunning === true && this.attackTimer < 15 && this.paralysisTimer === 0) {
                this.animationFrame += this.animationDir;
                if(this.animationFrame >= 3){//3
                    //this.animationDir = -1;
                    this.animationFrame = 0;
                }
                this.animationDir = 1;

            }else if(this.aliveTimer % 9 === 0 && this.animationRunning === false){
                this.animationFrame = 0;
            }
            if(this.animDir === 1){
                ctx.drawImage(tileMap, textureSize*12 + textureSize*this.animationFrame, 0, textureSize, textureSize, this.gameX + xCameraOffset - this.size/2 + this.attackOffsetX, this.gameY + yCameraOffset - this.size/2 - this.size/2 + this.attackOffsetY, tileSize, tileSize); //NORMAL
            }else{
                ctx.drawImage(tileMap, textureSize*12 + textureSize*this.animationFrame, textureSize, textureSize, textureSize, this.gameX + xCameraOffset - this.size/2 + this.attackOffsetX, this.gameY + yCameraOffset - this.size/2 - this.size/2 + this.attackOffsetY, tileSize, tileSize); //NORMAL
            }
            //ctx.fillStyle = 'red';
            //ctx.fillRect(this.tileX*tileSize - cameraX, this.tileY*tileSize - cameraY, tileSize, tileSize);
        }
    };

    this.checkPlayerVisible = function() {
        var theta = 0;
        if(this.tileX === player.tileX2 || this.tileY === player.tileY2){
            rayseg = Math.sqrt((cameraX + player.x - this.tileX * tileSize - tileSize / 2) * (cameraX + player.x - this.tileX * tileSize - tileSize / 2) + (cameraY + player.y - this.tileY * tileSize - tileSize / 2) * (cameraY + player.y - this.tileY * tileSize - tileSize / 2)) / seglength;
            theta = Math.atan2((this.tileY * tileSize + tileSize / 2) - (cameraY + player.y), (this.tileX * tileSize + tileSize / 2) - (cameraX + player.x));
            ctx.strokeStyle = 'rgba(255, 0, 0, 1)';

            /*ctx.beginPath();
            ctx.moveTo(0, (this.tileY * tileSize + tileSize / 2) - (cameraY + player.y));
            ctx.lineTo(WIDTH, (this.tileY * tileSize + tileSize / 2) - (cameraY + player.y));
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo((this.tileX * tileSize + tileSize / 2) - (cameraX + player.x), 0);
            ctx.lineTo((this.tileX * tileSize + tileSize / 2) - (cameraX + player.x), HEIGHT);
            ctx.stroke();*/

            currentLight = 0;
            this.followingPlayer = true;
            //this.path.push([player.tileY2, player.tileX2]);
            for (var k = 0; k < rayseg; k++) {
                if (Math.floor(map[Math.floor((cameraY + player.y + (seglength * (k + 1)) * Math.sin(theta)) / tileSize)][Math.floor((cameraX + player.x + (seglength * (k + 1)) * Math.cos(theta)) / tileSize)]) === 1) {
                    this.followingPlayer = false;
                    this.path = [];
                    break;
                }

                if(DEBUG === true){
                    ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
                    ctx.beginPath();
                    ctx.moveTo(player.x, player.y);
                    ctx.lineTo(player.x + (seglength * (k + 1)) * Math.cos(theta), (player.y + (seglength * (k + 1)) * Math.sin(theta)));
                    ctx.stroke();
                }

            }
        }

    };
}

function Button(x, y, text, type, action){
    this.x = x;
    this.y = y;
    this.width = WIDTH/5;
    this.height = HEIGHT/15;
    this.text = text;
    this.type = type;
    this.action = action;

    this.progress = 0;

    this.widener = 0;

    this.color = 'white';

    if(this.type === 3.1 && this.action === MAPSIZE){this.color = 'green';}
    if(this.type === 3.2 && this.action === SETDIFFICULTY){this.color = 'green';}
    this.update = function(){
        if(SWIPEVALUE === 0) {
            if (this.type === 1 || Math.floor(this.type) === 3) {
                if (mousePosX > this.x - this.width / 2 - this.widener / 2 && mousePosX < this.x + this.width / 2 + this.widener / 2 && mousePosY > this.y - this.height / 2 && mousePosY < this.y + this.height / 2) {
                    this.widener = Math.min(this.widener + 5, 20);
                    if(this.type === 1) {
                        if (clicked) {
                            //if(this.action === "LOAD"){generateMap();}
                            sounds.push(new sound("clickBass.wav", true, "clickBass"));
                            sounds[sounds.length-1].sound.volume = 0.2;
                            sounds[sounds.length-1].play();
                            generateMap();
                            trMaker.nextState = this.action;
                            trMaker.transitioning = true;
                        }
                    }else if(Math.floor(this.type) === 3){
                        if(clicked) {
                            sounds.push(new sound("clickBass.wav", true, "clickBass"));
                            sounds[sounds.length-1].sound.volume = 0.2;
                            sounds[sounds.length-1].play();
                            if(this.action === "fullscreen"){
                                if(FULLSCREEN){
                                    closeFullScreen();
                                }else{
                                    openFullScreen();
                                }
                            }
                            if(this.action === "scarceloot"){
                                SCARCELOOT = !SCARCELOOT;
                            }else if(this.action === "madgods"){
                                MADGODS = Math.abs(MADGODS-1);
                            }else if(this.action === "music"){
                                MUSIC = !MUSIC;
                                if(MUSIC === false){
                                    if(document.getElementById("musicThingy") !== null) {
                                        document.getElementById("musicThingy").remove();
                                    }
                                }
                            }else if(this.action === "sfx"){
                                SFX = !SFX;
                            }
                            if(this.type !== 3){
                                for (var i in buttons) {
                                    if (buttons[i].type === this.type) {
                                        buttons[i].color = 'white';
                                    }
                                }
                            }
                            this.color = 'green';
                            if(this.type === 3.1){
                                MAPSIZE = this.action;
                            }else if(this.type === 3.2){
                                SETDIFFICULTY = this.action;
                            }
                        }
                    }
                } else {
                    this.widener = Math.max(this.widener - 5, 0);
                }
            } else if (this.type === 2) {
                if (this.progress >= 1) {
                    trMaker.nextState = this.action;
                    trMaker.transitioning = true;
                }
            }
        }
        if(this.type === 3){
            //All of this shud've been made differently lol, will do next time
            if(this.action === "fullscreen"){
                if(FULLSCREEN){this.color = 'green';}else{this.color = 'white';}
            }
            else if(this.action === "scarceloot"){
                if(SCARCELOOT){this.color = 'green';}else{this.color = 'white';}
            }
            else if(this.action === "madgods"){
                if(MADGODS){this.color = 'green';}else{this.color = 'white';}
            }
            else if(this.action === "music"){
                if(MUSIC){this.color = 'green';}else{this.color = 'white';}
            }
            else if(this.action === "sfx"){
                if(SFX){this.color = 'green';}else{this.color = 'white';}
            }
        }
    }
    this.draw = function(){
        if(this.type === 0) {
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = HEIGHT / 6 + "px quickPixel";
            ctx.fillText(this.text, this.x + SWIPEVALUE * WIDTH, this.y + this.height / 4);
        }else if(this.type === 0.5) {
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = HEIGHT / 10 + "px quickPixel";
            ctx.fillText(this.text, this.x + SWIPEVALUE * WIDTH, this.y + this.height / 4);
        }else if(this.type === 1) {
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x - this.width / 2 - this.widener / 2 + SWIPEVALUE * WIDTH, this.y - this.height / 2, this.width + this.widener, this.height);
            ctx.lineWidth = 1;
            ctx.textAlign = 'center';
            ctx.font = HEIGHT / 10 + "px quickPixel";
            ctx.fillText(this.text, this.x + SWIPEVALUE * WIDTH, this.y + this.height / 4);
        }else if(this.type === 2){
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x - this.width / 2 - this.widener / 2 + SWIPEVALUE * WIDTH, this.y - this.height / 2, this.width + this.widener, this.height);
            ctx.fillRect(this.x - this.width / 2 - this.widener / 2 + SWIPEVALUE * WIDTH, this.y - this.height / 2, Math.min(this.progress, 1)*this.width, this.height);
            ctx.lineWidth = 1;
            ctx.textAlign = 'center';
            ctx.font = HEIGHT / 25 + "px quickPixel";
            ctx.fillText("Generating map...", this.x + SWIPEVALUE * WIDTH, this.y + this.height);
        }else if(Math.floor(this.type) === 3){
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x - this.width / 2 - this.widener / 2 + SWIPEVALUE * WIDTH, this.y - this.height / 2, this.width + this.widener, this.height);
            ctx.lineWidth = 1;
            ctx.textAlign = 'center';
            ctx.font = HEIGHT / 10 + "px quickPixel";
            ctx.fillText(this.text, this.x + SWIPEVALUE * WIDTH, this.y + this.height / 4);
        }
    }
}

function TransitionMaker(){
    this.nextState = "";
    this.previousState = "";
    this.transitioning = false;

    this.vX = 0;
    this.update = function(){
        if(this.transitioning){
            if(SWIPEVALUE === 0){this.vX = 0; this.previousState = GAMESTATE;}
            this.vX-=0.003;
            SWIPEVALUE += this.vX;
            if(SWIPEVALUE < -1){
                SWIPEVALUE = 1;
                this.transitioning = false;
                //console.log("Da");
                GAMESTATE = this.nextState;
                this.activateStates();
                this.vX = 0;
            }
        }else{
            if(SWIPEVALUE < 0.1){
                SWIPEVALUE = 0;
            }else{
                SWIPEVALUE-=this.vX;
                this.vX+=0.002;
            }
        }
    }

    this.activateStates = function(){
        if(this.nextState === "LOAD"){
            buttons = [];
            buttons.push(new Button(WIDTH/2, HEIGHT/2, "Loading bar", 2, "GAME"));
        }else if(this.nextState === "WIN"){
            buttons = [];
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/5, "YOU WIN!", 0, "GAME"));
            var secNumTmp = "";
            if((TIME%60).toString().length === 1){secNumTmp = "0" + (TIME%60).toString()}else{secNumTmp = (TIME%60).toString();}
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/8, "TIME TAKEN: " + Math.floor(TIME/60)  + ":" + secNumTmp, 0.5, "GAME"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12, "PLAY AGAIN", 1, "LOAD"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12*2, "MENU", 1, "MENU"));
        }else if(this.nextState === "LOSS"){
            buttons = [];
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/5, "YOU LOSE!", 0, "GAME"));
            var secNumTmp = "";
            if((TIME%60).toString().length === 1){secNumTmp = "0" + (TIME%60).toString()}else{secNumTmp = (TIME%60).toString();}
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/8, "TIME SURVIVED: " + Math.floor(TIME/60)  + ":" + secNumTmp, 0.5, "GAME"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12, "PLAY AGAIN", 1, "LOAD"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12*2, "MENU", 1, "MENU"));
        }else if(this.nextState === "MENU"){
            buttons = [];
            loadMenu();
        }else if(this.nextState === "GAME"){
            TIME = 0;
            frameCount = 0;
        }else if(this.nextState === "CONFIG"){
            buttons = [];
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3, "MAZE SIZE", 0, ""));
            buttons.push(new Button(WIDTH/2 - WIDTH/4, HEIGHT/2 - HEIGHT/4, "SMALL", 3.1, "sml"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/4, "MEDIUM", 3.1, "md"));
            buttons.push(new Button(WIDTH/2 + WIDTH/4, HEIGHT/2 - HEIGHT/4, "LARGE", 3.1, "lg"));

            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3 + HEIGHT/4, "DIFFICULTY", 0, ""));
            buttons.push(new Button(WIDTH/2 - WIDTH/4, HEIGHT/2, "EASY", 3.2, "e"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2, "MEDIUM", 3.2, "m"));
            buttons.push(new Button(WIDTH/2 + WIDTH/4, HEIGHT/2, "HARD", 3.2, "h"));

            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3 + HEIGHT/2, "EXTRA", 0, ""));
            buttons.push(new Button(WIDTH/2 - WIDTH/8, HEIGHT/2 + HEIGHT/4, "RARE LOOT", 3, "scarceloot"));
            buttons.push(new Button(WIDTH/2 + WIDTH/8, HEIGHT/2 + HEIGHT/4, "MAD GODS", 3, "madgods"));

            buttons.push(new Button(WIDTH/2 + WIDTH/4, HEIGHT/2 + HEIGHT/2.5, "PLAY", 1, "LOAD"));
            buttons.push(new Button(WIDTH/2 - WIDTH/4, HEIGHT/2 + HEIGHT/2.5, "MENU", 1, "MENU"));
        }else if(this.nextState === "OPTIONS"){
            buttons = [];
            //buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3, "MAZE SIZE", 0.5, ""));
            //openFullScreen();
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/12, "SFX", 3, "sfx"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/6, "MUSIC", 3, "music"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2, "FULLSCREEN", 3, "fullscreen"));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12*2, "MENU", 1, "MENU"));
        }else if(this.nextState === "CONTROLS"){
            buttons = [];

            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3.5, "CONTROLS", 0, ""));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3.5 + HEIGHT/8, "WASD to move", 0.5, ""));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3.5 + HEIGHT/8 + HEIGHT/16, "SPACE to attack", 0.5, ""));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3.5 + HEIGHT/8 + HEIGHT/16*2, "E to pickup item", 0.5, ""));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/3.5 + HEIGHT/8 + HEIGHT/16*3, "Q to drop item", 0.5, ""));
            buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12*3, "MENU", 1, "MENU"));
        }
    }
}

function sound(src, dlt, id) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.id = id;

    this.dlt = dlt;

    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";

    document.body.appendChild(this.sound);
    this.play = function(){
        if(SFX === true){this.sound.play();}
    };
    this.stop = function(){
        this.sound.pause();
    };
    this.delete = function(){
        this.sound.parentNode.removeChild(this.sound);
    };
    this.changeVolume = function(){
        this.sound.volume = globalVolume;
    };
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

var trMaker = new TransitionMaker();
function loadMenu(){
    if(trMaker.previousState === "WIN" || trMaker.previousState === "LOSS" || trMaker.previousState === "") {
        BGRANDOMS[0] = Math.round(Math.random());
        BGRANDOMS[1] = Math.round(Math.random());
    }
    buttons.push(new Button(WIDTH/2, HEIGHT/2 - HEIGHT/5, "A    MAZE", 0, ""));
    buttons.push(new Button(WIDTH/2 - WIDTH/20, HEIGHT/2 - HEIGHT/5, "(ncient)", 0.5, ""));

    buttons.push(new Button(WIDTH/2, HEIGHT/2, "PLAY", 1, "CONFIG"));
    buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12, "OPTIONS", 1, "OPTIONS"));
    buttons.push(new Button(WIDTH/2, HEIGHT/2 + HEIGHT/12*2, "CONTROLS", 1, "CONTROLS"));
}
loadMenu();

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function loadSounds(){
    var soundFiles = ["backSwish.wav", "choirSac.wav", "clickBass.wav", "hardSwipe.wav", "oof.wav", "pickup.wav", "release.wav", "sigh.wav", "swish2.wav", "walking.wav", "walkingSlow.wav", "weapon.wav"];
    for(var i = 0; i < soundFiles.length; i++){
        sounds.push(new sound(soundFiles[i], true));
        sounds[sounds.length-1].sound.volume = 0;
        sounds[sounds.length-1].play();
    }
    canvas.removeEventListener("click", loadSounds);
}
canvas.addEventListener("click", loadSounds);

function loadFont(){
    ctx.font = HEIGHT/45 + "px quickPixel";
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillText("Hey!", 0, 0);
}

function randomNum() {
    var x = Math.sin(SEED++) * 10000;
    return x - Math.floor(x);
}

function sign(x){
    if(x > 0){return 1;}
    else if(x < 0){return -1;}
    else{return 0;}
}

function resetVars(){
    xCameraOffset = 0;
    yCameraOffset = 0;
    player = new Player(WIDTH/2, HEIGHT/2, 0.9, 1); //Add the Player

    tileSize = Math.floor(72*(WIDTH/1024))*cameraZoom;

    player.gameX = mapwidth/2*tileSize;
    player.gameY = mapheight/2*tileSize;

    cameraX = (player.gameX-player.x+player.width*tileSize/2)*cameraZoom;
    cameraY = (player.gameY-player.y+player.height*tileSize/2)*cameraZoom;

    ORIGINALSEED = Math.floor(Math.random()*Math.pow(10, 10)); //COPY THIS IF YOU WANT TO PLAY THE SAME MAZE
    SEED = ORIGINALSEED;

    GODSATISFACTION = 100;

    TIME = 0;

    doorsGenerated = false;
}

function generateMap(){
    loadFont();
    creators = [];
    map = [];

    if(MAPSIZE === "md"){
        mapdimensions = 90; //70, 90, 110

        mapwidth = mapdimensions;
        mapheight = mapdimensions;

        roomsize = 8; //8

        room2size = 40; //36, 40, 40
        room2 = true; //true, true, true

        room3size = 72; //null, null, 72
        room3 = false; //false, false, true
    }else if(MAPSIZE === "lg"){
        mapdimensions = 110; //70, 90, 110

        mapwidth = mapdimensions;
        mapheight = mapdimensions;

        roomsize = 8; //8

        room2size = 40; //36, 40, 40
        room2 = true; //true, true, true

        room3size = 72; //null, null, 72
        room3 = true; //false, false, true
    }else{
        mapdimensions = 70; //70, 90, 110

        mapwidth = mapdimensions;
        mapheight = mapdimensions;

        roomsize = 8; //8

        room2size = 36; //36, 40, 40
        room2 = true; //true, true, true

        room3size = 72; //null, null, 72
        room3 = false; //false, false, true
    }

    if(SETDIFFICULTY === "m"){
        DIFFICULTY = 0.06;
    }else if(SETDIFFICULTY === "h"){
        DIFFICULTY = 0.09;
    }else{
        DIFFICULTY = 0.03;
    }

    if(SCARCELOOT === true){
        lootChances = 0.042;
    }else{
        lootChances = 0.09;
    }

    resetVars();
    creators.push(new Creator(1, 1, false));
    creators.push(new Creator(mapwidth-1, mapheight-1, false));
    //creators.push(new Creator(1, mapheight-1, false));
    //creators.push(new Creator(mapwidth-1, 1, false));
    if(room2 === true){
        creators.push(new Creator(mapwidth/2-room2size/2 + 2, mapheight/2-room2size/2 + 2, false));
        creators.push(new Creator(mapwidth/2+room2size/2 - 2, mapheight/2+room2size/2 - 2, false));
        //creators.push(new Creator(mapwidth/2-room2size/2 + 2, mapheight/2+room2size/2 - 2, false));
        //creators.push(new Creator(mapwidth/2+room2size/2 - 2, mapheight/2-room2size/2 + 2, false));
    }
    if(room2 === true){
        creators.push(new Creator(mapwidth/2-room3size/2 + 2, mapheight/2-room3size/2 + 2, false));
        creators.push(new Creator(mapwidth/2+room3size/2 - 2, mapheight/2+room3size/2 - 2, false));
    }
    //EDGES AND CENTER ROOM
    for(var i = 0; i <= mapheight; i++){
        var temparray = [];
        for(var j = 0; j <= mapwidth; j++){
            if(i === 0 || j === 0 || i === (mapheight) || j === (mapheight) || ((i === mapheight/2-roomsize/2 || i === mapheight/2+roomsize/2) && (j >= mapwidth/2-roomsize/2 && j <= mapwidth/2+roomsize/2))
                || ((j === mapwidth/2-roomsize/2 || j === mapwidth/2+roomsize/2) && (i >= mapheight/2-roomsize/2 && i <= mapheight/2+roomsize/2))){
                temparray.push(3);
            }else if(room2 === true && (((i === mapheight/2-room2size/2 || i === mapheight/2+room2size/2) && (j >= mapwidth/2-room2size/2 && j <= mapwidth/2+room2size/2))
                || ((j === mapwidth/2-room2size/2 || j === mapwidth/2+room2size/2) && (i >= mapheight/2-room2size/2 && i <= mapheight/2+room2size/2)))){
                temparray.push(3);
            }else if(room3 === true && (((i === mapheight/2-room3size/2 || i === mapheight/2+room3size/2) && (j >= mapwidth/2-room3size/2 && j <= mapwidth/2+room3size/2))
                || ((j === mapwidth/2-room3size/2 || j === mapwidth/2+room3size/2) && (i >= mapheight/2-room3size/2 && i <= mapheight/2+room3size/2)))){
                temparray.push(3);
            }else if(i > mapheight/2 - roomsize/2 && i < mapheight/2 + roomsize/2 && j > mapwidth/2 - roomsize/2 && j < mapwidth/2 + roomsize/2){
                if((i === mapheight/2 - 1 && j === mapwidth/2 - 1) || (i === mapheight/2 - 1 && j === mapwidth/2 + 1)){
                    temparray.push(1.97);
                }else if(i >= mapheight/2 - 1 && i <= mapheight/2 + 1 && j >= mapwidth/2 - 1 && j <= mapwidth/2 + 1) {
                    if(j === mapwidth/2 && i === mapheight/2 - 1){
                        temparray.push(5.2); //SACRIFICE TILE
                    }else{
                        temparray.push(0.5);
                    }

                }else{
                    temparray.push(5);
                }

            }else{
                temparray.push(1);
            }
        }
        map.push(temparray);
    }

}

function generateDoors(){ //TODO Make sure doors can't generate at 0, 0 and width, height;
    var doorrnd1 = Math.floor(randomNum()*mapwidth);
    /*while(map[doorrnd1][1] === 1 || map[doorrnd1][1] === 3){
     doorrnd1 = Math.floor(randomNum()*mapwidth);
     }
     map[doorrnd1][0] = 2;*/

    /*doorrnd1 = Math.floor(randomNum()*mapwidth);
     while(map[doorrnd1][mapheight-1] === 1 || map[doorrnd1][mapheight-1] === 3){
     doorrnd1 = Math.floor(randomNum()*mapwidth);
     }
     map[doorrnd1][mapwidth] = 2;*/

    doorrnd1 = Math.floor(randomNum()*mapheight);
    while(map[1][doorrnd1] === 1 || map[1][doorrnd1] === 3){
        doorrnd1 = Math.floor(randomNum()*mapheight);
    }
    map[0][doorrnd1] = 2;

    doorrnd1 = Math.floor(randomNum()*mapheight);
    while(map[mapwidth-1][doorrnd1] === 1 || map[mapwidth-1][doorrnd1] === 3){
        doorrnd1 = Math.floor(randomNum()*mapheight);
    }
    map[mapheight][doorrnd1] = 2;
}

//KINDA COOL LOL
function fillRooms(){ // Put the tall walls into this function
    for(var i = 2; i < map.length - 2; i+=2){
        for(var j = 2; j < map[0].length - 2; j+=2){
            if(map[i-1][j] === 0 && map[i+1][j] === 0 && map[i][j-1] === 0 && map[i][j + 1] === 0 && map[i][j] === 1){
                var rnd = randomNum();
                if(rnd < 0.9){
                    rndLoot(i, j);
                }else{
                    map[i][j] = 0;
                }
                if(Math.floor(map[i-2][j]) === 1 && Math.floor(map[i-3][j]) !== 0){map[i-2][j] = 1.85;}
                if(Math.floor(map[i-2][j-1]) === 1 && Math.floor(map[i-3][j-1]) !== 0){map[i-2][j-1] = 1.85;}
                if(Math.floor(map[i-2][j+1]) === 1 && Math.floor(map[i-3][j+1]) !== 0){map[i-2][j+1] = 1.85;}
            }
        }
    }
}

function generateLoot(){
    for(var i = 1; i < map.length - 1; i+=2){
        for(var j = 1; j < map[0].length - 1; j+=2){
            if(map[i][j] === 0){
                var rnd = randomNum();
                if(rnd < lootChances){
                    rndLoot(i, j);
                }else{
                    map[i][j] = 0;
                }
            }
        }
    }

    //FIGURE OUT LAST POSSIBLE KEY POSITION
    var lasti = 0;
    var lastj = 0;

    for(var i = mapwidth/2; i < mapwidth; i++){
        for(var j = mapheight/2; j < mapheight; j++){
            if(room3 === true){
                if(i > mapwidth/2 - room3size/2 && i < mapwidth/2 + room3size/2 && j > mapheight/2 - room3size/2 && j < mapheight/2 + room3size/2){

                }else{
                    if(map[i][j] === 0){
                        lasti = i;
                        lastj = j;
                    }
                }
            }else if(room2 === true){
                if(i > mapwidth/2 - room2size/2 && i < mapwidth/2 + room2size/2 && j > mapheight/2 - room2size/2 && j < mapheight/2 + room2size/2){

                }else{
                    if(map[i][j] === 0){
                        lasti = i;
                        lastj = j;
                    }
                }
            }
        }
    }

    //CREATE KEY IN BIG MAZE (MAX 2)
    var keycount = 0;
    var maxKeyCount = 1;

    for(var i = 1; i < mapheight; i++){
        for(var j = 1; j < mapwidth; j++){
            if(i === lasti && j === lastj){
                map[i][j] = 4.2;
            }if(room3 === true){
                if(i > mapwidth/2 - room3size/2 && i < mapwidth/2 + room3size/2 && j > mapheight/2 - room3size/2 && j < mapheight/2 + room3size/2){

                }else if(map[i][j] === 0){
                    var rnd = randomNum();
                    if(rnd > 0.998){
                        map[i][j] = 4.2;
                        keycount++;
                    }
                }
            }else if(room2 === true){
                if(i > mapwidth/2 - room2size/2 && i < mapwidth/2 + room2size/2 && j > mapheight/2 - room2size/2 && j < mapheight/2 + room2size/2){

                }else if(map[i][j] === 0){
                    var rnd = randomNum();
                    if(rnd > 0.998){
                        map[i][j] = 4.2;
                        keycount++;
                    }
                }
            }
            if(keycount >= maxKeyCount){
                break;
            }
        }
        if(keycount >= maxKeyCount){
            break;
        }
    }

    lasti = 0;
    lastj = 0;

    if(room3 === true){
        for(var i = mapwidth/2 - room3size/2 + 2; i < mapwidth/2 + room3size/2 - 2; i++){
            for(var j = mapheight/2 - room3size/2 + 2; j < mapheight/2 + room3size/2 - 2; j++){
                if(i > mapwidth/2 - room2size/2 && i < mapwidth/2 + room2size/2 && j > mapheight/2 - room2size/2 && j < mapheight/2 + room2size/2){

                }else{
                    if(map[i][j] === 0){
                        lasti = i;
                        lastj = j;
                    }
                }
            }
        }

        keycount = 0;
        maxKeyCount = 2;

        for(var i = mapwidth/2 - room3size/2 + 1; i < mapwidth/2 + room3size/2 - 1; i++){
            for(var j = mapheight/2 - room3size/2 + 1; j < mapheight/2 + room3size/2 - 1; j++){
                if(i === lasti && j === lastj){
                    map[i][j] = 4.2;
                    break;
                }
                if(i > mapwidth/2 - room2size/2 && i < mapwidth/2 + room2size/2 && j > mapheight/2 - room2size/2 && j < mapheight/2 + room2size/2){

                }else{
                    if(map[i][j] === 0){
                        var rnd = randomNum();
                        if(rnd > 0.99){
                            map[i][j] = 4.2;
                            keycount++;
                        }
                    }
                }
                if(keycount >= maxKeyCount){
                    break;
                }
            }
            if(keycount >= maxKeyCount){
                break;
            }
        }
    }

    lasti = 0;
    lastj = 0;

    if(room2 === true){
        for(var i = mapwidth/2 - room2size/2 + 1; i < mapwidth/2 + room2size/2 - 1; i++){
            for(var j = mapheight/2 - room2size/2 + 1; j < mapheight/2 + room2size/2 - 1; j++){
                if(map[i][j] === 0){
                    lasti = i;
                    lastj = j;
                }
            }
        }

        keycount = 0;

        for(var i = mapwidth/2 - room2size/2; i < mapwidth/2 + room2size/2; i++){
            for(var j = mapheight/2 - room2size/2; j < mapheight/2 + room2size/2; j++){
                if(i === lasti && j === lastj){
                    map[i][j] = 4.2;
                }
                if(i > mapwidth/2 - room2size/3 && i < mapwidth/2 + room2size/3 && j > mapheight/2 - room2size/3 && j < mapheight/2 + room2size/3){

                }else if(map[i][j] === 0){
                    var rnd = randomNum();
                    if(rnd > 0.99){
                        map[i][j] = 4.2;
                        keycount++;
                    }
                }
                if(keycount > maxKeyCount){
                    break;
                }
            }
            if(keycount > maxKeyCount){
                break;
            }
        }
    }
}

function rndLoot(i, j){
    var total = 0;
    for(var n = 0; n < itemSpawnRate.length; n++){
        total+=itemSpawnRate[n];
    }
    var rnd = Math.floor(randomNum()*total);
    for(var n = 0; n < itemSpawnRate.length; n++){
        rnd-=itemSpawnRate[n];
        if(rnd <= 0){
            map[i][j] = itemIDs[n];
            break;
        }
    }
}

function spawnEnemy(x, y){
    var total = 0;
    for(var n = 0; n < enemyRates.length; n++){
        total+=(0.1*TIME)/enemyRates[n]+enemyRates[n];
    }
    var rnd = Math.floor(randomNum()*total);
    for(var n = 0; n < enemyRates.length; n++){
        rnd-=(0.1*TIME)/enemyRates[n]+enemyRates[n];
        if(rnd <= 0){
            enemies.push(new Enemy(x, y, n));
            break;
        }
    }
}

function genExitsFromMain(size, room){
    var tmp = i;
    var rnd = Math.floor(randomNum()*(size-2));
    var incorrectGen = false;
    /*if(room === true){
     var swtchgtd = false;
     }else{
     var swtchgtd = true;
     }
     for(var i = 0; i <= mapheight; i++){
     for(var j = 0; j <= mapwidth; j++) {
     if(i === mapheight/2 - size/2 && j === mapwidth/2 - size/2 + rnd + 1){
     tmp = i;
     while((map[j][tmp] === 1 || map[j][tmp] === 3) && tmp > 0 && map[j-1][tmp+1] !== 0 && map[j+1][tmp+1] !== 0){
     if(map[j][tmp] === 3 && size !== roomsize){
     map[j][tmp] = 6;
     }else{
     if(swtchgtd === false) {
     map[j][tmp] = 5.1;
     swtchgtd = true;
     }else{
     map[j][tmp] = 0;
     }
     }
     tmp--;
     }
     tmp = i+1;
     while((map[j][tmp] === 1 || map[j][tmp] === 3) && tmp < mapdimensions&& map[j-1][tmp-1] !== 0 && map[j+1][tmp-1] !== 0){
     map[j][tmp] = 0;
     tmp++;
     }
     }
     }
     }
     rnd = Math.floor(randomNum()*(size-2));
     if(room === true){
     var swtchgtd = false;
     }else{
     var swtchgtd = true;
     } // Makes sure the first tile leading out of the center room is gold
     for(var i = 0; i <= mapheight; i++){
     for(var j = 0; j <= mapwidth; j++) {
     if(i === mapheight/2 + size/2 && j === mapwidth/2 - size/2 + rnd + 1){
     tmp = i;
     while((map[j][tmp] === 1 || map[j][tmp] === 3)  && tmp < mapdimensions && map[j-1][tmp-1] !== 0 && map[j+1][tmp-1] !== 0){
     if(map[j][tmp] === 3 && size !== roomsize){
     map[j][tmp] = 6;
     }else{
     if(swtchgtd === false) {
     map[j][tmp] = 5.1;
     swtchgtd = true;
     }else{
     map[j][tmp] = 0;
     }
     }
     tmp++;
     }
     tmp = i-1;
     while((map[j][tmp] === 1 || map[j][tmp] === 3) && tmp > 0 && map[j-1][tmp+1] !== 0 && map[j+1][tmp+1] !== 0){
     map[j][tmp] = 0;
     tmp--;
     console.log(tmp);
     }
     }
     }
     }*/
    rnd = Math.floor(randomNum()*(size-2));
    if(room === true){
        var swtchgtd = false;
    }else{
        var swtchgtd = true;
    }
    for(var i = 0; i <= mapheight; i++){
        for(var j = 0; j <= mapwidth; j++) {
            if(i === mapheight/2 - size/2 + rnd + 1 && j === mapwidth/2 - size/2){
                tmp = j;
                while((map[tmp][i] === 1 || map[tmp][i] === 3 || map[tmp][i] === 1.85) && tmp > 0 && map[tmp+1][i-1] !== 0 && map[tmp+1][i+1] !== 0){
                    if(map[tmp][i] === 3 && size !== roomsize){
                        map[tmp][i] = 6;
                    }else{
                        if(swtchgtd === false) {
                            map[tmp][i] = 5.1;
                            swtchgtd = true;
                        }else{
                            map[tmp][i] = 0;
                        }
                    }
                    tmp--;
                    if(tmp < j-maxTunnelLength){
                        incorrectGen = true;
                    }
                }
                tmp = j+1;
                while((map[tmp][i] === 1 || map[tmp][i] === 3 || map[tmp][i] === 1.85) && tmp < mapdimensions && map[tmp-1][i-1] !== 0 && map[tmp-1][i+1] !== 0){
                    map[tmp][i] = 0;
                    tmp++;
                }
            }
        }
    }
    //console.log(map);
    rnd = Math.floor(randomNum()*(size-2));
    if(room === true){
        var swtchgtd = false;
    }else{
        var swtchgtd = true;
    }
    for(var i = 0; i <= mapheight; i++){
        for(var j = 0; j <= mapwidth; j++) {
            if(i === mapheight/2 - size/2 + rnd + 1 && j === mapwidth/2 + size/2){
                tmp = j;
                while((map[tmp][i] === 1 || map[tmp][i] === 3 || map[tmp][i] === 1.85) && tmp < mapdimensions && map[tmp-1][i-1] !== 0 && map[tmp-1][i+1] !== 0){
                    if(map[tmp][i] === 3 && size !== roomsize){
                        map[tmp][i] = 6;
                    }else{
                        if(swtchgtd === false) {
                            map[tmp][i] = 5.1;
                            swtchgtd = true;
                        }else{
                            map[tmp][i] = 0;
                        }
                    }
                    tmp++;
                    if(tmp > j+maxTunnelLength){
                        incorrectGen = true;
                    }
                }
                tmp = j-1;
                while((map[tmp][i] === 1 || map[tmp][i] === 3 || map[tmp][i] === 1.85) && tmp > 0 && map[tmp+1][i-1] !== 0 && map[tmp+1][i+1] !== 0){
                    map[tmp][i] = 0;
                    tmp--;
                }
            }
        }
    }

    if(incorrectGen === true){
        doorsGenerated = false;
        creators = [];
        generateMap();
        //console.log("Something wrong");
    }
}

function generateTextureMap(){
    var rndgtm = randomNum();
    for(var i = 0; i < map[0].length; i++){
        for(var j = 0; j < map.length; j++){
            if(map[j][i] === 0){ //Paths
                rndgtm = randomNum();
                if(rndgtm < 0.9){
                    map[j][i] = 0;
                }else if(rndgtm < 0.93){
                    map[j][i] = 0.1;
                }else if(rndgtm < 0.98){
                    map[j][i] = 0.2;
                }else{
                    map[j][i] = 0.3;
                }

                rndgtm = randomNum();
                if(rndgtm < 0.03 && j > 1 && map[j-1][i] !== 0.6 && map[j-1][i] !== 6  && map[j-1][i] !== 2 && j < mapheight && map[j+1][i] !== 6  && map[j+1][i] !== 2){
                    map[j][i] = 0.6;
                }
            }
            if(map[j][i] === 1 && j < map.length - 1){ //Walls
                if(((Math.floor(map[j + 1][i]) === 0) || (Math.floor(map[j + 1][i]) === 4)) || (Math.floor(map[j + 1][i]) === 5)){ //If boi under isn't wall
                    rndgtm = randomNum();
                    if(rndgtm < 0.9){
                        map[j][i] = 1.05;
                    }else if(rndgtm < 0.91){
                        map[j][i] = 1.25;
                    }else if(rndgtm < 0.96){
                        map[j][i] = 1.35;
                    }else if(rndgtm < 0.97){
                        map[j][i] = 1.45;
                    }else if(rndgtm < 0.98){
                        map[j][i] = 1.55;
                    }else if(rndgtm < 0.99){
                        map[j][i] = 1.65;
                    }else{
                        map[j][i] = 1.75;
                    }
                }else{
                    rndgtm = randomNum();
                    if(rndgtm < 0.9){
                        map[j][i] = 1;
                    }else if(rndgtm < 0.93){
                        map[j][i] = 1.20;
                    }else{
                        map[j][i] = 1.30;
                    }
                }
            }

            if(map[j][i] === 6 && j < map.length - 1){
                if(Math.floor(map[j+1][i]) === 0){
                    map[j][i] = 1.8;
                }else if(Math.floor(map[j-1][i]) === 0){
                    map[j][i] = 1.8;
                }else if(Math.floor(map[j][i+1]) === 0){
                    map[j][i] = 1.81;
                }
            }

            if(map[j][i] === 3 && j < map.length - 1){
                if(((Math.floor(map[j + 1][i]) === 0) || (Math.floor(map[j + 1][i]) === 4) || (Math.floor(map[j + 1][i]) === 5))){
                    map[j][i] = 1.15;
                }else{
                    map[j][i] = 1.1;
                }
            }else if(map[j][i] === 3){
                map[j][i] = 1.15;
            }
        }
    }
}

function generate(){
    var paths = 0;
    for(var i = 0; i < mapheight; i++){
        for(var j = 0; j < mapwidth; j++){
            if(map[i][j] === 0){
                paths++;
            }
        }
    }
    if(paths < 0.43*mapwidth*mapheight){
        generateMap();
    }else{
        doorsGenerated = true;
        fillRooms();
        generateDoors();
        genExitsFromMain(roomsize, true);
        if(room2 === true){
            genExitsFromMain(room2size, false);
        }
        if(room3 === true){
            genExitsFromMain(room3size, false);
        }
        generateLoot();
        generateTextureMap();
    }
}

function renderTile(i, j){
    //for (var i = 0; i < mapwidth; i++) {
    //    for (var j = 0; j < mapheight; j++) {
    if(map[j][i] === 0){
        ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset - cameraY + yCameraOffset, tileSize, tileSize); //NORMAL
    }else if(map[j][i] === 0.1){
        ctx.drawImage(tileMap, textureSize, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //MOSS
    }else if(map[j][i] === 0.2){
        ctx.drawImage(tileMap, textureSize*2, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //BLUE
    }else if(map[j][i] === 0.3){
        ctx.drawImage(tileMap, textureSize*3, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL2
    }else if(map[j][i] === 0.5){
        ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, textureSize*2, textureSize*3, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //CARPET
        //ctx.drawImage(tileMap, textureSize, textureSize * 3, textureSize, textureSize, i * tileSize + xCameraOffset + offset - cameraX, j * tileSize + yCameraOffset + offset - cameraY, tileSize, tileSize); //NORMAL
    }//WALLS

    else if(Math.floor(map[j][i]*10) === 6){
        if(map[j][i] !== 0.63 && spikesAnimFrame === 0){
            map[j][i] += 0.01;
        }else if(map[j][i] !== 0.6 && spikesAnimFrame === 1){
            map[j][i] -= 0.01;
        }
        if(map[j][i] === 0.63 && frameCount % 120 === 0){
            //map[j][i] -= 0.01;
            spikesAnimFrame = 1;
        }else if(map[j][i] === 0.6 && frameCount % 120 === 0){
            //map[j][i] += 0.01;
            spikesAnimFrame = 0;
        }
        if(map[j][i] !== 0.6){
            ctx.drawImage(tileMap, textureSize*2 + textureSize*(map[j][i]*10 - 6)*10, textureSize*8.5, textureSize, textureSize*1.5, i*tileSize+ xCameraOffset + offset - cameraX, j*tileSize + yCameraOffset + offset - cameraY - tileSize/2, tileSize, tileSize*1.5); //NORMAL
        }
    }else if(map[j][i] === 0.7){ //cobweb
        ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, textureSize*5, textureSize*4, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //CARPET
    }

    else if(map[j][i] === 1){
        ctx.drawImage(tileMap, 0, 0, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize);
    }else if(map[j][i] === 1.05){
        ctx.drawImage(tileMap, 0, 0, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
    }else if(map[j][i] === 1.20){ //SKIPPED CAUSE 1.10 and 1.15 ARE INDESTRUCTIBLE WALLS
        ctx.drawImage(tileMap, textureSize, 0, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize);
    }else if(map[j][i] === 1.25){
        ctx.drawImage(tileMap, textureSize, 0, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
    }else if(map[j][i] === 1.30){
        ctx.drawImage(tileMap, textureSize*2, 0, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize);
    }else if(map[j][i] === 1.35){
        ctx.drawImage(tileMap, textureSize*2, 0, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
    }

    //DECORATED WALLS, ONLY APPEAR ON WHOLE FACE, THUS WE DON'T NEED 1.40 ONLY 1.45 etc.
    else if(map[j][i] === 1.45){
        ctx.drawImage(tileMap, textureSize*6, textureSize*8.5, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
    }else if(map[j][i] === 1.55){
        ctx.drawImage(tileMap, textureSize*7, textureSize*8.5, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
    }else if(map[j][i] === 1.65){
        ctx.drawImage(tileMap, textureSize*8, textureSize*8.5, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
    }else if(map[j][i] === 1.75){
        ctx.drawImage(tileMap, textureSize*9, textureSize*8.5, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
    }else if(map[j][i] === 1.85){
        ctx.drawImage(tileMap, textureSize*10, textureSize*8, textureSize, textureSize*2, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize, tileSize, tileSize*2);
    }

    else if(map[j][i] === 1.97){ //LIGHTS
        //ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, textureSize*2, textureSize*3, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, 0, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize + tileSize/2, tileSize, tileSize*1.5);
        //ctx.drawImage(tileMap, textureSize, textureSize * 3, textureSize, textureSize, i * tileSize + xCameraOffset + offset - cameraX, j * tileSize + yCameraOffset + offset - cameraY, tileSize, tileSize); //NORMAL
    }

    else if(map[j][i] === 1.8){//DOOR WALL
        ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, textureSize, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*3, tileSize, tileSize*1.5);
    }

    else if(map[j][i] === 2){
        //ctx.drawImage(tileMap, 0, textureSize*3, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset - cameraY + yCameraOffset, tileSize, tileSize); //NORMAL
        //ctx.drawImage(tileMap, textureSize*4, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*2, tileSize, tileSize*1.5);
        ctx.drawImage(tileMap, textureSize, textureSize * 3, textureSize, textureSize, i * tileSize + xCameraOffset + offset - cameraX, j * tileSize + yCameraOffset + offset - cameraY, tileSize, tileSize); //NORMAL
    }

    else if(map[j][i] === 6.1){//DOOR WALL
        ctx.drawImage(tileMap, textureSize*2, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*3, tileSize, tileSize*1.5);
        if(frameCount % 3 === 0) {
            map[j][i] = 6.2;
        }
    }else if(map[j][i] === 6.2){//DOOR WALL
        ctx.drawImage(tileMap, textureSize*3, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*3, tileSize, tileSize*1.5);
        if(frameCount % 3 === 0) {
            map[j][i] = 6.3;
        }
    }else if(map[j][i] === 6.3){//DOOR WALL
        ctx.drawImage(tileMap, textureSize*4, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*3, tileSize, tileSize*1.5);
    }

    //INDESTRUCTABLE WALLS
    else if(map[j][i] === 1.1){
        ctx.drawImage(tileMap, textureSize*3, 0, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize);
    }else if(map[j][i] === 1.15){
        ctx.drawImage(tileMap, textureSize*3, 0, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/2, tileSize, tileSize*1.5);
        if(j === mapheight){
            ctx.fillStyle = 'black';
            ctx.fillRect(i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset  + yCameraOffset - cameraY + tileSize/2, tileSize, tileSize/2);
        }
    }else if(Math.floor(map[j][i]) === 4){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';

        ctx.beginPath();
        ctx.arc(i*tileSize+ xCameraOffset + offset - cameraX + tileSize/2, j*tileSize + yCameraOffset + offset - cameraY + tileSize/2, tileSize*0.3, 0, Math.PI*2, false);
        ctx.fill();
        ctx.drawImage(tileMap, Math.round((map[j][i]-4)*10)*textureSize, textureSize*5.5 + textureSize*(Math.round((map[j][i]-4)*100-Math.round((map[j][i]-4)*10)*10)/100)*100, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/3 - Math.round(Math.sin(frameCount/25)*5), tileSize, tileSize); //NORMAL
    }else if(Math.floor(map[j][i]) === 5){
        if(map[j][i] !== 5.2) {
            ctx.drawImage(tileMap, textureSize, textureSize * 3, textureSize, textureSize, i * tileSize + xCameraOffset + offset - cameraX, j * tileSize + yCameraOffset + offset - cameraY, tileSize, tileSize); //NORMAL
            if(map[j][i] === 5.21) {
                ctx.drawImage(tileMap, textureSize*2, textureSize*3, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
                map[j][i] = 5.2;
            }
        }else{
            ctx.globalAlpha = Math.max(0, 1-sacrificedAnimationFrame*1.5);
            if(sacrificedAnimationFrame > 0) {
                ctx.fillStyle = 'rgba(200, 220, 255, 0.2)';
                ctx.beginPath();
                ctx.moveTo(i*tileSize+ xCameraOffset + offset - cameraX + sacrificedAnimationFrame*0.1*tileSize + tileSize/2 -0.5*tileSize, j*tileSize + yCameraOffset + offset - cameraY + tileSize);
                ctx.lineTo(i*tileSize+ xCameraOffset + offset - cameraX - sacrificedAnimationFrame*0.1*tileSize + tileSize/2 +0.5*tileSize, j*tileSize + yCameraOffset + offset - cameraY + tileSize);
                ctx.lineTo(i*tileSize+ xCameraOffset + offset - cameraX - sacrificedAnimationFrame*0.1*tileSize + tileSize/2 +1.5*tileSize + 4*tileSize*sacrificedAnimationFrame, j*tileSize + yCameraOffset + offset - cameraY + tileSize - tileSize*8 - sacrificedAnimationFrame*tileSize);
                ctx.lineTo(i*tileSize+ xCameraOffset + offset - cameraX - sacrificedAnimationFrame*0.1*tileSize + tileSize/2 -1.5*tileSize - 4*tileSize*sacrificedAnimationFrame, j*tileSize + yCameraOffset + offset - cameraY + tileSize - tileSize*8 - sacrificedAnimationFrame*tileSize);
                ctx.fill();

                ctx.fillStyle = 'rgba(200, 220, 255, 0.4)';
                ctx.beginPath();
                ctx.moveTo(i*tileSize+ xCameraOffset + offset - cameraX + sacrificedAnimationFrame*0.1*tileSize + tileSize/2 -0.5*tileSize, j*tileSize + yCameraOffset + offset - cameraY + tileSize);
                ctx.lineTo(i*tileSize+ xCameraOffset + offset - cameraX - sacrificedAnimationFrame*0.1*tileSize + tileSize/2 +0.5*tileSize, j*tileSize + yCameraOffset + offset - cameraY + tileSize);
                ctx.lineTo(i*tileSize+ xCameraOffset + offset - cameraX - sacrificedAnimationFrame*0.1*tileSize + tileSize/2 +1.5*tileSize + 2*tileSize*sacrificedAnimationFrame, j*tileSize + yCameraOffset + offset - cameraY + tileSize - tileSize*8 - sacrificedAnimationFrame*tileSize);
                ctx.lineTo(i*tileSize+ xCameraOffset + offset - cameraX - sacrificedAnimationFrame*0.1*tileSize + tileSize/2 -1.5*tileSize - 2*tileSize*sacrificedAnimationFrame, j*tileSize + yCameraOffset + offset - cameraY + tileSize - tileSize*8 - sacrificedAnimationFrame*tileSize);
                ctx.fill();

                ctx.fillStyle = 'rgba(200, 220, 255, 0.5)';
                ctx.fillRect(i*tileSize+ xCameraOffset + offset - cameraX + sacrificedAnimationFrame*0.1*tileSize + 0.1*tileSize, j*tileSize + yCameraOffset + offset - cameraY + tileSize - sacrificedAnimationFrame*tileSize*8, (0.8-sacrificedAnimationFrame*0.2)*tileSize, sacrificedAnimationFrame*tileSize*6);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(i*tileSize+ xCameraOffset + offset - cameraX + sacrificedAnimationFrame*0.2*tileSize + 0.1*tileSize, j*tileSize + yCameraOffset + offset - cameraY + tileSize - sacrificedAnimationFrame*tileSize*9, (0.8-sacrificedAnimationFrame*0.4)*tileSize, sacrificedAnimationFrame*tileSize*5);

                ctx.drawImage(tileMap, Math.round((sacrificedItem - 4) * 10) * textureSize, textureSize * 5.5 + textureSize * (Math.round((sacrificedItem - 4) * 100 - Math.round((sacrificedItem - 4) * 10) * 10) / 100) * 100, textureSize, textureSize, i * tileSize + offset + xCameraOffset - cameraX + tileSize*0.5*(sacrificedAnimationFrame), j * tileSize + offset + yCameraOffset - cameraY + tileSize / 2 - sacrificedAnimationFrame * tileSize/2 - tileSize*1.5, tileSize*(1-sacrificedAnimationFrame), tileSize); //NORMAL
                //yCameraOffset = tileSize*sacrificedAnimationFrame;
            }
            ctx.globalAlpha = 1;
            map[j][i] = 5.21;
        }
    }
}


function drawMinimap(){
    var minimapOffset = 5;
    for (var i = 0; i <= mapwidth; i++) {
        for (var j = 0; j <= mapheight; j++) {
            if (Math.floor(map[i][j]) === 0) {
                ctx.fillStyle = 'black';
            }

            else if (Math.floor(map[i][j]) === 1) {
                ctx.fillStyle = 'white';
            }

            else if (map[i][j] === 2) {
                ctx.fillStyle = 'red';
            }//INDESTRUCTABLE WALLS
            else if ((map[i][j]) === 4.2) {
                ctx.fillStyle = 'lime';
            }
            else if (Math.floor(map[i][j]) === 4) {
                ctx.fillStyle = 'yellow';
            } else if (Math.floor(map[i][j]) === 5) {
                ctx.fillStyle = 'green';
            } else if (Math.floor(map[i][j]) === 6) {
                ctx.fillStyle = 'brown';
            }
            ctx.fillRect(mapTileSize*j + minimapOffset, mapTileSize*i + minimapOffset, mapTileSize, mapTileSize);
        }
    }
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.tileX*mapTileSize + minimapOffset, (player.tileY+1)*mapTileSize + minimapOffset, mapTileSize, mapTileSize);
}

function doLighting(){
    var tempmap = [];
    var theta = 0;
    for(var i = Math.max(player.tileY - 3, 0); i <= Math.min(player.tileY + 5, mapheight); i++){
        tempmap.fill(1, 0, 8);
        for(var j = Math.max(player.tileX - 6, 0); j <= Math.min(player.tileX + 6, mapwidth); j++){
            if((map[i][j] !== 0.5 && Math.floor(map[i][j]) === 0) || Math.floor(map[i][j]) === 4 || Math.floor(map[i][j]) === 6){
                rayseg = Math.sqrt((cameraX + player.x - j*tileSize - tileSize/2)*(cameraX + player.x - j*tileSize - tileSize/2) + (cameraY + player.y - i*tileSize - tileSize/2)*(cameraY + player.y - i*tileSize - tileSize/2))/seglength;
                theta = Math.atan2((i*tileSize + tileSize/2) - (cameraY + player.y), (j*tileSize + tileSize/2) - (cameraX + player.x));
                currentLight = 0;
                for(var k = 0; k < rayseg; k++){
                    if(Math.floor(map[Math.floor((cameraY + player.y + (seglength*(k+1))*Math.sin(theta))/tileSize)][Math.floor((cameraX + player.x + (seglength*(k+1))*Math.cos(theta))/tileSize)]) === 1){
                        currentLight += lightConstant;
                    }

                    /*ctx.strokeStyle = 'rgba(0, 0, 0, ' + Math.min(1, currentLight) + ')';
                     ctx.beginPath();
                     ctx.moveTo(player.x, player.y);
                     ctx.lineTo(player.x + (seglength*(k+1))*Math.cos(theta), (player.y + (seglength*(k+1))*Math.sin(theta)));
                     ctx.stroke();*/
                }
                if(currentLight >= 1 && player.moveCycle % mobSpawnRate === 0 && enemies.length < maxMobCount){
                    var rnd = randomNum();
                    if(randomNum() < mobSpawnChance){
                        var spawnMob = true;
                        for(var tmpcheck = 0; tmpcheck < enemies.length; tmpcheck++){
                            if(enemies[tmpcheck].tileX === j && enemies[tmpcheck].tileY === i && Math.floor(map[j][i]) === 0){
                                spawnMob = false;
                                break;
                            }else{

                            }
                        }
                        if(spawnMob === true){
                            //enemies.push(new Enemy(j, i, 2));
                            spawnEnemy(j, i);
                            //enemies.push(new Enemy(j, i, 1));
                            player.moveCycle+=10;
                        }
                    }
                }
                tempmap[j-player.tileX+6] = (Math.min(1, currentLight));
            }else if(Math.floor(map[i][j]) === 5){
                tempmap[j-player.tileX+6] = 0;
            }else if(map[i][j] === 1.97){
                tempmap[j-player.tileX+6] = 0;
            }else if(map[i][j] === 0.5){
                tempmap[j-player.tileX+6] = 0;
            }else if(Math.floor(map[i][j]) === 2){
                tempmap[j-player.tileX+6] = 0;
            }else{
                tempmap[j-player.tileX+6] = 1;
            }

            for(var l = 0; l < tempmap.length; l++){
                lightmap[i-player.tileY+3][l] = tempmap[l];
            }

        }
    }

    for(var i = 0; i < lightmap.length; i++){
        for(var j = 0; j < lightmap[0].length; j++){
            if((lightmap[i][j] === 1) && ((i > 0 && lightmap[i-1][j] === 0) || (i < lightmap.length-1 && lightmap[i+1][j] === 0) || (j > 0 && lightmap[i][j-1] === 0) || (j < lightmap[0].length-1 && lightmap[i][j+1] === 0))){
                lightmap[i][j] = 0.25;
            }
        }
    }

    for(var i = 0; i < lightmap.length; i++){
        for(var j = 0; j < lightmap[0].length; j++){
            ctx.fillStyle = 'rgba(0, 0, 0, ' + Math.min(1, lightmap[i][j]) + ')';
            var tmpLightoffSetY = cameraY - (player.tileY - 3)*tileSize;
            var tmpLightoffSetX = cameraX - (player.tileX - 6)*tileSize;
            ctx.fillRect(j*tileSize - tmpLightoffSetX - 0.005 + xCameraOffset, i*tileSize - tmpLightoffSetY + yCameraOffset - tileSize*0.5 - 0.005, tileSize*1.01, tileSize*1.01);
        }
    }
}

function pathFinding(start, end){
    var openList = [];
    var closedList = [];
    var currentNode;
    var moves = [];
    var DONE = false;
    var path = [];

    openList.push(new Node(start[0], start[1], 0, 100000, null));

    //console.log(openList[0]);

    while(openList.length > 0 && !DONE){
        var low = 0;
        for(var i in openList){
            if(openList[i].f < openList[low].f){low = i;}
        }
        currentNode = openList[low];
        //console.log(currentNode);
        openList.splice(low, 1);

        closedList.push(currentNode);

        if(currentNode.x === end[0] && currentNode.y === end[1]){
            //console.log("Done!");
            var tmpCur = currentNode;
            path.push(tmpCur);
            while(tmpCur.parent !== null){
                path.push(tmpCur.parent);
                tmpCur = tmpCur.parent;
            }
            DONE = true;
            path.reverse();
            return path;
        }

        moves = [];
        var steppable = [0, 4, 5, 6];
        for(var s in steppable) {
            if (Math.floor(map[Math.max(0, currentNode.y - 1)][currentNode.x]) === steppable[s]) {
                moves.push([currentNode.x, currentNode.y - 1]);
            }
            if (Math.floor(map[Math.min(map.length, currentNode.y + 1)][currentNode.x]) === steppable[s]) {
                moves.push([currentNode.x, currentNode.y + 1]);
            }
            if (Math.floor(map[currentNode.y][Math.max(0, currentNode.x - 1)]) === steppable[s]) {
                moves.push([currentNode.x - 1, currentNode.y]);
            }
            if (Math.floor(map[currentNode.y][Math.min(map[0].length, currentNode.x + 1)]) === steppable[s]) {
                moves.push([currentNode.x + 1, currentNode.y]);
            }
        }
        //console.log(moves);

        for(var j in moves){
            var leave = false;
            for(var c in closedList){
                if(closedList[c].x === moves[j][0] && closedList[c].y === moves[j][1]){leave = true; break;}
            }
            if(leave){continue;}

            var dstTmp = (end[0] - moves[j][0])*(end[0] - moves[j][0]) + (end[1] - moves[j][1])*(end[1] - moves[j][1]);

            for(var o in openList){
                if(openList[o].x === moves[j][0] && openList[o].y === moves[j][1]){
                    if(currentNode.g + 1 > openList[o].g){leave = true; break;}
                }
            }
            if(leave){continue;}
            openList.push(new Node(moves[j][0], moves[j][1], currentNode.g + 1, dstTmp, currentNode));
        }
    }

    return [];
}

function Node(x, y, g, h, parent){
    this.x = x;
    this.y = y;
    this.g = g;
    this.h = h;
    this.f = this.g + this.h;
    this.parent = parent;
}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

var grd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 10, WIDTH/2, HEIGHT/2, tileSize*5);
grd.addColorStop(0, 'rgba(0, 0, 0, 0)');
grd.addColorStop(1, "black");

function game(){

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if(GAMESTATE === "MENU" || GAMESTATE === "LOAD" || GAMESTATE === "WIN" || GAMESTATE === "LOSS" || GAMESTATE === "CONFIG" || GAMESTATE === "OPTIONS" || GAMESTATE === "CONTROLS"){
        frameCount++;
        if(GAMESTATE === "LOAD"){
            for (var i = 0; i < creators.length; i++) {
                if (creators[i].dead === false) {
                    creators[i].update();
                    if( buttons[0].progress < 0.95) {
                        creators[i].draw();
                    }
                } else {
                    creators.splice(i, 1);
                }
            }

            if(creators.length > 0){
                if(buttons[0].progress === 0){buttons[0].progress = 0.01;}
                buttons[0].progress = Math.min(buttons[0].progress+0.1/(buttons[0].progress*100), 0.95);
            }

            if (creators.length === 0 && doorsGenerated === false) {
                generate();
                //console.log("Ja");
            }else if(creators.length === 0 && doorsGenerated === true){
                buttons[0].progress = 1;
            }
        }else if(GAMESTATE !== "WIN" && GAMESTATE !== "LOSS"){
            ctx.globalAlpha = 0.8;
            ctx.drawImage(backgrounds, Math.sin(frameCount/1000)/8*1024 + 1024/8 + BGRANDOMS[0]*1024, Math.cos(frameCount/1000)/8*576 + 576/8 + BGRANDOMS[1]*576, 1024*3/4, 576*3/4, 0, 0, WIDTH, HEIGHT);
            ctx.globalAlpha = 1;
            if(trMaker.nextState === "MENU" && trMaker.previousState === "CONFIG"){

            } else if((trMaker.nextState === "MENU" || trMaker.nextState === "LOAD") && (trMaker.previousState === "WIN" || trMaker.previousState === "LOSS" || trMaker.previousState === "CONFIG") && SWIPEVALUE !== 0){
                ctx.fillStyle = "rgba(0, 0, 0, " + Math.abs(SWIPEVALUE) + ")";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
            }
        }
        for(var i = 0; i < buttons.length; i++){
            buttons[i].draw();
            buttons[i].update();
        }
        trMaker.update();
    }else if(GAMESTATE === "GAME") {
        if (gameRunning === true) {
            player.update();
        }

        if(frameCount % 800 === 0 && MUSIC === true){
            var musicRandom = Math.random();
            //console.log("Moosic" + musicRandom);
            if(musicRandom < MUSICCHANCE){
                musicRandom = Math.random();
                if(document.getElementById("musicThingy") === null){
                    if(musicRandom < 0.5){
                        sounds.push(new sound("Temple.wav", true, "musicThingy"));
                    }else{
                        sounds.push(new sound("LostDisk.wav", true, "musicThingy"));
                    }
                    sounds[sounds.length - 1].sound.volume = 0.2;
                    sounds[sounds.length - 1].play();
                }
            }
        }

        if(sacrificedAnimationFrame > 0){
            sacrificedAnimationFrame = Math.min(sacrificedAnimationFrame*1.09, 1);
            if(sacrificedAnimationFrame === 1){
                sacrificedAnimationFrame = 0;
            }
        }

        cameraX = Math.round(cameraX);
        cameraY = Math.round(cameraY);

        for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
            for (var j = Math.max(player.tileY - 4, 0); j <= Math.min(player.tileY + 5, mapheight); j++) {
                if (Math.floor(map[j][i]) === 0 || Math.floor(map[j][i]) === 4 || Math.floor(map[j][i]) === 5 || Math.floor(map[j][i]) === 6 || Math.floor(map[j][i] * 10) === 6) {
                    if (Math.floor(map[j][i]) !== 4 && Math.floor(map[j][i]) !== 6 && Math.floor(map[j][i] * 10) !== 6) {
                        renderTile(i, j);
                    } else if (Math.floor(map[j][i] * 10) === 6) {
                        ctx.drawImage(tileMap, textureSize * 2, textureSize * 8.5, textureSize, textureSize * 1.5, i * tileSize + xCameraOffset + offset - cameraX, j * tileSize + yCameraOffset + offset - cameraY - tileSize / 2, tileSize, tileSize * 1.5); //NORMAL
                    } else {
                        ctx.drawImage(tileMap, 0, textureSize * 2, textureSize, textureSize, i * tileSize + offset + xCameraOffset - cameraX, j * tileSize + yCameraOffset + offset - cameraY, tileSize, tileSize); //NORMAL
                    }
                }
            }
        }

        for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
            for (var j = Math.max(player.tileY - 4, 0); j <= Math.min(player.tileY + 1, mapheight); j++) {
                if ((Math.floor(map[j][i]) !== 0 || Math.floor(map[j][i] * 10) === 6) && Math.floor(map[j][i]) !== 5) {
                    renderTile(i, j);
                }
            }
        }

        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].dead === true) {
                enemies.splice(i, 1);
            } else {
                enemies[i].update();
                enemies[i].draw();
            }

        }

        if (gameRunning === true) {
            if(player.visible) {
                player.draw();
            }

        }

        for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
            for (var j = Math.max(player.tileY2, 0); j <= Math.min(player.tileY + 4, mapheight); j++) {
                if (Math.floor(map[j][i]) === 6) {
                    renderTile(i, j);
                }
            }
        }

        for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
            for (var j = Math.max(player.tileY + 2, 0); j <= Math.min(player.tileY + 5, mapheight); j++) {
                if ((Math.floor(map[j][i]) !== 0 || Math.floor(map[j][i] * 10) === 6) && Math.floor(map[j][i]) !== 5) {
                    renderTile(i, j);
                }
            }
        }

        for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
            for (var j = Math.max(player.tileY - 4, 0); j <= Math.min(player.tileY + 5, mapheight); j++) {
                if (map[j][i]=== 5.2) {
                    renderTile(i, j);
                }
            }
        }

        if (gameRunning === true) {

            frameCount++;

            if(frameCount % 60 === 0){TIME++;}
            //console.log(TIME);

            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            doLighting();


            if(sacrificedAnimationFrame > 0) {
                ctx.globalAlpha = Math.max(0, 1 - Math.pow(sacrificedAnimationFrame, 0.5))/5;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                ctx.globalAlpha = 1;
            }else{
                yCameraOffset = Math.floor(yCameraOffset*0.9);
            }

            if(GUI){
                player.renderGUI();
            }

            //tileSize*=cameraZoom; cameraX = (player.gameX-player.x+player.width*tileSize/2)*cameraZoom; cameraY = (player.gameY-player.y+player.height*tileSize/2)*cameraZoom; seglength = tileSize/10;

            if (showMap === true) {
                drawMinimap();
            }

            if(SWIPEVALUE !== 0 || player.frozen){trMaker.update();}

            //console.log(SWIPEVALUE);
            ctx.fillStyle = 'rgba(0, 0, 0, ' + Math.abs(SWIPEVALUE) + ')';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            /* SPAWNING
             if(frameCount % spawnRate === 0){
             addWave();
             }
             */

            /* ON LOSS
             if(Lose condition){
             gameRunning = false;
             localStorage.setItem('HighScoreBusiness', HIGHSCORE);
             }
             */

        }
    }

    for(var i in sounds){
        if(sounds[i].dlt === true && sounds[i].sound.paused){
            sounds[i].delete();
            sounds.splice(i, 1);
        }
    }

    clicked = false;
}

// ---------------------------------------------------------- SIDE FUNCTIONS ------------------------------------------------------------------------ //

function player_give(name){
    var give_go = true;
    for(var item = 0; item < itemNames.length; item++){
        if(itemNames[item] === name.toUpperCase()){
            break;
        }
        if(item === itemNames.length-1){
            give_go = false;
        }
    }
    if(give_go === true){player.inventory.push(item%10 + (Math.floor(item/10)*0.1));}
}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //
gameRunning = false;
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
        if(!isNaN(parseInt(localStorage.getItem("HighScoreMaze")))){
            HIGHSCORE = parseInt(localStorage.getItem("HighScoreMaze"));
        }
        gameRunning = true;
    }
}
Start();

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

    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

}, false);
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.type == "keydown");
}, false);

function findScreenCoords(mouseEvent)
{
    var rect = canvas.getBoundingClientRect();
    mousePosX = mouseEvent.clientX - rect.left;
    mousePosY = mouseEvent.clientY - rect.top;
}

function click(){
    clicked = true;
}
document.getElementById("myCanvas").onmousemove = findScreenCoords;
document.getElementById("myCanvas").onclick = click;

function openFullScreen(){
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
}

function closeFullScreen(){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}


canvas.addEventListener("fullscreenchange", function() {
    FULLSCREEN = !FULLSCREEN;
    if(FULLSCREEN){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        canvas.position = 'absolute';
        canvas.left = '0';
        canvas.top = '0';
    }else{
        canvas.width = 1024;
        canvas.height = 576;

        canvas.position = 'relative';
    }
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    //console.log(canvas.getBoundingClientRect().top);

    cameraX = (player.gameX-player.x+player.width*tileSize/2)*(Math.floor(72*(WIDTH/1024))/tileSize);
    cameraY = (player.gameY-player.y+player.height*tileSize/2)*(Math.floor(72*(WIDTH/1024))/tileSize);

    player.x = WIDTH/2;
    player.y = HEIGHT/2;

    tileSize = Math.floor(72*(WIDTH/1024))*cameraZoom;

    grd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 10, WIDTH/2, HEIGHT/2, tileSize*5);
    grd.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grd.addColorStop(1, "black");

    fontSize1 = WIDTH/23;
    fontSize2 = WIDTH/13.3;
    fontSize3 = WIDTH/26.6;

    player.inventoryX = WIDTH - WIDTH/3;
    player.inventoryY = HEIGHT- HEIGHT/5;
    player.inventorySize = WIDTH/10;
    player.inventoryOffset = WIDTH/100;

    player.inventoryItemOffset = WIDTH/100;

    if(GAMESTATE !== "GAME") {
        buttons = [];
        trMaker.nextState = GAMESTATE;
        trMaker.transitioning = true;
    }
}, false);

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