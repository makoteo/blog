var versionCode = "Alpha 0.9";
var WIDTH = 900 + 90;
var HEIGHT = 300 + 100;
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

var boardToPlayIn = 3; //ANY BOARD
var turn = 1; //Alternates between 1 and 2

var noWin = true;

//AI STUFF
var AI = true;
var AItimer = 0;
var playCS = false;
var boardToPushTo = 4;

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

    //0 = nothing, 1 = cross, 2 = unavailable

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
                }else if(this.boardArrangement[p][o] === 2){
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = 'red';
                    ctx.fillRect(this.x + o*100, this.y + p*100, 100, 100);
                    ctx.globalAlpha = 1;
                }
            }
        }
    };
    this.update = function(){
        if(this.boardArrangement[0][0] === 1){
            if(this.boardArrangement[0][1] === 1){
                this.boardArrangement[0][2] = 2;
            }
            if(this.boardArrangement[1][0] === 1){
                this.boardArrangement[2][0] = 2;
            }
            if(this.boardArrangement[1][1] === 1){
                this.boardArrangement[2][2] = 2;
            }
            if(this.boardArrangement[2][0] === 1){
                this.boardArrangement[1][0] = 2;
            }
            if(this.boardArrangement[2][2] === 1){
                this.boardArrangement[1][1] = 2;
            }
        }
        if(this.boardArrangement[0][1] === 1){
            if(this.boardArrangement[0][2] === 1){
                this.boardArrangement[0][0] = 2;
            }
            if(this.boardArrangement[1][1] === 1){
                this.boardArrangement[2][1] = 2;
            }
            if(this.boardArrangement[2][1] === 1){
                this.boardArrangement[1][1] = 2;
            }
        }
        if(this.boardArrangement[0][2] === 1){
            if(this.boardArrangement[0][0] === 1){
                this.boardArrangement[0][1] = 2;
            }
            if(this.boardArrangement[1][1] === 1){
                this.boardArrangement[2][0] = 2;
            }
            if(this.boardArrangement[1][2] === 1){
                this.boardArrangement[2][2] = 2;
            }
            if(this.boardArrangement[2][2] === 1){
                this.boardArrangement[1][2] = 2;
            }
            if(this.boardArrangement[2][0] === 1){
                this.boardArrangement[1][1] = 2;
            }
        }

        if(this.boardArrangement[1][0] === 1){
            if(this.boardArrangement[1][1] === 1){
                this.boardArrangement[1][2] = 2;
            }
            if(this.boardArrangement[2][0] === 1){
                this.boardArrangement[0][0] = 2;
            }
            if(this.boardArrangement[1][2] === 1){
                this.boardArrangement[1][1] = 2;
            }
        }
        if(this.boardArrangement[1][1] === 1){
            if(this.boardArrangement[2][1] === 1){
                this.boardArrangement[0][1] = 2;
            }
            if(this.boardArrangement[1][2] === 1){
                this.boardArrangement[1][0] = 2;
            }
        }
        if(this.boardArrangement[1][2] === 1){
            if(this.boardArrangement[2][2] === 1){
                this.boardArrangement[0][2] = 2;
            }
        }

        if(this.boardArrangement[2][0] === 1){
            if(this.boardArrangement[1][1] === 1){
                this.boardArrangement[0][2] = 2;
            }
            if(this.boardArrangement[2][1] === 1){
                this.boardArrangement[2][2] = 2;
            }
            if(this.boardArrangement[2][2] === 1){
                this.boardArrangement[2][1] = 2;
            }
        }
        if(this.boardArrangement[2][1] === 1){
            if(this.boardArrangement[2][2] === 1){
                this.boardArrangement[2][0] = 2;
            }
        }
        if(this.boardArrangement[2][2] === 1){
            if(this.boardArrangement[1][1] === 1){
                this.boardArrangement[0][0] = 2;
            }
        }
    };

    this.click = function(){
        if(mousePosX > this.x && mousePosX < this.x + 300 && mousePosY > this.y && mousePosY < this.y + 300){
            for(var o = 0; o < this.boardArrangement.length; o++){
                if(mousePosY > this.y + 100*o && mousePosY < this.y + 100*(o+1)){
                    for(var p = 0; p < this.boardArrangement[0].length; p++){
                        if(mousePosX > this.x + 100*p && mousePosX < this.x + 100*(p+1)){
                            if(this.boardArrangement[o][p] !== 2 && this.boardArrangement[o][p] !== 1){
                                this.boardArrangement[o][p] = 1;
                                boardToPlayIn = p;
                                if(turn === 1){
                                    turn = 2;
                                }else{
                                    turn = 1;
                                }
                                noWin = false;
                                for(var p1 = 0; p1 < boards[boardToPlayIn].boardArrangement.length; p1++){
                                    for(var p2 = 0; p2 < boards[boardToPlayIn].boardArrangement[0].length; p2++){
                                        if(boards[boardToPlayIn].boardArrangement[p1][p2] === 0){
                                            noWin = true;
                                        }
                                    }
                                }
                                if(noWin === false){
                                    console.log("Game Over!!");
                                }
                                AItimer = 30;
                            }
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

    if(AItimer > 0){
        AItimer--;
    }

    window.onmousemove = logMouseMove;
    //SKY FILL
    ctx.fillStyle = "rgb(240, 240, 240)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if(boardToPlayIn !== 3){
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(boardToPlayIn*330 + 15, 310, 300, 10);
        ctx.globalAlpha = 1;
    }

    for(var i = 0; i < boards.length; i++){
        boards[i].update();
        boards[i].draw();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    if(noWin === true){
        ctx.fillText("Player " + turn + "'s turn.", WIDTH/2, 350);
    }else{
        if(turn === 1){
            ctx.fillText("Player 2 Wins!!", WIDTH/2, 350);
        }else{
            ctx.fillText("Player 1 Wins!!", WIDTH/2, 350);
        }
    }

    if(gameRunning === true) {

        frameCount++;

    }

    if(turn === 2 && AI === true && AItimer === 0){
        var availableSpotsX = [];
        var availableSpotsY = [];
        for(var a1 = 0; a1 < boards[boardToPlayIn].boardArrangement.length; a1++){
            for(var a2 = 0; a2 < boards[boardToPlayIn].boardArrangement.length; a2++){
                if(boards[boardToPlayIn].boardArrangement[a1][a2] === 1){
                    if(a2 === boardToPlayIn) {
                        playCS = true;
                    }
                }
            }
        }
        for(var a1 = 0; a1 < boards[boardToPlayIn].boardArrangement.length; a1++) {
            for (var a2 = 0; a2 < boards[boardToPlayIn].boardArrangement.length; a2++) {
                if(boards[boardToPlayIn].boardArrangement[a1][a2] === 0){
                    if(boardToPushTo === 4){
                        if(playCS === false){
                            if(a2 !== boardToPlayIn) {
                                availableSpotsX.push(a2);
                                availableSpotsY.push(a1);
                            }
                        }else{
                            if(a2 === boardToPlayIn) {
                                availableSpotsX.push(a2);
                                availableSpotsY.push(a1);
                            }
                            boardToPushTo = boardToPlayIn;
                        }
                    }else{
                        if(a2 === boardToPushTo) {
                            availableSpotsX.push(a2);
                            availableSpotsY.push(a1);
                        }
                    }
                }
            }
        }
        var random = Math.floor(Math.random()*availableSpotsX.length);
        boards[boardToPlayIn].boardArrangement[availableSpotsY[random]][availableSpotsX[random]] = 1;
        boardToPlayIn = availableSpotsX[random];
        turn = 1;

        noWin = false;
        console.log(boards[boardToPlayIn].boardArrangement);
        for(var p1 = 0; p1 < boards[boardToPlayIn].boardArrangement.length; p1++){
            for(var p2 = 0; p2 < boards[boardToPlayIn].boardArrangement[0].length; p2++){
                if(boards[boardToPlayIn].boardArrangement[p1][p2] === 0){
                    noWin = true;
                }
            }
        }
        if(noWin === false){
            console.log("Game Over!!");
        }

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
    if((AI === false) || (AI === true && turn === 1)){
        if(boardToPlayIn === 3){
            for(var bleh = 0; bleh < boards.length; bleh++){
                boards[bleh].click();
            }
        }else{
            boards[boardToPlayIn].click();
        }
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