var versionCode = "Alpha 0.9";
var WIDTH = 800;
var HEIGHT = 850;

var COLORS = {white: "rgb(254, 250, 236)", black: "rgb(7, 5, 14)", blue: "rgb(36, 32, 95)", red: "rgb(129, 43, 56)"};

var boards = [

    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]

];

var mainBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var mousePosX = 0;
var mousePosY = 0;
var clicked = false;

// EXAMPLE ARRAY coins = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var currentTurn = 1;
var player = 1;
var ai = -1;
var currentBoard = 4;

var gameRunning = true;

var RUNS = 0;

var estimatedInFiveTurns = 0;

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //



// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //



// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function checkWinCondition(map) {
    var a = 1;
    if (map[0] + map[1] + map[2] === a * 3 || map[3] + map[4] + map[5] === a * 3 || map[6] + map[7] + map[8] === a * 3 || map[0] + map[3] + map[6] === a * 3 || map[1] + map[4] + map[7] === a * 3 ||
        map[2] + map[5] + map[8] === a * 3 || map[0] + map[4] + map[8] === a * 3 || map[2] + map[4] + map[6] === a * 3) {
        return a;
    }
    a = -1;
    if (map[0] + map[1] + map[2] === a * 3 || map[3] + map[4] + map[5] === a * 3 || map[6] + map[7] + map[8] === a * 3 || map[0] + map[3] + map[6] === a * 3 || map[1] + map[4] + map[7] === a * 3 ||
        map[2] + map[5] + map[8] === a * 3 || map[0] + map[4] + map[8] === a * 3 || map[2] + map[4] + map[6] === a * 3) {
        return a;
    }
    return 0;
}

function checkSmartPosition(map) {
    var sum = 0;
    var a = -2/3;
    if (map[0] + map[1] + map[2] === a * 3 || map[3] + map[4] + map[5] === a * 3 || map[6] + map[7] + map[8] === a * 3 || map[0] + map[3] + map[6] === a * 3 || map[1] + map[4] + map[7] === a * 3 ||
        map[2] + map[5] + map[8] === a * 3 || map[0] + map[4] + map[8] === a * 3 || map[2] + map[4] + map[6] === a * 3) {
        sum+=a;
    }
    a = 2/3;
    if (map[0] + map[1] + map[2] === a * 3 || map[3] + map[4] + map[5] === a * 3 || map[6] + map[7] + map[8] === a * 3 || map[0] + map[3] + map[6] === a * 3 || map[1] + map[4] + map[7] === a * 3 ||
        map[2] + map[5] + map[8] === a * 3 || map[0] + map[4] + map[8] === a * 3 || map[2] + map[4] + map[6] === a * 3) {
        sum+=a;
    }
    return sum;
}


