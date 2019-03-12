var versionCode = "Alpha 0.9";
var WIDTH = 500;
var HEIGHT = 500;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;

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
        //DRAW EXAMPLE
        //ctx.fillStyle = "rgb(30, 20, 40)";
        //ctx.fillRect(x - width/2, y - height/2, width, height);

        /* IMAGE EXAMPLE
        ctx.drawImage(playerOneG, 0, 0, 16, 32, x - width/2, y - height/2, width, height);
        */

    };
    this.update = function(){

    }
    this.setVelX = function(i){
        velocityX = i;
    }
    this.setX = function(i){
        x = i;
    }
    this.setVelY = function(i){
        velocityY = i;
    }

    this.getVelY = function(){
        return velocityY;
    }

    this.getheight = function(){
        return height;
    }

    this.getwidth = function(){
        return width;
    }

    this.getY = function(){
        return y;
    }

    this.getX = function () {
        return x;
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

player = new Player(WIDTH/2, HEIGHT - HEIGHT/8 - 16, 16, 32, 0); //Add the Player

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //



// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    //SKY FILL
    ctx.fillStyle = "rgb(164, 197, 249)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    /* EXAMPLE FOR LOOP
    for(var i = 0; i < coins.length; i++){
        coins[i].update();
        coins[i].draw();
    }
    */

    /* IMAGE DRAW EXAMPLE
    ctx.drawImage(groundG, 0, 0, 1000, 100, 0, HEIGHT - floorHeight, 1000, 100);
    */

    if(gameRunning === true) {

        frameCount++;

        /* HIDE ALL DIVS
        document.getElementById("startMenu").setAttribute("hidden", "hidden");
        document.getElementById("resetMenu").setAttribute("hidden", "hidden");
        document.getElementById("instructionsMenu").setAttribute("hidden", "hidden");
        */

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