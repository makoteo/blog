var versionCode = "Alpha 0.9";
var WIDTH = 800;
var HEIGHT = 450;
var gameRunning = true;
var TIME = 0;

var frameCount = 0;

var map = [];

// 0 = empty, 1 = wall, 2 = door, 3 = permawall, 4 = loot, 5 = innerroom, 6 = lockedDoor

var mapdimensions = 70; //I think 50, 70, 90 are the sizes we want... (Tho 110 works and it's ridiculous lol)

var mapwidth = mapdimensions;
var mapheight = mapdimensions;

var roomsize = 8; //8

var room2size = 36; //32
var room2 = true;

var tileSize = 100; //100
var offset = 0;

var cameraX = tileSize*(mapwidth - 8)/2;
var cameraY = tileSize*mapheight/2;

//var cameraX = 0;
//var cameraY = 0;

var playerSpeed = 5; //5

var doorsGenerated = false;

var lootChances = 0.03; //0.03

var creators = [];
//KICKSTART GAME
generateMap();

// EXAMPLE ARRAY coins = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

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

    this.topMargin = 2/5;

    this.update = function(){
        this.gameX = cameraX + WIDTH/2;
        this.gameY = cameraY + HEIGHT/2;

        this.tileX = Math.floor(this.gameX/tileSize);
        this.tileY = Math.floor(this.gameY/tileSize);

        this.tileY3 = Math.floor((this.gameY+this.height*this.topMargin*tileSize)/tileSize);

        this.tileX2 = Math.floor((this.gameX+this.width*tileSize)/tileSize);
        this.tileY2 = Math.floor((this.gameY+this.height*tileSize)/tileSize);

        if(Math.floor((this.gameY + this.height*this.topMargin*tileSize - playerSpeed)/tileSize) !== this.tileY3){
            if(map[this.tileY3 - 1][this.tileX] === 1 || map[this.tileY3 - 1][this.tileX2] === 1){
                if (keys && keys[38] || keys && keys[87]) {cameraY+=Math.round((this.tileY3)*tileSize+1-(this.gameY)-(this.height*this.topMargin*tileSize));}
            }else{
                if (keys && keys[38] || keys && keys[87]) {cameraY-=playerSpeed;}
            }
        }else{
            if (keys && keys[38] || keys && keys[87]) {cameraY-=playerSpeed;}
        }

        if(Math.floor((this.gameX - playerSpeed)/tileSize) !== this.tileX){
            if(map[this.tileY3][this.tileX - 1] === 1 || map[this.tileY2][this.tileX - 1] === 1){
                if (keys && keys[65] || keys && keys[37]) {cameraX+=(this.tileX)*tileSize+1-(this.gameX);}
            }else{
                if (keys && keys[65] || keys && keys[37]) {cameraX-=playerSpeed;}
            }
        }else{
            if (keys && keys[65] || keys && keys[37]) {cameraX-=playerSpeed;}
        }

        if(Math.floor((this.gameY + this.height*tileSize + playerSpeed)/tileSize) !== this.tileY2){
            if(map[this.tileY2 + 1][this.tileX] === 1 || map[this.tileY2 + 1][this.tileX2] === 1){
                if (keys && keys[40] || keys && keys[83]) {cameraY+=((this.tileY2+1)*tileSize - (this.gameY + this.height*tileSize))-1;}
            }else{
                if (keys && keys[40] || keys && keys[83]) {cameraY+=playerSpeed;}
            }
        }else{
            if (keys && keys[40] || keys && keys[83]) {cameraY+=playerSpeed;}
        }

        if(Math.floor((this.gameX + this.width*tileSize + playerSpeed)/tileSize) !== this.tileX2){
            if(map[this.tileY3][this.tileX2 + 1] === 1 || map[this.tileY2][this.tileX2 + 1] === 1){
                if (keys && keys[68] || keys && keys[39]) {cameraX+=((this.tileX2+1)*tileSize - (this.gameX + this.width*tileSize))-1;}
            }else{
                if (keys && keys[68] || keys && keys[39]) {cameraX+=playerSpeed;}
            }
        }else{
            if (keys && keys[68] || keys && keys[39]) {cameraX+=playerSpeed;}
        }

    };

    this.draw = function(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - this.width/2, this.y - this.height, this.width*tileSize, this.height*tileSize);
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
        this.spawnNew = Math.random();
        this.die = Math.random();

        if(this.spawnNew < 0.26){
            creators.push(new Creator(this.x, this.y, true));
        }

        if(this.die < 0.05 && this.killable === true){
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
            this.dir = this.possibleDirections[Math.floor(Math.random()*this.possibleDirections.length)];
        }else{
            //BACKTRACKER


            if((this.possibleDirections.length === 0 && this.killable === true) || (this.possibleDirections.length === 0 && this.killable === false && this.aliveTime > 100)) {
                this.dead = true;
                //The following creates so many junctions:
                if(Math.random() < 0.3) {
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
            this.dir = this.possibleDirections[Math.floor(Math.random()*this.possibleDirections.length)];
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

player = new Player(WIDTH/2, HEIGHT/2, 1/2, 3/4); //Add the Player

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //



function generateMap(){
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
            }else if(i > mapheight/2 - roomsize/2 && i < mapheight/2 + roomsize/2 && j > mapwidth/2 - roomsize/2 && j < mapwidth/2 + roomsize/2){
                temparray.push(5);
            }else{
                temparray.push(1);
            }
        }
        map.push(temparray);
    }

}

