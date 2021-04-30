var versionCode = "Alpha 0.1";
var WIDTH = 1024;
var HEIGHT = 576;
var gameRunning = false;

var nodes = [];
var connections = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var SIZES = {big: [14, 14], small: [6, 6], squishHoriz: [4, 14], squishVertic: [14, 4]}; //Vertical is the correct orientation
var COLORS = {};

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Node(x, y, type, attribute){
    this.type = type;
    this.attribute = attribute;

    this.x = x;
    this.y = y;

    this.width = SIZES['big'][0]*2.5;
    this.height = SIZES['big'][0]*2;

    this.animFrame = 0;
    this.decorOffset = 2;

    this.animationSpeed = 100;

    this.input = [
        [], //Main
        [] //Sides
    ];

    this.output = [
        [], //Main
        [] //Sides
    ];

    this.update = function(){

    };

    this.draw = function (){
        this.animFrame++;

        ctx.fillStyle = 'rgb(25, 25, 25)';
        ctx.strokeStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'darkgray';
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, Math.max(this.height*0.5*Math.sin(this.animFrame/this.animationSpeed), 0));
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + this.decorOffset, this.y, this.width - this.decorOffset*2, Math.max(this.height*0.5*Math.sin(this.animFrame/this.animationSpeed), 0));

        //drawMiniature(this.x+this.width/2, this.y+this.height/2-this.decorOffset, 'rectangle-red-vertical-big', [[], []]);

        ctx.fillStyle = 'darkgray';
        ctx.strokeStyle = 'black';

        ctx.fillRect(this.x, this.y+this.height, this.width, -Math.max(this.height*0.5*Math.sin(this.animFrame/this.animationSpeed), 0));
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + this.decorOffset, this.y+this.height, this.width - this.decorOffset*2, -Math.max(this.height*0.5*Math.sin(this.animFrame/this.animationSpeed), 0));

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

nodes.push(new Node(500, 500, 0, 'square'));

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function drawShape(variables, x, y, offSet){
    var attrDraw = variables.split("-");
    var shape = attrDraw[0];
    var color = attrDraw[1];
    var rotation = attrDraw[2];
    var size = attrDraw[3];

    var ownOffSet = SIZES[size][1];

    var strokeWidthTmp = 4;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidthTmp;

    switch (shape){
        case 'rectangle':
            if(rotation === 'horizontal'){
                ctx.strokeRect(x - SIZES[size][1]/2, y - SIZES[size][0] + offSet, SIZES[size][1], SIZES[size][0]);
                ctx.fillRect(x - SIZES[size][1]/2, y - SIZES[size][0] + offSet, SIZES[size][1], SIZES[size][0]);
                ownOffSet = SIZES[size][0];
            }else{
                ctx.strokeRect(x - SIZES[size][0]/2, y - SIZES[size][1] + offSet, SIZES[size][0], SIZES[size][1]);
                ctx.fillRect(x - SIZES[size][0]/2, y - SIZES[size][1] + offSet, SIZES[size][0], SIZES[size][1]);
            }
            break;
        case 'ellipse':
            if(rotation === 'horizontal'){
                ctx.beginPath();
                ctx.ellipse(x, y - SIZES[size][0]/2 + offSet, SIZES[size][1]/2, SIZES[size][0]/2, 0, 0, Math.PI*2);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ownOffSet = SIZES[size][0];
            }else{
                ctx.beginPath();
                ctx.ellipse(x, y - SIZES[size][1]/2 + offSet, SIZES[size][0]/2, SIZES[size][1]/2, 0, 0, Math.PI*2);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
            break;
        case 'triangle':
            if(rotation === 'top'){
                ctx.beginPath();
                ctx.moveTo(x - SIZES[size][0]/2, y + offSet);
                ctx.lineTo(x + SIZES[size][0]/2, y + offSet);
                ctx.lineTo(x, y - SIZES[size][1] + offSet);
                ctx.lineTo(x - SIZES[size][0]/2, y + offSet);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ownOffSet = SIZES[size][1];
            }else if(rotation === 'right'){
                ctx.beginPath();
                ctx.moveTo(x - SIZES[size][1]/2, y - SIZES[size][0] + offSet);
                ctx.lineTo(x - SIZES[size][1]/2, y + offSet);
                ctx.lineTo(x + SIZES[size][1]/2, y - SIZES[size][0]/2 + offSet);
                ctx.lineTo(x - SIZES[size][1]/2, y - SIZES[size][0] + offSet);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ownOffSet = SIZES[size][0];
            }else if(rotation === 'bottom'){
                ctx.beginPath();
                ctx.moveTo(x - SIZES[size][0]/2, y - SIZES[size][1] + offSet);
                ctx.lineTo(x + SIZES[size][0]/2, y - SIZES[size][1] + offSet);
                ctx.lineTo(x, y + offSet);
                ctx.lineTo(x - SIZES[size][0]/2, y - SIZES[size][1] + offSet);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ownOffSet = SIZES[size][1];
            }else{
                ctx.beginPath();
                ctx.moveTo(x + SIZES[size][1]/2, y - SIZES[size][0] + offSet);
                ctx.lineTo(x + SIZES[size][1]/2, y + offSet);
                ctx.lineTo(x - SIZES[size][1]/2, y - SIZES[size][0]/2 + offSet);
                ctx.lineTo(x + SIZES[size][1]/2, y - SIZES[size][0] + offSet);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ownOffSet = SIZES[size][0];
            }
            break;
    }

    return -ownOffSet - strokeWidthTmp*0.8; //Objects are drawn from bottom, this moves the cursor up basically
}

//offArm should be formatted like... bottom, and then right left and top shud be last

function drawMiniature(x, y, shapeMain, offArms){
    var amount = offArms.length;
    if(amount === 2){
        var shapeoffSet = 0;
        for(var i in offArms[0]){ //bottom
            shapeoffSet += drawShape(offArms[0][offArms[0].length-1-i], x, y, sign(i)*shapeoffSet);
        }
        shapeoffSet += drawShape(shapeMain, x, y, shapeoffSet); //main
        for(var i in offArms[1]){ //top
            shapeoffSet += drawShape(offArms[1][i], x, y, shapeoffSet);
        }
    }
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
    ctx.fillStyle = "rgb(255, 250, 246)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drawMiniature(200, 500, 'rectangle-red-vertical-big', [['rectangle-yellow-vertical-big', 'triangle-green-top-big', 'ellipse-blue-horizontal-big'], ['rectangle-black-vertical-big', 'triangle-green-bottom-big', 'ellipse-blue-horizontal-big']]);
    drawMiniature(400, 500, 'triangle-green-top-big', [['rectangle-brown-vertical-squishHoriz'], []]);

    //drawShape('rectangle-green-vertical-big', 100, 200, shapeoffSet);

    for(var i = 0; i < nodes.length; i++){
        nodes[i].update();
        nodes[i].draw();
    }

    /* IMAGE DRAW EXAMPLE
    ctx.drawImage(groundG, 0, 0, 1000, 100, 0, HEIGHT - floorHeight, 1000, 100);
    */


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