function miniMax(position, boardToPlayOn, depth, alpha, beta, maximizingPlayer) {
    RUNS++;

    if(depth === 0 || checkWinCondition(mainBoard) !== 0) {
        return -evaluatePosition(position, boardToPlayOn);
    }

    if(boardToPlayOn === -1){
        boardToPlayOn = 0;
    }

    if(maximizingPlayer){
        var maxEval = -Infinity;
        for(var mm = 0; mm < 9; mm++){
            if(position[boardToPlayOn][mm] === 0){
                position[boardToPlayOn][mm] = ai;
                var evalu = miniMax(position, mm, depth-1, alpha, beta, false);
                position[boardToPlayOn][mm] = 0;
                maxEval = Math.max(evalu, maxEval);
                alpha = Math.max(alpha, evalu);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return maxEval;
    }else{
        var minEval = Infinity;
        for(var mm = 0; mm < 9; mm++){
            if(position[boardToPlayOn][mm] === 0){
                position[boardToPlayOn][mm] = player;
                var evalu = miniMax(position, mm, depth-1, alpha, beta, true);
                position[boardToPlayOn][mm] = 0;
                minEval = Math.min(evalu, minEval);
                beta = Math.min(beta, evalu);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return minEval;
    }
}

function oneBoardMinMax(position, depth, alpha, beta, maximizingPlayer) {
    RUNS++;

    if(checkWinCondition(position) !== 0){
        if(depth > 0){
            return -checkWinCondition(position)*10-sign(-checkWinCondition(position))*depth*0.5;
        }else{
            return -checkWinCondition(position)*10-sign(-checkWinCondition(position))*depth*0.1;
        }
    }

    var count = 0;
    for(var i = 0; i < 9; i++){
        if(position[i] !== 0) count++;
    }
    if(count === 9 || depth === 1000){return 0;}

    if(maximizingPlayer){
        var maxEval = -Infinity;
        for(var t in position){
            if(position[t] === 0){
                position[t] = ai;
                var evalu = oneBoardMinMax(position, depth+1, alpha, beta, false);
                position[t] = 0;
                maxEval = Math.max(maxEval, evalu);
                alpha = Math.max(alpha, evalu);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return maxEval;
    }else{
        var minEval = Infinity;
        for(var t in position){
            if(position[t] === 0){
                position[t] = player;
                var evalu = oneBoardMinMax(position, depth+1, alpha, beta, true);
                position[t] = 0;
                minEval = Math.min(minEval, evalu);
                beta = Math.min(beta, evalu);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return minEval;
    }
}

//POSITIVE INTEGER IS WINNING FOR BLUE AND VICA VERSA
function evaluatePosition(pos, next){
    var evaluation = 0;

    //Simple Positional Analysis
    for(var idk in pos){
        evaluation -= (pos[idk][0]*0.2+pos[idk][1]*0.1+pos[idk][2]*0.2+pos[idk][3]*1+pos[idk][4]*0.25+pos[idk][5]*0.1+pos[idk][6]*0.2+pos[idk][7]*0.1+pos[idk][8]*0.2);
        evaluation -= checkWinCondition(pos[idk])*20;
        //evaluation += checkDumbPosition(pos[idk])*2;
        evaluation -= checkSmartPosition(pos[idk])*7;
    }

    return evaluation;
}

function sign(x){
    if(x > 0){
        return 1;
    }else if(x < 0){
        return -1;
    }else{
        return 0;
    }
}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    //SKY FILL
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    //DRAW BOARDS

    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(WIDTH/3, 0);
    ctx.lineTo(WIDTH/3, WIDTH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(WIDTH/3*2, 0);
    ctx.lineTo(WIDTH/3*2, WIDTH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, WIDTH/3);
    ctx.lineTo(WIDTH, WIDTH/3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, WIDTH/3*2);
    ctx.lineTo(WIDTH, WIDTH/3*2);
    ctx.stroke();

    ctx.lineWidth = 3;
    var squareSize = WIDTH/4;
    var shapeSize = WIDTH/36;

    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize/3, j*WIDTH/3 + (WIDTH/3 - squareSize)/2);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize/3, j*WIDTH/3 + (WIDTH/3 - squareSize)/2 + squareSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize*2/3, j*WIDTH/3 + (WIDTH/3 - squareSize)/2);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize*2/3, j*WIDTH/3 + (WIDTH/3 - squareSize)/2 + squareSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3 - squareSize)/2, j*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize/3);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3 - squareSize)/2 + squareSize, j*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize/3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3 - squareSize)/2, j*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize*2/3);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3 - squareSize)/2 + squareSize, j*WIDTH/3 + (WIDTH/3-squareSize)/2 + squareSize*2/3);
            ctx.stroke();
        }
    }

    //Shapes
    ctx.lineWidth = 5;

    for(var i in boards){
        if(mainBoard[i] === 0) {
            if (checkWinCondition(boards[i]) !== 0) {
                mainBoard[i] = checkWinCondition(boards[i]);
            }
        }
        for(var j in boards[i]){
            if(boards[i][j] === 1){
                ctx.strokeStyle = COLORS.red;
                ctx.beginPath();
                ctx.moveTo((WIDTH/3-squareSize)/2 + squareSize/6 - shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 - shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.lineTo((WIDTH/3-squareSize)/2 + squareSize/6 + shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 + shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo((WIDTH/3-squareSize)/2 + squareSize/6 - shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 + shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.lineTo((WIDTH/3-squareSize)/2 + squareSize/6 + shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 - shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.stroke();
            }else if(boards[i][j] === -1){
                ctx.strokeStyle = COLORS.blue;
                ctx.beginPath();
                ctx.ellipse((WIDTH/3-squareSize)/2 + squareSize/6 + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3, shapeSize*1.1, shapeSize*1.1, 0, 0, Math.PI*2);
                ctx.stroke();
            }
        }
    }

    if(gameRunning){
        if (checkWinCondition(mainBoard) !== 0) {
            alert("GAME OVER");
            gameRunning = false;
        }
    }

    shapeSize = squareSize/3;
    ctx.lineWidth = 20;

    for(var j in mainBoard){
        if(mainBoard[j] === 1){
            ctx.strokeStyle = COLORS.red;
            ctx.beginPath();
            ctx.moveTo(WIDTH/6 - shapeSize + (j%3)*WIDTH/3, WIDTH/6 - shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.lineTo(WIDTH/6 + shapeSize + (j%3)*WIDTH/3, WIDTH/6 + shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(WIDTH/6 - shapeSize + (j%3)*WIDTH/3, WIDTH/6 + shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.lineTo(WIDTH/6 + shapeSize + (j%3)*WIDTH/3, WIDTH/6 - shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.stroke();
        }else if(mainBoard[j] === -1){
            ctx.strokeStyle = COLORS.blue;
            ctx.beginPath();
            ctx.ellipse(WIDTH/6 + (j%3)*WIDTH/3, WIDTH/6 + Math.floor(j/3)*WIDTH/3, shapeSize*1.1, shapeSize*1.1, 0, 0, Math.PI*2);
            ctx.stroke();
        }
    }

    if(mainBoard[currentBoard] !== 0){currentBoard = -1;}

    //HIGHLIGHT BOARD TO PLAY ON

    ctx.fillStyle = COLORS.red;
    ctx.globalAlpha = 0.1;
    ctx.fillRect(WIDTH/3*(currentBoard%3), WIDTH/3*Math.floor(currentBoard/3), WIDTH/3, WIDTH/3);
    ctx.globalAlpha = 1;

    shapeSize = squareSize/6;

    //mouseClickHandler
    if(clicked === true) {
        for (var i in boards) {
            if(currentBoard !== -1){i = currentBoard;if(mainBoard[currentBoard] !== 0){continue;}}
            for (var j in boards[i]) {
                if(boards[i][j] === 0) {
                    if (mousePosX > (WIDTH / 3 - squareSize) / 2 + squareSize / 6 - shapeSize + (j % 3) * squareSize / 3 + (i % 3) * WIDTH / 3 && mousePosX < (WIDTH / 3 - squareSize) / 2 + squareSize / 6 + shapeSize + (j % 3) * squareSize / 3 + (i % 3) * WIDTH / 3) {
                        if (mousePosY > (WIDTH / 3 - squareSize) / 2 + squareSize / 6 - shapeSize + Math.floor(j / 3) * squareSize / 3 + Math.floor(i / 3) * WIDTH / 3 && mousePosY < (WIDTH / 3 - squareSize) / 2 + squareSize / 6 + shapeSize + Math.floor(j / 3) * squareSize / 3 + Math.floor(i / 3) * WIDTH / 3) {
                            boards[i][j] = currentTurn;
                            currentBoard = j;
                            currentTurn = -currentTurn;
                            break;
                        }
                    }
                }
            }
        }
    }

    //Draw EVAL BAR

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(WIDTH/2, WIDTH, estimatedInFiveTurns*4, HEIGHT/16);

    if(evaluatePosition(boards) > 0){
        ctx.fillStyle = COLORS.blue;
        ctx.fillRect(WIDTH/2, WIDTH + HEIGHT/200, evaluatePosition(boards)*4, HEIGHT/20);
    }else{
        ctx.fillStyle = COLORS.red;
        ctx.fillRect(WIDTH/2 + (evaluatePosition(boards))*4, WIDTH + HEIGHT/200, -evaluatePosition(boards)*4, HEIGHT/20);
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(WIDTH/2, WIDTH);
    ctx.lineTo(WIDTH/2, WIDTH+HEIGHT);
    ctx.stroke();

    //AI HANDLER

    if(currentTurn === -1){
        RUNS = 0;
        var moveScores = [null, null, null, null, null, null, null, null, null];
        if(currentBoard !== -1 && mainBoard[currentBoard] === 0){
            //Just like playing normal tic tac toe
            for(var a = 0; a < 9; a++){
                if(boards[currentBoard][a] === 0){
                    boards[currentBoard][a] = ai;
                    var score = oneBoardMinMax(boards[currentBoard], 0, -Infinity, Infinity, false);
                    boards[currentBoard][a] = 0;
                    moveScores[a] = score*1.2;
                }
            }

            //Looking at global board and seeing which squares are worth it, then subtracting those so opponent doesn't get them
            for(var b = 0; b < 9; b++){
                if(mainBoard[b] === 0){
                    mainBoard[b] = ai;
                    var score = oneBoardMinMax(mainBoard, 0, -Infinity, Infinity, false);
                    mainBoard[b] = 0;
                    if(moveScores[b] !== null){ moveScores[b] -= score;}
                }else{
                    if(moveScores[b] !== null){ moveScores[b] -= 10;}
                }
            }

            //Looking at all the boards and evaluating them
            var boardScores = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            for(var a = 0; a < 9; a++){
                for (var b = 0; b < 9; b++) {
                    if(boards[a][b] === 0){
                        boards[a][b] = ai;
                        var score = oneBoardMinMax(boards[a], 0, -Infinity, Infinity, false);
                        boards[a][b] = 0;
                        boardScores[a] += score*0.02;
                    }
                }
            }

            //Add Board Scores to Move Scores
            for(var i in moveScores){
                if(moveScores[i] !== null){ moveScores[i] += boardScores[i];}
            }

            //Evaluate the current board for each possibility
            /*for(var g = 0; g < 9; g++){
                if(boards[currentBoard][g] === 0){
                    boards[currentBoard][g] = ai;
                    if(moveScores[g] !== null){ moveScores[g] += evaluatePosition(boards)*0.1;}
                    boards[currentBoard][g] = 0;
                }
            }*/

            var tmpForEval = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            //Final evaluation function
            for(var c = 0; c < 9; c++){
                if(boards[currentBoard][c] === 0){
                    boards[currentBoard][c] = ai;
                    var score = miniMax(boards, currentBoard, 6, -Infinity, +Infinity, false);
                    boards[currentBoard][c] = 0;
                    moveScores[c] += score;
                    tmpForEval[c] = score;
                }
            }
            estimatedInFiveTurns = Math.min(tmpForEval[0], tmpForEval[1], tmpForEval[2], tmpForEval[3], tmpForEval[4], tmpForEval[5], tmpForEval[6], tmpForEval[7], tmpForEval[8]);
        }else{
            for(var b = 0; b < 9; b++){
                if(mainBoard[b] === 0){
                    mainBoard[b] = ai;
                    var score = oneBoardMinMax(mainBoard, 0, -Infinity, Infinity, false);
                    console.log("BoardScore: " + score);
                    mainBoard[b] = 0;
                    moveScores[b] += score*0.1;
                }
            }

            var playOn = 0;

            for(var i in moveScores){
                if(moveScores[i] >= moveScores[playOn] && moveScores[i] !== null && mainBoard[i] === 0){
                    playOn = i;
                }
            }

            currentBoard = playOn;

        }

        /*for(var e = 0; e < 9; e++){
            var sum = 0;
            for(var f = 0; f < 9; f++){
                sum+=boards[e][f];
            }
            if(moveScores[e] !== null){ moveScores[e] -= sum;}
        }*/

        console.log(RUNS);
        console.log(moveScores);

        var move = 0;
        for(var j in moveScores){
            if(moveScores[j] !== null){
                move = j; break;
            }
        }

        for(var i = 0; i < 9; i++){
            if(moveScores[i] >= moveScores[move] && moveScores[i] !== null && boards[currentBoard][i] === 0){
                move = i;
            }
        }

        boards[currentBoard][move] = ai;
        currentBoard = move;


        currentTurn = -currentTurn;

    }

    clicked = false;

}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

var keys;

// ---------------------------------------------------------- KEY LISTENERS ------------------------------------------------------------------------ //

function findScreenCoords(mouseEvent)
{
    var rect = canvas.getBoundingClientRect();
    mousePosX = mouseEvent.clientX - rect.left;
    mousePosY = mouseEvent.clientY - rect.top;
}

function click(){
    clicked = true;
    console.log("Eval: " + evaluatePosition(boards));
}
document.getElementById("myCanvas").onmousemove = findScreenCoords;
document.getElementById("myCanvas").onclick = click;

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