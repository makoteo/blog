var versionCode = "Alpha 0.92  Lighting Update 2.0";
var WIDTH = 800;//800
var HEIGHT = 450;//450
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

var tileSize = Math.floor(72*(WIDTH/800)); //100
var offset = 0;

var textureSize = 16*5;

var cameraX = tileSize*(mapwidth-10)/2;
var cameraY = tileSize*(mapheight-6)/2;

//var cameraX = 0;
//var cameraY = 0;

var playerSpeedsList = [5, 3];
var playerSpeed = playerSpeedsList[0]*(WIDTH/800); //5

var doorsGenerated = false;

var lootChances = 0.042; //0.03

var creators = [];
//KICKSTART GAME
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var tileMap = new Image();
tileMap.onload = generateMap();
tileMap.src = "TileSetForMaze.png";

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

var xCameraOffset = 0;
var yCameraOffset = 0;

var ORIGINALSEED = Math.floor(Math.random()*Math.pow(10, 10)); //COPY THIS IF YOU WANT TO PLAY THE SAME MAZE
//8468407084;
var SEED = ORIGINALSEED;

var showMap = false;
var mapTileSize = 3;

var player;

var maxTunnelLength = 7;

var mousePosX = 0;
var mousePosY = 0;

var clicked = false;

var itemNames = ["SWORD", "BREAD", "KEY", "CHICKEN", "", "", "", "", "", "", "Hi", "Lol", "Why", "Not"];
var nutritionValues = [0, 20, 0, 50];
var itemSacrificeValues = [50, 20, 80, 40];
var itemDamageValues = [20, 0, 0, 0];

var spikesAnimFrame = 0;

var GODSATISFACTION = 100;
var MAXGODSATISFACTION = 200;