function generateDoors(){ //TODO Make sure doors can't generate at 0, 0 and width, height;
    var doorrnd1 = Math.floor(Math.random()*mapwidth);
    while(map[doorrnd1][1] === 1){
        doorrnd1 = Math.floor(Math.random()*mapwidth);
    }
    map[doorrnd1][0] = 2;

    doorrnd1 = Math.floor(Math.random()*mapwidth);
    while(map[doorrnd1][mapheight-1] === 1){
        doorrnd1 = Math.floor(Math.random()*mapwidth);
    }
    map[doorrnd1][mapheight] = 2;

    doorrnd1 = Math.floor(Math.random()*mapheight);
    while(map[1][doorrnd1] === 1){
        doorrnd1 = Math.floor(Math.random()*mapheight);
    }
    map[0][doorrnd1] = 2;

    doorrnd1 = Math.floor(Math.random()*mapheight);
    while(map[mapwidth-1][doorrnd1] === 1){
        doorrnd1 = Math.floor(Math.random()*mapheight);
    }
    map[mapwidth][doorrnd1] = 2;
}

//KINDA COOL LOL
function fillRooms(){
    for(var i = 2; i < map.length - 2; i+=2){
        for(var j = 2; j < map[0].length - 2; j+=2){
            if(map[i-1][j] === 0 && map[i+1][j] === 0 && map[i][j-1] === 0 && map[i][j + 1] === 0 && map[i][j] === 1){
                var rnd = Math.random();
                if(rnd < 0.8){
                    map[i][j] = 4;
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
                var rnd = Math.random();
                if(rnd < lootChances){
                    map[i][j] = 4;
                }else{
                    map[i][j] = 0;
                }
            }
        }
    }
}

function genExitsFromMain(size){
    var tmp = i;
    var rnd = Math.floor(Math.random()*(size-2));
    for(var i = 0; i <= mapheight; i++){
        for(var j = 0; j <= mapwidth; j++) {
            if(i === mapheight/2 - size/2 && j === mapwidth/2 - size/2 + rnd + 1){
                tmp = i;
                while((map[j][tmp] === 1 || map[j][tmp] === 3) && tmp > 0 && map[j-1][tmp+1] !== 0 && map[j+1][tmp+1] !== 0){
                    if(map[j][tmp] === 3 && size !== roomsize){
                        map[j][tmp] = 6;
                    }else{
                        map[j][tmp] = 0;
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
    rnd = Math.floor(Math.random()*(size-2));
    for(var i = 0; i <= mapheight; i++){
        for(var j = 0; j <= mapwidth; j++) {
            if(i === mapheight/2 + size/2 && j === mapwidth/2 - size/2 + rnd + 1){
                tmp = i;
                while((map[j][tmp] === 1 || map[j][tmp] === 3)  && tmp < mapdimensions && map[j-1][tmp-1] !== 0 && map[j+1][tmp-1] !== 0){
                    if(map[j][tmp] === 3 && size !== roomsize){
                        map[j][tmp] = 6;
                    }else{
                        map[j][tmp] = 0;
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
    }
    rnd = Math.floor(Math.random()*(size-2));
    for(var i = 0; i <= mapheight; i++){
        for(var j = 0; j <= mapwidth; j++) {
            if(i === mapheight/2 - size/2 + rnd + 1 && j === mapwidth/2 - size/2){
                tmp = j;
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp > 0 && map[tmp+1][i-1] !== 0 && map[tmp+1][i+1] !== 0){
                    if(map[tmp][i] === 3 && size !== roomsize){
                        map[tmp][i] = 6;
                    }else{
                        map[tmp][i] = 0;
                    }
                    tmp--;
                }
                tmp = j+1;
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp < mapdimensions && map[tmp-1][i-1] !== 0 && map[tmp-1][i+1] !== 0){
                    map[tmp][i] = 0;
                    tmp++;
                }
            }
        }
    }
    rnd = Math.floor(Math.random()*(size-2));
    for(var i = 0; i <= mapheight; i++){
        for(var j = 0; j <= mapwidth; j++) {
            if(i === mapheight/2 - size/2 + rnd + 1 && j === mapwidth/2 + size/2){
                tmp = j;
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp < mapdimensions && map[tmp-1][i-1] !== 0 && map[tmp-1][i+1] !== 0){
                    if(map[tmp][i] === 3 && size !== roomsize){
                        map[tmp][i] = 6;
                    }else{
                        map[tmp][i] = 0;
                    }
                    tmp++;
                }
                tmp = j-1;
                while((map[tmp][i] === 1 || map[tmp][i] === 3) && tmp > 0 && map[tmp+1][i-1] !== 0 && map[tmp+1][i+1] !== 0){
                    map[tmp][i] = 0;
                    tmp--;
                }
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
        fillRooms();
        generateDoors();
        genExitsFromMain(roomsize);
        if(room2 === true){
            genExitsFromMain(room2size);
        }
        generateLoot();
        doorsGenerated = true;
    }
}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[0].length; j++){
            if(map[j][i] === 0){
                ctx.fillStyle = 'black';
            }else if(map[j][i] === 1){
                ctx.fillStyle = 'white';
            }else if(map[j][i] === 2){
                ctx.fillStyle = 'red';
            }else if(map[j][i] === 3){
                ctx.fillStyle = 'green'; //INDESTRUCTABLE WALL
            }else if(map[j][i] === 4){
                ctx.fillStyle = 'yellow';
            }else if(map[j][i] === 5){
                ctx.fillStyle = 'gray';
            }else if(map[j][i] === 6){
                ctx.fillStyle = 'brown';
            }
            ctx.fillRect(i*tileSize + offset - cameraX, j*tileSize + offset - cameraY, tileSize, tileSize);
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

        player.update();
        player.draw();

        if(creators.length === 0 && doorsGenerated === false) {
            generate();
        }

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