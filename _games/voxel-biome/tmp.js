var versionCode = "Alpha 0.9";
var WIDTH = 720;
var HEIGHT = 720;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;

var voxels = [];

var grid = [
      [0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0]
];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var voxelsG = new Image();
voxelsG.src = "BiomeGame.png";

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Voxel(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function(){
        //DRAW EXAMPLE
        //ctx.fillStyle = "rgb(30, 20, 40)";
        //ctx.fillRect(x - width/2, y - height/2, width, height);
        ctx.drawImage(voxelsG, 0, 0, 300, 300, x - width/2, y - height/2, width, height);

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

/*var width = 5;

for(var i = 0; i < 10; i++) {
    var offset = 0;
    if(i % 2 === 0){
        offset = 1;
        width = 6;
    }else{
        width = 7;
    }
    for(var j = 0; j < width; j++) {
        voxels.push(new Voxel((WIDTH / 10 * (j + 2)) + (offset * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 20) - (HEIGHT / 30 * (i + 1))), 75, 75));
        //voxels.push(new Voxel((WIDTH / 10 * (j + 3)) + (i * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 9) - (HEIGHT / 30 * (i + 1))), 75, 75));
    }
    //width--;
}*/

var width = 5;

for(var i = 0; i < grid.length; i++) {
    var offset = 0;
    if(i % 2 === 0){
        offset = 1;
        width = 6;
    }else{
        width = 7;
    }
    for(var j = 0; j < grid[0].length; j++) {
        if(grid[i][j] === 0){

        }else{
            voxels.push(new Voxel((WIDTH / 10 * (j + 2)) + (offset * WIDTH / 20), HEIGHT - ((HEIGHT / 30 * (5 + grid.length)) - (HEIGHT / 30 * (i + 1))), 75, 75));
        }
        //voxels.push(new Voxel((WIDTH / 10 * (j + 3)) + (i * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 9) - (HEIGHT / 30 * (i + 1))), 75, 75));
    }
    //width--;
}

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //



// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    //SKY FILL
    ctx.fillStyle = "rgb(5, 8, 15)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.moveTo(WIDTH - WIDTH/8, HEIGHT/8 * 5);
    ctx.lineTo(WIDTH/8 * 4, HEIGHT - HEIGHT/8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(WIDTH/8, HEIGHT/8 * 5);
    ctx.lineTo(WIDTH/8 * 4, HEIGHT - HEIGHT/8);
    ctx.stroke();

    for(var i = 0; i < voxels.length; i++){
        voxels[i].update();
        voxels[i].draw();
    }

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
    if(gameRunning == false){
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