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
var G = 10;

var PAUSED = false;

var mousePosX = 0;
var mousePosY = 0;

var clickTimer = 1;

var dragging = false;

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, mass, density, type){
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

    this.passedThrough = false;
    this.affectedByGravity = true;

    if(this.type === 1){
        this.affectedByGravity = false;
    }
    if(this.type === 2){
        this.velX = -5;
    }

    this.draw = function(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.cameraX, this.cameraY, this.radius, 0, 2 * Math.PI);
        ctx.fill();

    };
    this.update = function(){
        if(this.inactive === false && this.affectedByGravity === true) {
            for (var j = 0; j < objects.length; j++) {
                if (objects[j] !== this) {
                    this.tempX = objects[j].x;
                    this.tempY = objects[j].y;

                    this.distance = Math.sqrt((this.x - this.tempX) * (this.x - this.tempX) + (this.y - this.tempY) * (this.y - this.tempY)); //This is the actual Distance

                    if (this.distance > this.radius + objects[j].radius) {
                        this.velX += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.x) / this.distance; // F = M*A A = F/M
                        this.velY += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.y) / this.distance;
                        if(Math.sqrt((this.velX)*(this.velX) + (this.velY)*(this.velY)) > this.distance){
                            this.passedThrough = true;
                        }
                    } else {
                        if(this.distance < 1){
                            this.distance = 1;
                        }
                        if(objects[j].affectedByGravity === true) {
                            this.velX = this.velX + (objects[j].velX);
                            this.velY += (objects[j].velY);
                            if(this.mass <= objects[j].mass){
                                this.x = objects[j].x;
                                this.y = objects[j].y;
                            }
                        }else{
                            this.velX = 0;
                            this.velY = 0;
                            if(this.mass <= objects[j].mass){
                                this.x = objects[j].x;
                                this.y = objects[j].y;
                            }
                            this.affectedByGravity = false;
                        }
                        this.mass += objects[j].mass;
                        this.radius = Math.sqrt(this.mass/(this.density*3.14));
                        objects[j].inactive = true;
                        objects.splice(j, 1);
                        console.log(this.distance);
                        break;
                    }

                    if(this.passedThrough === true){
                        if(this.distance < 1){
                            this.distance = 1;
                        }
                        if(objects[j].affectedByGravity === true){
                            this.velX = this.velX + (objects[j].velX);
                            this.velY += (objects[j].velY);
                            if(this.mass <= objects[j].mass){
                                this.x = objects[j].x;
                                this.y = objects[j].y;
                            }
                        }else{
                            this.velX = 0;
                            this.velY = 0;
                            if(this.mass <= objects[j].mass){
                                this.x = objects[j].x;
                                this.y = objects[j].y;
                            }
                            this.affectedByGravity = false;
                        }
                        this.mass += objects[j].mass;
                        this.radius = Math.sqrt(this.mass/(this.density*3.14));
                        objects[j].inactive = true;
                        objects.splice(j, 1);
                        break;
                    }
                    //console.log(this.distance);

                }
            }
        }
        //console.log(this.velX);
    };
    this.move = function(){
        this.x += this.velX;
        this.y += this.velY;

        this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
        this.cameraY = ((this.y - screenHalfHeight) * cameraZoom + screenHalfHeight);
        this.radius = Math.sqrt(this.mass/(this.density*3.14)) * cameraZoom;

    }
}

objects.push(new Object(WIDTH/2, HEIGHT/2, 50, 1, 1));
objects.push(new Object(WIDTH/3, 40, 10, 1, 0));

function game(){

    window.onmousemove = logMouseMove;

    //SKY FILL
    if(PAUSED === false){
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for(var i = 0; i < objects.length; i++){
            if(objects[i].inactive === false){
                objects[i].draw();
                objects[i].update();

            }
        }
        for(var i = 0; i < objects.length; i++){
            if(objects[i].inactive === false){
                objects[i].move();
            }
        }
    }

    if(clickTimer === 0){
        objects.push(new Object(mousePosX, mousePosY, 10, 1, 2));
        console.log(objects.length);
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

function clickedNow(){
    if(clickTimer === 1){
        clickTimer = 0;
        dragging = false;
    }
}

function draggedNow(){
    dragging = true;
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