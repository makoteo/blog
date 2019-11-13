var versionCode = "Alpha 0.9";
var WIDTH = 800;
var HEIGHT = 450;
var gameRunning = true;
var TIME = 0;

var frameCount = 0;

var map = [];
/*

111 101 111 111 111 111 111 111 111 111 111 111 111 111
111 101
111 111

 */

var mapwidth = 70;
var mapheight = 70; //THESE NUMBERS MUST BE DIVISIBLE BY TEN

var roomsize = 8;

var doorsGenerated = false;

generateMap();
var creators = [];
creators.push(new Creator(1, 1, false));
creators.push(new Creator(mapwidth-1, mapheight-1, false));

// EXAMPLE ARRAY coins = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Player(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function(){

    };

}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

player = new Player(WIDTH/2, HEIGHT - HEIGHT/8 - 16, 16, 32, 0); //Add the Player

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function Creator(x, y, killable){
    this.x = x;
    this.y = y;
    this.dir = 1;
    this.previousdir = 0;
    this.dead = false;
    this.killable = killable;
    this.update = function() {
        //CHECK DIRECTIONS
        this.possibleDirections = [];
        this.spawnNew = Math.random();
        this.die = Math.random();

        if(this.spawnNew < 0.23){
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

            if(this.possibleDirections.length === 0) {
                this.dead = true;
                //BACKTRACKER 2
                /*if (this.y > 2) {
                    if (map[this.y - 1][this.x] === 0) {
                        this.possibleDirections.push(0);
                    }
                }
                if (this.x < map.length - 1) {
                    if (map[this.y][this.x + 1] === 0) {
                        this.possibleDirections.push(1);
                    }
                }
                if (this.y < map[0].length - 1) {
                    if (map[this.y + 1][this.x] === 0) {
                        this.possibleDirections.push(2);
                    }
                }
                if (this.x > 2) {
                    if (map[this.y][this.x - 1] === 0) {
                        this.possibleDirections.push(3);
                    }
                }*/
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
        ctx.fillRect(this.x*2+5, this.y*2+5, 2, 2);
    }
}

function generateMap(){
    //EDGES AND CENTER ROOM
    for(var i = 0; i <= mapheight; i++){
        var temparray = [];
        for(var j = 0; j <= mapwidth; j++){
            if(i === 0 || j === 0 || i === (mapheight) || j === (mapheight) || ((i === mapheight/2-roomsize/2 || i === mapheight/2+roomsize/2) && (j >= mapwidth/2-roomsize/2 && j <= mapwidth/2+roomsize/2))
                || ((j === mapwidth/2-roomsize/2 || j === mapwidth/2+roomsize/2) && (i >= mapheight/2-roomsize/2 && i <= mapheight/2+roomsize/2))){
                temparray.push(3);
            }else{
                temparray.push(1);
            }
        }
        map.push(temparray);
    }
}

function generateDoors(){
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
    while(map[mapwidth-1][1] === 1){
        doorrnd1 = Math.floor(Math.random()*mapheight);
    }
    map[mapwidth][doorrnd1] = 2;
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
            }
            ctx.fillRect(i*2 + 5, j*2 + 5, 2, 2);
        }
    }

    if(gameRunning === true) {

        frameCount++;

        for(var i = 0; i < creators.length; i++){
            if(creators[i].dead === false){
                creators[i].update();
                creators[i].draw();
            }else{
                creators.splice(i, 1);
            }
        }

        if(creators.length === 0 && doorsGenerated === false){
            generateDoors();
            doorsGenerated = true;
        }

        /* (KEY INPUT)
        if (keys && keys[40] || keys && keys[83]) {player.setVelY(player.getVelY() + 0.2)}
        */

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