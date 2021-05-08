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

var currentTurn = -1;
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

function evaluateGame(position, currentBoard, turn) {
    var gameEval = 0;
    var count = 1;
    for (var bb = 0; bb < 9; bb++){
        for(var trn = 0; trn < 9; trn ++){
            if(position[bb][trn] === 0){
                gameEval += evaluatePos(position[bb], trn, ai);
                count++;
            }
        }
    }

    var turnNum = 0;

    gameEval = gameEval/count * 5;

    //console.log(currentBoard);

    /*for(var sqru = 0; sqru < 9; sqru++){
        if(position[currentBoard][sqru] === 0){
            gameEval += evaluatePos(position[currentBoard], sqru, -1)*2;
            //gameEval -= evaluatePos(position[currentBoard], sqru, 1)*2;
        }
        gameEval-=checkWinCondition(position[sqru])*5;
    }*/
    return gameEval * 2;
}

function pickBoard(position, maximizing){
    var bdScores = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var bb = 0; bb < 9; bb++){
        if(checkWinCondition(position[bb]) === 0){
            for(var trn = 0; trn < 9; trn ++){
                if(position[bb][trn] === 0){
                    if(maximizing){
                        bdScores[bb] = evaluatePos(position[bb], trn, ai);
                    }else{
                        bdScores[bb] = evaluatePos(position[bb], trn, player);
                    }
                }
            }
        }
    }
    var maxThing = 0;
    for(var je = 0; je < 9; je++){
        if(bdScores[je] > bdScores[maxThing]){
            maxThing = je;
        }
    }

    //console.log(maxThing);
    return maxThing;
}

function miniMax(position, boardToPlayOn, depth, alpha, beta, maximizingPlayer) {
    RUNS++;

    boardToPlayOn = parseInt(boardToPlayOn);

    if(boardToPlayOn < 0 || boardToPlayOn > 8){
        boardToPlayOn = pickBoard(position, maximizingPlayer);
    }

    if(depth === 0 || checkWinCondition(mainBoard) !== 0) {
        //console.log(evaluateGame(position, parseInt(boardToPlayOn), maximizingPlayer));
        return evaluateGame(position, boardToPlayOn, maximizingPlayer);
    }

    if(maximizingPlayer){
        var maxEval = -Infinity;
        for(var mm = 0; mm < 9; mm++){
            if(position[boardToPlayOn][mm] === 0){
                if(checkWinCondition(position[boardToPlayOn] !== 0)){
                    var tmpToPlay = pickBoard(position, true);
                    if(position[tmpToPlay][mm] === 0){
                        position[tmpToPlay][mm] = ai;
                        var evalu = miniMax(position, tmpToPlay, depth-1, alpha, beta, false);
                        evalu = evalu/2;
                        position[tmpToPlay][mm] = 0;
                    }else{
                        continue;
                    }
                }else{
                    position[boardToPlayOn][mm] = ai;
                    var evalu = miniMax(position, mm, depth-1, alpha, beta, false);
                    position[boardToPlayOn][mm] = 0;
                }
                if(evalu > maxEval && !isNaN(evalu)) {
                    maxEval = evalu;
                }
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
                if(checkWinCondition(position[boardToPlayOn]) !== 0){
                    var tmpToPlay = pickBoard(position, false);
                    if(position[tmpToPlay][mm] === 0){
                        position[tmpToPlay][mm] = player;
                        var evalu = miniMax(position, tmpToPlay, depth-1, alpha, beta, true);
                        evalu = evalu/2;
                        position[tmpToPlay][mm] = 0;
                    }else{
                        continue;
                    }
                }else{
                    position[boardToPlayOn][mm] = player;
                    var evalu = miniMax(position, mm, depth-1, alpha, beta, true);
                    position[boardToPlayOn][mm] = 0;
                }
                if(evalu < minEval && !isNaN(evalu)) {
                    minEval = evalu;
                }
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

//Low number means losing the board, big number means winning
function evaluatePos(pos, square, turn){
    pos[square] = ai;
    var evaluation = 0;
    //Prefer center over corners over edges
    //evaluation -= (pos[0]*0.2+pos[1]*0.1+pos[2]*0.2+pos[3]*0.1+pos[4]*0.25+pos[5]*0.1+pos[6]*0.2+pos[7]*0.1+pos[8]*0.2);
    var points = [0.2, 0.1, 0.2, 0.1, 0.25, 0.1, 0.2, 0.1, 0.2];

    var a = 2;
    if(turn === -1){
        evaluation+=points[square];
        //Prefer creating pairs
        a = 2;
        if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a || pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a ||
            pos[2] + pos[5] + pos[8] === a || pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
            evaluation -= 1;
        }
        //Take victories
        a = -3;
        if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a || pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a ||
            pos[2] + pos[5] + pos[8] === a || pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
            evaluation += 5;
        }

        //Block a players turn if necessary
        pos[square] = player;

        a = 3;
        if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a || pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a ||
            pos[2] + pos[5] + pos[8] === a || pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
            evaluation += 2;
        }
    }else{
        pos[square] = player;
        evaluation+=points[square];

        a = -2;
        if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a || pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a ||
            pos[2] + pos[5] + pos[8] === a || pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
            evaluation -= 1;
        }

        a = 3;
        if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a || pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a ||
            pos[2] + pos[5] + pos[8] === a || pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
            evaluation += 5;
        }

        //Block a players turn if necessary
        pos[square] = ai;

        a = -3;
        if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a || pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a ||
            pos[2] + pos[5] + pos[8] === a || pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
            evaluation += 2;
        }
    }

    pos[square] = 0;

    //evaluation -= checkWinCondition(pos)*4;

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
    //ctx.fillRect(WIDTH/2, WIDTH, evaluateGame(boards, currentBoard, true)*4, HEIGHT/16);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(WIDTH/2, WIDTH);
    ctx.lineTo(WIDTH/2, WIDTH+HEIGHT);
    ctx.stroke();

    //AI HANDLER

    if(currentTurn === -1){
        RUNS = 0;
        var bestMove = -1;
        var bestScore = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];
        /*for(var a = 0; a < 9; a++){
            if(boards[currentBoard][a] === 0){
                boards[currentBoard][a] = ai;
                var score = oneBoardMinMax(boards[currentBoard], 0, -Infinity, Infinity, false);
                boards[currentBoard][a] = 0;
                if(score >= bestScore){
                    bestScore = score;
                    bestMove = a;
                }
            }
        }*/

        if(checkWinCondition(boards[currentBoard]) !== 0 || currentBoard === -1){
            currentBoard = pickBoard(boards, true);
            console.log(currentBoard);
        }

        for(var i = 0; i < 9; i++){
            if(boards[currentBoard][i] === 0){
                bestMove = i;
                break;
            }
        }

        if(bestMove !== -1) {
            for (var a = 0; a < 9; a++) {
                if (boards[currentBoard][a] === 0) {
                    var score = evaluatePos(boards[currentBoard], a, currentTurn);
                    bestScore[a] = score;
                }
            }

            for(var b = 0; b < 9; b++){
                if (boards[currentBoard][b] === 0) {
                    var score2 = miniMax(boards, b, 5, -Infinity, Infinity, false);
                    bestScore[b] += score2;
                    //console.log(score2);
                }
            }

            for(var i in bestScore){
                if(bestScore[i] > bestScore[bestMove]){
                    bestMove = i;
                }
            }

            if(boards[currentBoard][bestMove] === 0){
                boards[currentBoard][bestMove] = ai;
                currentBoard = bestMove;
            }

            console.log(bestScore);
        }


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
    //console.log("Eval: " + evaluatePosition(boards));
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