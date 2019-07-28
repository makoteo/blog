//-----------------------------------------------------------------------------------------------------

//
// Copyright (c) Martin Feranec 2019 - All Rights Reserved
//

//-----------------------------------------------------------------------------------------------------

var versionCode = "Alpha 0.02";
var WIDTH = 1280; //1024x576
var HEIGHT = 720;

var AREAWIDTH = WIDTH*10;
var AREAHEIGHT = HEIGHT*10;

var objects = [];
var trails = [];
var buttonsPlanets = [];

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
var onlyStarsAffectGravity = false;
var savedStarsAffectGravity = false;
var collisions = true;
var debrietrails = true;

var PAUSED = false;
var gameClock = 0;
var globalPlanetId = 0;
var globalTrails = true;

var mousePosX = 0;
var mousePosY = 0;

var clickTimer = 1;

var dragging = false;
var clickingButton = false;

var autoOrbit = false;
var orbitalDirection = -1;

var savedMouseX2 = 0;
var savedMouseY2 = 0;

var simulationSpeed = 1;

var globalTrailLife = 500;
var globalTrailSmoothness = 5;
var globalPlanetMass = 200;

var windowSelectedPlanet = 0;
var changeValue = "";

var selectedPlanetButtonNum = 0;
var planetButtons = 0;

var mouseClickNoTimer = 0;

var globalButtonXOffset = 0;
var planetSelected = 0;

var sunAmount = 0;
var savedSunAmount = 0;

var img = new Image();
img.src = "IconsGravity.png";

var modal = document.getElementById('myModal');

