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
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
    [10, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 10],
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

tileSize = Math.round((HEIGHT - HEIGHT/10) / map.length);


var xOffset = Math.round(WIDTH/2 - (tileSize*map[0].length)/2);
var yOffset = Math.round(HEIGHT/2 - (tileSize*map.length)/2);

var cameraX = 0;
var cameraY = 0;
var cameraZoom = 0.5;

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
        ctx.fillRect(this.cameraX, this.cameraY, this.width*cameraZoom, this.height*cameraZoom);
    }
}

//CREATE TILES

for(var i = 0; i < map[0].length; i++){
    for(var j = 0; j < map.length; j++){
        if(map[j][i] !== 88){
            tiles.push(new Tile(xOffset + tileSize*i, yOffset + tileSize*j, tileSize, tileSize, map[j][i]));
        }
    }
}

var gameTicks = 0;

function game(){

    gameTicks++;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < tiles.length; i++){
        tiles[i].update();
        tiles[i].draw();
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
