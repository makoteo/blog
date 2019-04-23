//-----------------------------------------------------------------------------------------------------

//
// Copyright (c) Martin Feranec 2019 - All Rights Reserved
//

//-----------------------------------------------------------------------------------------------------

var versionCode = "Alpha 0.01";
var WIDTH = 1024;
var HEIGHT = 576;

var AREAWIDTH = WIDTH*10;
var AREAHEIGHT = HEIGHT*10;

var objects = [];
var trails = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var cameraZoom = 1;
var cameraX = 0;
var cameraY = 0;
var savedMouseX = 0;
var savedMouseY = 0;
var mouseonWindow = false;
var draggingWindow = false;
var draggingScreen = false;
var windowId = 0;

var pauseTimer = 0;

var cameraXOffset = 0;
var cameraYOffset = 0;
var screenHalfWidth = WIDTH/2;
var screenHalfHeight = HEIGHT/2;

var cursorTool = true;

var massMultiplier = 10;
var G = 0.5;
var T = 100;
var randomTempConstant = 1.2;
var mouseForce = 2;
var lineLength = 30;
var absoluteLowTemperature = -100;
var waterMeltTemperature = 550;
var starCreationLimit = 50000;
var globalDebrieLifetime = 2000;

var PAUSED = false;
var gameClock = 0;
var globalPlanetId = 0;
var globalTrails = true;

var mousePosX = 0;
var mousePosY = 0;

var clickTimer = 1;

var dragging = false;

var savedMouseX2 = 0;
var savedMouseY2 = 0;

var simulationSpeed = 1;

var globalTrailLife = 500;
var globalPlanetMass = 200;

var windowSelectedPlanet = 0;
var changeValue = "";

