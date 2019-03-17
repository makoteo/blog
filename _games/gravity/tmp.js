var versionCode = "Alpha 0.01";
var WIDTH = 1024;
var HEIGHT = 576;

var objects = [];
var trails = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var cameraZoom = 1;
var cameraX = 0;
var cameraY = 0;
var savedMouseX = 0;
var savedMouseY = 0;
var cameraXOffset = 0;
var cameraYOffset = 0;
var screenHalfWidth = WIDTH/2;
var screenHalfHeight = HEIGHT/2;

var cursorTool = true;

var massMultiplier = 10;
var G = 1;
var T = 100;
var mouseForce = 2;
var lineLength = 30;
var absoluteLowTemperature = -100;

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

var selectedPlanetProperties = {mass:5, density:1, color:'blue', type:0, materials:{rock:2, metals:2, ice:1}, affectedByGravity:true};

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, mass, density, type, gravityEffect, color, materials){
    this.lifeTimer = 0;
    this.x = x - cameraX/cameraZoom;
    this.y = y - cameraY/cameraZoom;
    this.mass = mass * massMultiplier;
    this.density = density;
    this.color = color;
    this.materials = materials;

    this.reflectiveMaterials = this.materials.rock/2 + this.materials.ice + this.materials.metals/2;
    this.reflectivity = this.reflectiveMaterials/this.mass;
    //Changeable Stuff

    this.temperature = 0;

    this.velX = 0;
    this.velY = 0;

    this.radius = Math.sqrt(this.mass/(this.density*3.14));

    this.type = type; // 0 = Meteorite, 1 = Planet, 2 = Star, 3 = Debris

    if(this.type === 2){
        this.temperature = this.mass;
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

    this.zoom = cameraZoom;

    if(this.gravityEffect === false){
        this.affectedByGravity = false;
    }

    this.draw = function(){
        if(this.inactive === false){
            if(this.type !== 0){
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius, 0, 2 * Math.PI);
                ctx.fill();
            }else{
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(this.points[0][0] + this.cameraX - this.cameraRadius + cameraX, this.points[0][1] + this.cameraY - this.cameraRadius + cameraY);
                for(var d = 1; d < this.points.length; d++){
                    //ctx.beginPath();
                    ctx.lineTo(this.points[d][0] + this.cameraX - this.cameraRadius + cameraX, this.points[d][1] + this.cameraY - this.cameraRadius + cameraY);
                    //ctx.stroke();

                }
                ctx.closePath();
                ctx.fill();
            }

            if(this.type === 2){
                ctx.fillStyle = 'yellow';
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*1.5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 0.05;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

        }
    };
    this.update = function(){
        this.lifeTimer++;
        if(this.type !== 2){
            this.temperature = 0;
        }else{
            this.temperature = this.mass;
        }

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
                    this.curvePoints.push([this.curvePoints[i-1][0] + this.curveVelX, this.curvePoints[i-1][1] + this.curveVelY]);
                    if(this.affectedByGravity === true){
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
                    }else{

                    }

                }
                if(this.lifeTimer > 1){
                    for(var d = 1; d < this.curvePoints.length; d++){
                        ctx.strokeStyle = 'white';
                        ctx.beginPath();
                        ctx.moveTo(((this.curvePoints[d-1][0] - screenHalfWidth) * cameraZoom + screenHalfWidth) + cameraX, ((this.curvePoints[d-1][1] - screenHalfHeight) * cameraZoom + screenHalfHeight) + cameraY);
                        ctx.lineTo(((this.curvePoints[d][0] - screenHalfWidth) * cameraZoom + screenHalfWidth) + cameraX, ((this.curvePoints[d][1] - screenHalfHeight) * cameraZoom + screenHalfHeight) + cameraY);
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
                        if(objects[j].type === 2 && gameClock % 20 === 0 && this.type !== 2){
                            this.temperature += Math.round(T*Math.pow(Math.pow(objects[j].radius,2)*Math.PI*objects[j].temperature*(1-this.reflectivity)/16*Math.PI,1/4)*(1/Math.sqrt(this.distance))) + absoluteLowTemperature;
                            console.log(this.temperature);
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

        if(this.type === 0 && this.zoom !== cameraZoom){
            this.regenerate();
        }
        //console.log(this.velX);
    };

    this.explode = function(distance, int){
        if(distance < 1){
            distance = 1;
        }
        if(objects[int].affectedByGravity === true) {
            this.velX = (this.velX*this.mass + objects[int].velX*objects[int].mass)/(this.mass + objects[int].mass);
            this.velY = (this.velY*this.mass + objects[int].velY*objects[int].mass)/(this.mass + objects[int].mass);
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
        if(this.type === 0){
            this.regenerate();
        }
        this.passedThrough = false;
        objects[int].inactive = true;
        objects.splice(int, 1);
    };

    this.move = function(){
        if(this.affectedByGravity === false){
            //this.velX = 0;
            //this.velY = 0;
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
                        this.points.push([0, this.cameraRadius + Math.round(Math.random()*this.cameraRadius)-this.cameraRadius*0.5])
                    }else if(this.readyPoints[i] === 1){
                        this.points.push([this.cameraRadius + Math.round(Math.random()*this.cameraRadius)-this.cameraRadius*0.5, 0])
                    }else if(this.readyPoints[i] === 2){
                        this.points.push([this.cameraRadius*2, this.cameraRadius + Math.round(Math.random()*this.cameraRadius)-this.cameraRadius*0.5])
                    }else if(this.readyPoints[i] === 3){
                        this.points.push([this.cameraRadius + Math.round(Math.random()*this.cameraRadius*0.5)-this.cameraRadius, this.cameraRadius*2])
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
        ctx.moveTo(this.cameraX1 + cameraX, this.cameraY1 + cameraY);
        ctx.lineTo(this.cameraX2 + cameraX, this.cameraY2 + cameraY);
        ctx.stroke();
    }
}

objects.push(new Object(WIDTH/2, HEIGHT/2, 1000, 1, 2, false, 'yellow', {rock:100, ice:0, metals:500}));
objects.push(new Object(WIDTH/3, 40, 10, 1, 1, true, 'blue', {rock:30, ice:0, metals:10}));

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
            if(cursorTool === false){
                if(selectedPlanetProperties.type === 0){

                }else{
                    ctx.fillStyle = selectedPlanetProperties.color;
                    ctx.beginPath();
                    ctx.arc(mousePosX, mousePosY, Math.sqrt(selectedPlanetProperties.mass*massMultiplier/(selectedPlanetProperties.density*3.14)) * cameraZoom, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }

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

    if(clickTimer === 0 && cursorTool === false){
        objects.push(new Object(((mousePosX - screenHalfWidth) / cameraZoom + screenHalfWidth), ((mousePosY - screenHalfHeight) / cameraZoom + screenHalfHeight), selectedPlanetProperties.mass, selectedPlanetProperties.density, selectedPlanetProperties.type, selectedPlanetProperties.affectedByGravity, selectedPlanetProperties.color, selectedPlanetProperties.materials));
    }else if(dragging === true &&  cursorTool === true){
        if(savedMouseX === 0){
            savedMouseX = mousePosX;
            savedMouseY = mousePosY;
        }


        cameraX = mousePosX - savedMouseX + cameraXOffset;
        cameraY = mousePosY - savedMouseY + cameraYOffset;
    }else if(clickTimer === 0 &&  cursorTool === true){
        for(var i = 0; i < objects.length; i++){

        }
    }else{
        cameraXOffset = cameraX;
        cameraYOffset = cameraY;
    }

    if(clickTimer < 1){
        clickTimer++;
    }

    //if(gameRunning === true) {

    if (keys && keys[49]) {
        selectedPlanetProperties.type = 0;
        selectedPlanetProperties.mass = 5;
        selectedPlanetProperties.color = 'white';
        cursorTool = false;
    }else if (keys && keys[50]) {
        selectedPlanetProperties.type = 1;
        selectedPlanetProperties.mass = 15;
        selectedPlanetProperties.color = 'blue';
        cursorTool = false;
    }else if (keys && keys[51]) {
        selectedPlanetProperties.type = 2;
        selectedPlanetProperties.mass = 500;
        selectedPlanetProperties.color = 'yellow';
        cursorTool = false;
    }else if (keys && keys[48]) {
        cursorTool = true;
    }

    //}
}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function Start(){
    //if(gameRunning === false){
    SCORE = 0;
    frameCount = 0;

    //document.getElementById("score").innerHTML = "" + SCORE;
    //document.getElementById("gamescore").innerHTML = "" + GAMESCORE;
    //document.getElementById("scorediv").removeAttribute("hidden");
    //document.getElementById("gamescorediv").removeAttribute("hidden");
    HIGHSCORE = localStorage.getItem("HighScoreBusiness");
    //gameRunning = true;
    // }
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
    e.preventDefault();
    var e = window.event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    cameraZoom += delta*cameraZoom/10;

    cameraX -= (mousePosX - screenHalfWidth)/10;
    cameraY -= (mousePosY - screenHalfHeight)/10;

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