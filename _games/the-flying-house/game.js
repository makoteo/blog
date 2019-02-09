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
    [88, 12, 14, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 15, 13, 88],
    [12, 14, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 15, 13],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 88],
    [88, 10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 88]
];

var backgroundMap = [
    [88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 25, 25, 25, 25, 25, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88, 88],
    [88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88],
    [88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88]
];


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

25-40 -> Dedicated to Backgrounds

88 -> Empty

 */

var tileMap = new Image();
tileMap.src = "Flying-House.png";

var tileSize;

var tiles = [];
var players = [];
var bullets = [];
var balloons = [];

var collidableBlocks = [10, 12, 13, 14, 15];

tileSize = Math.round((HEIGHT - HEIGHT/10) / map.length);


var xOffset = Math.round(WIDTH/2 - (tileSize*map[0].length)/2);
var yOffset = Math.round(HEIGHT/2 - (tileSize*map.length)/2);

var cameraGlobalX = 0;
var cameraGlobalY = 0;
var cameraZoom = 1;

var moveSpeed = tileSize/12;
var bulletSpeed = tileSize/6;

repeatOften(); //Starts Game

function Tile(x, y, width, height, type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    this.cameraX = 0;
    this.cameraY = 0;

    this.imageX = 0;
    this.imageY = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;

    if(this.type !== 11 && this.type !== 10 && this.type !== 12 && this.type !== 13 && this.type !== 14 && this.type !== 15){
        this.lightLevel = 0.8;
    }else if(this.type === 10 || this.type === 14 || this.type === 15){
        this.lightLevel = Math.random()/4;
    }else if(this.type === 12 || this.type === 13){
        this.lightLevel = 0;
    }else{
        this.lightLevel = 0.5;
    }

    if(this.type !== 10 && this.type !== 12){
        if(Math.round((this.x-xOffset)/tileSize) === 0){
            this.lightLevel = 0;
        }else if(Math.round((this.x-xOffset)/tileSize) === map[0].length - 1){
            this.lightLevel = 0;
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
    }

    this.update = function(){
        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };
    this.draw = function(){
        ctx.drawImage(tileMap, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
        ctx.globalAlpha = this.lightLevel/4*3;
        ctx.fillStyle = 'black';
        ctx.fillRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
        ctx.globalAlpha = 1;
    };
}

function Bullet(x, y, xVel, yVel, type){
    this.velY = yVel;
    this.velX = xVel;
    this.type = type;

    this.x = x;
    this.y = y;

    this.width = tileSize/10;
    this.height = tileSize/10;

    this.screenHalfWidth = Math.round(WIDTH/2);
    this.screenHalfHeight = Math.round(HEIGHT/2);

    this.update = function(){
        this.x += this.velX;
        this.y += this.velY;

        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.height/2 - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };

    this.draw = function(){
        ctx.fillStyle = 'black';
        ctx.fillRect(this.cameraX, this.cameraY, this.width * cameraZoom, this.height * cameraZoom);
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
            ctx.lineTo(this.cameraX + cameraGlobalX - 30*cameraZoom + i*30*cameraZoom, this.cameraY + cameraGlobalY/2 - this.yFloat*cameraZoom);
            ctx.stroke();
        }

        if(this.x > WIDTH/2 - tileSize && this.x < WIDTH/2 + tileSize){
            for(var i = 0; i < 3; i++){
                ctx.drawImage(tileMap, 192, 0, 192, 256, this.ballooncameraX - tileSize*cameraZoom + tileSize*cameraZoom*i, this.ballooncameraY, tileSize*7*cameraZoom, tileSize*10*cameraZoom);
            }
        }else{
            ctx.drawImage(tileMap, 192, 0, 192, 256, this.ballooncameraX, this.ballooncameraY, tileSize*6*cameraZoom, tileSize*8*cameraZoom);
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
    this.x = WIDTH/2;
    this.y = HEIGHT/2 - 50;
    this.id = id;

    this.reloadSpeed = 10;
    this.reloadTimer = 0;

    this.width = tileSize/2;
    this.height = tileSize;

    this.cameraX = 0;
    this.cameraY = 0;

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

    this.knockBackXVel = 0;

    this.update = function(){

        if(this.actualXVel === 0){
            this.actualXVel = this.xVel;
        }

        if(this.knockBackXVel > bulletSpeed*2){
            this.knockBackXVel = bulletSpeed*2;
        }

        this.actualXVel += this.knockBackXVel;
        if(this.actualYVel === 0){
            this.actualYVel = this.yVel;
        }

        this.tilePosXLeft = Math.round((this.x - this.width + this.width/10 - xOffset) / tileSize);
        this.tilePosXRight = Math.round((this.x - this.width/10 - xOffset) / tileSize);
        this.tilePosYTop = Math.round((this.y - this.height - yOffset) / tileSize);
        this.tilePosYBottom = Math.round((this.y - this.actualYVel - 2 - yOffset) / tileSize);

        if((this.x + this.width*2 > xOffset) && (this.x - this.width*2 < WIDTH - xOffset) && (this.y > yOffset) && (this.y + this.height < HEIGHT - yOffset)){
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
                                    this.actualYVel = this.yVel;
                                }
                            } else {
                                this.actualYVel += this.gravity;
                                break;
                            }
                        }
                    } else {
                        if (map[this.tilePosYBottom][this.tilePosXLeft] === 11 || map[this.tilePosYBottom][this.tilePosXRight] === 11) {
                            if ((map[this.tilePosYTop - 1][this.tilePosXLeft] === 11 && map[this.tilePosYTop - 1][this.tilePosXRight] === 11)) {
                                this.actualYVel = this.yVel;
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
            this.knockBackXVel--;
        }else if(this.knockBackXVel < -2){
            this.knockBackXVel++;
        }else{
            this.knockBackXVel = 0;
        }

        this.x += this.actualXVel;
        this.y += this.actualYVel;

        this.actualXVel = 0;

        this.xVel = 0;
        this.yVel = 0;

        if(this.reloadTimer > 0){
            this.reloadTimer--;
        }

        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.height/2 - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };

    this.draw = function(){
        if(this.id === 1){
            ctx.fillStyle = 'red';
        }else if(this.id === 2){
            ctx.fillStyle = 'lightblue';
        }

        ctx.fillRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
    };

    this.spawnBullet = function(){
        if(this.reloadTimer === 0){
            if(this.facing === 1){
                bullets.push(new Bullet(this.x + this.width, this.y, bulletSpeed, 0, 0));
            }else{
                bullets.push(new Bullet(this.x, this.y, -bulletSpeed, 0, 0));
            }
            this.reloadTimer = this.reloadSpeed;
        }
    }
}

//CREATE TILES

for(var i = 0; i < backgroundMap[0].length; i++){
    for(var j = 0; j < backgroundMap.length; j++){
        if(backgroundMap[j][i] !== 88){
            tiles.push(new Tile(xOffset + tileSize*i, yOffset + tileSize*j, tileSize, tileSize, backgroundMap[j][i]));
        }
    }
}

for(var i = 0; i < map[0].length; i++){
    for(var j = 0; j < map.length; j++){
        if(map[j][i] !== 88){
            tiles.push(new Tile(xOffset + tileSize*i, yOffset + tileSize*j, tileSize, tileSize, map[j][i]));
        }
    }
}

players.push(new Player(1));
players.push(new Player(2));

balloons.push(new Balloon(WIDTH/2, yOffset, 0));
balloons.push(new Balloon(xOffset + tileSize, yOffset + tileSize*6, 0));
balloons.push(new Balloon(WIDTH - xOffset - tileSize, yOffset + tileSize*6, 0));

var gameTicks = 0;

function game(){

    gameTicks++;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < tiles.length; i++){
        if(tiles[i].type !== 10 && tiles[i].type !== 12 && tiles[i].type !== 13 && tiles[i].type !== 14 && tiles[i].type !== 15){
            tiles[i].update();
            tiles[i].draw();
            if(gameTicks < 200){
                if(i < tiles.length - map.length){
                    if(tiles[i+map.length].lightLevel < tiles[i].lightLevel){
                        tiles[i].lightLevel = tiles[i+map.length].lightLevel + 0.1;
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
            if(bullets[i].x < players[j].x + players[j].width && bullets[i].x + bullets[i].velX > players[j].x){
                if(bullets[i].y > players[j].y - players[j].height/2 && bullets[i].y < players[j].y + players[j].height/2){
                    players[j].knockBackXVel += bullets[i].velX*1.5;
                    destroy = true;
                }
            }
        }

        if(bullets.length > 0 && i !== bullets.length){
            if(bullets[i].x < 10 || bullets[i].x > WIDTH + 10){
                bullets.splice(i, 1);
            }
        }

        if(bullets.length > 0 && i !== bullets.length) {
            for(var j = 0; j < collidableBlocks.length; j++){
                if (map[Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize)][Math.round((bullets[i].x - xOffset) / tileSize)] === collidableBlocks[j]) {
                    destroy = true;
                    break;
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
    if((keys && keys[40])&&(keys && keys[38])){

    }else if(keys && keys[38]){
        players[0].yVel = -moveSpeed;
    }
    else if(keys && keys[40]){
        players[0].yVel = moveSpeed;
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

    //PLAYER 2

    if((keys && keys[69])&&(keys && keys[68])){

    }else if(keys && keys[69]){
        players[1].yVel = -moveSpeed;
        console.log("Jump");
    }
    else if(keys && keys[68]){
        players[1].yVel = moveSpeed;
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

    for(var i = 0; i < players.length; i++) {
        players[i].update();
        players[i].draw();
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

    if(gameTicks % 5 === 0){
        cameraGlobalY = Math.round(Math.sin(gameTicks/50) * 3);
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
