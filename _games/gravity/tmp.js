var versionCode = "Alpha 0.01";
var WIDTH = 1024;
var HEIGHT = 576;
var gameRunning = false;

var objects = [];
var trails = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var cameraZoom = 1;
var screenHalfWidth = WIDTH/2;
var screenHalfHeight = HEIGHT/2;

var massMultiplier = 10;
var G = 1;
var mouseForce = 2;
var lineLength = 30;
var absoluteLowTemperature = -200;

var PAUSED = false;
var gameClock = 0;

var mousePosX = 0;
var mousePosY = 0;

var clickTimer = 1;

var dragging = false;

var savedMouseX = 0;
var savedMouseY = 0;

var simulationSpeed = 1;

var globalTrailLife = 500;
var globalPlanetMass = 200;

var selectedPlanetProperties = {mass:5, density:1, color:'blue', type:0};

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, mass, density, type, gravityEffect, color){
    this.lifeTimer = 0;
    this.x = x;
    this.y = y;
    this.mass = mass * massMultiplier;
    this.density = density;
    this.color = color;

    //Changeable Stuff

    this.temperature = 0;

    this.velX = 0;
    this.velY = 0;

    this.radius = Math.sqrt(this.mass/(this.density*3.14));

    this.type = type; // 0 = Meteorite, 1 = Planet, 2 = Star, 3 = Debris

    if(this.type === 2){
        this.temperature = 10000;
    }

    this.gravityEffect = gravityEffect;

    this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
    this.cameraY = ((this.y - screenHalfWidth) * cameraZoom + screenHalfHeight);
    this.cameraRadius = this.radius * cameraZoom;

    this.tempX = 0;
    this.tempY = 0;
    this.distance = 0;

    this.inactive = false;
    this.exists = false;
    this.passedThrough = false;
    this.affectedByGravity = true;
    this.curvePoints = [[this.x, this.y]];
    this.curveVelX = 0;
    this.curveVelY = 0;

    this.points = [];
    this.pointAmount = 0;
    this.readyPoints = [0, 1, 2, 3];


    if(this.gravityEffect === false){
        this.affectedByGravity = false;
    }

    this.draw = function(){
        if(this.inactive === false){
            if(this.type !== 0){
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.cameraX, this.cameraY, this.cameraRadius, 0, 2 * Math.PI);
                ctx.fill();
            }else{
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(this.points[0][0] + this.cameraX - this.cameraRadius, this.points[0][1] + this.cameraY - this.cameraRadius);
                for(var d = 1; d < this.points.length; d++){
                    //ctx.beginPath();
                    ctx.lineTo(this.points[d][0] + this.cameraX - this.cameraRadius, this.points[d][1] + this.cameraY - this.cameraRadius);
                    //ctx.stroke();

                }
                ctx.closePath();
                ctx.fill();
            }

        }
    };
    this.update = function(){
        if(gameClock % 20 === 0 && this.type === 0){
            this.regenerate();
        }
        this.lifeTimer++;
        if(this.exists === false){
            if(dragging === false){
                this.exists = true;
                this.velX = (savedMouseX - mousePosX)*mouseForce/100;
                this.velY = (savedMouseY - mousePosY)*mouseForce/100;
            }else{
                this.curveVelX = (savedMouseX - mousePosX)*mouseForce/100;
                this.curveVelY = (savedMouseY - mousePosY)*mouseForce/100;

                this.curvePoints = [[this.x, this.y]];

                for(var i = 1; i < Math.round(lineLength/cameraZoom); i++){
                    if(i === 1){
                        this.curvePoints.push([this.x + this.curveVelX, this.y + this.curveVelY])
                    }else{
                        this.curvePoints.push([this.curvePoints[i-1][0] + this.curveVelX, this.curvePoints[i-1][1] + this.curveVelY]);
                    }
                    for (var j = 0; j < objects.length; j++) {
                        if (objects[j] !== this && this.inactive === false && objects[j].exists === true) {
                            this.tempX = objects[j].x;
                            this.tempY = objects[j].y;
                            this.distance = Math.sqrt((this.curvePoints[i][0] - this.tempX) * (this.curvePoints[i][0] - this.tempX) + (this.curvePoints[i][1] - this.tempY) * (this.curvePoints[i][1] - this.tempY));
                            if(this.distance > (this.radius + objects[j].radius)){
                                this.curveVelX += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.curvePoints[i][0]) / this.distance; // F = M*A A = F/M
                                this.curveVelY += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.curvePoints[i][1]) / this.distance;
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
                        ctx.moveTo(((this.curvePoints[d-1][0] - screenHalfWidth) * cameraZoom + screenHalfWidth), ((this.curvePoints[d-1][1] - screenHalfHeight) * cameraZoom + screenHalfHeight));
                        ctx.lineTo(((this.curvePoints[d][0] - screenHalfWidth) * cameraZoom + screenHalfWidth), ((this.curvePoints[d][1] - screenHalfHeight) * cameraZoom + screenHalfHeight));
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

                    if ((this.distance > (this.radius + objects[j].radius))) {
                        this.velX += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.x) / this.distance; // F = M*A A = F/M
                        this.velY += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.y) / this.distance;
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
                        if(objects[j].type === 2){
                            this.temperature = objects[j].temperature/this.distance*10 + absoluteLowTemperature;
                            //console.log(this.temperature);
                        }
                    } else {
                        this.explode(this.distance, j);
                        break;
                    }

                    if(this.passedThrough === true){
                        this.explode(this.distance, j);
                        break;
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
            this.velX = (this.velX/this.mass + (objects[int].velX)/objects[int].mass)/2;
            this.velY = (this.velY/this.mass + (objects[int].velY)/objects[int].mass)/2;
            if(this.mass <= objects[int].mass){
                this.x = objects[int].x;
                this.y = objects[int].y;
                this.type = objects[int].type;
                this.color = objects[int].color;
                this.temperature = objects[int].temperature;
            }
        }else{
            this.velX = 0;
            this.velY = 0;
            if(this.mass <= objects[int].mass){
                this.x = objects[int].x;
                this.y = objects[int].y;
                this.type = objects[int].type;
                this.color = objects[int].color;
                this.temperature = objects[int].temperature;
            }
            this.affectedByGravity = false;
        }
        this.mass += objects[int].mass;
        this.radius = Math.sqrt(this.mass/(this.density*3.14));
        objects[int].inactive = true;
        objects.splice(int, 1);
        if(this.type === 0){
            this.regenerate();
        }
    };

    this.move = function(){
        if(this.affectedByGravity === false){
            this.velX = 0;
            this.velY = 0;
        }
        this.x += this.velX;
        this.y += this.velY;

        trails.push(new Trail(this.x - this.velX, this.y - this.velY, this.x, this.y, 'white'));

        this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
        this.cameraY = ((this.y - screenHalfHeight) * cameraZoom + screenHalfHeight);
        this.cameraRadius = Math.sqrt(this.mass/(this.density*3.14)) * cameraZoom;

    };

    this.regenerate = function(){
        if(this.mass < globalPlanetMass){
            this.points = [];
            this.pointAmount = 0;
            this.readyPoints = [0, 1, 2, 3];

            if(this.type === 0){
                for(var v = 0; v < this.pointAmount; v++){
                    this.readyPoints.push(Math.round(Math.random()*3));
                }
                this.readyPoints.sort(function(a, b){return a-b});
                for(var i = 0; i < this.readyPoints.length; i++){
                    if(this.readyPoints[i] === 0){
                        this.points.push([0, this.cameraRadius + Math.round(Math.random()*this.cameraRadius*0.5)-this.cameraRadius*0.5])
                    }else if(this.readyPoints[i] === 1){
                        this.points.push([this.cameraRadius + Math.round(Math.random()*this.cameraRadius*0.5)-this.cameraRadius*0.5, 0])
                    }else if(this.readyPoints[i] === 2){
                        this.points.push([this.cameraRadius*2, this.cameraRadius + Math.round(Math.random()*this.cameraRadius*0.5)-this.cameraRadius*0.5])
                    }else if(this.readyPoints[i] === 3){
                        this.points.push([this.cameraRadius + Math.round(Math.random()*this.cameraRadius*0.5)-this.cameraRadius*0.5, this.cameraRadius*2])
                    }
                }
            }
        }else{
            this.type = 1;
            this.color = 'white';
        }

    };

    if(this.type === 0){
        this.regenerate();
    }
}

function Trail(x1, y1, x2, y2, color){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.lifeTime = globalTrailLife;

    this.draw = function(){
        this.lifeTime--;

        this.cameraX1 = ((this.x1 - screenHalfWidth) * cameraZoom + screenHalfWidth);
        this.cameraY1 = ((this.y1 - screenHalfHeight) * cameraZoom + screenHalfHeight);
        this.cameraX2 = ((this.x2 - screenHalfWidth) * cameraZoom + screenHalfWidth);
        this.cameraY2 = ((this.y2 - screenHalfHeight) * cameraZoom + screenHalfHeight);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.cameraX1, this.cameraY1);
        ctx.lineTo(this.cameraX2, this.cameraY2);
        ctx.stroke();
    }
}

