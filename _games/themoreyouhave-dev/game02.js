var versionCode = "Alpha0.1";
var WIDTH = 500;
var HEIGHT = 500;
var gameRunning = false;
var SCORE = 0;
var HIGHSCORE = 0;
var pipes = [];
var clouds = [];
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var frameCount = 0;
var gameSpeed = 3;
var spawnRate = 150;
var waiting = false;
var pause = false;
var pipesX = [];
var speedUpTextTimer = 0;
var speedUpTextVisible = false;
var gameMode = "Infinite";
function Player(x, y, width, height, velY){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velY = velY;
    this.draw = function(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, width, height);
    };
    this.update = function(){

    }
}

player = new Player(50, HEIGHT/2 - 10, 20, 20, 0); //Add the Player

function game(){
    player.draw();
    player.update();
}
function Jump(){
    player.setVelY(-4);
}

function Start(){
    if(gameRunning == false){
        gameRunning = true;
        document.getElementById("score").innerHTML = "Score: " + SCORE;
        player.setY(240);
        HIGHSCORE = localStorage.getItem("HighScore");
    }
    player.setVelY(-3);
}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 32) {
        Jump();
    }
};

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 32) {
        Jump();
    }
};

function Reload() {
    localStorage.setItem("HighScore", 0);
    //localStorage.clear();
}

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);