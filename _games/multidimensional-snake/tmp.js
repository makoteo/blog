var versionCode = "Alpha 0.9";
var WIDTH = 750;
var HEIGHT = 750;
var gameRunning = true;
var SCORE = 0;
var frameCount = 0;

var cellDivision = 25;

// EXAMPLE ARRAY coins = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var gridU = [];
var gridD = [];

var sX = Math.floor(cellDivision/2);
var sY = Math.floor(cellDivision/2);

var speed = 10;
var decay = 50;

var dir = 0;
var savedDir = 0;

var currentDimension = 1;

var spaceReleased = true;
var flashDimTim = 0;

for(var i = 0; i < cellDivision; i++){
    var tmpZero = [];
    for(var j = 0; j < cellDivision; j++){
        tmpZero.push(0);
    }
    gridU.push(tmpZero);
}

for(var i = 0; i < cellDivision; i++){
    var tmpZero1 = [];
    for(var j = 0; j < cellDivision; j++){
        tmpZero1.push(0);
    }
    gridD.push(tmpZero1);
}

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function drawBg(dimension){
    if(dimension === 1){
        ctx.fillStyle = "rgb(24, 2, 6)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }else{
        ctx.fillStyle = "rgb(2, 6, 24)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
}

function drawBoard(dimension){
    if(dimension === 1){
        ctx.strokeStyle = "rgb(220, 25, 48)";
    }else{
        ctx.strokeStyle = "rgb(25, 48, 220)";
    }
    for(var i = 0; i < cellDivision; i++){
        ctx.beginPath();
        ctx.moveTo(i*(WIDTH/cellDivision), 0);
        ctx.lineTo(i*(WIDTH/cellDivision), HEIGHT);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i*(HEIGHT/cellDivision));
        ctx.lineTo(HEIGHT, i*(HEIGHT/cellDivision));
        ctx.stroke();
    }
}

function drawGrid(dimension){
    if(dimension === 1){
        for(var i = 0; i < cellDivision; i++){
            for(var j = 0; j < cellDivision; j++){
                if(gridU[i][j] <= 1){
                    gridU[i][j] = Math.max(0, gridU[i][j] - 1/decay);
                    if(gridU[i][j] > 0){
                        ctx.fillStyle = 'white';
                        ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                    }
                }else if(gridU[i][j] === 2){
                    ctx.fillStyle = 'red';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }
                else if(gridU[i][j] === 3){
                    ctx.fillStyle = 'rgba(70, 50, 50)';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }else if(gridU[i][j] === 4){
                    ctx.fillStyle = 'rgba(20, 170, 200)';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }else if(gridU[i][j] === 5){
                    ctx.fillStyle = 'rgba(220, 220, 20)';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }
                if(gridD[i][j] <= 1){gridD[i][j] = Math.max(0, gridD[i][j] - 1/decay);}
            }
        }
    }else{
        for(var i = 0; i < cellDivision; i++){
            for(var j = 0; j < cellDivision; j++){
                if(gridD[i][j] <= 1){
                    gridD[i][j] = Math.max(0, gridD[i][j] - 1/decay);
                    if(gridD[i][j] > 0){
                        ctx.fillStyle = 'white';
                        ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                    }
                }else if(gridD[i][j] === 2){
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }
                else if(gridD[i][j] === 3){
                    ctx.fillStyle = 'rgba(50, 50, 70)';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }else if(gridD[i][j] === 4){
                    ctx.fillStyle = 'rgba(20, 170, 200)';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }else if(gridD[i][j] === 5){
                    ctx.fillStyle = 'rgba(220, 220, 20)';
                    ctx.fillRect(j*(WIDTH/cellDivision), i*(HEIGHT/cellDivision), WIDTH/cellDivision, HEIGHT/cellDivision);
                }
                if(gridU[i][j] <= 1){gridU[i][j] = Math.max(0, gridU[i][j] - 1/decay);}
            }
        }
    }
}

function spawnFood(){
    var tmpX = Math.floor(Math.random()*cellDivision);
    var tmpY = Math.floor(Math.random()*cellDivision);
    var board = Math.round(Math.random());
    while((gridU[tmpY][tmpX] !== 0 || gridD[tmpY][tmpX] !== 0) || ((dir === 0 || dir === 2) && tmpX === sX) || ((dir === 1 || dir === 3) && tmpY === sY)){
        tmpX = Math.floor(Math.random()*cellDivision);
        tmpY = Math.floor(Math.random()*cellDivision);
    }
    if(board === 0){
        gridU[tmpY][tmpX] = 2;
        gridD[tmpY][tmpX] = 3;
    }else{
        gridD[tmpY][tmpX] = 2;
        gridU[tmpY][tmpX] = 3;
    }
}

