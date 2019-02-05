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
var players = [];

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

function Player(x, y, type){
    this.x = x;
    this.y = y;

    this.width = 30;
    this.height = 30;

    this.tilePosX = 0;
    this.tilePosY = 0;

    this.tilePosXRem = 0;
    this.tilePosYRem = 0;

    this.speed = 3;
    this.type = type;
    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.update = function(){

        this.tilePosX = Math.floor((this.x - this.width - xOffset + tileSize/2)/tileSize);
        this.tilePosXRem = (this.x - this.width - xOffset + tileSize/2) % tileSize;

        this.tilePosY = Math.floor((this.y - this.height - yOffset + tileSize/2)/tileSize);
        this.tilePosYRem = (this.y - this.height - yOffset + tileSize/2) % tileSize;

        //COLLISION CHECK
        if(this.tilePosY > 0) {
            if((map[this.tilePosY - 1][this.tilePosX] === 1) ||
                ((map[this.tilePosY - 1][this.tilePosX - 1] === 1) && this.tilePosXRem < this.width/2.5) ||
                ((map[this.tilePosY - 1][this.tilePosX + 1] === 1) && this.tilePosXRem > tileSize - this.width/2.5)){
                if(this.tilePosYRem < this.height/2){
                    this.movingUp = false;
                }
            }
        }
        if(this.tilePosY < map.length) {
            if(map[this.tilePosY + 1][this.tilePosX] === 1 ||
                ((map[this.tilePosY + 1][this.tilePosX - 1] === 1) && this.tilePosXRem < this.width/2.5) ||
                ((map[this.tilePosY + 1][this.tilePosX + 1] === 1) && this.tilePosXRem > tileSize - this.width/2.5)){
                if(this.tilePosYRem > tileSize - this.height/2){
                    this.movingDown = false;
                }
            }
        }

        if(this.tilePosX > 0) {
            if((map[this.tilePosY][this.tilePosX - 1] === 1) ||
                ((map[this.tilePosY - 1][this.tilePosX - 1] === 1) && this.tilePosYRem < this.width/2.5) ||
                ((map[this.tilePosY + 1][this.tilePosX - 1] === 1) && this.tilePosYRem > tileSize - this.width/2.5)){
                if(this.tilePosXRem < this.height/2){
                    this.movingLeft = false;
                }
            }
        }
        if(this.tilePosX < map[0].length) {
            if(map[this.tilePosY][this.tilePosX + 1] === 1 ||
                ((map[this.tilePosY - 1][this.tilePosX + 1] === 1) && this.tilePosYRem < this.width/2.5) ||
                ((map[this.tilePosY + 1][this.tilePosX + 1] === 1) && this.tilePosYRem > tileSize - this.width/2.5)){
                if(this.tilePosXRem > tileSize - this.height/2){
                    this.movingRight = false;
                }
            }
        }

        if(this.movingUp){
            this.y-= this.speed;
        }
        if(this.movingDown){
            this.y+= this.speed;
        }
        if(this.movingRight){
            this.x+= this.speed;
        }
        if(this.movingLeft){
            this.x-= this.speed;
        }

        console.log(this.tilePosX + " - " + this.tilePosXRem);
        console.log(this.tilePosY + " - " + this.tilePosYRem);

    }
    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, 30, 30);
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

players.push(new Player(WIDTH/2, HEIGHT/2, 0))

function game(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < tiles.length; i++){
        tiles[i].update();
        tiles[i].draw();
    }
    for(var i = 0; i < players.length; i++) {
        //if(players[i].type === 0){
        players[i].update();
        players[i].draw();
            if(keys && keys[37]){
                players[i].movingLeft = true;
            }else{
                players[i].movingLeft = false;
            }
            if(keys && keys[38]){
                players[i].movingUp = true;
            }else{
                players[i].movingUp = false;
            }
            if(keys && keys[39]){
                players[i].movingRight = true;
            }else{
                players[i].movingRight = false;
            }
            if(keys && keys[40]){
                players[i].movingDown = true;
            }else{
                players[i].movingDown = false;
            }
        //}
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
    keys[e.keyCode] = (e.type == "keydown");

    if([32, 37, 38, 39, 40, 114, 112].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

}, false);
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.type == "keydown");
}, false);