//objects.push(new Object(WIDTH/2, HEIGHT/2, 1000, 1, 2, false, 'yellow'));
objects.push(new Object(WIDTH/3, 40, 10, 1, 1, true, 'blue'));

function game(){

    gameClock++;

    window.onmousemove = logMouseMove;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    //SKY FILL
    if(PAUSED === false){
        for(var ticks = 0; ticks < simulationSpeed; ticks++){
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            //Cursor

            ctx.globalAlpha = 0.3;
            ctx.fillStyle = selectedPlanetProperties.color;
            ctx.beginPath();
            ctx.arc(mousePosX, mousePosY, Math.sqrt(selectedPlanetProperties.mass*massMultiplier/(selectedPlanetProperties.density*3.14)) * cameraZoom, 0, 2 * Math.PI);
            ctx.fill();

            ctx.globalAlpha = 0.5;

            for(var i = 0; i < trails.length; i++){
                if(trails[i].lifeTime > 0){
                    trails[i].draw();
                }else{
                    trails.splice(i, 1)
                }
            }

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
    }

    if(clickTimer === 0){
        objects.push(new Object(((mousePosX - screenHalfWidth) / cameraZoom + screenHalfWidth), ((mousePosY - screenHalfHeight) / cameraZoom + screenHalfHeight), selectedPlanetProperties.mass, selectedPlanetProperties.density, selectedPlanetProperties.type, true, selectedPlanetProperties.color));
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

    cameraZoom += delta/20;

    if(cameraZoom < 0.01){
        cameraZoom = 0.01;
    }
    if(cameraZoom > 5){
        cameraZoom = 5
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