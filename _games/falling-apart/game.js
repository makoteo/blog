var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = 1200;
var HEIGHT = 675;

var map = [
    [10, 10, 27, 10, 10, 10, 10, 10, 10, 10, 10, 27, 10, 10, 10],
    [27, 11, 11, 11, 11, 11, 11, 10, 11, 11, 11, 11, 11, 11, 27],
    [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10],
    [10, 11, 11, 11, 11, 11, 11, 10, 11, 11, 11, 11, 11, 11, 10],
    [10, 12, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 10],
    [10, 12, 12, 12, 12, 12, 12, 10, 10, 10, 10, 10, 10, 11, 10],
    [10, 12, 12, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 10],
    [10, 12, 12, 12, 12, 12, 12, 10, 11, 11, 11, 11, 11, 11, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
];

/*
GUIDE TO TILE TYPES:

10 -> Wall (rewrite wallTexture to get different wall textures)

11-25 -> Dedicated to Floor Tiles

26 -> Door

27-40 -> Windows and Other Ways to Fall out

40-70 -> Detailing

 */

var wallType = 10;

var tileMap = new Image();
tileMap.src = "FallingApart.png";

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

    this.wallIntersect = false;

    if(this.type === wallType || this.type === 27){
        if((this.y - yOffset)/tileSize + 1 !== map.length){
            if(map[(this.y - yOffset)/tileSize + 1][(this.x - xOffset)/tileSize] === wallType ||
                map[(this.y - yOffset)/tileSize + 1][(this.x - xOffset)/tileSize] === 27){
                this.wallIntersect = true;
            }
        }
    }

    this.update = function(){

    };
    this.draw = function(){
        if(this.type === wallType){ //Wall
            //ctx.fillStyle = 'black';
            //ctx.fillRect(this.x, this.y, this.width, this.height);

            if(this.wallIntersect === false){
                ctx.drawImage(tileMap, 0, 64, 64, 64, this.x, this.y, this.width, this.height);
            }else{
                ctx.drawImage(tileMap, 64, 64, 64, 64, this.x, this.y, this.width, this.height);
            }
        }else if(this.type === 26){ //Door
            //ctx.fillRect(this.x, this.y, this.width, this.height);

        }else if(this.type === 11){ //Wooden Floor 1
            ctx.drawImage(tileMap, 0, 0, 64, 64, this.x, this.y, this.width, this.height);
        }else if(this.type === 12){ //Tile Floor 1
            ctx.drawImage(tileMap, 64, 0, 64, 64, this.x, this.y, this.width, this.height);
        }else if(this.type === 27){ //Window 1
            if(this.wallIntersect === false){
                ctx.drawImage(tileMap, 0, 128, 64, 64, this.x, this.y, this.width, this.height);
            }else{
                ctx.drawImage(tileMap, 64, 128, 64, 64, this.x, this.y, this.width, this.height);
            }
        }else if(this.type === 99){ //Tile Floor 1
            if((this.y - yOffset - tileSize/2)/tileSize === 0){
                ctx.drawImage(tileMap, 0, 32, 64, 32, this.x, this.y, this.width, this.height/2);
            }else if((this.x - xOffset - tileSize/2)/tileSize === 0){
                ctx.drawImage(tileMap, 32, 0, 32, 64, this.x, this.y - this.height/2, this.width/2, this.height);
            }else if((this.y - yOffset - tileSize/2)/tileSize === map.length){
                ctx.drawImage(tileMap, 0, 0, 64, 32, this.x, this.y, this.width, this.height/2);
            }else if((this.x - xOffset - tileSize/2)/tileSize === map[0].length){
                console.log("CHECK");
                ctx.drawImage(tileMap, 0, 0, 32, 64, this.x + this.width, this.y - this.height, this.width/2, this.height);
            }else{
                //ctx.drawImage(tileMap, 0, 0, 64, 64, this.x, this.y, this.width, this.height);
            }
        }
    }
}

function Player(x, y, type){
    this.x = x;
    this.y = y;

    this.width = Math.round(tileSize/2);
    this.height = Math.round(tileSize/2);

    this.tilePosX = 0;
    this.tilePosY = 0;

    this.speed = Math.round(tileSize/20);
    this.type = type;
    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;

    this.reload = 0;

    this.orientation = 0;

    this.update = function(){

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

        this.tilePosX = Math.floor((this.x - this.width - xOffset + tileSize/2)/tileSize);
        this.tilePosY = Math.floor((this.y - this.height - yOffset + tileSize/2)/tileSize);

        //COLLISIONS

        if(this.tilePosY > 0) {
            if((map[this.tilePosY - 1][this.tilePosX] === wallType)){
                if((this.tilePosY - 1)*tileSize + yOffset + tileSize + this.height/2 > this.y){
                    this.y = (this.tilePosY - 1)*tileSize + yOffset + tileSize + this.height/2;
                    this.movingUp = false;
                }
            }
        }else{
            this.y = (this.tilePosY)*tileSize + yOffset + tileSize + this.height/2;
        }

        if(this.tilePosY < map.length) {
            if((map[this.tilePosY + 1][this.tilePosX] === wallType)){
                if((this.tilePosY + 1)*tileSize < this.y - this.height/2){
                    this.y = (this.tilePosY + 1)*tileSize + this.height/2;
                    this.movingDown = false;
                }
            }
        }else{
            this.y = (this.tilePosY)*tileSize + this.height/2;
        }

        if(this.tilePosX > 0) {
            if((map[this.tilePosY][this.tilePosX - 1] === wallType)){
                if((this.tilePosX - 1)*tileSize + xOffset + tileSize + this.width/2 > this.x){
                    this.x = (this.tilePosX - 1)*tileSize + xOffset + tileSize + this.width/2;
                    this.movingLeft = false;
                }
            }
        }else{
            this.x = (this.tilePosX)*tileSize + xOffset + tileSize + this.width/2;
        }

        if(this.tilePosX < map[0].length) {
            if((map[this.tilePosY][this.tilePosX + 1] === wallType)){
                if((this.tilePosX + 1)*tileSize + tileSize < this.x){
                    this.x = (this.tilePosX + 1)*tileSize + tileSize;
                    this.movingRight = false;
                }
            }
        }else{
            this.x = (this.tilePosX)*tileSize + this.height/2 + tileSize;
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

    };
    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    };
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
        if(map[this.tilePosY][this.tilePosX] === wallType){
            this.colliding = true;
        }

    }
    this.draw = function(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//CREATE TILES
for(var i = 0; i < map[0].length - 1; i++){
    for(var j = 0; j < map.length - 1; j++){
        tiles.push(new Tile(xOffset + tileSize*i + tileSize/2, yOffset + tileSize*j + tileSize/2, tileSize, tileSize, 99));
    }
}

for(var i = 0; i < map[0].length; i++){
    for(var j = 0; j < map.length; j++){
        tiles.push(new Tile(xOffset + tileSize*i, yOffset + tileSize*j, tileSize, tileSize, map[j][i]));
    }
}

players.push(new Player(WIDTH/2, HEIGHT/2, 0));

function game(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < tiles.length; i++){
        tiles[i].update();
        tiles[i].draw();
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
