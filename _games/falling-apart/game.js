var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = 1200;
var HEIGHT = 675;

var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 2, 1],
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 2, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var tileSize;

var tiles = [];

tileSize = Math.round((HEIGHT - HEIGHT/10) / map.length);


var xOffset = Math.round(WIDTH/2 - (tileSize*map[0].length)/2);
var yOffset = Math.round(HEIGHT/2 - (tileSize*map.length)/2);

repeatOften(); //Starts Game

function Tile(x, y, width, height, type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.update = function(){

    }
    this.draw = function(){
        if(this.type === 1){ //WALL
            ctx.fillStyle = 'black';
        }else if(this.type === 2){ //DOOR
            ctx.fillStyle = 'gray';
        }else{ //GROUND
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//CREATE TILES
for(var i = 0; i < map.length; i++){
    for(var j = 0; j < map[0].length; j++){
        if(map[j][i] === 0){
            tiles.push(new Tile(xOffset + tileSize*i, yOffset + tileSize*j, tileSize, tileSize, 0));
        }else if(map[j][i] === 1) {
            tiles.push(new Tile(xOffset + tileSize*i, yOffset + tileSize*j, tileSize, tileSize, 1));
        }
    }
}

function game(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < tiles.length;i++){
        tiles[i].update();
        tiles[i].draw();
    }
}

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
