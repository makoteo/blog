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
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 10, 88, 88, 88, 88, 88, 88, 10, 10, 88, 88, 10],
    [10, 88, 10, 10, 10, 88, 88, 88, 10, 10, 10, 10, 10, 88, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
];


/*
GUIDE TO TILE TYPES:

10 -> Wall (rewrite wallTexture to get different wall textures)

11-25 -> Dedicated to Floor Tiles

71-87 -> Transition Flooring

71 - Wood-Tiles (Horizontal)
72 - Tiles-Wood (Horizontal)

26 -> Door

27-40 -> Windows and Other Ways to Fall out

40-70 -> Detailing

 */

var wallType = 10;

//var tileMap = new Image();
//tileMap.src = "FallingApart.png";

var tileSize;

var tiles = [];
var players = [];

tileSize = Math.round((HEIGHT - HEIGHT/10) / map.length);


var xOffset = Math.round(WIDTH/2 - (tileSize*map[0].length)/2);
var yOffset = Math.round(HEIGHT/2 - (tileSize*map.length)/2);

var cameraGlobalX = 0;
var cameraGlobalY = 0;
var cameraZoom = 2;

var moveSpeed = tileSize/12;

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
        ctx.fillStyle = 'black';
        ctx.fillRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
    };
}

function Player(id){
    this.x = WIDTH/2;
    this.y = HEIGHT/2 - 50;
    this.id = id;

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

    this.goingUp = true;

    this.tilePosXLeft = 0;
    this.tilePosXRight = 0;
    this.tilePosXCenter = 0;
    this.tilePosY = 0;

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
        this.tilePosYBottomCenter = Math.round((this.y - this.height/5 - yOffset) / tileSize);

        if(this.tilePosYBottom < map.length){
            if(map[this.tilePosYBottom + 1][this.tilePosXLeft] === 10 || map[this.tilePosYBottom + 1][this.tilePosXRight] === 10){
                if(this.actualYVel > 0){
                    if(this.y + this.height/2 + this.actualYVel >= (this.tilePosYBottom + 1) * tileSize + yOffset){
                        this.actualYVel = (this.tilePosYBottom + 1) * tileSize + yOffset - this.y - this.height/2;
                    }else{
                        this.actualYVel += 0.15;
                    }
                }
            }else{
                this.actualYVel += 0.15;
            }
        }

        if(this.tilePosYTop > 0){
            if(map[this.tilePosYTop - 1][this.tilePosXLeft] === 10 || map[this.tilePosYTop - 1][this.tilePosXRight] === 10){
                if(this.actualYVel < 0){
                    if(this.y - this.height/2 + this.actualYVel <= (this.tilePosYTop - 1) * tileSize + tileSize + yOffset){
                        this.actualYVel = (this.tilePosYTop - 1) * tileSize + tileSize + yOffset - this.y + this.height/2 + 1;
                    }else{

                    }
                }
            }else{

            }
        }

        if(this.tilePosXLeft > 0){
            if(map[this.tilePosYBottom][this.tilePosXLeft - 1] === 10 || map[this.tilePosYTop][this.tilePosXLeft - 1] === 10){
                if(this.actualXVel < 0){
                    if(this.x + this.actualXVel <= (this.tilePosXLeft - 1) * tileSize + tileSize + xOffset){
                        this.actualXVel = (this.tilePosXLeft - 1) * tileSize + tileSize + xOffset - this.x + 1;
                    }else{

                    }
                }
            }else{

            }
        }

        if(this.tilePosXRight < map[0].length){
            if(map[this.tilePosYBottom][this.tilePosXRight + 1] === 10 || map[this.tilePosYTop][this.tilePosXRight + 1] === 10){
                if(this.actualXVel > 0){
                    if(this.x + this.width + this.actualXVel >= (this.tilePosXRight + 1) * tileSize + xOffset){
                        this.actualXVel = (this.tilePosXRight + 1) * tileSize + xOffset - this.x - this.width - 1;
                    }else{

                    }
                }
            }else{

            }
        }

        console.log(this.tilePosXLeft);

        this.x += this.actualXVel;
        this.y += this.actualYVel;

        this.actualXVel = 0;

        this.xVel = 0;
        this.yVel = 0;

        this.cameraX = Math.round((this.x - this.screenHalfWidth) * cameraZoom + this.screenHalfWidth);
        this.cameraY = Math.round((this.y - this.height/2 - this.screenHalfHeight) * cameraZoom + this.screenHalfHeight);
    };

    this.draw = function(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.cameraX + cameraGlobalX, this.cameraY + cameraGlobalY, this.width*cameraZoom, this.height*cameraZoom);
    };
}

//CREATE TILES

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
        tiles[i].update();
        tiles[i].draw();
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

    for(var i = 0; i < players.length; i++){
        players[i].update();
        players[i].draw();
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