function spawnItem(){
    //if(Math.random() > 0.1){return 0;}
    var tmpX = Math.floor(Math.random()*cellDivision);
    var tmpY = Math.floor(Math.random()*cellDivision);
    var board = Math.round(Math.random());
    while((gridU[tmpY][tmpX] !== 0 || gridD[tmpY][tmpX] !== 0) || ((dir === 0 || dir === 2) && tmpX === sX) || ((dir === 1 || dir === 3) && tmpY === sY)){
        tmpX = Math.floor(Math.random()*cellDivision);
        tmpY = Math.floor(Math.random()*cellDivision);
    }
    var itemType = Math.random();
    if(board === 0){
        if(itemType < 0.1){
            gridU[tmpY][tmpX] = 4;
        }else{
            if(board === 0) {
                gridU[tmpY][tmpX] = 5;
            }else{
                gridD[tmpY][tmpX] = 5;
            }
        }
    }else{
        if(itemType < 0.1){
            gridD[tmpY][tmpX] = 4;
        }else{
            if(board === 0) {
                gridU[tmpY][tmpX] = 5;
            }else{
                gridD[tmpY][tmpX] = 5;
            }
        }
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //



// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //



// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){

    drawBg(currentDimension);
    drawGrid(currentDimension);
    drawBoard(currentDimension);

    if(flashDimTim > 0){
        ctx.globalAlpha = 0.3;
        drawGrid(-currentDimension);
    }
    ctx.globalAlpha = 1;

    if(gameRunning === true) {

        flashDimTim = Math.max(flashDimTim-1, 0);

        frameCount++;

        if(frameCount % speed === 0){
            if(dir === 0) sX++;
            else if(dir === 1) sY++;
            else if(dir === 2) sX--;
            else if(dir === 3) sY--;

            if(sX >= cellDivision) sX = 0;
            if(sX < 0) sX = cellDivision-1;
            if(sY >= cellDivision) sY = 0;
            if(sY < 0) sY = cellDivision-1;

            if(currentDimension === 1){
                if(gridU[sY][sX] === 2){
                    decay += 20;
                    spawnFood();
                    spawnItem();
                }else if(gridU[sY][sX] === 5){
                    decay += 20;
                    flashDimTim = 100;
                }
                else if(gridU[sY][sX] > 0 || gridU[sY][sX] === 3 || gridU[sY][sX] === 4){
                    gameRunning = false;
                    decay = Infinity;
                    console.log("GAME OVER");
                }
            }else{
                if(gridD[sY][sX] === 2){
                    decay += 20;
                    spawnFood();
                    spawnItem();
                }else if(gridD[sY][sX] === 5){
                    decay += 20;
                    flashDimTim = 100;
                }
                else if(gridD[sY][sX] > 0 || gridD[sY][sX] === 3 || gridU[sY][sX] === 4){
                    gameRunning = false;
                    decay = Infinity;
                    console.log("GAME OVER");
                }
            }

            if(currentDimension === 1){
                gridU[sY][sX] = 1;
            }else{
                gridD[sY][sX] = 1;
            }

            savedDir = dir;
        }

        /* HIDE ALL DIVS
        document.getElementById("startMenu").setAttribute("hidden", "hidden");
        document.getElementById("resetMenu").setAttribute("hidden", "hidden");
        document.getElementById("instructionsMenu").setAttribute("hidden", "hidden");
        */

        if (keys && keys[68] || keys && keys[39]) {if(savedDir !== 2){dir = 0;}}
        else if (keys && keys[40] || keys && keys[83]) {if(savedDir !== 3){dir = 1;}}
        else if (keys && keys[65] || keys && keys[37]) {if(savedDir !== 0){dir = 2;}}
        else if (keys && keys[87] || keys && keys[38]) {if(savedDir !== 1){dir = 3;}}

        if (keys && keys[32] && spaceReleased) {currentDimension = -currentDimension; spaceReleased = false;}else if(keys && !keys[32]){spaceReleased = true;}

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

spawnFood();

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