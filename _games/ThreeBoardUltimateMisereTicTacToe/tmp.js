var versionCode = "Alpha 0.9";
var WIDTH = 900 + 90;
var HEIGHT = 300 + 50;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;

var NOUGHTS = true;

// EXAMPLE ARRAY coins = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var mousePosX = 0;
var mousePosY = 0;

var boards = [];

var board1Arrangement = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var board2Arrangement = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

var board3Arrangement = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Board(id){

    this.id = id;

    this.x = 330*this.id + 15;
    this.y = 0;

    if(this.id === 0){
        this.boardArrangement = board1Arrangement;
    }else if(this.id === 1){
        this.boardArrangement = board2Arrangement;
    }else{
        this.boardArrangement = board3Arrangement;
    }

    this.draw = function(){
        for(var col = 0; col < 2; col++){
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(this.x + 100*(col+1), 0);
            ctx.lineTo(this.x + 100*(col+1), 300);
            ctx.stroke();
        }
        for(var row = 0; row < 2; row++){
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + 100*(row+1));
            ctx.lineTo(this.x+ 300, this.y + 100*(row+1));
            ctx.stroke();
        }

        for(var o = 0; o < this.boardArrangement.length; o++){
            for(var p = 0; p < this.boardArrangement[0].length; p++){
                if(this.boardArrangement[p][o] === 1){
                    ctx.lineWidth = 3;
                    if(NOUGHTS === true){
                        ctx.beginPath();
                        ctx.moveTo(this.x + o*100 + 10, this.y + p*100 + 10);
                        ctx.lineTo(this.x + o*100 + 90, this.y + p*100 + 90);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(this.x + o*100 + 90, this.y + p*100 + 10);
                        ctx.lineTo(this.x + o*100 + 10, this.y + p*100 + 90);
                        ctx.stroke();
                    }else{

                    }
                    ctx.lineWidth = 1;
                }
            }
        }


    };
    this.update = function(){

    };

    this.click = function(){
        if(mousePosX > this.x && mousePosX < this.x + 300 && mousePosY > this.y && mousePosY < this.y + 300){
            for(var o = 0; o < this.boardArrangement.length; o++){
                if(mousePosY > this.y + 100*o && mousePosY < this.y + 100*(o+1)){
                    for(var p = 0; p < this.boardArrangement[0].length; p++){
                        if(mousePosX > this.x + 100*p && mousePosX < this.x + 100*(p+1)){
                            this.boardArrangement[o][p] = 1;
                        }
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

boards.push(new Board(0));
boards.push(new Board(1));
boards.push(new Board(2));

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //



// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    window.onmousemove = logMouseMove;
    //SKY FILL
    ctx.fillStyle = "rgb(240, 240, 240)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);


    for(var i = 0; i < boards.length; i++){
        boards[i].update();
        boards[i].draw();
    }

    if(gameRunning === true) {

        frameCount++;

    }
}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function Start(){
    if(gameRunning === false){
        SCORE = 0;
        frameCount = 0;
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
window.addEventListener("mouseup", clickedNow);

function clickedNow(){
    for(var bleh = 0; bleh < boards.length; bleh++){
        boards[bleh].click();
    }
}

function logMouseMove(e) {
    e = event || window.event;

    var rect = canvas.getBoundingClientRect();

    mousePosX = e.clientX - rect.left;
    mousePosY = e.clientY - rect.top;

    if(mousePosX < 0){
        mousePosX = 0;
    }

}

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);