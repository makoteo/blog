var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = 1200;
var HEIGHT = 675;

var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var tileSize;

var tiles = [];
var players = [];
var bullets = [];

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

    this.width = Math.round(tileSize/2);
    this.height = Math.round(tileSize/2);

    this.tilePosX = 0;
    this.tilePosY = 0;

    this.tilePosXRem = 0;
    this.tilePosYRem = 0;

    this.speed = Math.round(tileSize/20);
    this.type = type;
    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;

    this.reload = 0;

    this.orientation = 0;

    this.update = function(){

        this.tilePosX = Math.floor((this.x - this.width - xOffset + tileSize/2)/tileSize);
        this.tilePosXRem = (this.x - this.width - xOffset + tileSize/2) % tileSize;

        this.tilePosY = Math.floor((this.y - this.height - yOffset + tileSize/2)/tileSize);
        this.tilePosYRem = (this.y - this.height - yOffset + tileSize/2) % tileSize;

        //COLLISION CHECK
        if(this.tilePosY > 0) {
            if((map[this.tilePosY - 1][this.tilePosX] === 1) ||
                ((map[this.tilePosY - 1][this.tilePosX - 1] === 1) && this.tilePosXRem < this.width/3) ||
                ((map[this.tilePosY - 1][this.tilePosX + 1] === 1) && this.tilePosXRem > tileSize - this.width/3)){
                if(this.tilePosYRem < this.height/2){
                    this.movingUp = false;
                    //this.y -= this.tilePosYRem - this.height/2;
                }
            }
        }
        if(this.tilePosY < map.length) {
            if(map[this.tilePosY + 1][this.tilePosX] === 1 ||
                ((map[this.tilePosY + 1][this.tilePosX - 1] === 1) && this.tilePosXRem < this.width/3) ||
                ((map[this.tilePosY + 1][this.tilePosX + 1] === 1) && this.tilePosXRem > tileSize - this.width/3)){
                if(this.tilePosYRem > tileSize - this.height/2){
                    this.movingDown = false;
                    //this.y -= this.tilePosYRem - (tileSize - this.height/2);
                }
            }
        }

        if(this.tilePosX > 0) {
            if((map[this.tilePosY][this.tilePosX - 1] === 1) ||
                ((map[this.tilePosY - 1][this.tilePosX - 1] === 1) && this.tilePosYRem < this.width/3) ||
                ((map[this.tilePosY + 1][this.tilePosX - 1] === 1) && this.tilePosYRem > tileSize - this.width/3)){
                if(this.tilePosXRem < this.width/2){
                    this.movingLeft = false;
                }
            }
        }

        if(this.tilePosX < map[0].length) {
            if(map[this.tilePosY][this.tilePosX + 1] === 1 ||
                ((map[this.tilePosY - 1][this.tilePosX + 1] === 1) && this.tilePosYRem < this.width/3) ||
                ((map[this.tilePosY + 1][this.tilePosX + 1] === 1) && this.tilePosYRem > tileSize - this.width/3)){
                if(this.tilePosXRem > tileSize - this.width/2){
                    this.movingRight = false;
                }
            }
        }

        if(this.movingUp){
            this.orientation = 0;
        }
        else if(this.movingRight){
            this.orientation = 2;
        }
        else if(this.movingDown){
            this.orientation = 4;
        }
        else if(this.movingLeft){
            this.orientation = 6;
        }
        if(this.movingUp && this.movingRight){
            this.orientation = 1;
        }
        else if(this.movingRight && this.movingDown){
            this.orientation = 3;
        }
        else if(this.movingDown && this.movingLeft){
            this.orientation = 5;
        }
        else if(this.movingLeft && this.movingUp){
            this.orientation = 9;
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

        if(this.reload > 0){
            this.reload--;
        }

    }
    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
    this.spawnBullet = function(){
        if(this.reload === 0) {
            bullets.push(new Bullet(this.x, this.y, this.orientation));
            this.reload = 10;
        }
    }
}

function Bullet(x, y, orientation){
    this.x = x;
    this.y = y;

    this.width = Math.round(tileSize/10);
    this.height = Math.round(tileSize/10);

    this.speed = Math.round(tileSize/10);

    this.colliding = false;

    this.orientation = orientation;
    this.velX = 0;
    this.velY = 0;

    if(this.orientation === 0){
        this.velX = 0;
        this.velY = -this.speed;
    }else if(this.orientation === 1){
        this.velX = this.speed;
        this.velY = -this.speed;
    }else if(this.orientation === 2){
        this.velX = this.speed;
        this.velY = 0;
    }else if(this.orientation === 3){
        this.velX = this.speed;
        this.velY = this.speed;
    }else if(this.orientation === 4){
        this.velX = 0;
        this.velY = this.speed;
    }else if(this.orientation === 5){
        this.velX = -this.speed;
        this.velY = this.speed;
    }else if(this.orientation === 6){
        this.velX = -this.speed;
        this.velY = 0;
    }else{
        this.velX = -this.speed;
        this.velY = -this.speed;
    }

    this.update = function(){
        this.x += this.velX;
        this.y += this.velY;

        this.tilePosX = Math.floor((this.x - xOffset)/tileSize);
        this.tilePosY = Math.floor((this.y - yOffset)/tileSize);

        //COLLISION CHECK
        if(map[this.tilePosY][this.tilePosX] === 1){
            this.colliding = true;
        }

    }
    this.draw = function(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//CREATE TILES
for(var i = 0; i < map[0].length; i++){
    for(var j = 0; j < map.length; j++){
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
        if(tiles[i].type !== 1){
            tiles[i].update();
            tiles[i].draw();
        }
    }
    for(var i = 0; i < players.length; i++) {
        players[i].update();
        players[i].draw();
        if(players[i].type === 0){
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
            if(keys && keys[77]){
                players[i].spawnBullet();
            }
        }
    }

    for(var i = 0; i < bullets.length; i++){
        bullets[i].update();
        bullets[i].draw();
        if(bullets[i].colliding || bullets[i].x < 0 || bullets[i].y < 0 || bullets[i].x > WIDTH || bullets[i].y > HEIGHT){
            bullets.splice(i, 1);
        }
    }
    for(var i = 0; i < tiles.length; i++){
        if(tiles[i].type === 1){
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
    keys[e.keyCode] = (e.type == "keydown");

    if([32, 37, 38, 39, 40, 114, 112].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

}, false);
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.type == "keydown");
}, false);
