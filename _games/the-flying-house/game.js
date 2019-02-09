var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = 1200;
var HEIGHT = 675;

var map = [
    [88, 88, 88, 88, 88, 10, 10, 10, 10, 10, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 10, 88, 88, 88, 88, 88, 10, 88, 88, 88, 88],
    [88, 88, 88, 10, 88, 88, 88, 88, 88, 88, 88, 10, 88, 88, 88],
    [88, 88, 10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10, 88, 88],
    [88, 10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10, 88],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88],
    [10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10],
    [10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88],
    [10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10],
    [10, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 10],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 88, 88, 11, 88, 88, 88, 88, 88, 88, 88],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
];

var backgroundMap = [
    [88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 88, 25, 25, 25, 25, 25, 88, 88, 88, 88, 88],
    [88, 88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88, 88],
    [88, 88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88, 88],
    [88, 88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88, 88],
    [88, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 88],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
];


/*
GUIDE TO TILE TYPES:

10 -> Wall (rewrite wallTexture to get different wall textures)

11 -> Ladder

12-24 -> Dedicated to Other Walls/Colliders

25-40 -> Dedicated to Backgrounds

88 -> Empty

 */

var wallType = 10;

//var tileMap = new Image();
//tileMap.src = "FallingApart.png";

var tileSize;

var tiles = [];
var players = [];
var bullets = [];

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

    this.screenHalfWidth = Math.round(WIDTH/2);
    this.screenHalfHeight = Math.round(HEIGHT/2);

    this.update = function(){
        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };
    this.draw = function(){
        if(this.type === 10){
            ctx.fillStyle = 'black';
        }else if(this.type === 11){
            ctx.fillStyle = 'blue';
        }else if(this.type === 25){
            ctx.fillStyle = 'gray';
        }
        ctx.fillRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
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

function Player(id){
    this.x = WIDTH/2;
    this.y = HEIGHT/2 - 50;
    this.id = id;

    this.reloadSpeed = 5;
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

    this.update = function(){

        if(this.actualXVel === 0){
            this.actualXVel = this.xVel;
        }
        if(this.actualYVel === 0){
            this.actualYVel = this.yVel;
        }

        this.tilePosXLeft = Math.round((this.x - this.width + this.width/10 - xOffset) / tileSize);
        this.tilePosXRight = Math.round((this.x - this.width/10 - xOffset) / tileSize);
        this.tilePosYTop = Math.round((this.y - this.height - yOffset) / tileSize);
        this.tilePosYBottom = Math.round((this.y - this.actualYVel - 2 - yOffset) / tileSize);

        if(this.tilePosYTop > 0){
            if(map[this.tilePosYTop - 1][this.tilePosXLeft] === 10 || map[this.tilePosYTop - 1][this.tilePosXRight] === 10){
                if(this.actualYVel < 0){
                    if(this.y - this.height/2 + this.actualYVel <= (this.tilePosYTop - 1) * tileSize + tileSize + yOffset){
                        this.actualYVel = ((this.tilePosYTop - 1) * tileSize + tileSize + yOffset - this.y + this.height/2);
                    }else{

                    }
                }else{

                }
            }else{

            }
        }

        if(this.tilePosYBottom < map.length - 1){
            if(map[this.tilePosYBottom + 1][this.tilePosXLeft] === 10 || map[this.tilePosYBottom + 1][this.tilePosXRight] === 10){
                if(this.y + this.height/2 + this.actualYVel >= (this.tilePosYBottom + 1) * tileSize + yOffset){
                    this.actualYVel = ((this.tilePosYBottom + 1) * tileSize + yOffset - this.y - this.height/2);
                }else{
                    if(map[this.tilePosYBottom][this.tilePosXLeft] === 11 || map[this.tilePosYBottom][this.tilePosXRight] === 11){
                        if(map[this.tilePosYTop - 1][this.tilePosXLeft] === 11 || map[this.tilePosYTop - 1][this.tilePosXRight] === 11){
                            this.actualYVel = this.yVel;
                        }
                    }else{
                        this.actualYVel += this.gravity;
                    }
                }
            }else{
                if(map[this.tilePosYBottom][this.tilePosXLeft] === 11 || map[this.tilePosYBottom][this.tilePosXRight] === 11){
                    if(map[this.tilePosYTop - 1][this.tilePosXLeft] === 11 || map[this.tilePosYTop - 1][this.tilePosXRight] === 11){
                        this.actualYVel = this.yVel;
                    }
                }else{
                    this.actualYVel += this.gravity;
                }
            }
        }

        if(this.tilePosXLeft > 0){
            if(map[this.tilePosYBottom][this.tilePosXLeft - 1] === 10 || map[this.tilePosYTop][this.tilePosXLeft - 1] === 10){
                if(this.actualXVel < 0){
                    if(this.x + this.actualXVel <= (this.tilePosXLeft - 1) * tileSize + tileSize + xOffset){
                        this.actualXVel = ((this.tilePosXLeft - 1) * tileSize + tileSize + xOffset - this.x + 1.15);
                    }else{

                    }
                }
            }else{

            }
        }

        if(this.tilePosXRight < map[0].length - 1){
            if(map[this.tilePosYBottom][this.tilePosXRight + 1] === 10 || map[this.tilePosYTop][this.tilePosXRight + 1] === 10){
                if(this.actualXVel > 0){
                    if(this.x + this.width + this.actualXVel >= (this.tilePosXRight + 1) * tileSize + xOffset){
                        this.actualXVel = ((this.tilePosXRight + 1) * tileSize + xOffset - this.x - this.width - 1.15);
                    }else{

                    }
                }
            }else{

            }
        }

        //console.log(this.actualYVel);

        if(this.actualXVel > moveSpeed - 1){
            this.facing = 1;
        }else if(this.actualXVel < -moveSpeed + 1){
            this.facing = -1;
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
        ctx.fillStyle = 'red';
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

var gameTicks = 0;

function game(){

    gameTicks++;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < tiles.length; i++){
        if(tiles[i].type !== 10){
            tiles[i].update();
            tiles[i].draw();
        }
    }

    for(var i = 0; i < bullets.length; i++){
        bullets[i].update();
        bullets[i].draw();

        if(bullets.length > 0 && i !== bullets.length) {
            if (map[Math.round((bullets[i].y - tileSize / 2 - yOffset) / tileSize)][Math.round((bullets[i].x - xOffset) / tileSize)] === 10) {
                bullets.splice(i, 1);
            }
        }

        if(bullets.length > 0 && i !== bullets.length){
            if(bullets[i].x < 10 || bullets[i].x > WIDTH + 10){
                bullets.splice(i, 1);
            }
        }
    }

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
        players[0].spawnBullet();
    }

    for(var i = 0; i < players.length; i++){
        players[i].update();
        players[i].draw();
    }

    for(var i = 0; i < tiles.length; i++){
        if(tiles[i].type === 10){
            tiles[i].update();
            tiles[i].draw();
        }
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
