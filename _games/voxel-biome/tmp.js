var versionCode = "Alpha 0.9";
var WIDTH = 1200;
var HEIGHT = 675;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;

var htmlWidth = window.innerWidth;
var htmlHeight = window.innerHeight;

var offsetWidth = (WIDTH - htmlWidth) / 2 + 30;
var offsetHeight = (HEIGHT - htmlHeight) / 2 + 10;

var voxels = [];

var thisFrameClicked = false;

var grid = [
      [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 1, 1, 2, 0, 0],
    [0, 0, 0, 2, 1, 1, 1, 2, 2, 0, 0],
      [0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
      [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0]
];

var selected = [];
var clickSelected = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var voxelsG = new Image();
voxelsG.src = "BiomeGame.png";

var currentID = 0;

var mousePos;
var mousePosX;
var mousePosY;

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Voxel(x, y, width, height, type){
    this.x = x;
    this.startY = y;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    this.id = currentID;

    currentID++;

    this.movingUp = false;

    this.draw = function(){
        //DRAW EXAMPLE
        //ctx.fillStyle = "rgb(30, 20, 40)";
        //ctx.fillRect(x - width/2, y - height/2, width, height);
        if(this.type === 1) {
            ctx.drawImage(voxelsG, 0, 0, 300, 300, this.x - width / 2, this.y - height / 2, width, height);
        }else if(this.type === 2) {
            ctx.drawImage(voxelsG, 300, 0, 300, 300, this.x - width / 2, this.y - height / 2, width, height);
        }

    };
    this.update = function(){
        if(this.movingUp === false) {
            if(this.y < this.startY){
                this.y++;
            }
        }else{
            if(this.y > this.startY - 20){
                this.y--;
            }
        }
    }
    this.animateUp = function(up){
        if(up === 0) {
            this.movingUp = true;
        }else{
            this.movingUp = false;
        }
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
    for(var j = 0; j < grid[i].length; j++) {
        if(grid[i][j] === 0){

        }else if(grid[i][j] === 1){
            voxels.push(new Voxel((WIDTH / 16.5 * (j + 2.75)) + (offset * WIDTH / 33), HEIGHT - ((HEIGHT / 31 * (5 + grid.length)) - (HEIGHT / 28 * (i + 1))), WIDTH/16, WIDTH/16, 1));
        }else if(grid[i][j] === 2){
            voxels.push(new Voxel((WIDTH / 16.5 * (j + 2.75)) + (offset * WIDTH / 33), HEIGHT - ((HEIGHT / 31 * (5 + grid.length)) - (HEIGHT / 28 * (i + 1))), WIDTH/16, WIDTH/16, 2));
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

    for(var i = 0; i < voxels.length; i++){
        voxels[i].update();
        voxels[i].draw();

        if(selected.length > 0) {
            if (voxels[i].id === selected[0] || voxels[i].id === clickSelected[0] ) {
                voxels[i].animateUp(0);
            } else {
                voxels[i].animateUp(1);
            }
        }

        if(voxels[i].id !== selected[0]) {
            if (((mousePosX > voxels[i].x + voxels[i].width / 3)) &&
                ((mousePosX < voxels[i].x + voxels[i].width - voxels[i].width / 3)) &&
                ((mousePosY > voxels[i].y + voxels[i].height / 8)) &&
                ((mousePosY < voxels[i].y + voxels[i].height - voxels[i].height / 3))) {

                //voxels[i].animateUp(0);

                selected.unshift(voxels[i].id);

                if(thisFrameClicked === true){
                    if(voxels[i].id === clickSelected[0]) {
                        clickSelected = [];
                    }else{
                        clickSelected.unshift(voxels[i].id);
                    }
                }

            } else {
                //selected.splice(0, 1);
            }
        }else{
            if (((mousePosX > voxels[i].x + voxels[i].width / 3)) &&
                ((mousePosX < voxels[i].x + voxels[i].width - voxels[i].width / 3)) &&
                ((mousePosY > voxels[i].y + voxels[i].height / 8)) &&
                ((mousePosY < voxels[i].y + voxels[i].height - voxels[i].height / 8))) {

                if(thisFrameClicked === true){
                    if(voxels[i].id === clickSelected[0]) {
                        clickSelected = [];
                    }else{
                        clickSelected.unshift(voxels[i].id);
                    }
                }

            } else {
                selected.unshift(999);
            }
        }

    }

    if(selected.length > 1){
        selected.splice(1, 1);
    }

    if(clickSelected.length > 1){
        clickSelected.splice(1, 1);
    }

    window.onmousemove = logMouseMove;

    /* IMAGE DRAW EXAMPLE
    ctx.drawImage(groundG, 0, 0, 1000, 100, 0, HEIGHT - floorHeight, 1000, 100);
    */

    thisFrameClicked = false;

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

function logMouseMove(e) {

    e = event || window.event;
    mousePos = { x: e.clientX, y: e.clientY };
    mousePosX = e.clientX + offsetWidth;
    mousePosY = e.clientY - offsetHeight;
    //console.log(mousePosX + ", " + mousePosY);
}

document.addEventListener("click", clickedTrue);

function clickedTrue(){
    thisFrameClicked = true;
}

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