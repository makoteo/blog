//
// Copyright (c) Martin Feranec 2019
//

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = 1200;
var HEIGHT = 675;

var map = [
    [88, 88, 88, 88, 88, 88, 12, 10, 10, 10, 13, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 12, 14, 16, 88, 17, 15, 13, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 12, 14, 16, 88, 88, 88, 17, 15, 13, 88, 88, 88, 88],
    [88, 88, 88, 12, 14, 16, 88, 88, 88, 88, 88, 17, 15, 13, 88, 88, 88],
    [88, 88, 12, 14, 16, 88, 88, 88, 88, 88, 88, 88, 17, 15, 13, 88, 88],
    [88, 12, 14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 13, 88],
    [12, 14, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 15, 13],
    [88, 88, 88, 88, 88, 27, 27, 88, 77, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 28, 28, 88, 11, 88, 88, 88, 30, 88, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 27, 27, 88, 88, 88, 88, 88],
    [88, 88, 88, 77, 31, 32, 33, 88, 11, 88, 28, 28, 88, 77, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10, 88],
    [88, 88, 88, 88, 88, 27, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 77, 88, 28, 30, 88, 11, 88, 35, 36, 37, 77, 34, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 88]
];

var backgroundMap = [
    [88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 25, 25, 25, 25, 25, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 25, 25, 25, 26, 25, 25, 25, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88, 88],
    [88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88],
    [88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 29, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [99, 25, 25, 26, 26, 26, 25, 25, 25, 25, 25, 26, 26, 26, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [99, 25, 25, 26, 26, 26, 25, 25, 25, 25, 25, 26, 26, 26, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88]
];

var breakingApartFg = [];
var breakingApartBg = [];

/*
GUIDE TO TILE TYPES:

10 -> Wall (rewrite wallTexture to get different wall textures)

11 -> Ladder

12 - Left Roof
13 - Right Roof
14 - Left Corner Roof
15 - Right Corner Roof

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

34 -> Seat

35 -> Left Table
36 -> Middle Table
37 -> Right Table

77 -> Spawner of Weapons
88 -> Empty
99 -> Break Point

 */

var tileMap = new Image();
tileMap.src = "Flying-House.png";

var tileSize;

var tiles = [];
var players = [];
var bullets = [];
var balloons = [];
var playerStatBoxes = [];
var fallingTiles = [];
var effects = [];
var rainParticles = [];
var lightningBolts = [];

var lightningBoltFlashOpacity = 0;

var powerUpSpawned = false;

var fallApartTime = 1800; //1800
var fallApartTimer = 0;

var collidableBlocks = [10, 12, 13, 14, 15];

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

var GAMESTATE = "GAME";
var lightDetailLevel = 10;
var lightingPercision = 0.2;

var maxRainParticles = 100;
var weatherSwitchTime = 1200;

var rainOpacity = 0;

var updateSpeed = 2; //Must be bigger than 0, should be 5

var rainCurrent = 0;

repeatOften(); //Starts Game

function Tile(x, y, width, height, type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

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
        && this.type !== 31 && this.type !== 32 && this.type !== 33 && this.type !== 35 && this.type !== 36 && this.type !== 37){
        this.lightLevel = 0.8;
    }else if(this.type === 10 || this.type === 14 || this.type === 15 || this.type === 16 || this.type === 17 || this.type === 77){
        this.lightLevel = Math.random()/4;
    }else if(this.type === 12 || this.type === 13 || this.type === 99){
        this.lightLevel = 0;
    }else if(this.type === 27 || this.type === 28){
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
    }else if(this.type === 77){
        this.imageX = 128;
        this.imageY = 168;
        this.imageWidth = 40;
        this.imageHeight = 40;
    }

    this.update = function(){
        this.cameraX = ((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = ((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);

        if(this.type === 77 && this.powerUpActive === false && powerUpSpawned === false){
            if(this.spawnTimer < this.spawnPeriod){
                this.spawnTimer++;
            }else{
                this.powerUpActive = true;
                powerUpSpawned = true;
                effects.push(new Explosion(this.x + tileSize/2, this.y + tileSize/1.5, 0));
            }
        }
    };
    this.draw = function(){
        if(this.type !== 77){
            ctx.drawImage(tileMap, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
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

function Bullet(x, y, type){
    this.velY = 0;
    this.velX = 0;
    this.type = type;
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
            ctx.drawImage(tileMap, 152, 152, 24, 16, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width * cameraZoom, this.height * cameraZoom);
        }else if(this.type === 3){
            ctx.drawImage(tileMap, 128, 152, 24, 16, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width * cameraZoom, this.height * cameraZoom);
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

    this.yFloat = 100;

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
                ctx.drawImage(tileMap, 192, 0, 192, 256, this.ballooncameraX - tileSize*cameraZoom + tileSize*cameraZoom*i, this.ballooncameraY + cameraGlobalY - 100, tileSize*7*cameraZoom, tileSize*10*cameraZoom);
            }
        }else{
            ctx.drawImage(tileMap, 192, 0, 192, 256, this.ballooncameraX, this.ballooncameraY + cameraGlobalY, tileSize*6*cameraZoom, tileSize*8*cameraZoom);
        }
    };
    this.update = function(){
        if(gameTicks % 10 === 0){
            this.yFloat += Math.round(Math.random()*3 - 1.5);

            if(this.yFloat > 220){
                this.yFloat = 220;
            }else if(this.yFloat < 180){
                this.yFloat = 180;
            }
        }

        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);

        this.ballooncameraX = Math.round((this.x - this.screenHalfWidth - tileSize*3) * cameraZoom + this.screenHalfWidth);
        this.ballooncameraY = Math.round((this.y - this.screenHalfHeight - this.yFloat*2) * cameraZoom + this.screenHalfHeight);
    };
}

function Player(id){

    this.id = id;

    if(this.id === 0){
        this.x = WIDTH/2 - WIDTH/8;
        this.y = HEIGHT/2 - 50;
    }else if(this.id === 1){
        this.x = WIDTH/2 + WIDTH/8;
        this.y = HEIGHT/2 - 50;
    }else{
        this.x = WIDTH/2;
        this.y = HEIGHT/2;
    }

    this.lives = 5;

    this.spawnX = this.x;
    this.spawnY = this.y;

    this.reloadSpeed = 20;
    this.reloadTimer = 0;

    this.width = tileSize/2;
    this.height = tileSize;

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

    this.knockBackXVel = 0;

    this.walkFrame = 0;

    this.weapon = "Crumpled Paper";
    this.bulletCount = 0;

    this.update = function(){

        if(this.actualXVel === 0){
            this.actualXVel = this.xVel;
        }

        if(Math.abs(this.knockBackXVel) < bulletSpeed*5){
            this.actualXVel += this.knockBackXVel;
        }

        if(this.actualYVel === 0){
            this.actualYVel = this.yVel;
        }

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

            if(this.tilePosYBottom < map.length - 1){
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
                                    }
                                    if(Math.abs(this.yVel) > Math.abs(this.actualYVel)){
                                        this.actualYVel = this.yVel;
                                    }

                                }
                            } else {
                                this.actualYVel += this.gravity;
                                break;
                            }
                        }
                    } else {
                        if (map[this.tilePosYBottom][this.tilePosXLeft] === 11 || map[this.tilePosYBottom][this.tilePosXRight] === 11) {
                            if ((map[this.tilePosYTop - 1][this.tilePosXLeft] === 11 && map[this.tilePosYTop - 1][this.tilePosXRight] === 11)) {
                                if(Math.abs(this.actualYVel) === 0){
                                    this.actualYVel = this.yVel;
                                }
                                if(Math.abs(this.yVel) > Math.abs(this.actualYVel)){
                                    this.actualYVel = this.yVel;
                                }
                                break;
                            }
                        } else {
                            this.actualYVel += this.gravity;
                            break;
                        }
                    }
                }
            }else{
                this.actualYVel += this.gravity;
            }

            if(this.tilePosXLeft > 0 && this.tilePosYBottom < map.length){
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

            if(this.tilePosXRight < map[0].length - 1 && this.tilePosYBottom < map.length){
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
            if(this.tilePosYBottom < map.length){
                for(var i = 0; i < collidableBlocks.length; i++) {
                    if (map[this.tilePosYBottom][this.tilePosXRight] === collidableBlocks[i] || map[this.tilePosYBottom][this.tilePosXLeft] === collidableBlocks[i]) {
                        this.y = this.tilePosYTop*tileSize + yOffset + tileSize - this.height/2;
                    } else {

                    }
                }
            }
        }else{
            this.actualYVel += this.gravity;
        }

        //console.log(this.actualYVel);

        if(this.actualXVel > moveSpeed - 1){
            this.facing = 1;
        }else if(this.actualXVel < -moveSpeed + 1){
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
        ctx.drawImage(tileMap, 64, 256, 32, 25, this.cameraX + cameraGlobalX + this.facing*2*cameraZoom, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*0.39*cameraZoom);
        ctx.globalAlpha = 1;

        this.xVel = 0;
        this.yVel = 0;
    };

    this.spawnBullet = function(){
        if(this.reloadTimer === 0){
            if(this.weapon === "Crumpled Paper"){
                if(this.facing === 1){
                    bullets.push(new Bullet(this.x + this.width, this.y, 0));
                }else{
                    bullets.push(new Bullet(this.x - this.width, this.y, 1));
                }
                this.reloadTimer = this.reloadSpeed;
            }else if(this.weapon === "Darts"){
                if(this.facing === 1){
                    bullets.push(new Bullet(this.x + this.width, this.y, 2));
                }else{
                    bullets.push(new Bullet(this.x - this.width, this.y, 3));
                }
                this.reloadTimer = this.reloadSpeed*2;
                this.bulletCount--;
            }else if(this.weapon === "Potato Launcher"){
                if(this.facing === 1){
                    bullets.push(new Bullet(this.x + this.width, this.y, 4));
                }else{
                    bullets.push(new Bullet(this.x - this.width, this.y, 5));
                }
                this.reloadTimer = this.reloadSpeed*3;
                this.bulletCount--;
            }
        }
    };

    this.die = function(){
        this.lives--;
        if(this.lives > 0){
            this.x = this.spawnX;
            this.y = this.spawnY;
            this.knockBackXVel = 0;
            this.bulletCount = 0;
            this.weapon = "Crumpled Paper";
        }else{
            this.active = false;
        }
    };

    this.hide = function(){
        if(this.tilePosYBottom < map.length){
            if (map[this.tilePosYBottom][this.tilePosXRight] === 28 && map[this.tilePosYBottom][this.tilePosXLeft] === 28) {
                this.visible = false;
                //console.log("Works");
            } else {
                //console.log("Nope");
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
    this.lives = 10;

    if(this.id === 0){
        this.x = this.width/10;
        this.y = HEIGHT - 2*this.height - 2*this.height/10;
    }else if(this.id === 1){
        this.x = this.width/10;
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
        ctx.drawImage(tileMap, 64, 256, 32, 25, this.profileX + 5, this.profileY, this.profileWidth, this.profileHeight*0.7);

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
        if(gameTicks % 60 === 0){
            this.lives = players[this.id].lives;
            this.weapon = players[this.id].weapon;
        }
        this.bulletCount = players[this.id].bulletCount;
    };
}

function Button(){
    //Make Button
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
        this.y += this.yVel;
        if(this.opacity > 0.01){
            this.opacity -= 0.01
        }
        this.lifeSpan--;

        this.cameraX = ((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = ((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };

    this.draw = function(){
        ctx.font = "15px Arial";
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.globalAlpha = this.opacity;
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y + cameraGlobalY);
        ctx.globalAlpha = 1;
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
    this.length = Math.round((Math.random() + 1) * HEIGHT/100);
    this.velY = Math.round((Math.random() + 2)*5);
    this.velX = Math.round((Math.random() - 0.5) * 3);

    this.update = function(){
        this.x += this.velX;
        this.y += this.velY;
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
    this.x = Math.round(Math.random()*WIDTH);
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


//CREATE TILES

for(var i = 0; i < backgroundMap.length; i++){
    for(var j = 0; j < backgroundMap[0].length; j++){
        if(backgroundMap[i][j] !== 88){
            tiles.push(new Tile(xOffset + tileSize*j, yOffset + tileSize*i, tileSize, tileSize, backgroundMap[i][j]));
        }
    }
}

for(var i = 0; i < map.length; i++){
    for(var j = 0; j < map[0].length; j++){
        if(map[i][j] !== 88){
            tiles.push(new Tile(xOffset + tileSize*j, yOffset + tileSize*i, tileSize, tileSize, map[i][j]));
        }
    }
}

players.push(new Player(0));
players.push(new Player(1));
//MAKE SURE TO CHECK IF PLAYER ISN'T BOT IN KEY BINDINGS

playerStatBoxes.push(new playerStat(0));
playerStatBoxes.push(new playerStat(1));

balloons.push(new Balloon(WIDTH/2, yOffset, 0));
balloons.push(new Balloon(xOffset + tileSize, yOffset + tileSize*6, 0));
balloons.push(new Balloon(WIDTH - xOffset - tileSize, yOffset + tileSize*6, 0));

var gameTicks = 0;

var fallingApartLine = 0;
var wallTilesToDelete = 0;
var totalTiles = 0;
var bgTilesToDelete = 0;

var fallVelocity = 0;

var justFell = false;

var grd = ctx.createLinearGradient(0, 0, 0, HEIGHT/1.2);
grd.addColorStop(0, "rgb(86, 136, 216)");
grd.addColorStop(1, "rgb(100, 183, 249)");

var stormgrd = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, HEIGHT/120, WIDTH/2, HEIGHT/2, WIDTH/2);

stormgrd.addColorStop(0, "rgba(5, 5, 5, 0.4)");
stormgrd.addColorStop(1, "rgba(33, 32, 33, 1)");

function game(){

    if(GAMESTATE === "GAME"){
        gameTicks++;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

// Fill with gradient
        ctx.fillStyle = grd;
        ctx.globalAlpha = 1 - rainOpacity/2;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 1;

        if(gameTicks % weatherSwitchTime === 0){
            rainCurrent = Math.round(Math.random()*100)/100;
        }

        if(rainCurrent > rainOpacity){
            rainOpacity+=0.005;
        }else if(rainCurrent < rainOpacity){
            rainOpacity-=0.005;
        }

        if(rainOpacity > 0.5){
            if(gameTicks % updateSpeed === 0){
                if(rainParticles.length < maxRainParticles*rainOpacity){
                    rainParticles.push(new RainParticle());
                }
            }
        }else{
            rainParticles = [];
        }

        if(rainOpacity > 0.7){
            if(gameTicks % 600 - Math.round(rainOpacity*500) === 0){
                lightningBolts.push(new LightningBolt());
                lightningBoltFlashOpacity = 1;
            }
        }

        if(rainParticles.length > 0){
            if(gameTicks % (updateSpeed + 1) === 0){
                for(var r = 0; r < rainParticles.length; r++){
                    rainParticles[r].update();
                    if(rainParticles[r].y > HEIGHT){
                        rainParticles.splice(r, 1);
                    }
                }
            }
        }

        if(lightningBolts.length > 0){
            for(var l = 0; l < lightningBolts.length; l++){
                lightningBolts[l].update();
                lightningBolts[l].draw();
                if(lightningBolts[l].opacity < 0.2){
                    lightningBolts.splice(l, 1);
                }
            }
        }

        ctx.globalAlpha = rainOpacity;
        for(var r = 0; r < rainParticles.length; r++){
            rainParticles[r].draw();
        }
        ctx.globalAlpha = 1;

        if(justFell === true){
            if(yOffset + cameraGlobalYOffset + tileSize*map.length < HEIGHT - yOffset - cameraGlobalYOffset){
                cameraGlobalYOffset += 0.1;
            }else{
                justFell = false;
            }
        }

        if(fallApartTimer < fallApartTime){
            fallApartTimer++;
        }else{
            fallApartTimer = 0;
        }

        for(var i = 0; i < backgroundMap.length; i++){
            for(var j = 0; j < backgroundMap[0].length; j++){
                if(backgroundMap[i][j] === 99){
                    fallingApartLine = i;
                }
            }
        }

        if(fallApartTimer === fallApartTime - 1 && fallingApartLine !== 0){
            for(var m = fallingApartLine - 1; m < backgroundMap.length; m++){
                breakingApartBg.push(backgroundMap[m]);
            }
            for(var a = 0; a < map.length; a++){
                for(var b = 0; b < map[0].length; b++){
                    if(map[a][b] === 99){
                        fallingApartLine = i;
                    }
                }
            }
            for(var m = fallingApartLine - 1; m < map.length; m++){
                breakingApartFg.push(map[m]);
            }
            for(var n = 0; n < breakingApartFg.length; n++){
                for(var t = 0; t < breakingApartFg[0].length; t++){
                    if(breakingApartFg[n][t] !== 88){
                        wallTilesToDelete++;
                    }else{

                    }
                }
            }
            for(var n = 0; n < map.length; n++){
                for(var t = 0; t < map[0].length; t++){
                    if(map[n][t] !== 88){
                        totalTiles++;
                    }else{

                    }
                }
            }

            for(var n = fallingApartLine - 1; n < backgroundMap.length; n++){
                for(var t = 0; t < backgroundMap[0].length; t++){
                    if(backgroundMap[n][t] !== 88){
                        bgTilesToDelete++;
                    }else{

                    }
                }
            }

            tiles.splice(tiles.length - totalTiles - bgTilesToDelete, bgTilesToDelete);
            tiles.splice(tiles.length - wallTilesToDelete, wallTilesToDelete);

            map.splice(fallingApartLine - 1, map.length - fallingApartLine + 1);
            backgroundMap.splice(fallingApartLine - 1, backgroundMap.length - fallingApartLine + 1);

            for(var i = 0; i < breakingApartBg.length; i++){
                for(var j = 0; j < breakingApartBg[0].length; j++){
                    if(breakingApartBg[i][j] !== 88){
                        fallingTiles.push(new Tile(xOffset + tileSize*j, yOffset + tileSize*i + tileSize*(fallingApartLine - 1), tileSize, tileSize, breakingApartBg[i][j]));
                    }
                }
            }
            for(var i = 0; i < breakingApartFg.length; i++){
                for(var j = 0; j < breakingApartFg[0].length; j++){
                    if(breakingApartFg[i][j] !== 88){
                        fallingTiles.push(new Tile(xOffset + tileSize*j, yOffset + tileSize*i + tileSize*(fallingApartLine - 1), tileSize, tileSize, breakingApartFg[i][j]));
                    }
                }
            }

            fallingApartLine = 0;
            bgTilesToDelete = 0;
            wallTilesToDelete = 0;
            totalTiles = 0;

        }

        for(var i = 0; i < fallingTiles.length; i++){
            fallingTiles[i].update();
            fallingTiles[i].draw();
            fallingTiles[i].y += fallVelocity;
            if(fallingTiles[i].type !== 10 && fallingTiles[i].type !== 12 && fallingTiles[i].type !== 13 && fallingTiles[i].type !== 14 && fallingTiles[i].type !== 15){
                if(i > 0){
                    if(fallingTiles[i-1].lightLevel < fallingTiles[i].lightLevel){
                        fallingTiles[i].lightLevel = fallingTiles[i-1].lightLevel + lightingPercision;
                    }
                }
                if(i < fallingTiles.length){
                    if(fallingTiles[i+1].lightLevel < fallingTiles[i].lightLevel){
                        fallingTiles[i].lightLevel = fallingTiles[i+1].lightLevel + lightingPercision;
                    }
                }
                if(i > map[0].length && i < fallingTiles.length/2){
                    if(fallingTiles[i-map[0].length].lightLevel < tiles[i].lightLevel){
                        fallingTiles[i].lightLevel = fallingTiles[i-map[0].length].lightLevel + lightingPercision;
                    }
                }
                if(i < fallingTiles.length/2 - map[0].length){
                    if(fallingTiles[i+map[0].length].lightLevel < fallingTiles[i].lightLevel){
                        fallingTiles[i].lightLevel = fallingTiles[i+map[0].length].lightLevel + lightingPercision;
                    }
                }
            }
        }

        if(fallingTiles.length > 0){
            fallVelocity+=0.1;
        }

        if(fallVelocity > 10){
            powerUpSpawned = false;
            breakingApartBg = [];
            breakingApartFg = [];
            fallingTiles = [];
            fallVelocity = 0;
            justFell = true;
        }

        for(var i = 0; i < tiles.length; i++){
            if(tiles[i].type !== 10 && tiles[i].type !== 12 && tiles[i].type !== 13 && tiles[i].type !== 14 && tiles[i].type !== 15){
                tiles[i].update();
                tiles[i].draw();
                if(gameTicks < lightDetailLevel){
                    if(i > 0){
                        if(tiles[i-1].lightLevel < tiles[i].lightLevel){
                            tiles[i].lightLevel = tiles[i-1].lightLevel + lightingPercision;
                        }
                    }
                    if(i < tiles.length){
                        if(tiles[i+1].lightLevel < tiles[i].lightLevel){
                            tiles[i].lightLevel = tiles[i+1].lightLevel + lightingPercision;
                        }
                    }
                    if(i > map[0].length && i < tiles.length/2){
                        if(tiles[i-map[0].length].lightLevel < tiles[i].lightLevel){
                            tiles[i].lightLevel = tiles[i-map[0].length].lightLevel + lightingPercision;
                        }
                    }
                    if(i < tiles.length/2 - map[0].length){
                        if(tiles[i+map[0].length].lightLevel < tiles[i].lightLevel){
                            tiles[i].lightLevel = tiles[i+map[0].length].lightLevel + lightingPercision;
                        }
                    }
                }
            }
            if(tiles[i].type === 77){
                if(tiles[i].powerUpActive === true){
                    for(var j = 0; j < players.length; j++){
                        if(players[j].x + players[j].width > tiles[i].x && players[j].x < tiles[i].x + tiles[i].width){
                            if(players[j].y + players[j].height/2 > tiles[i].y && players[j].y < tiles[i].y + tiles[i].height){
                                tiles[i].powerUpActive = false;
                                tiles[i].spawnTimer = 0;
                                var random = Math.random();
                                if(random > 0.8){
                                    effects.push(new TextBox(tiles[i].x + tiles[i].width/2, tiles[i].y - tiles[i].height/2, 0, "Potato Launcher!"));
                                    players[j].weapon = "Potato Launcher";
                                    players[j].bulletCount = 3;
                                }else{
                                    effects.push(new TextBox(tiles[i].x + tiles[i].width/2, tiles[i].y - tiles[i].height/2, 0, "Darts!"));
                                    players[j].weapon = "Darts";
                                    players[j].bulletCount = 20;
                                }
                                powerUpSpawned = false;
                            }
                        }
                    }
                }
            }
        }

        for(var i = 0; i < bullets.length; i++){
            bullets[i].update();
            bullets[i].draw();

            var destroy = false;

            for(var j = 0; j < players.length; j++){
                if(bullets[i].x < players[j].x + players[j].width && bullets[i].x + bullets[i].velX + bullets[i].width > players[j].x){
                    if(bullets[i].y > players[j].y - players[j].height/2 && bullets[i].y < players[j].y + players[j].height/2){
                        players[j].knockBackXVel = bullets[i].knockBack;
                        destroy = true;
                    }
                }
            }

            if(bullets.length > 0 && i !== bullets.length){
                if(bullets[i].x < 10 || bullets[i].x > WIDTH + 10){
                    destroy = true;
                }
            }

            if(bullets.length > 0 && i !== bullets.length) {
                for(var j = 0; j < collidableBlocks.length; j++){
                    if(Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize) < map.length){
                        if (map[Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize)][Math.round((bullets[i].x - xOffset) / tileSize)] === collidableBlocks[j]) {
                            destroy = true;
                            break;
                        }
                    }
                }
            }else{

            }

            if(destroy === true){
                bullets.splice(i, 1);
            }
        }

        //CONTROLS
        //PLAYER 1
        if(players.length > 0){
            if((keys && keys[40])&&(keys && keys[38])){

            }else if(keys && keys[38]){
                players[0].yVel = -moveSpeed;
            }
            else if(keys && keys[40]){
                players[0].yVel = moveSpeed;
                players[0].hide();
            }else{

            }

            if((keys && keys[37])&&(keys && keys[39])){

            }else if(keys && keys[37]){
                players[0].xVel = -moveSpeed;
            }
            else if(keys && keys[39]){
                players[0].xVel = moveSpeed;
            }else{

            }

            if(keys && keys[77]){
                if(players[0].y + players[0].height < HEIGHT){
                    players[0].spawnBullet();
                }
            }
        }

        //PLAYER 2
        if(players.length > 1){
            if((keys && keys[69])&&(keys && keys[68])){

            }else if(keys && keys[69]){
                players[1].yVel = -moveSpeed;
            }
            else if(keys && keys[68]){
                players[1].yVel = moveSpeed;
                players[1].hide();
            }

            if((keys && keys[83])&&(keys && keys[70])){

            }else if(keys && keys[83]){
                players[1].xVel = -moveSpeed;
            }
            else if(keys && keys[70]){
                players[1].xVel = moveSpeed;
            }

            if(keys && keys[81]){
                if(players[1].y + players[1].height < HEIGHT){
                    players[1].spawnBullet();
                }
            }
        }

        for(var i = 0; i < players.length; i++) {
            if(players[i].active === true){
                players[i].update();
                players[i].draw();

                if(players[i].x < -200 || players[i].x > WIDTH + 200 || players[i].y < -200 || players[i].y > HEIGHT + 200){
                    players[i].die();
                }
            }
        }

        for(var i = 0; i < balloons.length; i++){
            balloons[i].update();
            balloons[i].draw();
        }

        for(var i = 0; i < tiles.length; i++){
            if(tiles[i].type === 10 || tiles[i].type === 12 || tiles[i].type === 13 || tiles[i].type === 14 || tiles[i].type === 15){
                tiles[i].update();
                tiles[i].draw();
            }
        }

        for(var i = 0; i < effects.length; i++){
            effects[i].update();
            effects[i].draw();
            if(effects[i].lifeSpan === 0){
                effects.splice(i, 1);
            }
        }

        ctx.globalAlpha = rainOpacity;
        ctx.fillStyle = stormgrd;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 1;

        if(lightningBoltFlashOpacity > 0){
            ctx.fillStyle = 'white';
            ctx.globalAlpha = lightningBoltFlashOpacity;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.globalAlpha = 1;
            lightningBoltFlashOpacity -= 0.2;
        }

        for(var i = 0; i < playerStatBoxes.length; i++){
            playerStatBoxes[i].update();
            playerStatBoxes[i].draw();
        }
        if(gameTicks % updateSpeed === 0){
            cameraYWindOffsetVel+=(Math.random()*rainOpacity/2 - rainOpacity/4);
            cameraYWindOffset += cameraYWindOffsetVel;
            if(cameraYWindOffset > HEIGHT/50){
                cameraYWindOffset = HEIGHT/50;
            }else if(cameraYWindOffset < -HEIGHT/50){
                cameraYWindOffset = -HEIGHT/50;
            }
            if(cameraYWindOffsetVel > 2){
                cameraYWindOffsetVel = 2;
            }else if(cameraYWindOffsetVel < -2){
                cameraYWindOffsetVel = -2;
            }
            cameraGlobalY = Math.round(Math.sin(gameTicks/50) * 3 + cameraGlobalYOffset + cameraYWindOffset);
        }

    }else if(GAMESTATE === "MAIN MENU"){
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

// Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }



}

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
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
