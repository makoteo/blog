var versionCode = "Alpha 0.01";
var WIDTH = 1024;
var HEIGHT = 576;
var gameRunning = false;

var objects = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var cameraZoom = 1;
var screenHalfWidth = WIDTH/2;
var screenHalfHeight = HEIGHT/2;

var massMultiplier = 10;
var G = 1;
var mouseForce = 2;
var lineLength = 30;

var PAUSED = false;

var mousePosX = 0;
var mousePosY = 0;

var clickTimer = 1;

var dragging = false;

var savedMouseX = 0;
var savedMouseY = 0;

var selectedPlanetProperties = {mass:10, density:1, color:'blue'};

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, mass, density, type){
    this.lifeTimer = 0;
    this.x = x;
    this.y = y;
    this.mass = mass * massMultiplier;
    this.density = density;

    this.velX = 0;
    this.velY = 0;

    this.radius = Math.sqrt(this.mass/(this.density*3.14)) * cameraZoom;

    this.type = type;

    this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
    this.cameraY = ((this.y - screenHalfWidth) * cameraZoom + screenHalfHeight);

    this.tempX = 0;
    this.tempY = 0;
    this.distance = 0;

    this.inactive = false;
    this.exists = false;
    this.passedThrough = false;
    this.affectedByGravity = true;
    this.curvePoints = [[this.cameraX, this.cameraY]];
    this.curveVelX = 0;
    this.curveVelY = 0;

    if(this.type === 1){
        this.affectedByGravity = false;
    }

    this.draw = function(){
        if(this.inactive === false){
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(this.cameraX, this.cameraY, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    };
    this.update = function(){
        this.lifeTimer++;
        if(this.exists === false){
            if(dragging === false){
                this.exists = true;
                this.velX = (savedMouseX - mousePosX)*mouseForce/100;
                this.velY = (savedMouseY - mousePosY)*mouseForce/100;
            }else{
                this.curveVelX = (savedMouseX - mousePosX)*mouseForce/100;
                this.curveVelY = (savedMouseY - mousePosY)*mouseForce/100;

                this.curvePoints = [[this.cameraX, this.cameraY]];

                for(var i = 1; i < lineLength; i++){
                    if(i === 1){
                        this.curvePoints.push([this.cameraX + this.curveVelX, this.cameraY + this.curveVelY])
                    }else{
                        this.curvePoints.push([this.curvePoints[i-1][0] + this.curveVelX, this.curvePoints[i-1][1] + this.curveVelY]);
                    }
                    for (var j = 0; j < objects.length; j++) {
                        if (objects[j] !== this && this.inactive === false && objects[j].exists === true) {
                            this.tempX = objects[j].x;
                            this.tempY = objects[j].y;
                            this.distance = Math.sqrt((this.curvePoints[i][0] - this.tempX) * (this.curvePoints[i][0] - this.tempX) + (this.curvePoints[i][1] - this.tempY) * (this.curvePoints[i][1] - this.tempY));
                            if(this.distance > this.radius + objects[j].radius){
                                this.curveVelX += (2 * G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.curvePoints[i][0]) / this.distance; // F = M*A A = F/M
                                this.curveVelY += (2 * G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.curvePoints[i][1]) / this.distance;
                            }else{
                                this.curveVelX = 0;
                                this.curveVelY = 0;
                                break;
                            }

                        }
                    }
                }
                if(this.lifeTimer > 1){
                    for(var d = 1; d < this.curvePoints.length; d++){
                        ctx.strokeStyle = 'white';
                        ctx.beginPath();
                        ctx.moveTo(this.curvePoints[d-1][0], this.curvePoints[d-1][1]);
                        ctx.lineTo(this.curvePoints[d][0], this.curvePoints[d][1]);
                        ctx.stroke();
                    }
                }
            }
        }

        if(this.inactive === false && this.affectedByGravity === true && this.exists === true) {
            for (var j = 0; j < objects.length; j++) {
                if (objects[j] !== this && this.inactive === false && objects[j].exists === true && this.passedThrough === false) {
                    this.tempX = objects[j].x;
                    this.tempY = objects[j].y;

                    this.distance = Math.sqrt((this.x - this.tempX) * (this.x - this.tempX) + (this.y - this.tempY) * (this.y - this.tempY)); //This is the actual Distance

                    if (this.distance > this.radius + objects[j].radius) {
                        this.velX += (2*G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.x) / this.distance; // F = M*A A = F/M
                        this.velY += (2*G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.y) / this.distance;
                        if(this.distance < objects[j].radius*2 + Math.sqrt((this.velX)*(this.velX) + (this.velY)*(this.velY))*2){
                            if(Math.sqrt((this.velX)*(this.velX) + (this.velY)*(this.velY)) > objects[j].radius*2){
                                var segments = Math.ceil(Math.sqrt((this.velX)*(this.velX) + (this.velY)*(this.velY))/objects[j].radius*2);
                                console.log("Check");
                                for(var s = 0; s < segments; s++){
                                    if(Math.sqrt((this.x + this.velX/segments*s - this.tempX) * (this.x + this.velX/segments*s - this.tempX) +
                                            (this.y + this.velY/segments*s - this.tempY) * (this.y + this.velY/segments*s - this.tempY)) < this.radius*2 + objects[j].radius){
                                        this.passedThrough = true;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        this.explode(this.distance, j);
                    }

                    if(this.passedThrough === true){
                        this.explode(this.distance, j);
                    }

                    //console.log(this.distance);

                }
            }
        }
        //console.log(this.velX);
    };

    this.explode = function(distance, int){
        if(distance < 1){
            distance = 1;
        }
        if(objects[int].affectedByGravity === true) {
            this.velX = (this.velX + (objects[int].velX)*(objects[int].mass/this.mass))/2;
            this.velY = (this.velY + (objects[int].velY)*(objects[int].mass/this.mass))/2;
            if(this.mass < objects[int].mass){
                this.x = objects[int].x;
                this.y = objects[int].y;
            }
        }else{
            this.velX = 0;
            this.velY = 0;
            if(this.mass < objects[int].mass){
                this.x = objects[int].x;
                this.y = objects[int].y;
            }
            this.affectedByGravity = false;
        }
        this.mass += objects[int].mass;
        this.radius = Math.sqrt(this.mass/(this.density*3.14));
        objects[int].inactive = true;
        objects.splice(int, 1);
    };

    this.move = function(){
        if(this.affectedByGravity === false){
            this.velX = 0;
            this.velY = 0;
        }
        this.x += this.velX;
        this.y += this.velY;

        this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
        this.cameraY = ((this.y - screenHalfHeight) * cameraZoom + screenHalfHeight);
        this.radius = Math.sqrt(this.mass/(this.density*3.14)) * cameraZoom;

    };
}

objects.push(new Object(WIDTH/2, HEIGHT/2, 50, 1, 1));
objects.push(new Object(WIDTH/3, 40, 10, 1, 0));

function game(){

    window.onmousemove = logMouseMove;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    //SKY FILL
    if(PAUSED === false){
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        //Cursor

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(mousePosX, mousePosY, Math.sqrt(selectedPlanetProperties.mass*massMultiplier/(selectedPlanetProperties.density*3.14)) * cameraZoom, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        for(var i = 0; i < objects.length; i++){
            if(objects[i].inactive === false){
                objects[i].update();
            }
        }
        for(var i = 0; i < objects.length; i++){
            if(objects[i].inactive === false){
                objects[i].move();
            }
        }
        for(var i = 0; i < objects.length; i++){
            if(objects[i].inactive === false){
                objects[i].draw();
            }
        }
    }

    if(clickTimer === 0){
        objects.push(new Object(((mousePosX - screenHalfWidth) / cameraZoom + screenHalfWidth), ((mousePosY - screenHalfHeight) / cameraZoom + screenHalfHeight), 10, 1, 2));
    }

    if(clickTimer < 1){
        clickTimer++;
    }

    if(gameRunning === true) {

        frameCount++;

        /* (KEY INPUT)
        if (keys && keys[40] || keys && keys[83]) {player.setVelY(player.getVelY() + 0.2)}
        */

    }
}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function Start(){
    if(gameRunning === false){
        SCORE = 0;
        frameCount = 0;

        //document.getElementById("score").innerHTML = "" + SCORE;
        //document.getElementById("gamescore").innerHTML = "" + GAMESCORE;
        //document.getElementById("scorediv").removeAttribute("hidden");
        //document.getElementById("gamescorediv").removeAttribute("hidden");
        HIGHSCORE = localStorage.getItem("HighScoreBusiness");
        gameRunning = true;
    }
}

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

document.addEventListener("mouseup", clickedNow);
document.addEventListener("mousedown", draggedNow);

    // IE9, Chrome, Safari, Opera
document.addEventListener("mousewheel", MouseWheelHandler, false);
    // Firefox
document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

function MouseWheelHandler(e)
{
    // cross-browser wheel delta
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if(cameraZoom >= 0.1){
        cameraZoom += delta/20;
    }else{
        cameraZoom = 0.1;
    }
}

function clickedNow(){
    if(clickTimer === 1){
        //clickTimer = 0;
        dragging = false;
    }
}

function draggedNow(){
    clickTimer = 0;
    dragging = true;
    savedMouseX = mousePosX;
    savedMouseY = mousePosY;
}

function logMouseMove(e) {
    e = event || window.event;

    var rect = canvas.getBoundingClientRect();

    mousePosX = e.clientX - rect.left;
    mousePosY = e.clientY - rect.top;
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