var input = document.getElementById('boxValueChange');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, mass, density, type, gravityEffect, color, materials){
    this.lifeTimer = 0;
    this.x = x - cameraX/cameraZoom;
    this.y = y - cameraY/cameraZoom;

    this.mass = mass * massMultiplier;

    this.density = density;
    this.color = color;
    this.materials = materials;

    this.type = type; // 0 = Meteorite, 1 = Planet, 2 = Star, 3 = Debris

    if(this.type !== 3){
        this.id = globalPlanetId;
        globalPlanetId++;
    }else{
        this.id = -1;
    }

    this.arrayid = 0;

    this.name = "";

    this.following = false;

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

    if(this.materials.gas > 0.9*this.totalMaterials){
        this.color = "rgb(" + this.materials.gas*2 + "," + this.materials.gas*2 + "," + (this.materials.ice*2.5) + ")";
    }else if(this.materials.gas > 0.5*this.totalMaterials){
        this.color = "rgb(" + (this.materials.gas*1.2 + this.materials.metals*0.5 + this.materials.rock*0.3) + "," + (this.materials.gas*1  + this.materials.metals*0.6 + this.materials.rock*0.5) + "," + this.materials.ice*2.2 + ")";
    }else{
        this.color = "rgb(" + (this.materials.gas*0.5 + this.materials.metals*1.5 + this.materials.rock*0.2) + "," + (this.materials.gas*0.2 + this.materials.metals*0.8 + this.materials.rock*0.6) + "," + this.materials.ice*2 + ")";
    }
    //Changeable Stuff

    this.velX = 0;
    this.velY = 0;

    this.density = (this.materials.rock + this.materials.metals + this.materials.ice*0.8 + this.materials.gas*0.3)/(this.materials.rock + this.materials.metals + this.materials.ice + this.materials.gas);
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
    this.infoWindowHeight = HEIGHT/2 * 1.2;

    this.gravityConstant = 1;

    this.randomNumBcWhyNot = Math.random()+1;

    this.gravityAffectsList = [];

    if(this.type === 3){
        if(this.color === 'white'){
            this.gravityConstant = 0.02*G;
        }else{
            this.gravityConstant = 0.14*G;
        }
    }

    if(this.gravityEffect === false){
        this.affectedByGravity = false;
    }

    this.biggestGravAttraction = 0;
    this.greatestAttractor = 0;

    this.draw = function(){

        this.cameraX = ((this.x - screenHalfWidth) * cameraZoom + screenHalfWidth);
        this.cameraY = ((this.y - screenHalfHeight) * cameraZoom + screenHalfHeight);
        this.cameraRadius = Math.sqrt(this.mass/(this.density*3.14)) * cameraZoom;

        if((this.type === 0 || this.type === 3) && this.zoom !== cameraZoom){
            this.regenerate();
            this.zoom = cameraZoom;
        }

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
                this.gradient = ctx.createRadialGradient(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius/2, this.cameraX + cameraX, this.cameraY + cameraY,  this.cameraRadius*20);
                this.gradient.addColorStop(0, "rgba(200, 200, 70)");
                this.gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = this.gradient;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            if(this.type === 3){
                if(this.lifeTimer > 5){
                    //console.log(this.arrayid);
                    this.gradient = ctx.createRadialGradient(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius/2, this.cameraX + cameraX, this.cameraY + cameraY,  this.cameraRadius*5*Math.round(this.randomNumBcWhyNot));
                    this.gradient.addColorStop(0, "yellow");
                    this.gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.fillStyle = this.gradient;
                    ctx.globalAlpha = 0.1;
                    ctx.beginPath();
                    ctx.arc(this.cameraX + cameraX, this.cameraY + cameraY, this.cameraRadius*5*this.randomNumBcWhyNot, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }

            }

        }
    };
    this.drawInfoWindow = function(){
        if(this.infoWindowOpen === true) {
            if (this.infoWindowX === 0 && draggingWindow === false) {
                if (this.cameraX + cameraX + this.cameraRadius < WIDTH - this.infoWindowWidth * 1.2) {
                    this.infoWindowX = this.cameraX + cameraX + this.radius*1.2;
                } else {
                    this.infoWindowX = this.cameraX + cameraX;
                }

                this.infoWindowY = this.cameraY + cameraY - this.infoWindowHeight / 2;

            }
            ctx.textAlign = 'left';
            ctx.fillStyle = 'white';
            ctx.font = WIDTH / 80 + 'px Arial';
            ctx.fillText("Name: " + this.name, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25);
            ctx.fillText("Type: " + this.type, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30);
            ctx.fillText("Id: " + this.id, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 2);
            if(this.affectedByGravity === false){
                ctx.fillText("Affected by: " + "Nothing", this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 3);
            }else if(this.gravityAffectsList.length === 0){
                ctx.fillText("Affected by: " + "All planets", this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 3);
            }else{
                ctx.fillText("Affected by: " + this.gravityAffectsList, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 3);
            }

            //Changed here
            ctx.fillText("Mass: " + Math.round(this.mass), this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 4.5);
            ctx.fillText("Density: " + Math.round(this.density*1000)/1000, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 5.5);
            ctx.fillText("Radius: " + Math.round(this.radius) * 1000, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 6.5);
            ctx.fillText("Temperature: " + Math.round(this.temperature + this.planetTemperature), this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 7.5);

            ctx.fillText("Delta X: " + Math.round(this.velX * 10000) / 10000, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 9);
            ctx.fillText("Delta Y: " + Math.round(this.velY * 10000) / 10000, this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 10);

            ctx.fillText("Metal: " + Math.round(this.materials.metals) + "%", this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 11.5);
            ctx.fillText("Rock: " + Math.round(this.materials.rock) + "%", this.infoWindowX + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 12.5);
            ctx.fillText("Ice: " + Math.round(this.materials.ice) + "%", this.infoWindowX + this.infoWindowWidth / 2 + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 11.5);
            ctx.fillText("Gas: " + Math.round(this.materials.gas) + "%", this.infoWindowX + this.infoWindowWidth / 2 + WIDTH / 50, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 12.5);

            ctx.font = WIDTH / 80 + 'px Arial';
            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01, this.infoWindowY + HEIGHT / 25);
            if(this.affectedByGravity !== false) {
                ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 3);
            }

            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 4.5);

            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 9);
            ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 10);

            if(this.type !== 2) {
                ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 11.5);
                ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 12.5);

                ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01 + this.infoWindowWidth / 2, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 11.5);
                ctx.fillText("\u270e", this.infoWindowX + this.infoWindowWidth * 0.01 + this.infoWindowWidth / 2, this.infoWindowY + HEIGHT / 25 + HEIGHT / 30 * 12.5);
            }

            ctx.fillText("X", this.infoWindowX + this.infoWindowWidth * 0.9, this.infoWindowY + HEIGHT / 25);

            ctx.fillText("Follow", this.infoWindowX + this.infoWindowWidth * 0.4, this.infoWindowY + this.infoWindowHeight - HEIGHT / 25);

            ctx.fillStyle = 'red';
            ctx.fillText("Delete", this.infoWindowX + this.infoWindowWidth * 0.4, this.infoWindowY + this.infoWindowHeight - HEIGHT / 100);
            ctx.fillStyle = 'white';

            //if (clickTimer === 0) {
                if (mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT / 50 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2) {
                    if(clickTimer === 0){
                        modal.style.display = "block";
                        for (var i = 0; i < objects.length; i++) {
                            if (objects[i] === this) {
                                windowSelectedPlanet = i;
                                input.value = this.name;
                                changeValue = "Name";
                            }
                        }
                        PAUSED = true;
                    }else{
                        document.body.style.cursor = "pointer";
                    }
                }else if (mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 3 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 3) {
                    if(this.affectedByGravity !== false){
                        if(clickTimer === 0) {
                            modal.style.display = "block";
                            for (var i = 0; i < objects.length; i++) {
                                if (objects[i] === this) {
                                    windowSelectedPlanet = i;
                                    input.value = this.gravityAffectsList;
                                    changeValue = "AffectedGravity"
                                }
                            }
                            PAUSED = true;
                        }else{
                            document.body.style.cursor = "pointer";
                        }
                    }
                }else if (mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 4.5 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 4.5) {
                    if(clickTimer === 0) {
                        modal.style.display = "block";
                        for (var i = 0; i < objects.length; i++) {
                            if (objects[i] === this) {
                                windowSelectedPlanet = i;
                                input.value = this.mass;
                                changeValue = "Mass"
                            }
                        }
                        PAUSED = true;
                    }else{
                        document.body.style.cursor = "pointer";
                    }
                } else if (mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 9 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 9) {
                    if(clickTimer === 0){
                        modal.style.display = "block";
                        for (var i = 0; i < objects.length; i++) {
                            if (objects[i] === this) {
                                windowSelectedPlanet = i;
                                input.value = this.velX;
                                changeValue = "DeltaX"
                            }
                        }
                        PAUSED = true;
                    }else{
                        document.body.style.cursor = "pointer";
                    }
                } else if (mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 10 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 10) {
                    if(clickTimer === 0){
                        modal.style.display = "block";
                        for (var i = 0; i < objects.length; i++) {
                            if (objects[i] === this) {
                                windowSelectedPlanet = i;
                                input.value = this.velY;
                                changeValue = "DeltaY"
                            }
                        }
                        PAUSED = true;
                    }else{
                        document.body.style.cursor = "pointer";
                    }
                } else if (mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 11 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 11.5) {
                    if(this.type !== 2) {
                        if (clickTimer === 0) {
                            modal.style.display = "block";
                            for (var i = 0; i < objects.length; i++) {
                                if (objects[i] === this) {
                                    windowSelectedPlanet = i;
                                    input.value = this.materials.metals;
                                    changeValue = "Metal"
                                }
                            }
                            PAUSED = true;
                        } else {
                            document.body.style.cursor = "pointer";
                        }
                    }
                }else if (mousePosX > this.infoWindowX && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 12 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 12.5) {
                    if(this.type !== 2) {
                        if (clickTimer === 0) {
                            modal.style.display = "block";
                            for (var i = 0; i < objects.length; i++) {
                                if (objects[i] === this) {
                                    windowSelectedPlanet = i;
                                    input.value = this.materials.rock;
                                    changeValue = "Rock"
                                }
                            }
                            PAUSED = true;
                        } else {
                            document.body.style.cursor = "pointer";
                        }
                    }
                }else if (mousePosX > this.infoWindowX + this.infoWindowWidth/2 && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 11 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05 + this.infoWindowWidth/2 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 11.5) {
                    if(this.type !== 2) {
                        if (clickTimer === 0) {
                            modal.style.display = "block";
                            for (var i = 0; i < objects.length; i++) {
                                if (objects[i] === this) {
                                    windowSelectedPlanet = i;
                                    input.value = this.materials.ice;
                                    changeValue = "Ice"
                                }
                            }
                            PAUSED = true;
                        } else {
                            document.body.style.cursor = "pointer";
                        }
                    }
                }else if (mousePosX > this.infoWindowX + this.infoWindowWidth/2 && mousePosY > this.infoWindowY + HEIGHT / 50 + HEIGHT / 30 * 12 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.05  + this.infoWindowWidth/2 && mousePosY < this.infoWindowY + HEIGHT / 50 * 2 + HEIGHT / 30 * 12.5) {
                    if(this.type !== 2) {
                        if (clickTimer === 0) {
                            modal.style.display = "block";
                            for (var i = 0; i < objects.length; i++) {
                                if (objects[i] === this) {
                                    windowSelectedPlanet = i;
                                    input.value = this.materials.gas;
                                    changeValue = "Gas"
                                }
                            }
                            PAUSED = true;
                        } else {
                            document.body.style.cursor = "pointer";
                        }
                    }
                }else if (mousePosX > this.infoWindowX + this.infoWindowWidth * 0.9 && mousePosY > this.infoWindowY + HEIGHT / 50 && mousePosX < this.infoWindowX + this.infoWindowWidth && mousePosY < this.infoWindowY + HEIGHT / 50 * 2) {
                    if(clickTimer === 0){
                        this.infoWindowOpen = false;
                        this.infoWindowX = 0;
                        this.infoWindowY = 0;
                        mouseClickNoTimer = 5;
                    }else{
                        document.body.style.cursor = "pointer";
                    }

                } else if (mousePosX > this.infoWindowX + this.infoWindowWidth * 0.3 && mousePosY > this.infoWindowY + this.infoWindowHeight - HEIGHT / 15 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.7 && mousePosY < this.infoWindowY + this.infoWindowHeight - HEIGHT / 30) {
                    if(clickTimer === 0){
                        this.following = true;
                    }else{
                        document.body.style.cursor = "pointer";
                    }
                } else if (mousePosX > this.infoWindowX + this.infoWindowWidth * 0.3 && mousePosY > this.infoWindowY + this.infoWindowHeight - HEIGHT / 35 && mousePosX < this.infoWindowX + this.infoWindowWidth * 0.7 && mousePosY < this.infoWindowY + this.infoWindowHeight - HEIGHT / 100) {
                    if(clickTimer === 0){
                        objects.splice(this.arrayid, 1);
                    }else{
                        document.body.style.cursor = "pointer";
                    }
                }else{

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

        if(this.type !== 2){
            if(gameClock % 10 === 0){
                if(this.materials.gas > 0.9*this.totalMaterials){
                    this.color = "rgb(" + this.materials.gas*2 + "," + this.materials.gas*1.5 + "," + this.materials.ice*2.5 + ")";
                }else if(this.materials.gas > 0.5*this.totalMaterials){
                    this.color = "rgb(" + (this.materials.metals*0.5 + this.materials.rock*0.6 + this.materials.ice*0.5 + this.materials.gas*0.4 + (this.temperature + this.planetTemperature + 100)/6) + "," + (this.materials.metals*0.6 + this.materials.rock*0.8 + this.materials.gas*0.2 + this.materials.ice*0.5 +(this.temperature + this.planetTemperature + 100)/12) + "," + (this.materials.ice*1.5 + this.materials.rock*0.9) + ")";
                }else{
                    this.color = "rgb(" + (this.materials.metals*1.5 + this.materials.rock*0.8 + this.materials.ice*0.5 +(this.temperature + this.planetTemperature + 100)/6) + "," + (this.materials.metals*0.8 + this.materials.rock*1 + this.materials.ice*0.5 +(this.temperature + this.planetTemperature + 100)/12) + "," + (this.materials.ice*1.7 + this.materials.rock*1) + ")";
                }
            }
        }else{
            this.blueTemp = Math.min(this.radius/2, 255);
            this.color = "rgb(" + this.materials.gas*2 + "," + this.materials.gas*2 + "," + this.blueTemp + ")";
        }

        if(this.exists === false && this.type !== 3){
            if(dragging === false){
                this.exists = true;
                if(autoOrbit === true && objects.length > 1){
                    if(objects.length > this.greatestAttractor){
                        this.pointAX = objects[this.greatestAttractor].x;
                        this.pointAY = objects[this.greatestAttractor].y - this.distancefromGreatestAttractor;

                        //Point B is sun X, Y and point C is planet x Y

                        this.distanceBetweenTopArcToCurrentArc = Math.sqrt((this.y - this.pointAY)*(this.y - this.pointAY) + (this.x - this.pointAX)*(this.x - this.pointAX));

                        this.angleBetweenArcs = 2*Math.asin((this.distanceBetweenTopArcToCurrentArc/2)/this.distancefromGreatestAttractor);

                        this.totalVelocity = Math.sqrt(Math.abs((G*objects[this.greatestAttractor].mass)/(this.distancefromGreatestAttractor)));

                        //Works for right half circle
                        if(this.x >= this.pointAX){
                            this.velX = (Math.cos(this.angleBetweenArcs)*this.totalVelocity)*orbitalDirection + objects[this.greatestAttractor].velX;
                            this.velY = (Math.sin(this.angleBetweenArcs)*this.totalVelocity)*orbitalDirection + objects[this.greatestAttractor].velY;
                        }else{
                            this.velX = (Math.cos(this.angleBetweenArcs)*this.totalVelocity)*orbitalDirection + objects[this.greatestAttractor].velX;
                            this.velY = -(Math.sin(this.angleBetweenArcs)*this.totalVelocity)*orbitalDirection + objects[this.greatestAttractor].velY;
                        }
                    }
                }else{
                    this.velX = (savedMouseX - mousePosX)*mouseForce/100;
                    this.velY = (savedMouseY - mousePosY)*mouseForce/100;
                }
            }else{
                this.greatestAttractor = 0;
                this.biggestGravAttraction = 0;
                this.distancefromGreatestAttractor = 0;

                this.curveVelX = (savedMouseX - mousePosX)*mouseForce/100;
                this.curveVelY = (savedMouseY - mousePosY)*mouseForce/100;


                this.curvePoints = [[this.x, this.y]];

                for (var j = 0; j < objects.length; j++) {
                    this.tempX = objects[j].x;
                    this.tempY = objects[j].y;
                    if (objects[j] !== this && this.inactive === false && objects[j].exists === true && objects[j].type !== 3) {
                        this.distance = Math.sqrt((this.x - this.tempX) * (this.x - this.tempX) + (this.y - this.tempY) * (this.y - this.tempY));
                        if(this.distance < 1){
                            this.distance = 1;
                        }
                        if((objects[j].mass/(this.distance*this.distance) > this.biggestGravAttraction)){
                            this.greatestAttractor = j;
                            this.biggestGravAttraction = objects[j].mass/(this.distance*this.distance);
                            this.distancefromGreatestAttractor = this.distance;
                        }

                    }
                }

                for(var i = 1; i < Math.round(lineLength/cameraZoom); i++){
                    this.curvePoints.push([this.curvePoints[i-1][0] + this.curveVelX, this.curvePoints[i-1][1] + this.curveVelY]);
                    if(this.affectedByGravity === true){
                        for (var j = 0; j < objects.length; j++) {
                            if (objects[j] !== this && this.inactive === false && objects[j].exists === true && objects[j].type !== 3) {
                                this.tempX = objects[j].x;
                                this.tempY = objects[j].y;
                                this.distance = Math.sqrt((this.curvePoints[i][0] - this.tempX) * (this.curvePoints[i][0] - this.tempX) + (this.curvePoints[i][1] - this.tempY) * (this.curvePoints[i][1] - this.tempY));
                                if(this.distance < 1){
                                    this.distance = 1;
                                }
                                if(this.distance > (this.radius + objects[j].radius)){
                                    this.curveVelX += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.curvePoints[i][0]) / this.distance; // F = M*A A = F/M
                                    this.curveVelY += (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.curvePoints[i][1]) / this.distance;
                                    if((objects[j].mass/(this.distance*this.distance) > this.biggestGravAttraction) && i === 1){
                                        //this.greatestAttractor = j;
                                        //this.biggestGravAttraction = objects[j].mass/(this.distance*this.distance);
                                        //this.distancefromGreatestAttractor = this.distance;
                                    }
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
                    if(autoOrbit === false){
                        for(var d = 1; d < this.curvePoints.length; d++){
                            ctx.strokeStyle = 'white';
                            ctx.beginPath();
                            ctx.moveTo(((this.curvePoints[d-1][0] - screenHalfWidth) * cameraZoom + screenHalfWidth) + cameraX, ((this.curvePoints[d-1][1] - screenHalfHeight) * cameraZoom + screenHalfHeight) + cameraY);
                            ctx.lineTo(((this.curvePoints[d][0] - screenHalfWidth) * cameraZoom + screenHalfWidth) + cameraX, ((this.curvePoints[d][1] - screenHalfHeight) * cameraZoom + screenHalfHeight) + cameraY);
                            ctx.stroke();
                        }
                    }

                    ctx.fillStyle = 'white';
                    if(autoOrbit === true){
                        ctx.globalAlpha = 0.5;
                    }else{
                        ctx.globalAlpha = 0.1;
                    }
                    ctx.beginPath();
                    ctx.arc(objects[this.greatestAttractor].cameraX + cameraX, objects[this.greatestAttractor].cameraY + cameraY, this.distancefromGreatestAttractor*cameraZoom, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.globalAlpha = 1;

                }
            }
        }

        if(this.inactive === false && (this.exists === true || (this.type === 3)) && PAUSED === false && this.affectedByGravity === true) {
            for (var j = 0; j < objects.length; j++) {
                if (objects[j] !== this && this.inactive === false && objects[j].exists === true && this.passedThrough === false && objects[j].type !== 3 && (this.gravityAffectsList.length === 0 || arrayInclude(this.gravityAffectsList, objects[j].id))) {
                    this.tempX = objects[j].x;
                    this.tempY = objects[j].y;

                    this.distance = Math.sqrt((this.x - this.tempX) * (this.x - this.tempX) + (this.y - this.tempY) * (this.y - this.tempY)); //This is the actual Distance

                    if ((this.distance > (this.radius + objects[j].radius))) {
                        this.velX += this.gravityConstant * (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.x) / this.distance; // F = M*A A = F/M
                        this.velY += this.gravityConstant * (G * objects[j].mass / (this.distance * this.distance)) * (objects[j].y - this.y) / this.distance;
                    }

                    //console.log(this.distance);

                }
            }
            for (var j = 0; j < objects.length; j++) {
                if (objects[j] !== this && this.inactive === false && objects[j].exists === true && this.passedThrough === false && objects[j].type !== 3) {
                    this.tempX = objects[j].x;
                    this.tempY = objects[j].y;

                    this.distance = Math.sqrt((this.x - this.tempX) * (this.x - this.tempX) + (this.y - this.tempY) * (this.y - this.tempY)); //This is the actual Distance

                    if ((this.distance > (this.radius + objects[j].radius))) {
                        if((this.gravityConstant*(G * objects[j].mass / (this.distance * this.distance)) * (objects[j].x - this.x) / this.distance) > 1){
                            if(debrietrails === true && PAUSED === false){
                                this.explode(1, 0.5);
                            }
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

                        if((objects[j].type === 2 || objects[j].type.temperature > 1000) && this.type !== 2 && this.type !== 3 && (gameClock % 10 === 0)){
                            if(savedSunAmount === 0){
                                savedSunAmount = 1;
                            }
                            this.temperature += Math.round(T*Math.pow(Math.pow(objects[j].radius,2)*Math.PI*objects[j].temperature*(1-this.reflectivity)/16*Math.PI,1/4)*(1/Math.sqrt(this.distance)))/savedSunAmount;
                        }else{
                            if(this.type === 2 || this.mass > starCreationLimit){
                                this.temperature = this.mass * randomTempConstant;
                                sunAmount++;
                            }

                        }
                    } else {
                        if(collisions === true && this.distance === this.distance){
                            this.explode(this.distance, j);
                            break;
                        }
                    }

                    if(this.passedThrough === true){
                        if(collisions === true) {
                            this.explode(this.distance, j);
                            break;
                        }
                    }
                }
            }
        }

        for (var j = 0; j < objects.length; j++) {
            if (objects[j] === this) {
                this.arrayid = j;
            }
        }

        if(this.temperature > waterMeltTemperature && this.type !== 2 && this.type !== 3){
            if(debrietrails === true){
                this.explode(1, 0.5);
            }
        }

        if(this.planetTemperature > 0 && PAUSED === false){
            this.planetTemperature-=this.planetTemperature*0.05;
        }
        //console.log(this.velX);
    };

    this.explode = function(distance, int){
        this.spawnX = 0;
        this.spawnY = 0;
        this.random = 0;
        if(int !== 0.5){
            if(distance < 1 || distance !== distance){
                distance = 1;
            }
            if(this.type !== 3 && objects[int].type !== 3){
                if(this.mass < objects[int].mass){
                    this.random = Math.round(this.mass/massMultiplier/2);
                }else{
                    this.random = Math.round(objects[int].mass/massMultiplier/2);
                }
                if(this.random > 50){
                    this.random = 50;
                }
                if(this.mass <= objects[int].mass){
                    if(this.x !== this.x || this.velX !== this.velX){ //Easy way to check if NaN

                    }else{
                        for(var debrieNum = 0; debrieNum < this.random; debrieNum++){
                            this.spawnX = Math.random()*this.radius*1.4 - this.radius*0.7;
                            this.spawnY = Math.random()*this.radius*1.4 - this.radius*0.7;
                            objects.push(new Object(this.x + this.spawnX - this.velX + cameraX/cameraZoom, this.y + this.spawnY - this.velY + cameraY/cameraZoom, Math.round(Math.random()*5)+3, 1, 3, false, 'yellow', {metals:this.materials.metals, ice:this.materials.ice, rock:this.materials.rock, gas:this.materials.gas}));
                            objects[objects.length - 1].velX = this.velX/4*Math.random() - this.velX/8;
                            objects[objects.length - 1].velY = this.velY/4*Math.random() - this.velY/8;
                        }
                    }

                }else{
                    if(objects[int].x !== objects[int].x || objects[int].velX !== objects[int].velX){ //Easy way to check if NaN

                    }else{
                        for(var debrieNum = 0; debrieNum < this.random; debrieNum++) {
                            this.spawnX = Math.random()*objects[int].radius*1.4 - objects[int].radius*0.7;
                            this.spawnY = Math.random()*objects[int].radius*1.4 - objects[int].radius*0.7;
                            objects.push(new Object(objects[int].x + this.spawnX - objects[int].velX + cameraX / cameraZoom, objects[int].y + this.spawnY - objects[int].velY + cameraY / cameraZoom, Math.round(Math.random()*5)+3, 1, 3, false, 'yellow', {metals:this.materials.metals, ice:this.materials.ice, rock:this.materials.rock, gas:this.materials.gas}));
                            objects[objects.length - 1].velX = objects[int].velX/4*Math.random() - objects[int].velX/8;
                            objects[objects.length - 1].velY = objects[int].velY/4*Math.random() - objects[int].velX/8;
                        }
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
                }else if(objects[int].type === 3){

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
                    this.id = objects[int].id;
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
                    this.id = objects[int].id;
                }else{

                }
                if(this.affectedByGravity === true){
                    this.x = objects[int].x;
                    this.y = objects[int].y;
                }
                this.affectedByGravity = false;
            }

            this.density = (this.materials.rock + this.materials.metals + this.materials.ice*0.8 + this.materials.gas*0.3)/(this.materials.rock + this.materials.metals + this.materials.ice + this.materials.gas);
            this.radius = Math.sqrt(this.mass/(this.density*3.14));
            if(this.type === 0 || this.type === 3){
                this.regenerate();
            }

            this.planetTemperature += 150;

            this.passedThrough = false;
            objects[int].inactive = true;
            objects.splice(int, 1);

        }else{
            if(distance < 1){
                distance = 1;
            }

            if(this.type !== 3){

                this.random = Math.round(this.mass/massMultiplier/10);

                if(this.random > 1){
                    this.random = 1;
                }
                for(var i = 0; i < this.random; i++){
                    this.spawnX = Math.random()*this.radius - this.radius/2;
                    this.spawnY = Math.random()*this.radius - this.radius/2;
                    if(this.materials.ice >= 50){
                        objects.push(new Object(this.x + this.spawnX + this.velX + cameraX/cameraZoom, this.y + this.spawnY + this.velY + cameraY/cameraZoom, Math.round(Math.random())+1, 1, 3, false, 'blue', {ice:90, metals:0, rock:0, gas: 10}));
                        objects[objects.length - 1].velX = this.velX/10*Math.random();
                        objects[objects.length - 1].velY = this.velY/10*Math.random();
                    }else{
                        if(this.mass <= 50){

                        }else{
                            objects.push(new Object(this.x + this.spawnX + this.velX + cameraX/cameraZoom, this.y + this.spawnY + this.velY + cameraY/cameraZoom, Math.round(Math.random())+1, 1, 3, false, 'yellow', {ice:0, metals:0, rock:20, gas: 80}));
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

            this.density = massMultiplier/2*(this.materials.rock + this.materials.metals + this.materials.ice*0.8 + this.materials.gas*0.3)/(this.materials.rock + this.materials.metals + this.materials.ice + this.materials.gas);
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

        if(this.following === true){
            cameraX = -this.cameraX + screenHalfWidth;
            cameraY = -this.cameraY + screenHalfHeight;
        }

        if(globalTrails === true){
            if(this.type !== 3 && (gameClock % (globalTrailSmoothness-1) === 0)){
                trails.push(new Trail(this.id, 'white'));
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
                this.cameraRadius = this.cameraRadius/2;
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
                this.cameraRadius = this.cameraRadius*2;
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

function Trail(planetId, color){
    this.planetId = planetId;
    this.x1 = 0;
    this.y1 = 0;
    for(var temp = 0; temp < objects.length; temp++){
        if(objects[temp].id === this.planetId){
            this.x1 = objects[temp].x;
            this.y1 = objects[temp].y;
        }
    }
    this.x2 = 1.732;
    this.y2 = 1.732;
    this.color = color;
    this.interval = globalTrailSmoothness;
    this.lifeTime = globalTrailLife;
    this.zoom = 0;

    this.draw = function(){
        if(PAUSED === false){
            this.lifeTime--;
        }

        if(this.lifeTime === globalTrailLife-this.interval){
            for(var temp = 0; temp < objects.length; temp++){
                if(objects[temp].id === this.planetId){
                    this.x2 = objects[temp].x;
                    this.y2 = objects[temp].y;
                }
            }
        }

        if(this.zoom !== cameraZoom){
            this.cameraX1 = ((this.x1 - screenHalfWidth) * cameraZoom + screenHalfWidth);
            this.cameraY1 = ((this.y1 - screenHalfHeight) * cameraZoom + screenHalfHeight);
            this.cameraX2 = ((this.x2 - screenHalfWidth) * cameraZoom + screenHalfWidth);
            this.cameraY2 = ((this.y2 - screenHalfHeight) * cameraZoom + screenHalfHeight);
        }

        if(this.x2 !== 1.732){
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.cameraX1 + cameraX, this.cameraY1 + cameraY);
            ctx.lineTo(this.cameraX2 + cameraX, this.cameraY2 + cameraY);
            ctx.stroke();
        }

    }
}

function Button(type, subtype, id, planetProperties){
    this.x = 0;
    this.y = HEIGHT - HEIGHT/50 - WIDTH/12;
    this.xOffset = 0;
    this.yOffset = 0;
    this.width = WIDTH/18;
    this.height = WIDTH/16;
    this.type = type;
    this.subtype = subtype;
    this.id = id;

    this.color = 'white';

    this.planetButtonNum = 0;
    this.planetProperties = planetProperties;

    this.infoWindowOpen = false;
    this.infoWindowWidth = this.width*2;
    this.infoWindowHeight = this.height;

    this.lifeClock = 0;

    if(this.subtype === 1){
        if(this.planetProperties.materials.gas > 0.9*100){
            this.color = "rgb(" + (this.planetProperties.materials.gas*2 + (this.planetProperties.type-1)*this.planetProperties.materials.gas*0.5) + "," + (this.planetProperties.materials.gas*1.5 + (this.planetProperties.type-1)*this.planetProperties.materials.gas*1) + "," + this.planetProperties.materials.ice*2.5 + ")";
        }else if(this.gas > 0.5*100){
            this.color = "rgb(" + (this.planetProperties.materials.metals*0.5 + this.planetProperties.materials.rock*0.6 + this.planetProperties.materials.ice*0.5 + this.planetProperties.materials.gas*0.4 + (100)/6) + "," + (this.planetProperties.materials.metals*0.6 + this.planetProperties.materials.rock*0.8 + this.planetProperties.materials.gas*0.2 + this.planetProperties.materials.ice*0.5 +(100)/12) + "," + (this.planetProperties.materials.ice*1.5 + this.planetProperties.materials.rock*0.9) + ")";
        }else{
            this.color = "rgb(" + (this.planetProperties.materials.metals*1.5 + this.planetProperties.materials.rock*0.8 + this.planetProperties.materials.ice*0.5 +(100)/6) + "," + (this.planetProperties.materials.metals*0.8 + this.planetProperties.materials.rock*1 + this.planetProperties.materials.ice*0.5 +(100)/12) + "," + (this.planetProperties.materials.ice*1.7 + this.planetProperties.materials.rock*1) + ")";
        }

        this.planetProperties.density = (this.planetProperties.materials.rock + this.planetProperties.materials.metals + this.planetProperties.materials.ice*0.8 + this.planetProperties.materials.gas*0.3)/(this.planetProperties.materials.rock + this.planetProperties.materials.metals + this.planetProperties.materials.ice + this.planetProperties.materials.gas);
    }

    this.update = function(){
        this.lifeClock++;
        if(this.type === 1){
            this.infoWindowX = this.x - this.width/2;
            this.infoWindowY = this.y - this.height*1.2;

            /*if(this.planetButtonNum !== planetButtons){
                this.x = WIDTH/2 - this.width/2 - (planetButtons-1)*(this.width-WIDTH/50) + this.id*(WIDTH/50+this.width);
                this.planetButtonNum = planetButtons;
            }*/

            this.yOffset = (Math.abs(WIDTH/2 - this.x - this.width/2)*Math.abs(WIDTH/2 - this.x - this.width/2))/5000;

            if(this.lifeClock === 1){
                globalButtonXOffset = Math.round(WIDTH/2 - this.width/2 - selectedPlanetButtonNum*(WIDTH/20+this.width));
                this.x = this.id*(WIDTH/30+this.width) + globalButtonXOffset;
                this.xOffset = globalButtonXOffset;
            }

            if(Math.abs(globalButtonXOffset - this.xOffset) > 10){
                if(globalButtonXOffset < this.xOffset){
                    this.xOffset -= WIDTH/128;
                }else if(globalButtonXOffset > this.xOffset){
                    this.xOffset += WIDTH/128;
                }
            }

            this.x = this.id*(WIDTH/20+this.width) + this.xOffset;
            if(clickTimer === 0){
                if(mousePosX > this.x + this.width/2 && mousePosX < this.x + this.width/3 + this.width*0.5 && mousePosY > this.y + this.height + this.yOffset && mousePosY < this.y + this.height*0.7 + this.yOffset + this.height*0.5){
                    if(selectedPlanetButtonNum === this.id){
                        buttonsPlanets.splice(this.id, 1);
                        selectedPlanetButtonNum = this.id;
                        globalButtonXOffset = Math.round(WIDTH/2 - this.width/2 - selectedPlanetButtonNum*(WIDTH/20+this.width));
                        cursorTool = true;
                        clickingButton = true;
                    }
                }else if(mousePosX > this.x && mousePosX < this.x + this.width/4 && mousePosY > this.y + this.height + this.yOffset && mousePosY < this.y + this.height*0.7 + this.yOffset + this.height*0.5){
                    if(selectedPlanetButtonNum === this.id){
                        bottomPanel.closed = true;
                        editingPanel.closed = false;
                        mouseClickNoTimer = 5;
                    }
                }
                if(mousePosX > this.x + this.width*0.1 && mousePosX < this.x + this.width*0.3 && mousePosY > this.y + this.yOffset && mousePosY < this.y + this.yOffset + this.height*0.2) {
                    //mouseClickNoTimer = 5;
                }else if(mousePosX > this.x && mousePosX < this.x + this.width){
                    if((mousePosY > (this.y + this.yOffset)) && (mousePosY < (this.y + this.yOffset + this.height*0.9))){
                        if(this.subtype === 1){
                            selectedPlanetButtonNum = this.id;
                            if(clickTimer === 0){
                                globalButtonXOffset = Math.round(WIDTH/2 - this.width/2 - selectedPlanetButtonNum*(WIDTH/20+this.width));
                            }
                            cursorTool = false;
                            clickingButton = true;
                        }else if(this.subtype === 2){
                            selectedPlanetButtonNum = this.id;
                            if(clickTimer === 0){
                                globalButtonXOffset = Math.round(WIDTH/2 - this.width/2 - selectedPlanetButtonNum*(WIDTH/20+this.width));
                            }
                            cursorTool = true;
                        }else if(this.subtype === 3){
                            if(clickTimer === 0){
                                globalButtonXOffset = Math.round(WIDTH/2 - this.width/2 - selectedPlanetButtonNum*(WIDTH/20+this.width));
                                buttonsPlanets.splice(buttonsPlanets.length - 1, 1);
                                buttonsPlanets.push(new Button(1, 1, 2, {mass:500, density:1, color:'yellow', type:2, materials:{rock:0, metals:0, ice:0, gas:100}, affectedByGravity:true}));
                                buttonsPlanets.push(new Button(1, 3, 1, {}));
                                mouseClickNoTimer = 5;
                            }

                        }

                    }
                }
            }else{
                if(mousePosX > this.x && mousePosX < this.x + this.width){
                    if(mousePosY > this.y + this.yOffset && mousePosY < this.y + this.yOffset + this.height*0.9){
                        if(selectedPlanetButtonNum !== this.id){
                            document.body.style.cursor = "pointer";
                        }
                    }else{

                    }
                }
                if(mousePosX > this.x + this.width/2 && mousePosX < this.x + this.width/3 + this.width*0.5 && mousePosY > this.y + this.height && mousePosY < this.y + this.height*1.2){
                    if(selectedPlanetButtonNum === this.id){
                        document.body.style.cursor = "pointer";
                    }
                }else if(mousePosX > this.x && mousePosX < this.x + this.width/4 && mousePosY > this.y + this.height && mousePosY < this.y + this.height*1.2){
                    if(selectedPlanetButtonNum === this.id){
                        document.body.style.cursor = "pointer";
                    }
                }


            }
        }

    };

    this.draw = function(){
        this.y = this.y + this.yOffset + bottomPanel.offsetY;
        if(this.subtype === 1){
            if(selectedPlanetButtonNum === this.id){
                ctx.globalAlpha = 1;
                ctx.fillStyle = 'white';
                //ctx.font = WIDTH/80 + 'px Arial';
                //ctx.fillText("\u270e", this.x - this.width/5, this.y + this.height*1.5 - this.height/5);
                ctx.drawImage(img, 1600, 0, 800, 800, this.x + this.width/10, this.y + this.height*1, this.width/2, this.width/2);
                ctx.drawImage(img, 2400, 0, 800, 800, this.x + this.width/2, this.y + this.height*1, this.width/2, this.width/2);
            }else{
                ctx.globalAlpha = 0.3;
            }
            ctx.fillStyle = this.color;
            ctx.beginPath();
            if(this.planetProperties.type === 2){
                ctx.arc(this.x+this.width/2, this.y+this.height/2, WIDTH/35, 0, 2 * Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.globalAlpha = 0.2;
                ctx.arc(this.x+this.width/2, this.y+this.height/2, WIDTH/25, 0, 2 * Math.PI);
            }else if(this.planetProperties.type === 0){
                ctx.moveTo(this.x + this.width*0.45, this.y + this.height*0.45);
                ctx.lineTo(this.x + this.width*0.57, this.y + this.height*0.40);
                ctx.lineTo(this.x + this.width*0.59, this.y + this.height*0.48);
                ctx.lineTo(this.x + this.width*0.53, this.y + this.height*0.53);
                ctx.lineTo(this.x + this.width*0.48, this.y + this.height*0.57);
            }else{
                if(this.planetProperties.mass*0.5 < WIDTH/200){
                    ctx.arc(this.x+this.width/2, this.y+this.height/2, WIDTH/100, 0, 2 * Math.PI);
                }else if(this.planetProperties.mass < WIDTH/60){
                    ctx.arc(this.x+this.width/2, this.y+this.height/2, this.planetProperties.mass*0.75, 0, 2 * Math.PI);
                }else{
                    ctx.arc(this.x+this.width/2, this.y+this.height/2, WIDTH/50, 0, 2 * Math.PI);
                }
            }
            ctx.fill();
            ctx.globalAlpha = 1;
        }else if(this.subtype === 2){
            if(selectedPlanetButtonNum === this.id){
                ctx.globalAlpha = 1;
                ctx.font = WIDTH/100 + 'px Arial';
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.3;
                ctx.fillText("(Cursor)", this.x + this.width/4, this.y + this.height);
                ctx.globalAlpha = 1;
            }else{
                ctx.globalAlpha = 0.3;
            }
            ctx.drawImage(img, 0, 0, 800, 800, this.x - this.width/8, this.y - this.height/4, WIDTH/15, WIDTH/15);
            ctx.globalAlpha = 1;
        }else if(this.subtype === 3){
            if(selectedPlanetButtonNum === this.id){
                ctx.globalAlpha = 1;
                ctx.font = WIDTH/100 + 'px Arial';
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.3;
                ctx.fillText("(Add new)", this.x + this.width/8, this.y + this.height);
                ctx.globalAlpha = 1;
            }else{
                ctx.globalAlpha = 0.3;
            }
            ctx.drawImage(img, 800, 0, 800, 800, this.x + this.width/8, this.y + this.height/8, WIDTH/18, WIDTH/18);
            ctx.globalAlpha = 1;
        }
        this.y = this.y - this.yOffset - bottomPanel.offsetY;
    }

    this.drawInfoWindow = function(){

    };

}

function Panel(loc, type) {
    this.loc = loc;
    this.type = type;

    this.x = 0;
    this.y = 0;
    this.radius = 0;

    this.closed = false;
    this.offsetY = 0;

    if(this.loc === "top"){
        this.x = WIDTH/2;
        this.y = -WIDTH*1.85;
        this.radius = WIDTH*2;
    }else if(this.loc === "bottom"){
        this.x = WIDTH/2;
        this.y = HEIGHT + WIDTH*1.85;
        this.radius = WIDTH*2;
    }

    this.draw = function(){
        if(this.closed === true){
            if(this.offsetY < WIDTH/6) {
                this.offsetY+=WIDTH/32;
            }
        }else{
            if(this.offsetY > 0) {
                this.offsetY-=WIDTH/32;
            }
        }

        this.y = this.y + this.offsetY;
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        if(this.loc === "top"){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.arc(this.x, this.y + this.y/500, this.radius, 0, Math.PI);
            ctx.fill();
        }else{
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, Math.PI, 2*Math.PI);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.arc(this.x, this.y + this.y/500, this.radius, Math.PI, 2*Math.PI);
            ctx.fill();
        }
        this.y = this.y - this.offsetY;
    }
}

objects.push(new Object(WIDTH/2, HEIGHT/2, 500, 1, 2, false, 'yellow', {rock:0, metals:0, ice:0, gas:100}));
objects.push(new Object(WIDTH/3, 40, 10, 1, 1, true, 'blue', {rock:60, metals:40, ice:0, gas:0}));

buttonsPlanets.push(new Button(1, 2, 0, {})); // REMEMBER INCREASING ID RIP
buttonsPlanets.push(new Button(1, 1, 0, {mass:5, density:1, color:'gray', type:0, materials:{rock:60, metals:40, ice:0, gas:0}, affectedByGravity:true})); // REMEMBER INCREASING ID RIP
buttonsPlanets.push(new Button(1, 1, 1, {mass:10, density:1, color:'orange', type:1, materials:{rock:0, metals:100, ice:0, gas:0}, affectedByGravity:true})); // REMEMBER INCREASING ID RIP
buttonsPlanets.push(new Button(1, 1, 2, {mass:12, density:1, color:'blue', type:1, materials:{rock:50, metals:0, ice:50, gas:0}, affectedByGravity:true}));
buttonsPlanets.push(new Button(1, 1, 0, {mass:15, density:1, color:'gray', type:1, materials:{rock:90, metals:10, ice:0, gas:0}, affectedByGravity:true})); // REMEMBER INCREASING ID RIP
buttonsPlanets.push(new Button(1, 1, 1, {mass:20, density:1, color:'blue', type:1, materials:{rock:0, metals:0, ice:80, gas:20}, affectedByGravity:true})); // REMEMBER INCREASING ID RIP
buttonsPlanets.push(new Button(1, 1, 0, {mass:50, density:1, color:'yellow', type:1, materials:{rock:0, metals:0, ice:0, gas:100}, affectedByGravity:true}));
buttonsPlanets.push(new Button(1, 1, 2, {mass:500, density:1, color:'yellow', type:2, materials:{rock:0, metals:0, ice:0, gas:100}, affectedByGravity:true}));
buttonsPlanets.push(new Button(1, 3, 0, {})); // REMEMBER INCREASING ID RIP

bottomPanel = new Panel("bottom", 1);
editingPanel = new Panel("bottom", 1);

editingPanel.closed = true;

var clickedOnSomePlanet = false;

function arrayInclude(array, result){
    for(var oof = 0; oof < array.length; oof++){
        if(array[oof] === result){
            return true;
            break;
        }
    }
    return false;
}

function game(){

    if(PAUSED === false){
        gameClock++;
    }

    document.body.style.cursor = "auto";

    planetButtons = 0;

    for(var i = 0; i < buttonsPlanets.length; i++){
        if(buttonsPlanets[i].type === 1){
            planetButtons++;
        }
    }

    var tempId = 0;
    for(var i = 0; i < buttonsPlanets.length; i++){
        if(buttonsPlanets[i].type === 1){ // PLANET PICKING BUTTONS MUST RESET ID ALL THE TIME
            buttonsPlanets[i].id = tempId;
            tempId++;
        }
        buttonsPlanets[i].update();
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

            //Cursor

            ctx.globalAlpha = 0.3;
            if(cursorTool === false){
                if(buttonsPlanets[selectedPlanetButtonNum].planetProperties === 0){
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.moveTo(mousePosX - WIDTH/20*0.05, mousePosY - WIDTH/20*0.05);
                    ctx.lineTo(mousePosX + WIDTH/20*0.07, mousePosY - WIDTH/20*0.10);
                    ctx.lineTo(mousePosX + WIDTH/20*0.09, mousePosY - WIDTH/20*0.02);
                    ctx.lineTo(mousePosX + WIDTH/20*0.03, mousePosY + WIDTH/20*0.03);
                    ctx.lineTo(mousePosX - WIDTH/20*0.02, mousePosY + WIDTH/20*0.07);
                    ctx.fill();
                }else{
                    ctx.fillStyle = buttonsPlanets[selectedPlanetButtonNum].color;
                    ctx.beginPath();
                    ctx.arc(mousePosX, mousePosY, Math.sqrt(buttonsPlanets[selectedPlanetButtonNum].planetProperties.mass*massMultiplier/(buttonsPlanets[selectedPlanetButtonNum].planetProperties.density*3.14)) * cameraZoom, 0, 2 * Math.PI);
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

            //if(PAUSED === false){
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
                savedSunAmount = sunAmount;
                sunAmount = 0;
            //}

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

    //Buttons?
    bottomPanel.draw();
    editingPanel.draw();

    for(var i = 0; i < buttonsPlanets.length; i++){
        buttonsPlanets[i].update();
        buttonsPlanets[i].draw();
    }


    //Cursor Logic

    window.onmousemove = logMouseMove;
    if(dragging === true && clickedOnSomePlanet === true){
        clickedOnSomePlanet = true;
    }else{
        clickedOnSomePlanet = false;
    }

    if(clickTimer === 0 && cursorTool === false ){
        draggingWindow = false;
        if(clickingButton === false && mouseClickNoTimer === 0){
            objects.push(new Object(((mousePosX - screenHalfWidth) / cameraZoom + screenHalfWidth), ((mousePosY - screenHalfHeight) / cameraZoom + screenHalfHeight), buttonsPlanets[selectedPlanetButtonNum].planetProperties.mass, buttonsPlanets[selectedPlanetButtonNum].planetProperties.density, buttonsPlanets[selectedPlanetButtonNum].planetProperties.type, buttonsPlanets[selectedPlanetButtonNum].planetProperties.affectedByGravity, buttonsPlanets[selectedPlanetButtonNum].planetProperties.color, {ice:buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.ice, gas:buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.gas, metals:buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.metals, rock:buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.rock}));
        }
    }else if(clickTimer === 0 && cursorTool === true){
        for(var i = 0; i < objects.length; i++){
            if(objects[i].type !== 3){
                if(objects[i].cameraX + cameraX - objects[i].cameraRadius - WIDTH/50 < mousePosX && objects[i].cameraX + cameraX + objects[i].cameraRadius + WIDTH/50 > mousePosX){
                    if(objects[i].cameraY + cameraY - objects[i].cameraRadius - WIDTH/50 < mousePosY && objects[i].cameraY + cameraY + objects[i].cameraRadius + WIDTH/50 > mousePosY){
                        for(var temp = 0; temp < objects.length; temp++){
                            objects[temp].infoWindowOpen = false;
                            objects[temp].following = false;
                        }
                        clickedOnSomePlanet = true;
                        objects[i].infoWindowOpen = true;
                        objects[i].following = true;
                        bottomPanel.closed = true;
                        objects[i].infoWindowX = 0;
                        objects[i].infoWindowY = 0;
                        break;
                    }
                }
            }
        }
    }else if(dragging === true){
        var noCreatingPlanets = true;
        for(var p = 0; p < objects.length; p++){
            if(objects[p].exists === false){
                noCreatingPlanets = false;
                break;
            }
        }
        if(clickedOnSomePlanet === false && noCreatingPlanets === true) {
            for (var x = 0; x < objects.length; x++) {
                objects[x].following = false;
                objects[x].infoWindowOpen = false;
            }

            savedMouseX2 = 0;
            savedMouseY2 = 0;
            if (savedMouseX === 0) {
                savedMouseX = mousePosX;
                savedMouseY = mousePosY;
            }

            cameraX = mousePosX - savedMouseX + cameraXOffset;
            cameraY = mousePosY - savedMouseY + cameraYOffset;

            AREAWIDTH = WIDTH / 2 / 0.01;
            AREAHEIGHT = HEIGHT / 2 / 0.01;

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

    if(clickTimer < 1){
        clickTimer++;
    }

    if(mouseClickNoTimer > 0){
        mouseClickNoTimer--;
    }
    //if(gameRunning === true) {

    if(pauseTimer > 0){
        pauseTimer--;
    }

    clickingButton = false;

    if (keys && keys[48]) {
        selectedPlanetButtonNum = 0;
        globalButtonXOffset = Math.round(WIDTH/2 - buttonsPlanets[0].width/2 - selectedPlanetButtonNum*(WIDTH/20+buttonsPlanets[0].width));
        cursorTool = true;
        editingPanel.closed = true;
    }else if (keys && keys[49]) {
        selectedPlanetButtonNum = 1;
        globalButtonXOffset = Math.round(WIDTH/2 - buttonsPlanets[0].width/2 - selectedPlanetButtonNum*(WIDTH/20+buttonsPlanets[0].width));
        bottomPanel.closed = false;
        editingPanel.closed = true;
        cursorTool = false;
    }else if (keys && keys[50]) {
        selectedPlanetButtonNum = 2;
        globalButtonXOffset = Math.round(WIDTH/2 - buttonsPlanets[0].width/2 - selectedPlanetButtonNum*(WIDTH/20+buttonsPlanets[0].width));
        bottomPanel.closed = false;
        editingPanel.closed = true;
        cursorTool = false;
    }else if (keys && keys[51]) {
        selectedPlanetButtonNum = 3;
        globalButtonXOffset = Math.round(WIDTH/2 - buttonsPlanets[0].width/2 - selectedPlanetButtonNum*(WIDTH/20+buttonsPlanets[0].width));
        bottomPanel.closed = false;
        editingPanel.closed = true;
        cursorTool = false;
    }else if (keys && keys[52] && buttonsPlanets.length > 3) {
        selectedPlanetButtonNum = 4;
        globalButtonXOffset = Math.round(WIDTH/2 - buttonsPlanets[0].width/2 - selectedPlanetButtonNum*(WIDTH/20+buttonsPlanets[0].width));
        bottomPanel.closed = false;
        editingPanel.closed = true;
        cursorTool = false;
    }else if (keys && keys[88]) {
        bottomPanel.closed = true;
    }else if (keys && keys[79]) {
        bottomPanel.closed = false;
    }else if ((keys && keys[32])) {
        if(pauseTimer === 0 && modal.style.display !== "block"){
            PAUSED = !PAUSED;
        }
        pauseTimer = 2;
    }

    if (keys && keys[16]) {
        autoOrbit = true;
    }else{
        autoOrbit = false;
    }

    //}
}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function setMaterials(x, y, z, u){
    buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.metals = x;
    buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.rock = y;
    buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.ice = z;
    buttonsPlanets[selectedPlanetButtonNum].planetProperties.materials.gas = u;
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

window.addEventListener("mouseup", clickedNow);
document.getElementById("myCanvas").addEventListener("mousedown", draggedNow);

// IE9, Chrome, Safari, Opera
document.getElementById("myCanvas").addEventListener("mousewheel", MouseWheelHandler, false);
// Firefox
document.getElementById("myCanvas").addEventListener("DOMMouseScroll", MouseWheelHandler, false);

function MouseWheelHandler(e)
{
    // cross-browser wheel delta
    //var e = window.event || e; // old IE support
    e.preventDefault();
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    cameraZoom += delta*cameraZoom/10;

    if(cameraZoom < 0.01){
        cameraZoom = 0.01;
    }
    if(cameraZoom > 5){
        cameraZoom = 5
    }

    if(delta < 0){
        cameraX += (mousePosX - screenHalfWidth)/30 - (cameraX)/10;
        cameraY += (mousePosY - screenHalfHeight)/30 - (cameraY)/10;
    }else{
        cameraX -= (mousePosX - screenHalfWidth)/30 - (cameraX)/10;
        cameraY -= (mousePosY - screenHalfHeight)/30 - (cameraY)/10;
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

    if(mousePosX < 0){
        mousePosX = 0;
    }

}

// When the user clicks the button, open the modal

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    if(changeValue === "Name"){
        objects[windowSelectedPlanet].name = input.value;
    }else if(changeValue === "Mass"){
        objects[windowSelectedPlanet].mass = input.value;
    }else if(changeValue = "AffectedGravity"){
        input.placeholder = "Enter the id's of the planets separated by comas";
    }

    input.value = "";
    PAUSED = false;

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    input.placeholder = "";
    if (event.target == modal) {
        if(input.value === ""){input.value = 0;}
        modal.style.display = "none";
        if(changeValue === "Name"){
            objects[windowSelectedPlanet].name = input.value;
        }else if(changeValue === "Mass"){
            objects[windowSelectedPlanet].mass = parseInt(input.value);
            console.log(objects[windowSelectedPlanet].mass);
        }else if(changeValue === "DeltaX"){
            objects[windowSelectedPlanet].velX = parseInt(input.value);
        }else if(changeValue === "DeltaY"){
            objects[windowSelectedPlanet].velY = parseInt(input.value);
        }else if(changeValue === "Metal"){
            if(parseInt(input.value) > 100){
                input.value = 100;
            }
            objects[windowSelectedPlanet].materials.metals = parseInt(input.value);
            if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas > 100){
                objects[windowSelectedPlanet].materials.rock += 100 - (objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas);
                if(objects[windowSelectedPlanet].materials.rock < 0){
                    objects[windowSelectedPlanet].materials.ice += objects[windowSelectedPlanet].materials.rock;
                    objects[windowSelectedPlanet].materials.rock = 0;
                    if(objects[windowSelectedPlanet].materials.ice < 0){
                        objects[windowSelectedPlanet].materials.gas += objects[windowSelectedPlanet].materials.ice;
                        objects[windowSelectedPlanet].materials.ice = 0;
                        if(objects[windowSelectedPlanet].materials.gas < 0){
                            objects[windowSelectedPlanet].materials.metals = 100;
                            objects[windowSelectedPlanet].materials.gas = 0;
                        }
                    }
                }
            }else if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas < 100){
                objects[windowSelectedPlanet].materials.metals = 100 - (objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas);
            }
        }else if(changeValue === "Rock"){
            if(parseInt(input.value) > 100){
                input.value = 100;
            }
            objects[windowSelectedPlanet].materials.rock = parseInt(input.value);
            if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas > 100){
                objects[windowSelectedPlanet].materials.ice += 100 - (objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas);
                if(objects[windowSelectedPlanet].materials.ice < 0){
                    objects[windowSelectedPlanet].materials.gas += objects[windowSelectedPlanet].materials.ice;
                    objects[windowSelectedPlanet].materials.ice = 0;
                    if(objects[windowSelectedPlanet].materials.gas < 0){
                        objects[windowSelectedPlanet].materials.metals += objects[windowSelectedPlanet].materials.gas;
                        objects[windowSelectedPlanet].materials.gas = 0;
                        if(objects[windowSelectedPlanet].materials.metals < 0){
                            objects[windowSelectedPlanet].materials.rock = 100;
                            objects[windowSelectedPlanet].materials.metals = 0;
                        }
                    }
                }
            }else if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas < 100){
                objects[windowSelectedPlanet].materials.rock = 100 - (objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas);
            }
        }else if(changeValue === "Ice"){
            if(parseInt(input.value) > 100){
                input.value = 100;
            }
            objects[windowSelectedPlanet].materials.ice = parseInt(input.value);
            if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas > 100){
                objects[windowSelectedPlanet].materials.gas += 100 - (objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas);
                if(objects[windowSelectedPlanet].materials.gas < 0){
                    objects[windowSelectedPlanet].materials.metals += objects[windowSelectedPlanet].materials.gas;
                    objects[windowSelectedPlanet].materials.gas = 0;
                    if(objects[windowSelectedPlanet].materials.metals < 0){
                        objects[windowSelectedPlanet].materials.rock += objects[windowSelectedPlanet].materials.metals;
                        objects[windowSelectedPlanet].materials.metals = 0;
                        if(objects[windowSelectedPlanet].materials.rock < 0){
                            objects[windowSelectedPlanet].materials.ice = 100;
                            objects[windowSelectedPlanet].materials.rock = 0;
                        }
                    }
                }
            }else if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas < 100){
                objects[windowSelectedPlanet].materials.ice = 100 - (objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.gas);
            }
        }else if(changeValue === "Gas"){
            if(parseInt(input.value) > 100){
                input.value = 100;
            }
            objects[windowSelectedPlanet].materials.gas = parseInt(input.value);
            if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas > 100){
                objects[windowSelectedPlanet].materials.metals += 100 - (objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas);
                if(objects[windowSelectedPlanet].materials.metals < 0){
                    objects[windowSelectedPlanet].materials.rock += objects[windowSelectedPlanet].materials.metals;
                    objects[windowSelectedPlanet].materials.metals = 0;
                    if(objects[windowSelectedPlanet].materials.rock < 0){
                        objects[windowSelectedPlanet].materials.ice += objects[windowSelectedPlanet].materials.rock;
                        objects[windowSelectedPlanet].materials.rock = 0;
                        if(objects[windowSelectedPlanet].materials.ice < 0){
                            objects[windowSelectedPlanet].materials.gas = 100;
                            objects[windowSelectedPlanet].materials.ice = 0;
                        }
                    }
                }
            }else if(objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.rock + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.gas < 100){
                objects[windowSelectedPlanet].materials.gas = 100 - (objects[windowSelectedPlanet].materials.metals + objects[windowSelectedPlanet].materials.ice + objects[windowSelectedPlanet].materials.rock);
            }
        }else if(changeValue === "AffectedGravity") {
            var tmpString = input.value.split(",").map(function(item) {
                return parseInt(item, 10);
            });
            objects[windowSelectedPlanet].gravityAffectsList = tmpString;
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