var selectedPlanetProperties = {mass:5, density:1, color:'blue', type:0, materials:{rock:60, metals:40, ice:0, gas:0}, affectedByGravity:true};

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, mass, density, type, gravityEffect, color, materials){
    this.lifeTimer = 0;
    this.x = x - cameraX/cameraZoom;
    this.y = y - cameraY/cameraZoom;

    this.mass = mass * massMultiplier;

    this.density = density;
    this.color = color;
    this.materials = materials;

    this.id = globalPlanetId;
    globalPlanetId++;

    this.name = "";

    this.type = type; // 0 = Meteorite, 1 = Planet, 2 = Star, 3 = Debris

    this.temperature = 0;
    this.planetTemperature = 0;

    if(this.type === 2 || this.mass > starCreationLimit){
        this.temperature = this.mass * randomTempConstant;
    }

    if(this.type === 2){
        this.materials.ice = 0;
        this.materials.gas = 100;
    }

    this.reflectiveMaterials = this.materials.rock/2 + this.materials.ice*0.9 + this.materials.metals/2 - this.materials.gas;
    this.gas = this.materials.gas;
    this.totalMaterials = this.materials.rock + this.materials.metals + this.materials.ice + this.materials.gas;
    this.reflectivity = this.reflectiveMaterials/this.totalMaterials;
    if(this.reflectivity > 1 || this.reflectivity < 0){
        this.reflectivity = 0.5;
    }

    //this.density = (this.materials.rock + this.materials.metals + this.materials.ice*0.8 + this.materials.gas*0.3)/(this.materials.rock + this.materials.metals + this.materials.ice + this.materials.gas);

    if(this.gas > 0.9*this.totalMaterials){
        this.color = "rgb(" + this.materials.gas*2 + "," + this.materials.gas*2 + "," + this.materials.ice*2.5 + ")";
    }else if(this.gas > 0.5*this.totalMaterials){
        this.color = "rgb(" + (this.materials.gas*1.2 + this.materials.metals*0.5 + this.materials.rock*0.3) + "," + (this.materials.gas*1  + this.materials.metals*0.6 + this.materials.rock*0.5) + "," + this.materials.ice*2.2 + ")";
    }else{
        this.color = "rgb(" + (this.materials.gas*0.5 + this.materials.metals*1.5 + this.materials.rock*0.2) + "," + (this.materials.gas*0.2 + this.materials.metals*0.8 + this.materials.rock*0.6) + "," + this.materials.ice*2 + ")";
    }
    //Changeable Stuff

    this.velX = 0;
    this.velY = 0;

    this.radius = Math.sqrt(this.mass/(this.density*3.14));

    this.gravityEffect = gravityEffect;

    this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
    this.cameraY = ((this.y - screenHalfWidth) * cameraZoom + screenHalfHeight);
    this.cameraRadius = this.radius * cameraZoom;

    this.tempX = 0;
    this.tempY = 0;
    this.distance = 0;

    this.inactive = false;
    if(gameClock !== 0){
        this.exists = false;
    }else{
        this.exists = true;
    }

    this.passedThrough = false;
    this.affectedByGravity = true;
    this.curvePoints = [[this.x, this.y]];
    this.curveVelX = 0;
    this.curveVelY = 0;

    this.points = [];
    this.pointAmount = 0;
    this.readyPoints = [0, 1, 2, 3];

    this.zoom = cameraZoom;

    this.infoWindowOpen = false;
    this.infoWindowX = 0;
    this.infoWindowY = 0;
    this.infoWindowWidth = WIDTH/5;
    this.infoWindowHeight = HEIGHT/2;

    this.gravityConstant = 1;

    if(this.type === 3){
        if(this.color === 'white'){
            this.gravityConstant = 0.01;
        }else{
            this.gravityConstant = 0.07;
        }
    }

    if(this.gravityEffect === false){
        this.affectedByGravity = false;
    }

    this.draw = function(){
        if(this.type === 3 && this.lifeTimer > 10){
            this.exists = true;
            this.affectedByGravity = true;
        }else if(this.type === 3){
            this.regenerate();
        }
        if(this.inactive === false && this.lifeTimer > 1){

            ctx.fillStyle = this.color;

            if(this.infoWindowOpen === true){
                ctx.strokeStyle = 'red';
                ctx.beginPath();
                ctx.moveTo(this.cameraX + cameraX, this.cameraY + cameraY);
                ctx.lineTo(this.cameraX + cameraX + this.velX*4*cameraZoom, this.cameraY + cameraY + this.velY*4*cameraZoom);
                ctx.stroke();
            }

            if(this.name !== ""){
                ctx.textAlign = 'center';
                ctx.fillStyle = 'white';
                ctx.font = 30 + 'px Arial';
                ctx.fillText(this.name, this.cameraX + cameraX, this.cameraY + cameraY - this.cameraRadius - WIDTH/40*cameraZoom);
            }

            if(this.type === 1 || this.type === 2){
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius, 0, 2 * Math.PI);
                ctx.fill();
            }/*else if(this.type === 3){
                if(this.materials.ice > 75 && this.mass < 50) {
                    ctx.fillStyle = 'white';
                }else{
                    ctx.fillStyle = 'yellow';
                }
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius, 0, 2 * Math.PI);
                ctx.fill();
            }*/

            if(this.type === 0 || this.type === 3){
                if((this.materials.ice > 75 && this.mass < 50) || this.type === 0) {
                    ctx.fillStyle = 'white';
                }else{
                    ctx.fillStyle = 'yellow';
                }
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
                ctx.globalAlpha = 0.05;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*1.5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 0.04;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            if(this.type === 3){
                ctx.fillStyle = 'yellow';
                ctx.globalAlpha = 0.05;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*1.5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 0.04;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

        }
    };
    this.drawInfoWindow = function(){
        if(this.infoWindowOpen === true){
            if(this.infoWindowX === 0 && draggingWindow === false){
                if(this.cameraX + cameraX + this.cameraRadius < WIDTH - this.infoWindowWidth*1.2){
                    this.infoWindowX = this.cameraX + cameraX;
                }else{
                    this.infoWindowX = this.cameraX + cameraX;
                }

                this.infoWindowY = this.cameraY + cameraY - this.infoWindowHeight/2;

            }
            ctx.fillStyle = 'rgb(10, 10, 10)';
            ctx.globalAlpha = 0.4;
            ctx.fillRect(this.infoWindowX, this.infoWindowY, this.infoWindowWidth, this.infoWindowHeight);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'gray';
            ctx.strokeRect(this.infoWindowX, this.infoWindowY, this.infoWindowWidth, this.infoWindowHeight);
            ctx.textAlign = 'left';
            ctx.fillStyle = 'white';
            ctx.font = WIDTH/80 + 'px Arial';
            ctx.fillText("Name: " + this.name, this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25);
            ctx.fillText("Type: " + this.type, this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30);
            ctx.fillText("Id: " + this.id, this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*2);

            ctx.fillText("Mass: " + Math.round(this.mass), this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*3.5);
            ctx.fillText("Density: " + Math.round(this.density), this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*4.5);
            ctx.fillText("Radius: " + Math.round(this.radius)*1000, this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*5.5);
            ctx.fillText("Temperature: " + Math.round(this.temperature + this.planetTemperature), this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*6.5);

            ctx.fillText("Delta X: " + Math.round(this.velX*10000)/10000, this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*8);
            ctx.fillText("Delta Y: " + Math.round(this.velY*10000)/10000, this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*9);

            ctx.fillText("Metal: " + Math.round(this.materials.metals) + "%", this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*10.5);
            ctx.fillText("Rock: " + Math.round(this.materials.rock) + "%", this.infoWindowX + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*11.5);
            ctx.fillText("Ice: " + Math.round(this.materials.ice) + "%", this.infoWindowX + this.infoWindowWidth/2 + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*10.5);
            ctx.fillText("Gas: " + Math.round(this.materials.gas) + "%", this.infoWindowX + this.infoWindowWidth/2 + WIDTH/50, this.infoWindowY + HEIGHT/25 + HEIGHT/30*11.5);

            ctx.font = WIDTH/80 + 'px Arial';
            ctx.fillText('\u270e', this.infoWindowX + this.infoWindowWidth*0.01, this.infoWindowY + HEIGHT/25);
            ctx.fillText('\u270e', this.infoWindowX + this.infoWindowWidth*0.01, this.infoWindowY + HEIGHT/25 + HEIGHT/30*3.5);
            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth*0.01, this.infoWindowY + HEIGHT/25 + HEIGHT/30*6.5);
            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth*0.01, this.infoWindowY + HEIGHT/25 + HEIGHT/30*8);
            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth*0.01, this.infoWindowY + HEIGHT/25 + HEIGHT/30*9);

            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth*0.01, this.infoWindowY + HEIGHT/25 + HEIGHT/30*10.5);
            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth*0.01, this.infoWindowY + HEIGHT/25 + HEIGHT/30*11.5);

            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth*0.01 + this.infoWindowWidth/2, this.infoWindowY + HEIGHT/25 + HEIGHT/30*10.5);
            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth*0.01 + this.infoWindowWidth/2, this.infoWindowY + HEIGHT/25 + HEIGHT/30*11.5);

            ctx.fillText("X", this.infoWindowX + this.infoWindowWidth*0.9, this.infoWindowY + HEIGHT/25);

            if(clickTimer === 0){
                if(mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT/50 && mousePosX < this.infoWindowX + this.infoWindowWidth*0.05 && mousePosY < this.infoWindowY + HEIGHT/50*2){
                    modal.style.display = "block";
                    for(var i = 0; i < objects.length; i++){
                        if(objects[i] === this){
                            windowSelectedPlanet = i;
                            input.value = this.name;
                            changeValue = "Name";
                        }
                    }
                    PAUSED = true;
                }else if(mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT/50 + HEIGHT/30*3.5 && mousePosX < this.infoWindowX + this.infoWindowWidth*0.05 && mousePosY < this.infoWindowY + HEIGHT/50*2 + HEIGHT/30*3.5){
                    modal.style.display = "block";
                    for(var i = 0; i < objects.length; i++){
                        if(objects[i] === this){
                            windowSelectedPlanet = i;
                            input.value = this.mass;
                            changeValue = "Mass"
                        }
                    }
                    PAUSED = true;
                }else if(mousePosX > this.infoWindowX + this.infoWindowWidth*0.9 && mousePosY > this.infoWindowY + HEIGHT/50 && mousePosX < this.infoWindowX + this.infoWindowWidth && mousePosY < this.infoWindowY + HEIGHT/50*2){
                    this.infoWindowOpen = false;
                    this.infoWindowX = 0;
                    this.infoWindowY = 0;
                }
            }
        }
    };
    this.update = function(){

        if(this.type === 2){
            this.materials.ice = 0;
            this.materials.rock = 0;
            this.materials.metals = 0;
            this.materials.gas = 100;
        }


        this.lifeTimer++;

        if(this.type !== 3){
            this.gravityConstant = 1;
        }else{

        }

        if(this.type !== 2){
            if(gameClock % 10 === 0 && PAUSED === false){
                this.temperature = 0;
            }
        }

        if(this.mass > starCreationLimit){
            if(this.type !== 2){
                this.type = 2;
                this.explode(1, 0.5);
                this.materials.gas = 100;
                this.materials.rock = 0;
                this.materials.metals = 0;
                this.materials.ice = 0;
                this.color = 'yellow';
                this.temperature = 1000;
            }
        }

        if(this.type === 1){
            if(gameClock % 10 === 0){
                if(this.gas > 0.9*this.totalMaterials){
                    this.color = "rgb(" + this.materials.gas*2 + "," + this.materials.gas*1.5 + "," + this.materials.ice*2.5 + ")";
                }else if(this.gas > 0.5*this.totalMaterials){
                    this.color = "rgb(" + (this.materials.metals*0.5 + this.materials.rock*0.6 + this.materials.ice*0.5 + this.materials.gas*0.4 + (this.temperature + this.planetTemperature + 100)/6) + "," + (this.materials.metals*0.6 + this.materials.rock*0.8 + this.materials.gas*0.2 + this.materials.ice*0.5 +(this.temperature + this.planetTemperature + 100)/12) + "," + (this.materials.ice*1.5 + this.materials.rock*0.9) + ")";
                }else{
                    this.color = "rgb(" + (this.materials.metals*1.5 + this.materials.rock*0.8 + this.materials.ice*0.5 +(this.temperature + this.planetTemperature + 100)/6) + "," + (this.materials.metals*0.8 + this.materials.rock*1 + this.materials.ice*0.5 +(this.temperature + this.planetTemperature + 100)/12) + "," + (this.materials.ice*1.7 + this.materials.rock*1) + ")";
                }
            }
        }

        if(this.exists === false && this.type !== 3){
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

        if(this.inactive === false && this.affectedByGravity === true && (this.exists === true || (this.type === 3)) && PAUSED === false) {
            for (var j = 0; j < objects.length; j++) {
                if (objects[j] !== this && this.inactive === false && objects[j].exists === true && this.passedThrough === false && objects[j].type !== 3) {
                    this.tempX = objects[j].x;
                    this.tempY = objects[j].y;

                    this.distance = Math.sqrt((this.x - this.tempX) * (this.x - this.tempX) + (this.y - this.tempY) * (this.y - this.tempY)); //This is the actual Distance

                    if ((this.distance > (this.radius + objects[j].radius))) {
                        this.velX += this.gravityConstant*(G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.x) / this.distance; // F = M*A A = F/M
                        this.velY += this.gravityConstant*(G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.y) / this.distance;

                        if((this.gravityConstant*(G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.x) / this.distance) > 1){
                            this.explode(1, 0.5);
                        }

                        if(this.distance < objects[j].radius*2 + Math.sqrt((this.velX)*(this.velX) + (this.velY)*(this.velY))*2){
                            if(Math.sqrt((this.velX)*(this.velX) + (this.velY)*(this.velY)) > objects[j].radius*2){
                                var segments = Math.ceil(Math.sqrt((this.velX)*(this.velX) + (this.velY)*(this.velY))/objects[j].radius*2);
                                for(var s = 0; s < segments; s++){
                                    if(Math.sqrt((this.x + this.velX/segments*s - this.tempX) * (this.x + this.velX/segments*s - this.tempX) +
                                            (this.y + this.velY/segments*s - this.tempY) * (this.y + this.velY/segments*s - this.tempY)) < this.radius*2 + objects[j].radius){
                                        if(!(this.type === 3 && objects[j].type === 3)) {
                                            this.passedThrough = true;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        if((objects[j].type === 2 || objects[j].type.temperature > 1000) && this.type !== 2 && this.type !== 3 && gameClock % 10 === 0){
                            this.temperature += Math.round(T*Math.pow(Math.pow(objects[j].radius,2)*Math.PI*objects[j].temperature*(1-this.reflectivity)/16*Math.PI,1/4)*(1/Math.sqrt(this.distance))) + absoluteLowTemperature;
                            //console.log(this.temperature);
                        }else{
                            if(this.type === 2 || this.mass > starCreationLimit){
                                this.temperature = this.mass * randomTempConstant;
                            }

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
                if(objects[j] === this){
                    this.id = j;
                }
            }
        }

        if((this.type === 0 || this.type === 3) && this.zoom !== cameraZoom){
            this.regenerate();
            this.zoom = cameraZoom;
        }

        if(this.temperature > waterMeltTemperature && this.type !== 2 && this.type !== 3){
            this.explode(1, 0.5);
        }

        this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
        this.cameraY = ((this.y - screenHalfHeight) * cameraZoom + screenHalfHeight);
        this.cameraRadius = Math.sqrt(this.mass/(this.density*3.14)) * cameraZoom;

        if(this.planetTemperature > 0 && PAUSED === false){
            this.planetTemperature--;
        }
        //console.log(this.velX);
    };

    this.explode = function(distance, int){
        this.spawnX = 0;
        this.spawnY = 0;
        this.random = 0;
        if(int !== 0.5){
            if(distance < 1){
                distance = 1;
            }
            if(this.type !== 3 && objects[int].type !== 3){
                if(this.mass < objects[int].mass){
                    this.random = Math.round(this.mass/massMultiplier/5);
                }else{
                    this.random = Math.round(objects[int].mass/massMultiplier/5);
                }
                if(this.random > 50){
                    this.random = 50;
                }
                if(this.mass <= objects[int].mass){
                    for(var i =0; i < this.random; i++){
                        this.spawnX = Math.random()*this.radius - this.radius/2;
                        this.spawnY = Math.random()*this.radius - this.radius/2;
                        objects.push(new Object(this.x + this.spawnX + this.velX + cameraX/cameraZoom, this.y + this.spawnY + this.velY + cameraY/cameraZoom, 5, 1, 3, false, 'yellow', {metals:this.materials.metals, ice:this.materials.ice, rock:this.materials.rock, gas:this.materials.gas}));
                        objects[objects.length - 1].velX = this.velX/4*Math.random() - this.velX/8;
                        objects[objects.length - 1].velY = this.velY/4*Math.random() - this.velY/8;
                    }
                }else{
                    for(var i =0; i < this.random; i++) {
                        this.spawnX = Math.random()*objects[int].radius - objects[int].radius/2;
                        this.spawnY = Math.random()*objects[int].radius - objects[int].radius/2;
                        objects.push(new Object(objects[int].x + this.spawnX + objects[int].velX + cameraX / cameraZoom, objects[int].y + this.spawnY + objects[int].velY + cameraY / cameraZoom, 5, 1, 3, false, 'yellow', {metals:this.materials.metals, ice:this.materials.ice, rock:this.materials.rock, gas:this.materials.gas}));
                        objects[objects.length - 1].velX = objects[int].velX/4*Math.random() - objects[int].velX/8;
                        objects[objects.length - 1].velY = objects[int].velY/4*Math.random() - objects[int].velX/8;
                    }
                }
            }else{

            }

            if(this.mass < objects[int].mass){
                objects[int].mass += this.mass/2;
            }else{
                this.mass+=objects[int].mass/2;
                //console.log(this.mass + " " + objects[int].mass);
            }

            this.materials.ice = (this.mass*this.materials.ice + objects[int].mass*objects[int].materials.ice)/(this.mass+objects[int].mass);
            this.materials.rock = (this.mass*this.materials.rock + objects[int].mass*objects[int].materials.rock)/(this.mass+objects[int].mass);
            this.materials.metals = (this.mass*this.materials.metals + objects[int].mass*objects[int].materials.metals)/(this.mass+objects[int].mass);
            this.materials.gas = (this.mass*this.materials.gas + objects[int].mass*objects[int].materials.gas)/(this.mass+objects[int].mass);

            if(objects[int].affectedByGravity === true) {
                if(!(objects[int].type === 3 || this.type === 3)){
                    this.velX = (this.velX*this.mass + objects[int].velX*objects[int].mass)/(this.mass + objects[int].mass);
                    this.velY = (this.velY*this.mass + objects[int].velY*objects[int].mass)/(this.mass + objects[int].mass);
                }else if(this.type === 3){
                    this.velX = objects[int].velX;
                    this.velY = objects[int].velY;
                }else if(objects[i].type === 3){

                }
                if(this.mass <= objects[int].mass){
                    this.mass = objects[int].mass;
                    if(this.affectedByGravity === false){
                        objects[int].x = this.x;
                        objects[int].y = this.y;
                    }else{
                        this.x = objects[int].x;
                        this.y = objects[int].y;
                    }
                    this.name = objects[int].name;
                    this.type = objects[int].type;
                    this.infoWindowOpen = objects[int].infoWindowOpen;
                    this.infoWindowX  = objects[int].infoWindowX;
                    this.infoWindowY  = objects[int].infoWindowY;
                    this.temperature = objects[int].temperature;
                    this.planetTemperature = objects[int].planetTemperature;
                    this.gravityConstant = 1;
                    this.color = objects[int].color;
                }else{

                }
            }else{
                this.velX = 0;
                this.velY = 0;
                if(this.mass <= objects[int].mass){
                    this.mass = objects[int].mass;
                    this.name = objects[int].name;
                    this.type = objects[int].type;
                    this.infoWindowOpen = objects[int].infoWindowOpen;
                    this.infoWindowX  = objects[int].infoWindowX;
                    this.infoWindowY  = objects[int].infoWindowY;
                    this.temperature = objects[int].temperature;
                    this.planetTemperature = objects[int].planetTemperature;
                    this.gravityConstant = 1;
                    this.color = objects[int].color;
                }else{

                }
                if(this.affectedByGravity === true){
                    this.x = objects[int].x;
                    this.y = objects[int].y;
                }
                this.affectedByGravity = false;
            }

            this.radius = Math.sqrt(this.mass/(this.density*3.14));
            if(this.type === 0 || this.type === 3){
                this.regenerate();
            }

            this.planetTemperature += 30;

            this.passedThrough = false;
            objects[int].inactive = true;
            objects.splice(int, 1);

        }else{
            if(distance < 1){
                distance = 1;
            }

            if(this.type !== 3){

                this.random = Math.round(this.mass/massMultiplier/10);

                if(this.random > 50){
                    this.random = 50;
                }
                for(var i = 0; i < this.random; i++){
                    this.spawnX = Math.random()*this.radius - this.radius/2;
                    this.spawnY = Math.random()*this.radius - this.radius/2;
                    if(this.materials.ice >= 50){
                        objects.push(new Object(this.x + this.spawnX + this.velX + cameraX/cameraZoom, this.y + this.spawnY + this.velY + cameraY/cameraZoom, 1, 1, 3, false, 'blue', {ice:90, metals:0, rock:0, gas: 10}));
                        objects[objects.length - 1].velX = this.velX/10*Math.random();
                        objects[objects.length - 1].velY = this.velY/10*Math.random();
                    }else{
                        if(this.mass <= 50){

                        }else{
                            objects.push(new Object(this.x + this.spawnX + this.velX + cameraX/cameraZoom, this.y + this.spawnY + this.velY + cameraY/cameraZoom, 1, 1, 3, false, 'yellow', {ice:0, metals:0, rock:20, gas: 80}));
                            objects[objects.length - 1].velX = this.velX/2*Math.random();
                            objects[objects.length - 1].velY = this.velY/2*Math.random();
                        }
                    }
                }
                if(this.materials.ice / this.totalMaterials >= 0.5){
                    this.mass -= 1;
                }else{
                    this.mass -= 3*this.random;
                }
            }else{

            }

            this.density = (this.materials.rock + this.materials.metals + this.materials.ice*0.8 + this.materials.gas*0.3)/(this.materials.rock + this.materials.metals + this.materials.ice + this.materials.gas);
            this.radius = Math.sqrt(this.mass/(this.density*3.14));
            if(this.type === 0 || this.type === 3){
                this.regenerate();
            }
            this.passedThrough = false;
        }

    };

    this.move = function(){
        if(this.affectedByGravity === false && this.type !== 3){
            //this.velX = 0;
            //this.velY = 0;
        }else if(this.type === 3){

        }
        this.x += this.velX;
        this.y += this.velY;

        if(globalTrails === true){
            if(this.type !== 3){
                trails.push(new Trail(this.x - this.velX, this.y - this.velY, this.x, this.y, 'white'));
            }
        }

    };

    this.regenerate = function(){
        if(this.mass < globalPlanetMass){
            this.points = [];
            this.pointAmount = 0;
            this.readyPoints = [0, 1, 2, 3];

            if(this.type === 0 || this.type === 3){
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

    if(this.type === 0 || this.type === 3){
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
        if(PAUSED === false){
            this.lifeTime--;
        }

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

objects.push(new Object(WIDTH/2, HEIGHT/2, 2000, 1, 2, false, 'yellow', {rock:0, metals:0, ice:0, gas:100}));
objects.push(new Object(WIDTH/3, 40, 10, 1, 1, true, 'blue', {rock:60, metals:40, ice:0, gas:0}));

function game(){

    if(PAUSED === false){
        gameClock++;
    }

    window.onmousemove = logMouseMove;

    if(clickTimer === 0 && cursorTool === false){
        draggingWindow = false;
        objects.push(new Object(((mousePosX - screenHalfWidth) / cameraZoom + screenHalfWidth), ((mousePosY - screenHalfHeight) / cameraZoom + screenHalfHeight), selectedPlanetProperties.mass, selectedPlanetProperties.density, selectedPlanetProperties.type, selectedPlanetProperties.affectedByGravity, selectedPlanetProperties.color, {ice:selectedPlanetProperties.materials.ice, gas:selectedPlanetProperties.materials.gas, metals:selectedPlanetProperties.materials.metals, rock:selectedPlanetProperties.materials.rock}));
    }else if(clickTimer === 0 && cursorTool === true){
        for(var i = 0; i < objects.length; i++){
            if(objects[i].type !== 3){
                if(objects[i].infoWindowOpen === true){
                    if(mousePosX > objects[i].infoWindowX && mousePosX < objects[i].infoWindowX + objects[i].infoWindowWidth){
                        if(mousePosY > objects[i].infoWindowY && mousePosY < objects[i].infoWindowY + objects[i].infoWindowHeight){

                        }else{

                        }
                    }else{

                    }
                }
                if(objects[i].cameraX + cameraX - objects[i].cameraRadius - WIDTH/50 < mousePosX && objects[i].cameraX + cameraX + objects[i].cameraRadius + WIDTH/50 > mousePosX){
                    if(objects[i].cameraY + cameraY - objects[i].cameraRadius - WIDTH/50 < mousePosY && objects[i].cameraY + cameraY + objects[i].cameraRadius + WIDTH/50 > mousePosY){
                        objects[i].infoWindowOpen = true;
                        objects[i].infoWindowX = 0;
                        objects[i].infoWindowY = 0;
                        break;
                    }
                }
            }
        }
    }else if(dragging === true &&  cursorTool === true){
        mouseonWindow = false;
        if(windowId === 0.1){
            for(var i = 0; i < objects.length; i++){
                if(objects[i].type !== 3){
                    if(objects[i].infoWindowOpen === true){
                        if(mousePosX > objects[i].infoWindowX && mousePosX < objects[i].infoWindowX + objects[i].infoWindowWidth){
                            if(mousePosY > objects[i].infoWindowY && mousePosY < objects[i].infoWindowY + objects[i].infoWindowHeight){
                                mouseonWindow = true;
                                windowId = i;
                                draggingWindow = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if((mouseonWindow === true || draggingWindow === true) && draggingScreen === false && windowId !== 0.1){
            if(windowId < objects.length){
                if(savedMouseX2 === 0){
                    savedMouseX2 = objects[windowId].infoWindowX - mousePosX;
                    savedMouseY2 = objects[windowId].infoWindowY - mousePosY;
                }
                if(mousePosX + savedMouseX2 + objects[windowId].infoWindowWidth < WIDTH){
                    if(mousePosX + savedMouseX2 > 0){
                        objects[windowId].infoWindowX = mousePosX + savedMouseX2;
                    }else{
                        objects[windowId].infoWindowX = 1;
                    }
                }else{
                    objects[windowId].infoWindowX = WIDTH - objects[windowId].infoWindowWidth;
                }

                if(mousePosY + savedMouseY2 + objects[windowId].infoWindowHeight < HEIGHT){
                    if(mousePosY + savedMouseY2 > 0){
                        objects[windowId].infoWindowY = mousePosY + savedMouseY2;
                    }else{
                        objects[windowId].infoWindowY = 1;
                    }
                }else{
                    objects[windowId].infoWindowY = HEIGHT - objects[windowId].infoWindowHeight;
                }
            }
        }else{
            savedMouseX2 = 0;
            savedMouseY2 = 0;
            if(savedMouseX === 0){
                savedMouseX = mousePosX;
                savedMouseY = mousePosY;
            }

            cameraX = mousePosX - savedMouseX + cameraXOffset;
            cameraY = mousePosY - savedMouseY + cameraYOffset;

            AREAWIDTH = WIDTH/2/0.01;
            AREAHEIGHT = HEIGHT/2/0.01;

            draggingScreen = true;
        }

    }else{
        cameraXOffset = cameraX;
        cameraYOffset = cameraY;
        windowId = 0.1;
        draggingWindow = false;
        draggingScreen = false;
        savedMouseX2 = 0;
        savedMouseY2 = 0;
    }


    //SKY FILL
    //if(PAUSED === false){
        for(var ticks = 0; ticks < simulationSpeed; ticks++){

            if((cameraX)/cameraZoom - WIDTH/2/cameraZoom < -AREAWIDTH){
                cameraX = (WIDTH/2/cameraZoom - AREAWIDTH) * cameraZoom;
            }else if((cameraX)/cameraZoom + WIDTH/2/cameraZoom > AREAWIDTH){
                cameraX = (-WIDTH/2/cameraZoom + AREAWIDTH) * cameraZoom;
            }

            if((cameraY)/cameraZoom - HEIGHT/2/cameraZoom < -AREAHEIGHT){
                cameraY = (HEIGHT/2/cameraZoom - AREAHEIGHT) * cameraZoom;
            }else if((cameraY)/cameraZoom + HEIGHT/2/cameraZoom > AREAHEIGHT){
                cameraY = (-HEIGHT/2/cameraZoom + AREAHEIGHT) * cameraZoom;
            }

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            //Buttons?



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
                    if(objects[i].x < -AREAWIDTH || objects[i].x > AREAWIDTH || objects[i].y < -AREAHEIGHT || objects[i].y > AREAHEIGHT){
                        objects.splice(i, 1);
                    }else{
                        if(objects[i].type === 3){
                            if(objects[i].lifeTimer > globalDebrieLifetime){
                                objects.splice(i, 1);
                            }else{
                                objects[i].update();
                            }
                        }else{
                            objects[i].update();
                        }
                    }
                }
            }

            if(PAUSED === false){
                for(var i = 0; i < objects.length; i++){
                    if(objects[i].inactive === false){
                        objects[i].move();
                    }
                }
            }

        }

    for(var i = 0; i < objects.length; i++){
        if(objects[i].inactive === false){
            objects[i].draw();
        }
    }

    for(var i = 0; i < objects.length; i++){
        if(objects[i].inactive === false){
            objects[i].drawInfoWindow();
        }
    }
    //}

    if(clickTimer < 1){
        clickTimer++;
    }
    //if(gameRunning === true) {

    if(pauseTimer > 0){
        pauseTimer--;
    }

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
    }else if ((keys && keys[32])) {
        if(pauseTimer === 0 && modal.style.display !== "block"){
            PAUSED = !PAUSED;
        }
        pauseTimer = 2;
    }

    //}
}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function setMaterials(x, y, z, u){
    selectedPlanetProperties.materials.metals = x;
    selectedPlanetProperties.materials.rock = y;
    selectedPlanetProperties.materials.ice = z;
    selectedPlanetProperties.materials.gas = u;
}

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

    if(cameraZoom < 0.01){
        cameraZoom = 0.01;
    }
    if(cameraZoom > 5){
        cameraZoom = 5
    }

    if(delta < 0){
        cameraX += (mousePosX - screenHalfWidth - cameraX)/30;
        cameraY += (mousePosY - screenHalfHeight - cameraY)/30;
    }else{
        cameraX -= (mousePosX - screenHalfWidth - cameraX)/30;
        cameraY -= (mousePosY - screenHalfHeight - cameraY)/30;
    }

    AREAWIDTH = WIDTH/2/0.01;
    AREAHEIGHT = HEIGHT/2/0.01;
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

var modal = document.getElementById('myModal');

var input = document.getElementById('boxValueChange');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    if(changeValue === "Name"){
        objects[windowSelectedPlanet].name = input.value;
    }else if(changeValue === "Mass"){
        objects[windowSelectedPlanet].mass = input.value;
    }

    input.value = "";
    PAUSED = false;

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        if(changeValue === "Name"){
            objects[windowSelectedPlanet].name = input.value;
        }else if(changeValue === "Mass"){
            objects[windowSelectedPlanet].mass = parseInt(input.value);
            console.log(objects[windowSelectedPlanet].mass);
        }
        input.value = "";
        PAUSED = false;
    }
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