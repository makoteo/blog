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

var gameRunning = false;

var RUNS = 0;

var estimatedInFiveTurns = 0;

var SEARCHDEPTH = 6;
var MOVES = 0;

var switchAroo = 1;

var AIACTIVE = true;

var playerNames = ["PLAYER", "AI"];

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

function evaluateGame(position, currentBoard) {
    var evale = 0;
    var mainBd = [];
    var evaluatorMul = [1.4, 1, 1.4, 1, 1.75, 1, 1.4, 1, 1.4];
    for (var eh = 0; eh < 9; eh++){
        evale += realEvaluateSquare(position[eh])*1.5*evaluatorMul[eh];
        if(eh === currentBoard){
            evale += realEvaluateSquare(position[eh])*evaluatorMul[eh];
        }
        var tmpEv = checkWinCondition(position[eh]);
        evale -= tmpEv*evaluatorMul[eh];
        mainBd.push(tmpEv);
    }
    evale -= checkWinCondition(mainBd)*5000;
    evale += realEvaluateSquare(mainBd)*150;
    return evale;
}

function miniMax(position, boardToPlayOn, depth, alpha, beta, maximizingPlayer) {
    RUNS++;

    var tmpPlay = -1;

    var calcEval = evaluateGame(position, boardToPlayOn);
    if(depth <= 0 || Math.abs(calcEval) > 5000) {
        return {"mE": calcEval, "tP": tmpPlay};
    }
    if(boardToPlayOn !== -1 && checkWinCondition(position[boardToPlayOn]) !== 0){
        boardToPlayOn = -1;
    }

    if(maximizingPlayer){
        var maxEval = -Infinity;
        for(var mm = 0; mm < 9; mm++){
            /*if(position[boardToPlayOn][mm] === 0){
                var evalu = -Infinity;
                if(boardToPlayOn === -1 || checkWinCondition(position[boardToPlayOn]) !== 0){
                    var tmpPlay = pickBoard(position, true);
                    depth = 1;
                    if(position[tmpPlay][mm] === 0){
                        position[tmpPlay][mm] = ai;
                        evalu = miniMax(position, tmpPlay, depth-1, alpha, beta, false);
                        evalu+=100;
                        position[tmpPlay][mm] = 0;
                    }
                    //console.log("Eeeeyo");
                }else{
                    position[boardToPlayOn][mm] = ai;
                    evalu = miniMax(position, mm, depth-1, alpha, beta, false);
                    position[boardToPlayOn][mm] = 0;
                }
                maxEval = Math.max(evalu, maxEval);
                alpha = Math.max(alpha, evalu);
                if(beta <= alpha){
                    break;
                }
            }*/
            var evalut = -Infinity;
            if(boardToPlayOn === -1){
                /*if(position[tmpPlay][mm] === 0){
                    position[tmpPlay][mm] = ai;
                    tmpPlay = pickBoard(position, true);
                    evalu = miniMax(position, tmpPlay, depth-1, alpha, beta, false);
                    evalu+=500;
                    position[tmpPlay][mm] = 0;
                }*/
                for(var trr = 0; trr < 9; trr++){
                    if(checkWinCondition(position[mm]) === 0){
                        if(position[mm][trr] === 0){
                            position[mm][trr] = ai;
                            //tmpPlay = pickBoard(position, true);
                            evalut = miniMax(position, mm, depth-1, alpha, beta, false).mE;
                            //evalut+=150;
                            position[mm][trr] = 0;
                        }
                        if(evalut > maxEval){
                            maxEval = evalut;
                            tmpPlay = mm;
                        }
                        alpha = Math.max(alpha, evalut);
                        if(beta <= alpha){
                            break;
                        }
                    }
                }
                /*alpha = Math.max(alpha, evalut);
                if(beta <= alpha){
                    break;
                }*/
            }else{
                if(position[boardToPlayOn][mm] === 0){
                    position[boardToPlayOn][mm] = ai;
                    evalut = miniMax(position, mm, depth-1, alpha, beta, false).mE;
                    position[boardToPlayOn][mm] = 0;
                }
                maxEval = Math.max(evalut, maxEval);
                alpha = Math.max(alpha, evalut);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return {"mE": maxEval, "tP": tmpPlay};
    }else{
        var minEval = Infinity;
        for(var mm = 0; mm < 9; mm++){
            /*if(position[boardToPlayOn][mm] === 0){
                var evalu = Infinity;
                if(boardToPlayOn === -1 || checkWinCondition(position[boardToPlayOn]) !== 0){
                    var tmpPlay = pickBoard(position, false);
                    depth = 1;
                    if(position[tmpPlay][mm] === 0) {
                        position[tmpPlay][mm] = player;
                        evalu = miniMax(position, tmpPlay, depth-1, alpha, beta, true);
                        evalu-=100;
                        position[tmpPlay][mm] = 0;
                    }
                }else{
                    position[boardToPlayOn][mm] = player;
                    evalu = miniMax(position, mm, depth-1, alpha, beta, true);
                    position[boardToPlayOn][mm] = 0;
                }
                //console.log("Eeeeyo");
                minEval = Math.min(evalu, minEval);
                beta = Math.min(beta, evalu);
                if(beta <= alpha){
                    break;
                }
            }*/
            var evalua = Infinity;
            if(boardToPlayOn === -1){
                /*if(position[tmpPlay][mm] === 0){
                    position[tmpPlay][mm] = player;
                    tmpPlay = pickBoard(position, false);
                    evalu = miniMax(position, tmpPlay, depth-1, alpha, beta, true);
                    evalu-=500;
                    position[tmpPlay][mm] = 0;
                }*/
                for(var trr = 0; trr < 9; trr++){
                    if(checkWinCondition(position[mm]) === 0){
                        if(position[mm][trr] === 0){
                            position[mm][trr] = player;
                            //tmpPlay = pickBoard(position, true);
                            evalua = miniMax(position, mm, depth-1, alpha, beta, true).mE;
                            //evalua -= 150;
                            position[mm][trr] = 0;
                        }
                        if(evalua < minEval){
                            minEval = evalua;
                            tmpPlay = mm;
                        }
                        beta = Math.min(beta, evalua);
                        if(beta <= alpha){
                            break;
                        }
                    }
                }
                /*beta = Math.min(beta, evalua);
                if(beta <= alpha){
                    break;
                }*/
            }else{
                if(position[boardToPlayOn][mm] === 0){
                    position[boardToPlayOn][mm] = player;
                    evalua = miniMax(position, mm, depth-1, alpha, beta, true).mE;
                    position[boardToPlayOn][mm] = 0;
                }
                minEval = Math.min(evalua, minEval);
                beta = Math.min(beta, evalua);
                if(beta <= alpha){
                    break;
                }
            }
        }
        return {"mE": minEval, "tP": tmpPlay};
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
//Tbf this is less an evaluation algorithm and more something that figures out where the AI shud move to win normal Tic Tac Toe
function evaluatePos(pos, square){
    pos[square] = ai;
    var evaluation = 0;
    //Prefer center over corners over edges
    //evaluation -= (pos[0]*0.2+pos[1]*0.1+pos[2]*0.2+pos[3]*0.1+pos[4]*0.25+pos[5]*0.1+pos[6]*0.2+pos[7]*0.1+pos[8]*0.2);
    var points = [0.2, 0.17, 0.2, 0.17, 0.22, 0.17, 0.2, 0.17, 0.2];

    var a = 2;
    evaluation+=points[square];
    //console.log("Eyy");
    //Prefer creating pairs
    a = -2;
    if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a || pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a ||
        pos[2] + pos[5] + pos[8] === a || pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
        evaluation += 1;
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

    pos[square] = ai;

    evaluation-=checkWinCondition(pos)*15;

    pos[square] = 0;

    //evaluation -= checkWinCondition(pos)*4;

    return evaluation;
}

function realEvaluateSquare(pos){
    var evaluation = 0;
    var points = [0.2, 0.17, 0.2, 0.17, 0.22, 0.17, 0.2, 0.17, 0.2];

    for(var bw in pos){
        evaluation -= pos[bw]*points[bw];
    }

    /*var a = 1;
    if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a) {
        evaluation += 1.5;
    }
    if(pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a || pos[2] + pos[5] + pos[8] === a) {
        evaluation += 1.5;
    }

    var a = -1;
    if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a) {
        evaluation += -1.5;
    }
    if(pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a || pos[2] + pos[5] + pos[8] === a) {
        evaluation += -1.5;
    }*/


    var a = 2;
    if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a) {
        evaluation -= 6;
    }
    if(pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a || pos[2] + pos[5] + pos[8] === a) {
        evaluation -= 6;
    }
    if(pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
        evaluation -= 7;
    }

    a = -1;
    if((pos[0] + pos[1] === 2*a && pos[2] === -a) || (pos[1] + pos[2] === 2*a && pos[0] === -a) || (pos[0] + pos[2] === 2*a && pos[1] === -a)
        || (pos[3] + pos[4] === 2*a && pos[5] === -a) || (pos[3] + pos[5] === 2*a && pos[4] === -a) || (pos[5] + pos[4] === 2*a && pos[3] === -a)
        || (pos[6] + pos[7] === 2*a && pos[8] === -a) || (pos[6] + pos[8] === 2*a && pos[7] === -a) || (pos[7] + pos[8] === 2*a && pos[6] === -a)
        || (pos[0] + pos[3] === 2*a && pos[6] === -a) || (pos[0] + pos[6] === 2*a && pos[3] === -a) || (pos[3] + pos[6] === 2*a && pos[0] === -a)
        || (pos[1] + pos[4] === 2*a && pos[7] === -a) || (pos[1] + pos[7] === 2*a && pos[4] === -a) || (pos[4] + pos[7] === 2*a && pos[1] === -a)
        || (pos[2] + pos[5] === 2*a && pos[8] === -a) || (pos[2] + pos[8] === 2*a && pos[5] === -a) || (pos[5] + pos[8] === 2*a && pos[2] === -a)
        || (pos[0] + pos[4] === 2*a && pos[8] === -a) || (pos[0] + pos[8] === 2*a && pos[4] === -a) || (pos[4] + pos[8] === 2*a && pos[0] === -a)
        || (pos[2] + pos[4] === 2*a && pos[6] === -a) || (pos[2] + pos[6] === 2*a && pos[4] === -a) || (pos[4] + pos[6] === 2*a && pos[2] === -a)){
        evaluation-=9;
    }

    a = -2;
    if(pos[0] + pos[1] + pos[2] === a || pos[3] + pos[4] + pos[5] === a || pos[6] + pos[7] + pos[8] === a) {
        evaluation += 6;
    }
    if(pos[0] + pos[3] + pos[6] === a || pos[1] + pos[4] + pos[7] === a || pos[2] + pos[5] + pos[8] === a) {
        evaluation += 6;
    }
    if(pos[0] + pos[4] + pos[8] === a || pos[2] + pos[4] + pos[6] === a) {
        evaluation += 7;
    }

    a = 1;
    if((pos[0] + pos[1] === 2*a && pos[2] === -a) || (pos[1] + pos[2] === 2*a && pos[0] === -a) || (pos[0] + pos[2] === 2*a && pos[1] === -a)
        || (pos[3] + pos[4] === 2*a && pos[5] === -a) || (pos[3] + pos[5] === 2*a && pos[4] === -a) || (pos[5] + pos[4] === 2*a && pos[3] === -a)
        || (pos[6] + pos[7] === 2*a && pos[8] === -a) || (pos[6] + pos[8] === 2*a && pos[7] === -a) || (pos[7] + pos[8] === 2*a && pos[6] === -a)
        || (pos[0] + pos[3] === 2*a && pos[6] === -a) || (pos[0] + pos[6] === 2*a && pos[3] === -a) || (pos[3] + pos[6] === 2*a && pos[0] === -a)
        || (pos[1] + pos[4] === 2*a && pos[7] === -a) || (pos[1] + pos[7] === 2*a && pos[4] === -a) || (pos[4] + pos[7] === 2*a && pos[1] === -a)
        || (pos[2] + pos[5] === 2*a && pos[8] === -a) || (pos[2] + pos[8] === 2*a && pos[5] === -a) || (pos[5] + pos[8] === 2*a && pos[2] === -a)
        || (pos[0] + pos[4] === 2*a && pos[8] === -a) || (pos[0] + pos[8] === 2*a && pos[4] === -a) || (pos[4] + pos[8] === 2*a && pos[0] === -a)
        || (pos[2] + pos[4] === 2*a && pos[6] === -a) || (pos[2] + pos[6] === 2*a && pos[4] === -a) || (pos[4] + pos[6] === 2*a && pos[2] === -a)){
        evaluation+=9;
    }

    evaluation -= checkWinCondition(pos)*12;

    return evaluation;
}

function pickBoard(pos, pl){
    var bestScoreThing = -Infinity;
    if(!pl){bestScoreThing = Infinity;}
    var remembered = 0;
    for(var ah = 0; ah < 9; ah++){
        if(checkWinCondition(pos[ah]) === 0){
            for(var eheh = 0; eheh < 9; eheh++){
                if(pos[ah][eheh] === 0){
                    if(pl){
                        pos[ah][eheh] = ai;
                    }else{
                        pos[ah][eheh] = player;
                    }
                    var scoreThing = evaluateGame(pos, eheh)*50;
                    pos[ah][eheh] = 0;
                    scoreThing += realEvaluateSquare(pos[eheh])*12;

                    if((scoreThing > bestScoreThing && pl) || (scoreThing < bestScoreThing && !pl)){
                        bestScoreThing = scoreThing;
                        remembered = ah;
                    }
                    //scoreThing += miniMax(pos, eheh, 2, -Infinity, Infinity, !pl);
                    /*pos[ah][eheh] = 0;
                    if((scoreThing > bestScoreThing && pl) || (scoreThing < bestScoreThing && !pl)){
                        bestScoreThing = scoreThing;
                        remembered = ah;
                    }*/
                }
            }
        }
    }
    return remembered;
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

var bestMove = -1;
var bestScore = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];

function game(){
    //SKY FILL
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.lineWidth = 3;
    var squareSize = WIDTH/4;

    //AI HANDLER

    if(currentTurn === -1 && gameRunning && AIACTIVE){

        bestMove = -1;
        bestScore = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];

        RUNS = 0;
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

        /*if(currentBoard === -1 || checkWinCondition(boards[currentBoard]) !== 0){
            currentBoard = pickBoard(boards, true);
        }*/


        if(currentBoard === -1 || checkWinCondition(boards[currentBoard]) !== 0){
            var savedMm;
            if(MOVES < 10) {
                savedMm = miniMax(boards, -1, 5, -Infinity, Infinity, true);
            }else if(MOVES < 18){
                savedMm = miniMax(boards, -1, 5, -Infinity, Infinity, true);
            }else{
                savedMm = miniMax(boards, -1, 7, -Infinity, Infinity, true);
            }

            console.log(savedMm.tP);
            currentBoard = savedMm.tP;
        }

        for (var i = 0; i < 9; i++) {
            if (boards[currentBoard][i] === 0) {
                bestMove = i;
                break;
            }
        }


        if(bestMove !== -1) {

            for (var a = 0; a < 9; a++) {
                if (boards[currentBoard][a] === 0) {
                    var score = evaluatePos(boards[currentBoard], a, currentTurn)*45;
                    bestScore[a] = score;
                }
            }

            for(var b = 0; b < 9; b++){
                if(checkWinCondition(boards[currentBoard]) === 0){
                    if (boards[currentBoard][b] === 0) {
                        boards[currentBoard][b] = ai;
                        var savedMm;
                        if(MOVES < 16){
                            savedMm = miniMax(boards, b, 6, -Infinity, Infinity, false);
                        }else if(MOVES < 24){
                            console.log("DEEP SEARCH");
                            savedMm = miniMax(boards, b, 7, -Infinity, Infinity, false);
                        }else{
                            console.log("ULTRA DEEP SEARCH");
                            savedMm = miniMax(boards, b, 8, -Infinity, Infinity, false);
                        }
                        console.log(savedMm);
                        var score2 = savedMm.mE;
                        boards[currentBoard][b] = 0;
                        bestScore[b] += score2;
                        //boardSel[b] = savedMm.tP;
                        //console.log(score2);
                    }
                }
            }

            console.log(bestScore);

            for(var i in bestScore){
                if(bestScore[i] > bestScore[bestMove]){
                    bestMove = i;
                }
            }

            if(boards[currentBoard][bestMove] === 0){
                boards[currentBoard][bestMove] = ai;
                currentBoard = bestMove;
            }

            console.log(evaluateGame(boards, currentBoard));
        }


        currentTurn = -currentTurn;

    }

    shapeSize = squareSize/6;

    //mouseClickHandler
    if(clicked === true && gameRunning) {
        for (var i in boards) {
            if(currentBoard !== -1){i = currentBoard;if(mainBoard[currentBoard] !== 0){continue;}}
            for (var j in boards[i]) {
                if(boards[i][j] === 0) {
                    if (mousePosX > (WIDTH / 3 - squareSize) / 2 + squareSize / 6 - shapeSize + (j % 3) * squareSize / 3 + (i % 3) * WIDTH / 3 && mousePosX < (WIDTH / 3 - squareSize) / 2 + squareSize / 6 + shapeSize + (j % 3) * squareSize / 3 + (i % 3) * WIDTH / 3) {
                        if (mousePosY > (WIDTH / 3 - squareSize) / 2 + squareSize / 6 - shapeSize + Math.floor(j / 3) * squareSize / 3 + Math.floor(i / 3) * WIDTH / 3 && mousePosY < (WIDTH / 3 - squareSize) / 2 + squareSize / 6 + shapeSize + Math.floor(j / 3) * squareSize / 3 + Math.floor(i / 3) * WIDTH / 3) {
                            boards[i][j] = currentTurn;
                            currentBoard = j;
                            currentTurn = -currentTurn;
                            MOVES++;
                            break;
                        }
                    }
                }
            }
        }
    }

    //DRAW BOARDS

    squareSize = WIDTH/4;
    var shapeSize = WIDTH/36;

    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 3;
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
            if(boards[i][j] === 1*switchAroo){
                ctx.strokeStyle = COLORS.red;
                ctx.beginPath();
                ctx.moveTo((WIDTH/3-squareSize)/2 + squareSize/6 - shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 - shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.lineTo((WIDTH/3-squareSize)/2 + squareSize/6 + shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 + shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo((WIDTH/3-squareSize)/2 + squareSize/6 - shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 + shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.lineTo((WIDTH/3-squareSize)/2 + squareSize/6 + shapeSize + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 - shapeSize + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.stroke();
            }else if(boards[i][j] === -1*switchAroo){
                ctx.strokeStyle = COLORS.blue;
                ctx.beginPath();
                ctx.ellipse((WIDTH/3-squareSize)/2 + squareSize/6 + (j%3)*squareSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - squareSize)/2 + squareSize/6 + Math.floor(j/3)*squareSize/3 + Math.floor(i/3)*WIDTH/3, shapeSize*1.1, shapeSize*1.1, 0, 0, Math.PI*2);
                ctx.stroke();
            }
        }
    }

    if(gameRunning){
        if (checkWinCondition(mainBoard) !== 0) {
            gameRunning = false;
            document.getElementById("winMenu").removeAttribute("hidden");
            if(checkWinCondition(mainBoard) === 1){
                document.getElementById("result").innerHTML = playerNames[0] + " WINS!";
            }else{
                document.getElementById("result").innerHTML = playerNames[1] + " WINS!";
            }
        }
    }

    shapeSize = squareSize/3;
    ctx.lineWidth = 20;

    for(var j in mainBoard){
        if(mainBoard[j] === 1*switchAroo){
            ctx.strokeStyle = COLORS.red;
            ctx.beginPath();
            ctx.moveTo(WIDTH/6 - shapeSize + (j%3)*WIDTH/3, WIDTH/6 - shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.lineTo(WIDTH/6 + shapeSize + (j%3)*WIDTH/3, WIDTH/6 + shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(WIDTH/6 - shapeSize + (j%3)*WIDTH/3, WIDTH/6 + shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.lineTo(WIDTH/6 + shapeSize + (j%3)*WIDTH/3, WIDTH/6 - shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.stroke();
        }else if(mainBoard[j] === -1*switchAroo){
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

    //Draw EVAL BAR

    ctx.globalAlpha = 0.9;
    if(evaluateGame(boards, currentBoard)*switchAroo > 0){
        ctx.fillStyle = COLORS.blue;
    }else{
        ctx.fillStyle = COLORS.red;
    }
    ctx.fillRect(WIDTH/2, WIDTH, evaluateGame(boards, currentBoard)*2*switchAroo, HEIGHT/16);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(WIDTH/2, WIDTH);
    ctx.lineTo(WIDTH/2, WIDTH+HEIGHT);
    ctx.stroke();

    //console.log(RUNS);

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(WIDTH/2, WIDTH, bestScore[bestMove]*2*switchAroo, HEIGHT/16);
    ctx.globalAlpha = 1;

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

function startGame(type){
    boards = [

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

    mainBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    MOVES = 0;

    currentTurn = 1;

    if(type === 0){
        AIACTIVE = true;
        gameRunning = true;
        playerNames[0] = "PLAYER";
        playerNames[1] = "AI";
    }else{
        AIACTIVE = false;
        gameRunning = true;
        switchAroo = 1;
        playerNames[0] = "PLAYER 1";
        playerNames[1] = "PLAYER 2";
    }
    document.getElementById("startMenu").setAttribute("hidden", "hidden");
    document.getElementById("turnMenu").setAttribute("hidden", "hidden");
}

function setGame(type){
    if(type === 0){
        currentTurn = 1;
        switchAroo = 1;
    }else{
        currentTurn = -1;
        switchAroo = -1;
    }
    startGame(0);
}

function menu(){
    document.getElementById("startMenu").removeAttribute("hidden");
    document.getElementById("turnMenu").setAttribute("hidden", "hidden");
    document.getElementById("winMenu").setAttribute("hidden", "hidden");
}

function pickTurns(){
    document.getElementById("startMenu").setAttribute("hidden", "hidden");
    document.getElementById("turnMenu").removeAttribute("hidden");
}

// ---------------------------------------------------------- GAME LOOP ------------------------------------------------------------------------ //

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);