var godDecreasePerSecond = 0.6;

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

    this.inventorySelected = 0;

    this.inventoryX = WIDTH - WIDTH/3;
    this.inventoryY = HEIGHT- HEIGHT/5;
    this.inventorySize = WIDTH/10;
    this.inventoryOffset = WIDTH/100;

    this.inventoryItemOffset = WIDTH/100;

    this.previousGameX = cameraX - this.width/2*tileSize + WIDTH/2;
    this.previousGameY = cameraY - this.height/2*tileSize + HEIGHT/2;

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

    this.update = function(){
        this.winStateCheck();
        this.gameX = cameraX - this.width/2*tileSize + WIDTH/2;
        this.gameY = cameraY - this.height/2*tileSize + HEIGHT/2;

        if(this.previousGameX !== this.gameX){
            this.movingX = true;
        }else{
            this.movingX = false;
        }

        if(this.previousGameY !== this.gameY){
            this.movingY = true;
        }else{
            this.movingY = false;
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

        if(this.frozen === false){
            this.checkCollisions(1);
            this.actionButtonCheck();
        }

        this.saturation = this.saturationList[0]; //RESET BEFORE FUNCTION SEES IF PLAYER IS MOVING
        this.calculateCamera(); //CAUSE THIS FUNCTION ALSO SETS SATURATION IF PLAYER MOVES
        if(frameCount % 60 === 0){
            this.countBars();
        }
        this.countHealth();

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

        GODSATISFACTION = Math.max(GODSATISFACTION - godDecreasePerSecond, 0);
    };

    this.countHealth = function(){
        if(map[this.tileY2][this.tileX3] === 0.63){
            this.health = Math.max(this.health - 2, 0);
        }
    }

    this.calculateCamera = function(){
        if((keys && keys[68] || keys && keys[39] || keys && keys[40] || keys && keys[83] || keys && keys[65] || keys && keys[37] || keys && keys[38] || keys && keys[87])){
            this.saturation = this.saturationList[1];
            switch(this.dir) {
                case 0:
                    if(xCameraOffset > -12 && this.movingX === true){
                        xCameraOffset-=2;
                    }
                    break;
                case 1:
                    if(xCameraOffset < 12 && this.movingX === true){
                        xCameraOffset+=2;
                    }
                    break;
                case 2:
                    if(yCameraOffset < 12 && this.movingY === true){
                        yCameraOffset+=2;
                    }
                    break;
                case 3:
                    if(yCameraOffset > -12 && this.movingY === true){
                        yCameraOffset-=2;
                    }
                    break;
            }
        }
        if(!this.movingX) {
            if (xCameraOffset > 0) {
                xCameraOffset -= 1;
            } else if (xCameraOffset < 0) {
                xCameraOffset += 1;
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
                if (keys && keys[40] || keys && keys[83]) {cameraY+=((this.tileY2+1)*tileSize - (this.gameY + this.height*tileSize))-1; this.dir = 2;}
            }else{
                if (keys && keys[40] || keys && keys[83]) {cameraY+=playerSpeed; this.dir = 2;}
            }
        }else{
            if (keys && keys[40] || keys && keys[83]) {cameraY+=playerSpeed; this.dir = 2;}
        }

        if(Math.floor((this.gameX - playerSpeed)/tileSize) !== this.tileX){
            if(Math.floor(map[this.tileY3][this.tileX - 1]) === block || Math.floor(map[this.tileY2][this.tileX - 1]) === block){
                if (keys && keys[65] || keys && keys[37]) {cameraX+=(this.tileX)*tileSize+1-(this.gameX); this.dir = 0;}
            }else{
                if (keys && keys[65] || keys && keys[37]) {cameraX-=playerSpeed; this.dir = 0;}
            }
        }else{
            if (keys && keys[65] || keys && keys[37]) {cameraX-=playerSpeed; this.dir = 0;}
        }

        if(Math.floor((this.gameX + this.width*tileSize + playerSpeed)/tileSize) !== this.tileX2){
            if(Math.floor(map[this.tileY3][this.tileX2 + 1]) === block || Math.floor(map[this.tileY2][this.tileX2 + 1]) === block){
                if (keys && keys[68] || keys && keys[39]) {cameraX+=((this.tileX2+1)*tileSize - (this.gameX + this.width*tileSize))-1; this.dir = 1;}
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
            if(this.animationTimer === this.moveAnimSpeed){
                this.animationFrame++;
                this.animationTimer = 0;
            }
            if(this.animationFrame > 3){
                this.animationFrame = 0;
            }
        }else{
            this.animationFrame = 3;
        }

        if(this.animationFrame === 0){
            this.weaponOffset = 0;
            this.weaponOffsetY = 0;
        }else if(this.animationFrame === 1){
            this.weaponOffset = -tileSize/30;
            this.weaponOffsetY = -tileSize/40;
        }else if(this.animationFrame === 2){
            this.weaponOffset = 0;
            this.weaponOffsetY = 0;
        }else{
            this.weaponOffset = tileSize/30;
            this.weaponOffsetY = -tileSize/40;
        }

        if(this.dir === 3){
            this.drawWeapon();
        }

        ctx.drawImage(tileMap, textureSize*4+textureSize*0.75*this.animationFrame, textureSize*this.dir, textureSize*0.75, textureSize, this.x - this.width/2*tileSize + xCameraOffset, this.y - this.height/2*tileSize + yCameraOffset - this.breathCycle, this.width*tileSize, this.height*tileSize + this.breathCycle); //NORMAL

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
        if(this.getItemSelectedName() === "SWORD"){

        }
    };

    this.renderGUI = function(){
        if(this.tileY3 < mapheight && this.tileY3 > -1 && map[this.tileY3][this.tileX] === 0.5){
            if(this.inventory.length > 0 && this.inventorySelected < this.inventory.length){
                ctx.font = '60px quickPixel';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText("Press E to SACRIFICE " + this.getItemSelectedName(), WIDTH/2, 350);
            }
        }
        if((this.tileY < mapheight && this.tileY > -1 && map[this.tileY][this.tileX] === 1.8 && this.tileY < mapheight/2) || (this.tileY+2 < mapheight && map[this.tileY + 2][this.tileX] === 1.8 && this.tileY > mapheight/2)){
            if(this.getItemSelectedName() === "KEY"){
                ctx.font = '40px quickPixel';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText("Press E to OPEN DOOR", WIDTH/2, 350);
            }else{
                ctx.font = '40px quickPixel';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText("You need a KEY to open this door", WIDTH/2, 350);
            }
        }
        if(this.tileY4 < mapheight && this.tileY4 > -1 && Math.floor(map[this.tileY4][this.tileX3]) === 4){
            ctx.font = '40px quickPixel';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            if(this.inventory.length < 3){
                ctx.fillText("Press E to PICK UP", WIDTH/2, 350);
            }else{
                ctx.fillText("INVENTORY FULL", WIDTH/2, 350);
            }
        }

        if(this.getItemSelectedNutrition() > 0 && this.hunger !== this.maxHunger){
            ctx.font = '30px quickPixel';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText("Press SPACE to EAT " + this.getItemSelectedName(), WIDTH/2, HEIGHT - HEIGHT/10);
        }else if(this.getItemSelectedName() === "SWORD"){
            ctx.font = '30px quickPixel';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText("Press SPACE to ATTACK", WIDTH/2, HEIGHT - HEIGHT/10);
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
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40, this.maxHealth*2, HEIGHT/20);
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40 + HEIGHT/20 + HEIGHT/100, this.maxHunger*2, HEIGHT/20);

        ctx.fillStyle = 'rgba(150, 0, 0, 0.8)';
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40, this.health*2, HEIGHT/20);

        ctx.fillStyle = 'rgba(0, 100, 0, 0.8)';
        ctx.fillRect(WIDTH/100, this.inventoryY + HEIGHT/40 + HEIGHT/20 + HEIGHT/100, this.hunger*2, HEIGHT/20);


        ctx.font = '25px quickPixel';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(200, 200, 200)';
        ctx.fillText("HEALTH", WIDTH/100 + this.maxHealth, this.inventoryY + HEIGHT/17);
        ctx.fillText("HUNGER", WIDTH/100 + this.maxHunger, this.inventoryY + HEIGHT/17 + HEIGHT/20 + HEIGHT/100);

        //GOD SATISFACTION

        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.fillRect(WIDTH/2 - MAXGODSATISFACTION*1.5, HEIGHT/40, MAXGODSATISFACTION*3, HEIGHT/15);

        ctx.fillStyle = 'rgba(240, 240, 240, 0.8)';
        ctx.fillRect(WIDTH/2 - MAXGODSATISFACTION*1.5, HEIGHT/40, GODSATISFACTION*3, HEIGHT/15);

        ctx.font = '45px quickPixel';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0)';
        ctx.fillText("GODS' SATISFACTION", WIDTH/2, HEIGHT/13);

    };

    this.actionButtonCheck = function(){
        if(keys && keys[69]){
            //DOORS
            if((map[this.tileY][this.tileX] === 1.8 && this.tileY < mapheight/2) && this.getItemSelectedName() === "KEY"){
                map[this.tileY][this.tileX] = 6.1;
                this.inventory.splice(this.inventorySelected, 1);
            }else if(map[this.tileY + 2][this.tileX] === 1.8 && this.tileY > mapheight/2 && this.getItemSelectedName() === "KEY"){
                map[this.tileY + 2][this.tileX] = 6.1;
                this.inventory.splice(this.inventorySelected, 1);
            }
            //ITEM PICK UP
            else if(this.tileY4 < mapheight && this.tileY4 > -1 && Math.floor(map[this.tileY4][this.tileX3]) === 4){
                if(this.inventory.length < 3){
                    this.inventory.push(Math.round((map[this.tileY4][this.tileX3] - 4)*100)/10);
                    map[this.tileY4][this.tileX3] = 0;
                }else{
                    //DISPLAY INVENTORY FULL MESSAGE OR SWAP ITEM IDK
                }
            }
            //SACRIFICE
            else if(this.tileY3 < mapheight && this.tileY3 > -1 && map[this.tileY3][this.tileX] === 0.5 && this.ereleased === true){
                if(this.inventorySelected < this.inventory.length){
                    GODSATISFACTION = Math.min(GODSATISFACTION + this.getItemSelectedSacrificeValue(), MAXGODSATISFACTION);
                    this.inventory.splice(this.inventorySelected, 1);
                    this.ereleased = false;
                }
            }
        }else{
            this.ereleased = true;
        }

        //SPACE KEY

        //EATING FOOD

        if(keys && keys[32]){
            if(this.getItemSelectedNutrition > 0 && this.spaceReleased === true && this.hunger !== this.maxHunger){
                this.hunger = Math.min(this.hunger + this.getItemSelectedNutrition, this.maxHunger);
                this.health = Math.min(this.health + this.getItemSelectedNutrition/10, this.maxHealth);
                this.inventory.splice(this.inventorySelected, 1);
                this.spaceReleased = false;
            }
        }else{
            this.spaceReleased = true;
        }

        if(clicked === true){
            for(var invs = 0; invs < 3; invs++){
                if(mousePosX > this.inventoryX + this.inventorySize*invs + this.inventoryOffset*invs && mousePosX < this.inventoryX + this.inventorySize*invs + this.inventoryOffset*invs + this.inventorySize &&
                    mousePosY > this.inventoryY && mousePosY < this.inventoryY + this.inventorySize){
                    this.inventorySelected = invs;
                }
            }
        }

        if(keys && keys[49]){
            this.inventorySelected = 0;
        }else if(keys && keys[50]){
            this.inventorySelected = 1;
        }else if(keys && keys[51]){
            this.inventorySelected = 2;
        }

    };

    this.winStateCheck = function(){
        if(this.tileY < 0 || this.tileY === mapheight - 1){
            console.log("YOU WIN!");
            this.frozen = true;
        }
        if(this.health <= 0){
            console.log("YOU LOSE!");
            this.frozen = true;
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
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x*tileSize + offset- cameraX, this.y*tileSize + offset - cameraY, tileSize, tileSize);
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

restartGame();

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function loadFont(){
    ctx.font = "10px quickPixel";
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillText("Hey!", 0, 0);
}

function randomNum() {
    var x = Math.sin(SEED++) * 10000;
    return x - Math.floor(x);
}

function generateMap(){
    loadFont();
    creators = [];
    map = [];
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
                    temparray.push(0.5);
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
function fillRooms(){
    for(var i = 2; i < map.length - 2; i+=2){
        for(var j = 2; j < map[0].length - 2; j+=2){
            if(map[i-1][j] === 0 && map[i+1][j] === 0 && map[i][j-1] === 0 && map[i][j + 1] === 0 && map[i][j] === 1){
                var rnd = randomNum();
                if(rnd < 0.9){
                    rndLoot(i, j);
                }else{
                    map[i][j] = 0;
                }
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
}

function rndLoot(i, j){
    var rnd = randomNum();
    if(rnd < 0.2){
        map[i][j] = 4.01; //SWORD
    }else if(rnd < 0.4){
        map[i][j] = 4.31; //CHICKEN
    }else if(rnd < 0.95){
        map[i][j] = 4.11; //BREAD
    }else{
        map[i][j] = 4.21; //KEY
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
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp > 0 && map[tmp+1][i-1] !== 0 && map[tmp+1][i+1] !== 0){
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
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp < mapdimensions && map[tmp-1][i-1] !== 0 && map[tmp-1][i+1] !== 0){
                    map[tmp][i] = 0;
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
    }
    for(var i = 0; i <= mapheight; i++){
        for(var j = 0; j <= mapwidth; j++) {
            if(i === mapheight/2 - size/2 + rnd + 1 && j === mapwidth/2 + size/2){
                tmp = j;
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp < mapdimensions && map[tmp-1][i-1] !== 0 && map[tmp-1][i+1] !== 0){
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
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp > 0 && map[tmp+1][i-1] !== 0 && map[tmp+1][i+1] !== 0){
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
    }
}

function generateTextureMap(){
    var rndgtm = randomNum();
    for(var i = 0; i < map[0].length; i++){
        for(var j = 0; j < map.length; j++){
            if(map[j][i] === 0){
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
            if(map[j][i] === 1 && j < map.length - 1){
                if(((Math.floor(map[j + 1][i]) === 0) || (Math.floor(map[j + 1][i]) === 4)) || (Math.floor(map[j + 1][i]) === 5)){
                    rndgtm = randomNum();
                    if(rndgtm < 0.9){
                        map[j][i] = 1.05;
                    }else if(rndgtm < 0.93){
                        map[j][i] = 1.25;
                    }else{
                        map[j][i] = 1.35;
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
            if(map[j][i] === 0){
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
    }//WALLS

    else if(Math.floor(map[j][i]*10) === 6){
        if(map[j][i] !== 0.6 && map[j][i] !== 0.63 && spikesAnimFrame === 0){
            map[j][i] += 0.01;
        }else if(map[j][i] !== 0.6 && map[j][i] !== 0.63 && spikesAnimFrame === 1){
            map[j][i] -= 0.01;
        }else if(map[j][i] === 0.63 && frameCount % 120 === 0){
            map[j][i] -= 0.01;
            spikesAnimFrame = 1;
        }else if(map[j][i] === 0.6 && frameCount % 120 === 0){
            map[j][i] += 0.01;
            spikesAnimFrame = 0;
        }
        if(map[j][i] !== 0.6){
            ctx.drawImage(tileMap, textureSize*2 + textureSize*(map[j][i]*10 - 6)*10, textureSize*8.5, textureSize, textureSize*1.5, i*tileSize+ xCameraOffset + offset - cameraX, j*tileSize + yCameraOffset + offset - cameraY - tileSize/2, tileSize, tileSize*1.5); //NORMAL
        }
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

    else if(map[j][i] === 1.97){ //LIGHTS
        ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, textureSize*2, textureSize*3, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, 0, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize + tileSize/2, tileSize, tileSize*1.5);
    }

    else if(map[j][i] === 1.8){//DOOR WALL
        ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY, tileSize, tileSize); //NORMAL
        ctx.drawImage(tileMap, textureSize, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*3, tileSize, tileSize*1.5);
    }

    else if(map[j][i] === 6.1){//DOOR WALL
        ctx.drawImage(tileMap, textureSize*2, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*3, tileSize, tileSize*1.5);
        map[j][i] = 6.2;
    }else if(map[j][i] === 6.2){//DOOR WALL
        ctx.drawImage(tileMap, textureSize*3, textureSize*4, textureSize, textureSize*1.5, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/4*3, tileSize, tileSize*1.5);
        map[j][i] = 6.3;
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
        ctx.drawImage(tileMap, Math.round((map[j][i]-4)*10)*textureSize, textureSize*5.5 + textureSize*(Math.round((map[j][i]-4)*100-Math.round((map[j][i]-4)*10)*10)/100)*100, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + offset + yCameraOffset - cameraY - tileSize/3 - Math.round(Math.sin(frameCount/25)*5), tileSize, tileSize); //NORMAL
    }else if(Math.floor(map[j][i]) === 5){
        ctx.drawImage(tileMap, textureSize, textureSize*3, textureSize, textureSize, i*tileSize+ xCameraOffset + offset - cameraX, j*tileSize + yCameraOffset + offset - cameraY, tileSize, tileSize); //NORMAL
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
                        currentLight += 0.10;
                    }

                    /*ctx.strokeStyle = 'rgba(0, 0, 0, ' + Math.min(1, currentLight) + ')';
                     ctx.beginPath();
                     ctx.moveTo(player.x, player.y);
                     ctx.lineTo(player.x + (seglength*(k+1))*Math.cos(theta), (player.y + (seglength*(k+1))*Math.sin(theta)));
                     ctx.stroke();*/
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

function restartGame(){
    player = new Player(WIDTH/2, HEIGHT/2, 0.75, 1); //Add the Player
}


// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

var grd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 10, WIDTH/2, HEIGHT/2, tileSize*5);
grd.addColorStop(0, 'rgba(0, 0, 0, 0)');
grd.addColorStop(1, "black");

function game(){

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if(gameRunning === true){
        player.update();
    }

    for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
        for (var j = Math.max(player.tileY - 3, 0); j <= Math.min(player.tileY + 4, mapheight); j++) {
            if(Math.floor(map[j][i]) === 0 || Math.floor(map[j][i]) === 4 || Math.floor(map[j][i]) === 5 || Math.floor(map[j][i]) === 6 || Math.floor(map[j][i]*10) === 6){
                if(Math.floor(map[j][i]) !== 4 && Math.floor(map[j][i]) !== 6 && Math.floor(map[j][i]*10) !== 6){
                    renderTile(i, j);
                }else if(Math.floor(map[j][i]*10) === 6){
                    ctx.drawImage(tileMap, textureSize*2, textureSize*8.5, textureSize, textureSize*1.5, i*tileSize+ xCameraOffset + offset - cameraX, j*tileSize + yCameraOffset + offset - cameraY - tileSize/2, tileSize, tileSize*1.5); //NORMAL
                }else{
                    ctx.drawImage(tileMap, 0, textureSize*2, textureSize, textureSize, i*tileSize + offset + xCameraOffset - cameraX, j*tileSize + yCameraOffset + offset - cameraY, tileSize, tileSize); //NORMAL
                }
            }
        }
    }

    for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
        for (var j = Math.max(player.tileY - 3, 0); j <= Math.min(player.tileY + 1, mapheight); j++) {
            if((Math.floor(map[j][i]) !== 0 || Math.floor(map[j][i]*10) === 6) && Math.floor(map[j][i]) !== 5) {
                renderTile(i, j);
            }
        }
    }

    for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
        for (var j = Math.max(player.tileY - 3, 0); j <= Math.min(player.tileY + 4, mapheight); j++) {
            if(Math.floor(map[j][i]) === 6){
                renderTile(i, j);
            }
        }
    }

    if(gameRunning === true){
        player.draw();
    }

    for (var i = Math.max(player.tileX - 6, 0); i <= Math.min(player.tileX + 6, mapwidth); i++) {
        for (var j = Math.max(player.tileY + 1, 0); j <= Math.min(player.tileY + 4, mapheight); j++) {
            if((Math.floor(map[j][i]) !== 0 || Math.floor(map[j][i]*10) === 6) && Math.floor(map[j][i]) !== 5) {
                renderTile(i, j);
            }
        }
    }

    if(gameRunning === true) {

        frameCount++;

        //if(frameCount % 10 === 0){
        for(var i = 0; i < creators.length; i++){
            if(creators[i].dead === false){
                creators[i].update();
                creators[i].draw();
            }else{
                creators.splice(i, 1);
            }
        }
        //}


        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        if(creators.length === 0 && doorsGenerated === false) {
            generate();
        }

        doLighting();

        if(showMap === true){
            drawMinimap();
        }

        player.renderGUI();

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
    clicked = false;
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