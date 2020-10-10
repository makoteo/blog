var versionCode = "V 0.01";
var WIDTH = 1280;
var HEIGHT = 720;

var gameRunning = true;
var frameCount = 0;

var SCORE = 0;
var HIGHSCORE = 0;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var COLORS = {bg: "#081518", darkgreen: "#102E2F", lightgreen: "#2A7E63", lightblue: "#B6D3E7", yellow:"#CCAF66", red:"#D28A77", white:"#F9EFEC", lightgray: "#5E768C"};
var CONTROLS = {a: [87, 83, "W", "S", 0], b: [38, 40, "Up", "Dwn", 1], c:[69, 68, "E", "D", 2], d: [100, 97, "4", "1", 3], e: [82, 70, "R", "F", 4], f: [101, 98, "5", "2", 5], g: [84, 71, "T", "G", 6], h: [102, 99, "6", "3", 7]};
var FONTSIZES = {large1: 80, large2: 80, medium: 40};

var AICONTROLS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var objects = [];
var projectiles = [];

var players = [];
var placers = [];
var buttons = [];

var bots = [];

var maxProjectiles = 2;

var GAMESTATE = "PLACE";

var mousePosX = 0;
var mousePosY = 0;

var CONST = {dividerSize: 10, hingeWidth:5, bound: 5, nonplwid: WIDTH/30};

var clicked = false;

var imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
var pixels = imageData.data;

var image = new Image();
image.id = "pic";
image.src = canvas.toDataURL();

var glitchTimer = 0;

var chromAbb = true;

var spawnChance = [8, 2, 1, 1, 2];
var spawnTotal = spawnChance.reduce(function(acc, val) { return acc + val; }, 0);
var projPoints = [1, 5, 2, 5, 2];

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, width, height, controls, type, bounds){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.length = this.height;
    this.controls = controls;

    if(this.x < WIDTH/2){
        this.team = 0;
    }else{
        this.team = 1;
    }

    this.type = type;

    this.angle = Math.PI/2;
    this.maxRot = 0.03;
    if(this.type === 3){
        this.omega = this.maxRot;
    }else{
        this.omega = 0;
    }
    this.angleAccel = 0.003;

    this.speed = 8;

    this.boundsY = bounds;

    this.ctrlReleased = [true, true];

    this.dividerSize = CONST.dividerSize;

    this.hingeWidth = CONST.hingeWidth;

    this.opacities = [0, 1];
    this.prevY = this.y;

    this.expRad = 0;
    this.expCoolDown = 0;

    this.expectedAngle = Math.PI/2;

    this.pads = [1, 1, 1, 1, 1];

    this.update = function(){

        this.velY = 0;

        if(this.expRad > 0){
            this.expRad += 0.25;
            if(this.expRad > 3.75){
                this.expRad = 0;
            }
        }

        if(this.type === 3){
            if(this.expCoolDown > 0){
                this.omega = 0;
            }else{
                this.omega = this.maxRot;
            }
        }

        if(this.controls.length > 0) {
            if(this.type === 0){
                if ((keys && keys[this.controls[0]] && !players[this.team].ai) || (players[this.team].ai && AICONTROLS[this.controls[4]*2])) {
                    if(this.y > this.boundsY[0]){
                        this.velY = -this.speed;
                    }
                }
                if ((keys && keys[this.controls[1]] && !players[this.team].ai) || (players[this.team].ai && AICONTROLS[this.controls[4]*2+1])) {
                    if(this.y+this.height < this.boundsY[1]){
                        this.velY = this.speed;
                    }
                }
            }else if(this.type === 1){
                /*if (keys && keys[this.controls[0]] && this.ctrlReleased[0] === true && this.opacities[1] === 1) {
                    if(this.y > this.boundsY[0]){
                        this.y -= this.height+this.dividerSize;
                        this.ctrlReleased[0] = false;
                    }
                }
                if (keys && keys[this.controls[1]] && this.ctrlReleased[1] === true && this.opacities[1] === 1) {
                    if(this.y+this.height < this.boundsY[1]){
                        this.y += this.height+this.dividerSize;
                        this.ctrlReleased[1] = false;
                    }
                }*/

                if (((keys && keys[this.controls[0]] && !players[this.team].ai) || (players[this.team].ai && AICONTROLS[this.controls[4]+2])) && this.ctrlReleased[0] === true && this.opacities[1] === 1) {
                    if(this.y > this.boundsY[0]){
                        this.y -= this.height+this.dividerSize;
                        this.ctrlReleased[0] = false;
                    }else{
                        this.y = this.boundsY[1];
                    }
                }
            }else if(this.type === 2){
                if (((keys && keys[this.controls[0]] && !players[this.team].ai) || (players[this.team].ai && AICONTROLS[this.controls[4]+2])) && this.ctrlReleased[0] === true) {
                    //this.omega = -this.omega;
                    this.expectedAngle += Math.PI/4;
                    this.ctrlReleased[0] = false;
                }
                /*if (keys && keys[this.controls[1]] && this.omega > -this.maxRot) {
                    this.omega = -this.maxRot;
                }*/
            }else if(this.type === 3){
                if (((keys && keys[this.controls[0]] && !players[this.team].ai) || (players[this.team].ai && AICONTROLS[this.controls[4]+2])) && this.ctrlReleased[0] === true && this.expCoolDown === 0) {
                    this.expRad = 0.5;
                    this.expCoolDown = 150;
                    this.ctrlReleased[0] = false;
                }
            }else if(this.type === 4){
                if (((keys && keys[this.controls[0]] && !players[this.team].ai) || (players[this.team].ai && AICONTROLS[this.controls[4]+2])) && this.ctrlReleased[0] === true && this.expCoolDown === 0) {
                    for (var i = 0; i < 5; i++) {
                        if (this.pads[i] < 1) {
                            this.pads[i] += 0.2;
                            break;
                        }
                    }
                    this.expCoolDown = 10;
                }
            }

            if(!players[this.team].ai){
                if (keys && !keys[this.controls[0]]){
                    this.ctrlReleased[0] = true;
                }
                if (keys && !keys[this.controls[1]]){
                    this.ctrlReleased[1] = true;
                }
            }else{
                if(frameCount % 6 === 0){
                    this.ctrlReleased[0] = true;
                    this.ctrlReleased[1] = true;
                }
            }
        }

        if(this.expCoolDown > 0){
            this.expCoolDown--;
        }

        //this.angle+=this.omega;
        this.y+=this.velY;

        if(this.type === 2){
            if(this.expectedAngle !== this.angle && this.angle + Math.PI/16 < this.expectedAngle){
                this.angle += Math.PI/16;
            }else{
                this.angle = this.expectedAngle;
            }
        }

        if(this.type === 3){
            this.angle += this.omega;
        }
    };

    this.draw = function(){
        if(this.type === 0) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillStyle = COLORS.white;
            ctx.fillRect(-this.width / 2, 0, this.width, this.height);
            ctx.restore();
        }else if(this.type === 1){

            if(this.prevY !== this.y){
                this.opacities[1] -= 0.15;
                this.opacities[0] += 0.15;
            }

            if(this.opacities[0] >= 1){
                this.prevY = this.y;
                this.opacities[0] = 0;
                this.opacities[1] = 1;
            }

            ctx.strokeStyle = COLORS.lightblue;
            ctx.globalAlpha = 0.5;
            ctx.setLineDash([this.width/2, this.width/2]);
            ctx.strokeRect(this.x-this.width/2, this.boundsY[0], this.width, this.height);
            ctx.strokeRect(this.x-this.width/2, this.boundsY[0] + this.height + this.dividerSize, this.width, this.height);
            ctx.strokeRect(this.x-this.width/2, this.boundsY[0] + 2*this.height + 2*this.dividerSize, this.width, this.height);
            ctx.globalAlpha = 1;
            ctx.setLineDash([0, 0]);

            ctx.globalAlpha = Math.sqrt(this.opacities[0]);
            ctx.fillStyle = COLORS.white;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillRect(-this.width / 2 * this.opacities[0], this.height/2*(1-this.opacities[0]), this.width*this.opacities[0], this.height*this.opacities[0]);
            ctx.restore();

            ctx.globalAlpha = Math.sqrt(this.opacities[1]);
            ctx.fillStyle = COLORS.white;
            ctx.save();
            ctx.translate(this.x, this.prevY);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillRect(-this.width / 2 * this.opacities[1], this.height/2*(1-this.opacities[1]), this.width*this.opacities[1], this.height*this.opacities[1]);
            ctx.restore();

            ctx.globalAlpha = 1;
        }else if(this.type === 2){
            ctx.fillStyle = COLORS.white;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillRect(-this.width*0.5, 0, this.width, this.height);
            ctx.restore();

            ctx.beginPath();
            ctx.arc(this.x, this.y, CONST.hingeWidth, 0, 2 * Math.PI, false);
            ctx.fillStyle = COLORS.white;
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.setLineDash([this.width, this.width]);
            ctx.arc(this.x, this.y, this.height+CONST.bound, 0, 2 * Math.PI, false);
            ctx.strokeStyle = COLORS.lightblue;
            ctx.stroke();
            ctx.setLineDash([0, 0]);
            ctx.globalAlpha = 1;
        }else if(this.type === 3){
            ctx.strokeStyle = COLORS.lightblue;
            ctx.fillStyle = COLORS.lightblue;

            if(this.expCoolDown > 0) {
                ctx.strokeStyle = COLORS.lightgray;
                ctx.fillStyle = COLORS.lightgray;
            }

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height);
            ctx.restore();

            ctx.beginPath();
            //ctx.setLineDash([this.width, this.width]);
            ctx.lineWidth = 3;
            ctx.arc(this.x, this.y, (this.width*0.8), 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.setLineDash([0, 0]);
            ctx.lineWidth = 1;

            ctx.strokeStyle = COLORS.lightblue;

            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.setLineDash([this.width*0.5, this.width*0.5]);
            ctx.arc(this.x, this.y, (this.width)*4, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.setLineDash([0, 0]);
            ctx.globalAlpha = 1;

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.globalAlpha = 1/(this.expRad+1)+0.15;
            //ctx.setLineDash([this.width, this.width]);
            ctx.arc(this.x, this.y, (this.width*this.expRad), 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
        }else if(this.type === 4){
            ctx.fillStyle = COLORS.white;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            for(var i = 0; i < 5; i++){
                ctx.globalAlpha = this.pads[i];
                ctx.fillRect(-this.width*0.5, -this.height*0.5 - this.height*2 - CONST.bound*2 + i*(this.height+CONST.bound), this.width, this.height);
            }
            ctx.restore();
            ctx.globalAlpha = 1;
        }

        if(GAMESTATE === "PLACE"){
            //MOUSE CLICKS
            if(this.type === 0){
                ctx.fillStyle = COLORS.lightblue;
            }else if(this.type === 1){
                if(mousePosX > this.x-this.width && mousePosX < this.x + this.width && mousePosY > this.boundsY[0] && mousePosY < this.boundsY[0] + this.height*3 + this.dividerSize*2){
                    ctx.fillStyle = COLORS.yellow;
                    if(clicked === true){
                        this.switchControls();
                    }
                }else{
                    ctx.fillStyle = COLORS.lightblue;
                }
            }else if(this.type === 2){
                if(getDistance(this.x, this.y, mousePosX, mousePosY) < this.length){
                    ctx.fillStyle = COLORS.yellow;
                    if(clicked === true){
                        this.switchControls();
                    }
                }else{
                    ctx.fillStyle = COLORS.lightblue;
                }
            }else if(this.type === 3){
                if(getDistance(this.x, this.y, mousePosX, mousePosY) < this.width*2){
                    ctx.fillStyle = COLORS.yellow;
                    if(clicked === true){
                        this.switchControls();
                    }
                }else{
                    ctx.fillStyle = COLORS.lightblue;
                }
            }
            else if(this.type === 4){
                if(mousePosX > this.x-this.width && mousePosX < this.x + this.width && mousePosY > this.y - this.height*2.5 - CONST.bound*2 && mousePosY < this.y + this.height*2.5 + CONST.bound*2){
                    ctx.fillStyle = COLORS.yellow;
                    if(clicked === true){
                        this.switchControls();
                    }
                }else{
                    ctx.fillStyle = COLORS.lightblue;
                }
            }

            this.textYOff = 0;
            this.textXOff = -1;
            if(this.x < WIDTH/2){
                this.textXOff = 1;
            }

            ctx.font = FONTSIZES.medium + 'px quickPixel';
            ctx.textAlign = 'center';
            if(this.type === 0){
                ctx.fillText(this.controls[2], this.x + WIDTH/50*this.textXOff, this.y + this.height*0.4 + this.textYOff);
                ctx.fillText("-", this.x + WIDTH/50*this.textXOff, this.y + this.height*0.61 + this.textYOff);
                ctx.fillText(this.controls[3], this.x + WIDTH/50*this.textXOff, this.y + this.height*0.8 + this.textYOff);
            }else if(this.type === 3){
                ctx.fillText(this.controls[2], this.x + WIDTH/40*this.textXOff, this.y + this.height*0.3 + this.textYOff);
            }else{
                ctx.fillText(this.controls[2], this.x + WIDTH/50*this.textXOff, this.y + this.height*0.6 + this.textYOff);
            }

        }

        /*ctx.strokeStyle = COLORS.red;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2*Math.cos(this.angle+Math.PI/2), this.y + this.width/2*Math.sin(this.angle+Math.PI/2));
        ctx.lineTo(this.x + this.width/2*Math.cos(this.angle+Math.PI/2) + this.length*Math.cos(this.angle), this.y + this.width/2*Math.sin(this.angle+Math.PI/2) + this.length*Math.sin(this.angle));
        ctx.stroke();
        ctx.strokeStyle = COLORS.white;*/
    };

    this.switchControls = function(){
        switch(this.controls) {
            case CONTROLS.a: this.controls = CONTROLS.c; break;
            case CONTROLS.b: this.controls = CONTROLS.d; break;
            case CONTROLS.c: this.controls = CONTROLS.e; break;
            case CONTROLS.d: this.controls = CONTROLS.f; break;
            case CONTROLS.e: this.controls = CONTROLS.g; break;
            case CONTROLS.f: this.controls = CONTROLS.h; break;
            case CONTROLS.g: this.controls = CONTROLS.a; break;
            case CONTROLS.h: this.controls = CONTROLS.b; break;
            default: break;
        }
    }
}

function Projectile(x, y, angle, type, spwTimer){
    this.x = x;
    this.y = y;

    this.type = type;

    switch(this.type){
        case 0: this.radius = 4; this.speed = Math.round(Math.random()*5)+4; break;
        case 1: this.radius = 6; this.speed = Math.round(Math.random()*3)+2; break;
        case 2: this.radius = 5; this.speed = Math.round(Math.random()*3)+2; break;
        case 3: this.radius = 4; this.speed = Math.round(Math.random()*2)+2; break;
        case 4: this.radius = 4; this.speed = Math.round(Math.random()*4)+2; break;
    }

    this.startTimer = 100*spwTimer;
    this.animWd = 1-spwTimer;

    this.angle = angle;

    this.velX = this.speed*Math.cos(this.angle);
    this.velY = this.speed*Math.sin(this.angle);

    if(this.type === 1){
        this.explodeTime = Math.floor(Math.random()*800) + 700;
        this.light = true;
    }else if(this.type === 2){
        this.invisTimer = Math.floor(Math.random()*300) + 100;
        this.opacity = 1;
        this.targetOpacity = 1;
    }else if(this.type === 3){
        this.rotAngle = 0;
        this.spawnTimer = Math.floor(Math.random()*400)+400;
    }else if(this.type === 4){
        this.spdChgTimer = Math.floor(Math.random()*100) + 100;
    }

    this.update = function(){
        if(this.startTimer === 0){
            //BOUNCES OFF SIDES
            if(this.y + this.velY < 0 || this.y + this.velY > HEIGHT){
                this.angle = (2*Math.PI - this.angle);
                this.velX = this.speed*Math.cos(this.angle);
                this.velY = this.speed*Math.sin(this.angle);
            }
            //BOUNCES OFF PADDLES

            for(var o in objects){

                //COULD HAVE DONE THIS THROUGH ORS BUT I'M TOO LAZY TO REDO IT
                //Wait, I'm reading this later... And I don't get what I could've done through ors? Am I missing something?

                //var collision = false;

                if(objects[o].type !== 4){
                    var coltemp = false;

                    if(objects[o].type === 0 || objects[o].type === 1 || objects[o].type === 2 ){
                        coltemp = colCircleRectangle(this, objects[o]);
                        var rottop = coltemp.rt;
                    }

                    if(coltemp.col){
                        var rndOff = 0;
                        if(objects[o].type === 0 || objects[o].type === 1){
                            rndOff = (this.y - (objects[o].y + objects[o].height/2))/100;
                        }
                        this.angle = (Math.PI - this.angle) + (objects[o].angle-Math.PI/2+(rottop*Math.PI/2))*2 - rndOff*Math.sign(this.velX)+ (Math.random() * (0.4) - 0.2); // + (Math.random() * (1) - 0.5)

                        this.x = coltemp.colX;
                        this.y = coltemp.colY;
                        if(rottop === 1){
                            this.y += objects[o].velY;
                        }

                        this.velX = this.speed*Math.cos(this.angle);
                        this.velY = this.speed*Math.sin(this.angle);
                        //this.velX = 0;
                        //this.velY = 0;
                        objects[o].omega*=(1+0.5*coltemp.rs);
                    }

                    if(objects[o].type === 3){
                        if(getDistance(this.x, this.y, objects[o].x, objects[o].y) < objects[o].width*objects[o].expRad){
                            this.angle = Math.atan2(this.y - objects[o].y, this.x - objects[o].x) + (Math.random() * (0.4) - 0.2);
                            this.speed = Math.min((300/(getDistance(this.x, this.y, objects[o].x, objects[o].y)+1)), 20);
                        }

                        this.velX = this.speed*Math.cos(this.angle);
                        this.velY = this.speed*Math.sin(this.angle);

                    }
                }else{
                    for(var i = 0; i < 5; i++) {
                        if(objects[o].pads[i] === 1){
                            coltemp = colCircleRectangle(this, {x: objects[o].x - objects[o].width / 2, y: objects[o].y - objects[o].height * 2.5 - CONST.bound * 2 + i * (objects[o].height + CONST.bound), width: objects[o].width, height: objects[o].height, angle: Math.PI / 2, type: objects[o].type, length: objects[o].height, omega: 0});
                            var rottop = coltemp.rt;

                            //ctx.fillRect(objects[o].x - objects[o].width/2, objects[o].y - objects[o].height*2.5 - CONST.bound*2 + i*(objects[o].height+CONST.bound), objects[o].width, objects[o].height);

                            if (coltemp.col) {
                                var rndOff = 0;
                                if (objects[o].type === 0 || objects[o].type === 1) {
                                    rndOff = (this.y - (objects[o].y + objects[o].height / 2)) / 100;
                                }
                                this.angle = (Math.PI - this.angle) + (objects[o].angle - Math.PI / 2) * 2 - rndOff * Math.sign(this.velX) + (Math.random() * (0.4) - 0.2); // + (Math.random() * (1) - 0.5)

                                this.x = coltemp.colX;
                                this.y = coltemp.colY;

                                this.velX = this.speed * Math.cos(this.angle);
                                this.velY = this.speed * Math.sin(this.angle);
                                //this.velX = 0;
                                //this.velY = 0;
                                objects[o].omega *= (1 + 0.5 * coltemp.rs);

                                objects[o].pads[i] = 0;

                                break;
                            }
                        }
                    }
                }

            }

            //UPDATE POSITION
            this.x += this.velX;
            this.y += this.velY;

        }else{
            this.startTimer--;
            if(this.animWd < 1){
                this.animWd+=0.02;
            }
        }
    };

    this.draw = function(){

        if(this.type === 0){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius*this.animWd, 0, 2 * Math.PI, false);
            ctx.fillStyle = COLORS.white;
            ctx.fill();
            /*ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x +this.velX*12, this.y +this.velY*12);
            ctx.stroke();*/
        }else if(this.type === 1){
            this.explodeTime--;

            ctx.fillStyle = COLORS.white;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius*this.animWd, 0, 2 * Math.PI, false);
            ctx.fill();

            if(this.explodeTime > 500){
                ctx.fillStyle = 'green';
            }else if(this.explodeTime > 200){
                ctx.fillStyle = 'orange';
            }else{
                ctx.fillStyle = 'red';
                if(frameCount % 20 === 0){
                    this.light = !this.light;
                }
            }
            ctx.globalAlpha = 1;
            if(this.light){
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius*0.5*this.animWd, 0, 2 * Math.PI, false);
                ctx.fill();
            }
        }else if(this.type === 2){

            if(this.x > WIDTH*0.1 && this.x < WIDTH*0.9){
                if((frameCount + 1) % this.invisTimer === 0){
                    this.targetOpacity = Math.abs(this.targetOpacity-1);
                }
            }else{
                this.targetOpacity = 1;
            }

            if(this.opacity < this.targetOpacity){
                this.opacity = Math.min(1, this.opacity+0.05);
            }else if(this.opacity > this.targetOpacity){
                this.opacity = Math.max(0, this.opacity-0.05);
            }

            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius*this.animWd, 0, 2 * Math.PI, false);
            ctx.fillStyle = COLORS.lightgreen;
            ctx.fill();
            ctx.globalAlpha = 1;
        }else if(this.type === 3){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotAngle);
            ctx.fillStyle = COLORS.white;
            ctx.fillRect(-this.radius*2*this.animWd, -this.radius*2*this.animWd, this.radius*4*this.animWd, this.radius*4*this.animWd);
            ctx.restore();

            this.rotAngle+=0.02;
        }else if(this.type === 4){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(-this.radius*this.animWd, -this.radius*this.animWd);
            ctx.lineTo(this.radius*2*this.animWd,0);
            ctx.lineTo(-this.radius*this.animWd,this.radius*this.animWd);
            ctx.rotate(this.rotAngle);
            ctx.fillStyle = COLORS.white;
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            if((frameCount + 1) % this.spdChgTimer === 0){
                this.speed = Math.round(Math.random()*8)+2;
                this.velX = this.speed * Math.cos(this.angle);
                this.velY = this.speed * Math.sin(this.angle);
            }
        }
    };
}

function Placer(type, width, height, controls, pos){
    this.type = type;
    this.placed = false;
    this.finished = false;
    this.pos = pos;
    if(this.pos.length === 0){
        this.x = mousePosX;
        this.y = mousePosY;
    }else{
        this.x = pos[0];
        this.y = pos[1];
    }
    this.width = width;
    this.height = height;
    this.controls = controls;

    this.placeable = true;

    //CHANGE FOLLOWING
    this.dividerSize = CONST.dividerSize;
    this.hingeWidth = CONST.hingeWidth;

    this.boundsY = [0, 0];

    this.anim = [1, 1];

    if(this.type === 1){
        this.boundsY[0] = this.y-this.height*1.5-this.dividerSize;
        this.boundsY[1] = this.y+this.height*0.5+this.dividerSize;
    }

    this.update = function(){
        if(this.placed === false && this.pos.length === 0){
            this.x = mousePosX;
            this.y = mousePosY;
        }

        this.placeable = true;

        //TODO Centerline check

        if(this.type === 1){
            if(this.boundsY[0] < 0 || this.boundsY[1]+this.height > HEIGHT || this.x < CONST.nonplwid || this.x > WIDTH - CONST.nonplwid || (this.x > WIDTH/2-CONST.nonplwid && this.x < WIDTH/2+CONST.nonplwid)){
                this.placeable = false;
            }
        }else if(this.type === 2){
            if(this.y - this.height - CONST.bound < 0 || this.y + this.height + CONST.bound > HEIGHT || this.x - this.height - CONST.bound < CONST.nonplwid || this.x > WIDTH - this.height - CONST.bound || (this.x + this.height > WIDTH/2-CONST.nonplwid && this.x - this.height < WIDTH/2+CONST.nonplwid)){
                this.placeable = false;
            }
        }else if(this.type === 3){
            if(this.y - this.height*4 - CONST.bound < 0 || this.y + this.height*4 + CONST.bound > HEIGHT || this.x - this.height*4 - CONST.bound < CONST.nonplwid || this.x > WIDTH - this.height*4 - CONST.bound || (this.x + this.width*4 > WIDTH/2-CONST.nonplwid && this.x - this.width*4 < WIDTH/2+CONST.nonplwid)){
                this.placeable = false;
            }
        }else if(this.type === 4){
            if(this.y - this.height*2.5 - CONST.bound*3 < 0 || this.y + this.height*2.5 + CONST.bound*3 > HEIGHT || this.x - this.width - CONST.bound < CONST.nonplwid || this.x > WIDTH - this.width - CONST.bound || (this.x + this.width > WIDTH/2-CONST.nonplwid && this.x - this.width < WIDTH/2+CONST.nonplwid)){
                this.placeable = false;
            }
        }

        if(this.placeable === true){
            for(var j = 0; j < objects.length; j++){
                if(this.type === 1){
                    if(objects[j].type === 1){
                        if(colRect({x: this.x + this.width/2, y:this.boundsY[0], width:this.width, height:3*this.height+2*this.dividerSize}, {x: objects[j].x - objects[j].width, y:objects[j].boundsY[0]-objects[j].height*0.2, width:objects[j].width*4, height:3*objects[j].height+2*objects[j].dividerSize+objects[j].height*0.4})){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 2){
                        if(colCircleRectangle({x: objects[j].x, y: objects[j].y, radius: objects[j].height+CONST.bound, velX:0, velY:0}, {x: this.x, y:this.boundsY[0], width:this.width, height:3*this.height+2*this.dividerSize, length:3*this.height+2*this.dividerSize, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 3){
                        if(colCircleRectangle({x: objects[j].x, y: objects[j].y, radius: objects[j].height*4+CONST.bound, velX:0, velY:0}, {x: this.x, y:this.boundsY[0], width:this.width, height:3*this.height+2*this.dividerSize, length:3*this.height+2*this.dividerSize, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 4){
                        if(colRect({x: this.x - this.width/2, y:this.boundsY[0], width:this.width, height:3*this.height+2*this.dividerSize}, {x: objects[j].x - objects[j].width*2, y:objects[j].y - objects[j].height*2.5 - CONST.bound*4, width:objects[j].width*4, height:objects[j].height*5 + CONST.bound*8})){
                            this.placeable = false;
                        }
                    }
                }else if(this.type === 2){
                    if(objects[j].type === 1){
                        if(colCircleRectangle({x: this.x, y: this.y, radius: this.height+CONST.bound, velX:0, velY:0}, {x: objects[j].x, y:objects[j].boundsY[0]-objects[j].height*0.2, width:objects[j].width*4, height:3*objects[j].height+2*objects[j].dividerSize+objects[j].height*0.4, length:3*objects[j].height+2*objects[j].dividerSize, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 2){
                        if(getDistance(this.x, this.y, objects[j].x, objects[j].y) < (this.height + objects[j].length + 2*CONST.bound)){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 3){
                        if(getDistance(this.x, this.y, objects[j].x, objects[j].y) < (objects[j].height*8)){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 4){
                        if(colCircleRectangle({x: this.x, y: this.y, radius: this.height+CONST.bound, velX:0, velY:0}, {x: objects[j].x, y:objects[j].y - objects[j].height*2.5 - CONST.bound*4, width:objects[j].width*4, height:objects[j].height*5 + CONST.bound*8, length:objects[j].height*5 + CONST.bound*8, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }
                }else if(this.type === 3){
                    if(objects[j].type === 1){
                        if(colCircleRectangle({x: this.x, y: this.y, radius: this.height*4+CONST.bound, velX:0, velY:0}, {x: objects[j].x, y:objects[j].boundsY[0]-objects[j].height*0.2, width:objects[j].width*4, height:3*objects[j].height+2*objects[j].dividerSize+objects[j].height*0.4, length:3*objects[j].height+2*objects[j].dividerSize, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 2){
                        if(getDistance(this.x, this.y, objects[j].x, objects[j].y) < (this.height*4 + objects[j].length + 2*CONST.bound)){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 3){
                        if(getDistance(this.x, this.y, objects[j].x, objects[j].y) < (objects[j].height*8)){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 4){
                        if(colCircleRectangle({x: this.x, y: this.y, radius: this.height*4+CONST.bound, velX:0, velY:0}, {x: objects[j].x, y:objects[j].y - objects[j].height*2.5 - CONST.bound*4, width:objects[j].width*4, height:objects[j].height*5 + CONST.bound*8, length:objects[j].height*5 + CONST.bound*8, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }
                }else if(this.type === 4){
                    if(objects[j].type === 1){
                        if(colRect({x: this.x - this.width*2, y:this.y - this.height*2.5 - CONST.bound*4, width:this.width*4, height:this.height*5 + CONST.bound*8}, {x: objects[j].x - objects[j].width/2, y:objects[j].boundsY[0], width:objects[j].width, height:3*objects[j].height+2*objects[j].dividerSize})){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 2){
                        if(colCircleRectangle({x: objects[j].x, y: objects[j].y, radius: objects[j].height+CONST.bound, velX:0, velY:0}, {x: this.x, y:this.y - this.height*2.5 - CONST.bound*4, width:this.width*4, height:this.height*5 + CONST.bound*8, length:this.height*5 + CONST.bound*8, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 3){
                        if(colCircleRectangle({x: objects[j].x, y: objects[j].y, radius: objects[j].height*4+CONST.bound, velX:0, velY:0}, {x: this.x, y:this.y - this.height*2.5 - CONST.bound*4, width:this.width*4, height:this.height*5 + CONST.bound*8, length:this.height*5 + CONST.bound*8, angle:Math.PI/2}).col){
                            this.placeable = false;
                        }
                    }else if(objects[j].type === 4){
                        if(colRect({x: this.x - this.width/2, y:this.y - this.height*2.5 - CONST.bound*4, width:this.width, height:5*this.height+4*CONST.bound}, {x: objects[j].x - objects[j].width*2, y:objects[j].y - objects[j].height*3 - CONST.bound*4, width:objects[j].width*4, height:objects[j].height*5 + CONST.bound*8})){
                            this.placeable = false;
                        }
                    }
                }
            }
        }

        if(this.type === 1){
            this.boundsY[0] = this.y-this.height*1.5-this.dividerSize;
            this.boundsY[1] = this.y+this.height*0.5+this.dividerSize;
        }

        if(clicked === true && this.anim[0] === 1 && this.placeable === true){
            this.placed = true;
            this.anim = [0, 0];
        }

        if(this.anim[0] <= 1 && this.placed){
            this.anim[0]+=0.15;
        }else if(this.anim[1] <= 1 && this.placed) {
            this.anim[1]+=0.15;
        }else if(this.anim[1] > 1){
            this.finished = true;

            if(this.x < WIDTH/2){
                this.controls = CONTROLS.c;
            }else{
                this.controls = CONTROLS.d;
            }

            if(this.type === 1){
                objects.push(new Object(this.x, this.y-this.height/2, this.width, this.height, this.controls, this.type, this.boundsY));
            }else if(this.type === 2 || this.type === 3 || this.type === 4){
                objects.push(new Object(this.x, this.y, this.width, this.height, this.controls, this.type, this.boundsY));
            }
        }
    };
    this.draw = function(){
        if(this.type === 1){
            if(this.placed === false){
                if(this.placeable === true){
                    ctx.strokeStyle = COLORS.yellow;
                }else{
                    ctx.strokeStyle = COLORS.red;
                }
            }else{
                ctx.strokeStyle = COLORS.lightblue;
            }
            ctx.globalAlpha = 0.5;
            ctx.setLineDash([this.width/2, this.width/2]);
            ctx.strokeRect(this.x-this.width/2*this.anim[0], this.boundsY[0] + this.height/2*(1-this.anim[1]), this.width*this.anim[0], this.height*this.anim[1]);
            ctx.strokeRect(this.x-this.width/2*this.anim[0], this.boundsY[0] + this.height + this.dividerSize + this.height/2*(1-this.anim[1]), this.width*this.anim[0], this.height*this.anim[1]);
            ctx.strokeRect(this.x-this.width/2*this.anim[0], this.boundsY[0] + 2*this.height + 2*this.dividerSize + this.height/2*(1-this.anim[1]), this.width*this.anim[0], this.height*this.anim[1]);
            ctx.globalAlpha = 1;
            ctx.setLineDash([0, 0]);

            if(this.placeable === true){
                ctx.fillStyle = COLORS.white;
            }else{
                ctx.fillStyle = COLORS.red;
            }
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillRect(-this.width / 2*this.anim[0], -this.height/2*this.anim[1], this.width*this.anim[0], this.height*this.anim[1]); //0011
            ctx.restore();
        }else if(this.type === 2){
            if(this.placeable === true){
                ctx.fillStyle = COLORS.white;
            }else{
                ctx.fillStyle = COLORS.red;
            }
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillRect(-this.width*0.5*this.anim[0], 0, this.width*this.anim[0], this.height*this.anim[1]);
            ctx.restore();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.hingeWidth*this.anim[0], 0, 2 * Math.PI, false);
            if(this.placeable === true){
                ctx.fillStyle = COLORS.white;
            }else{
                ctx.fillStyle = COLORS.red;
            }
            ctx.fill();

            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.setLineDash([this.width, this.width]);
            ctx.arc(this.x, this.y, (this.height+5)*this.anim[1], 0, 2 * Math.PI, false);
            if(this.placed === false){
                if(this.placeable === true){
                    ctx.strokeStyle = COLORS.yellow;
                }else{
                    ctx.strokeStyle = COLORS.red;
                }
            }else{
                ctx.strokeStyle = COLORS.lightblue;
            }
            ctx.stroke();
            ctx.setLineDash([0, 0]);
            ctx.globalAlpha = 1;
        }else if(this.type === 3){
            if(this.placeable === true){
                ctx.fillStyle = COLORS.yellow;
                ctx.strokeStyle = COLORS.yellow;
            }else{
                ctx.fillStyle = COLORS.red;
                ctx.strokeStyle = COLORS.red;
            }
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            ctx.fillRect(-this.width*0.5*this.anim[0], -this.height*0.5*this.anim[1], this.width*this.anim[0], this.height*this.anim[1]);
            ctx.restore();

            ctx.beginPath();
            ctx.lineWidth = 3;
            //ctx.setLineDash([this.width, this.width]);
            ctx.arc(this.x, this.y, (this.width*0.8)*this.anim[1], 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.setLineDash([0, 0]);
            ctx.lineWidth = 1;
            ctx.strokeStyle = COLORS.white;

            if(this.placed === false){
                if(this.placeable === true){
                    ctx.strokeStyle = COLORS.yellow;
                }else{
                    ctx.strokeStyle = COLORS.red;
                }
            }else{
                ctx.strokeStyle = COLORS.lightblue;
            }
            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.setLineDash([this.width*0.5, this.width*0.5]);
            ctx.arc(this.x, this.y, (this.width)*4*this.anim[0], 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.setLineDash([0, 0]);
            ctx.globalAlpha = 1;
        }else if(this.type === 4){
            if(this.placeable === true){
                ctx.fillStyle = COLORS.lightblue;
            }else{
                ctx.fillStyle = COLORS.red;
            }
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
            for(var i = 0; i < 5; i++){
                ctx.fillRect(-this.width*0.5*this.anim[0], -this.height*0.5*this.anim[1] - this.height*2 - CONST.bound*2 + i*(this.height+CONST.bound), this.width*this.anim[0], this.height*this.anim[1]);
            }
            ctx.restore();
        }
    };
}

function Button(x, y, width, height, use, text, val){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.use = use;
    this.text = text;
    this.val = val;

    this.hover = false;

    this.angle = 0;
    this.textScale = 0;
    this.yOff = 0;
    this.xOff = 0;

    this.maxAng = 0.1;

    this.update = function(){
        this.hover = false;
        if(mousePosX > this.x-this.width/2 && mousePosX < this.x + this.width/2 && mousePosY > this.y - this.height/2 && mousePosY < this.y + this.height/2){
            this.hover = true;
            if(this.angle < this.maxAng){
                this.angle+=0.03;
                this.textScale += 1;
                this.yOff+=0.5;
                this.xOff-=0.5;
            }
            if(clicked){
                if(this.use === "play"){
                    GAMESTATE = "GAME";
                    placers = [];
                    buttons = [];

                    for(var f = 0; f < players.length; f++){
                        if(players[f].ai){
                            for(var objs = 0; objs < objects.length; objs++){
                                if(objects[objs].team === f){
                                    players[f].paddles.push(objs);
                                }
                            }
                        }
                    }
                }
            }
        }else{
            if(this.angle > 0){
                this.angle-=0.03;
                this.textScale-=1;
                this.xOff+=0.5;
                this.yOff-=0.5;
            }else{
                this.angle = 0;
                this.textScale = 0;
                this.xOff = 0;
                this.yOff = 0;
            }
        }
    };

    this.draw = function(){
        ctx.textAlign = 'center';
        if(this.hover === true){
            ctx.fillStyle = COLORS.white;
        }else{
            ctx.fillStyle = COLORS.lightblue;
        }

        ctx.font = (FONTSIZES.large1 + this.textScale) + 'px quickPixel';

        ctx.save();
        ctx.translate(this.x + this.xOff, this.y + this.yOff);
        ctx.rotate(this.angle);
        ctx.fillText(text, 0, 0, this.width+this.textScale);
        ctx.restore();
    };
}

function Player(id, ai){
    this.id = id;
    this.points = 0;
    this.paddles = 0;

    this.ai = ai;

    this.paddles = [];

    if(this.ai){
        bots.push(new AI(this.id));
    }
}

function AI(id){
    this.id = id;
    this.update = function(){

        this.projDis = [];
        for(var st = 0; st < objects.length; st++){
            if(objects[st].team === 1){
                var tmpArrProj = [];
                tmpArrProj.push(st);
                for(var pr = 0; pr < projectiles.length; pr++){
                    if(projectiles[pr].velX > 0 && (projectiles[pr].x*1.2 + projectiles[pr].velX*20 > objects[st].x) && (projectiles[pr].x < objects[st].x)){
                        tmpArrProj.push([(objects[st].x - projectiles[pr].x), pr]);
                    }
                }
                tmpArrProj.sort(sortFunction);
                this.projDis.push(tmpArrProj);
            }
        }

        for(var o = 0; o < this.projDis.length; o++){
            if(this.projDis[o].length > 1) {
                if(objects[this.projDis[o][0]].team === this.id){
                    if(objects[this.projDis[o][0]].type === 0){
                        //console.log(this.projDis);
                        if((projectiles[this.projDis[o][1][1]].y - (objects[this.projDis[o][0]].y + objects[this.projDis[o][0]].height/2)) < 0){
                            AICONTROLS[objects[this.projDis[o][0]].controls[4]*2] = 1;
                        }else if((projectiles[this.projDis[o][1][1]].y - (objects[this.projDis[o][0]].y + objects[this.projDis[o][0]].height/2)) > CONST.bound*4){
                            AICONTROLS[objects[this.projDis[o][0]].controls[4]*2 + 1] = 1;
                        }
                    }else if(objects[this.projDis[o][0]].type === 1){
                        //console.log(this.projDis);
                        if((projectiles[this.projDis[o][1][1]].y < (objects[this.projDis[o][0]].y)) && projectiles[this.projDis[o][1][1]].y > (objects[this.projDis[o][0]].boundsY[0])){
                            AICONTROLS[objects[this.projDis[o][0]].controls[4]+2] = 1;
                        }else if((projectiles[this.projDis[o][1][1]].y > (objects[this.projDis[o][0]].y + objects[this.projDis[o][0]].height/2)) && (projectiles[this.projDis[o][1][1]].y < (objects[this.projDis[o][0]].boundsY[1] + objects[this.projDis[o][0]].height))){
                            AICONTROLS[objects[this.projDis[o][0]].controls[4]+2] = 1;
                        }

                        if(objects[this.projDis[o][0]].y < projectiles[this.projDis[o][1][1]].y && projectiles[this.projDis[o][1][1]].y < (objects[this.projDis[o][0]].y + objects[this.projDis[o][0]].height)){
                            AICONTROLS[objects[this.projDis[o][0]].controls[4]+2] = 0;
                        }
                    }else if(objects[this.projDis[o][0]].type === 2 && objects[this.projDis[o][0]].ctrlReleased[0] === true){
                        if((projectiles[this.projDis[o][1][1]].y < (objects[this.projDis[o][0]].y)) && projectiles[this.projDis[o][1][1]].y > (objects[this.projDis[o][0]].y - objects[this.projDis[o][0]].length*1.5)){

                            console.log((objects[this.projDis[o][0]].angle + Math.PI/2) % Math.PI*4);

                            if((objects[this.projDis[o][0]].angle + Math.PI/2) % Math.PI*4 !== 0){
                                AICONTROLS[objects[this.projDis[o][0]].controls[4]+2] = 1;
                            }
                        }else if((projectiles[this.projDis[o][1][1]].y > (objects[this.projDis[o][0]].y)) && projectiles[this.projDis[o][1][1]].y < (objects[this.projDis[o][0]].y + objects[this.projDis[o][0]].length)){
                            if((objects[this.projDis[o][0]].angle - Math.PI/2) % Math.PI*4 !== 0){
                                AICONTROLS[objects[this.projDis[o][0]].controls[4]+2] = 1;
                            }
                        }
                    }else if(objects[this.projDis[o][0]].type === 3){
                        if(projectiles[this.projDis[o][1][1]].x < (objects[this.projDis[o][0]].x) && getDistance(projectiles[this.projDis[o][1][1]].x, projectiles[this.projDis[o][1][1]].y, objects[this.projDis[o][0]].x, objects[this.projDis[o][0]].y) < objects[this.projDis[o][0]].height*2.5){
                            AICONTROLS[objects[this.projDis[o][0]].controls[4]+2] = 1;
                        }
                    }else if(objects[this.projDis[o][0]].type === 4){
                        if(Math.random() > 0.8){
                            AICONTROLS[objects[this.projDis[o][0]].controls[4]+2] = 1;
                        }
                    }
                }
            }
        }
        /*
        if(this.projDis[0].length > 1){
            this.paddles = [];
            for(var o = 0; o < objects.length; o++){
                if(objects[o].team === 1){
                    this.paddles.push(o);
                }
            }

            for(var pad = 0; pad < this.paddles.length; pad++){
                if(objects[this.paddles[pad]].team === this.id){
                    if(objects[this.paddles[pad]].type === 0){
                        if((projectiles[this.projDis[0][1]].y - (objects[this.paddles[pad]].y + objects[this.paddles[pad]].height/2)) < 0){
                            if(objects[this.paddles[pad]].y - objects[this.paddles[pad]].speed > 0){
                                objects[this.paddles[pad]].y -= objects[this.paddles[pad]].speed;
                            }else{
                                objects[this.paddles[pad]].y = 0;
                            }
                        }else if((projectiles[this.projDis[0][1]].y - (objects[this.paddles[pad]].y + objects[this.paddles[pad]].height/2)) > CONST.bound*4){
                            if(objects[this.paddles[pad]].y + objects[this.paddles[pad]].height + objects[this.paddles[pad]].speed < HEIGHT){
                                objects[this.paddles[pad]].y += objects[this.paddles[pad]].speed;
                            }else{
                                objects[this.paddles[pad]].y = HEIGHT - objects[this.paddles[pad]].height;
                            }
                        }
                    }
                }
            }*/
    }
}

function WaveSpawner(){
    this.update = function(){
        if(frameCount % 1800 === 0){
            var tmpfrcount = frameCount/1800;
            spawnChance[0] = Math.round(Math.pow(tmpfrcount, 0.9)+8+Math.sin(tmpfrcount)*0.5);
            spawnChance[1] = Math.round(Math.pow(tmpfrcount, 1.1)+2-Math.sin(tmpfrcount)*0.75);
            spawnChance[2] = Math.round(Math.pow(tmpfrcount, 0.98)+1-Math.sin(tmpfrcount));
            spawnChance[3] = Math.round(Math.pow(tmpfrcount, 1.05)+1-Math.sin(tmpfrcount)*1.5);
            spawnChance[4] = Math.round(Math.pow(tmpfrcount, 0.95)+2+Math.sin(tmpfrcount)*0.2);
            spawnTotal = spawnChance.reduce(function(acc, val) { return acc + val; }, 0);
            //console.log(spawnChance);
        }
        if(projectiles.length < maxProjectiles){
            var projNum = 0;
            var rnd = Math.random();
            for(var p = 0; p < spawnChance.length; p++){
                if(rnd < (spawnChance[p]+projNum)/spawnTotal){
                    projectiles.push(new Projectile(WIDTH/2, Math.random()*HEIGHT/2+HEIGHT/4, Math.PI*Math.round(Math.random()), p, 1));
                    break;
                }
                projNum+=spawnChance[p];
            }
        }
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

players.push(new Player(0, 0));
players.push(new Player(1, 1));

objects.push(new Object(10, HEIGHT/2-50, 10, 100, CONTROLS.a, 0, [0, HEIGHT]));
objects.push(new Object(WIDTH-10, HEIGHT/2-50, 10, 100, CONTROLS.b, 0, [0, HEIGHT]));

var spawner = new WaveSpawner();

//objects.push(new Object(200, HEIGHT/2, 5, 60, CONTROLS.c, 2, [HEIGHT/2-50-100-10, HEIGHT/2-50+100+10]));
//objects.push(new Object(WIDTH-200, HEIGHT/2, 5, 60, CONTROLS.d, 2, [HEIGHT/2-50-100-10, HEIGHT/2-50+100+10]));

//objects.push(new Object(300, HEIGHT/2-30, 10, 60, CONTROLS.e, 1, [HEIGHT/2-30-60-10, HEIGHT/2-30+60+10]));

buttons.push(new Button(WIDTH - WIDTH/20, HEIGHT- HEIGHT/30, WIDTH/10, HEIGHT/15, "play", "PLAY", 0));

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function colCircleRectangle ( circle, rect ) {

    var rectX = rect.x - rect.width/2*Math.cos(rect.angle - Math.PI / 2 );
    var rectY = rect.y - rect.width/2*Math.sin(rect.angle - Math.PI / 2 );

    if(rect.type === 3){
        rectY -= rect.height/2;
    }

    var rectReferenceX = rectX;
    var rectReferenceY = rectY;

    // Rotate circle's center point back
    var unrotatedCircleX = Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x + circle.velX - rectX ) - Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y + circle.velY - rectY ) + rectX;
    var unrotatedCircleY = Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x + circle.velX - rectX ) + Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y + circle.velY - rectY ) + rectY;

    var unrotatedCircleXB = Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x - rectX ) - Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y - rectY ) + rectX;
    var unrotatedCircleYB = Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x - rectX ) + Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y - rectY ) + rectY;

    //ctx.fillStyle = COLORS.red;
    //ctx.fillRect(rectX, rectY, rect.width, rect.height);

    /*ctx.beginPath();
    ctx.arc(unrotatedCircleX, unrotatedCircleY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = COLORS.yellow;
    ctx.fill();*/

    //ctx.fillRect(rect.x - rect.width/2, rect.y, rect.width, rect.height);

    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
    var closestX, closestY;

    var offSetXCol = 0;
    var offSetYCol = 0;

    var rottop = 0;
    var rotspd = 0;

    // Find the unrotated closest x point from center of unrotated circle
    if ( unrotatedCircleX < rectReferenceX ) {
        closestX = rectReferenceX;
    } else if ( unrotatedCircleX > rectReferenceX + rect.width ) {
        closestX = rectReferenceX + rect.width;
    } else {
        closestX = unrotatedCircleX;
    }

    // Find the unrotated closest y point from center of unrotated circle
    if ( unrotatedCircleY < rectReferenceY ) {
        closestY = rectReferenceY;
        rottop = 1;
    } else if ( unrotatedCircleY > rectReferenceY + rect.height ) {
        closestY = rectReferenceY + rect.height;
        rottop = 1;
    } else {
        closestY = unrotatedCircleY;
    }

    var closestPoint = getNearestPointInPerimeter(rectReferenceX, rectReferenceY, rect.width, rect.length, unrotatedCircleXB, unrotatedCircleYB);

    if(closestPoint[0] === rectReferenceX && closestPoint[1] === rectReferenceY){
        closestPoint[0] -= circle.radius*0.35;
        closestPoint[1] -= circle.radius*0.35;
    }else if(closestPoint[0] === rectReferenceX + rect.width && closestPoint[1] === rectReferenceY){
        closestPoint[0] += circle.radius*0.35;
        closestPoint[1] -= circle.radius*0.35;
    }else if(closestPoint[0] === rectReferenceX && closestPoint[1] === rectReferenceY + rect.length){
        closestPoint[0] -= circle.radius*0.35;
        closestPoint[1] += circle.radius*0.35;
    }else if(closestPoint[0] === rectReferenceX + rect.width && closestPoint[1] === rectReferenceY + rect.length){
        closestPoint[0] += circle.radius*0.35;
        closestPoint[1] += circle.radius*0.35;
    }else{
        if(closestPoint[0] === rectReferenceX){
            closestPoint[0] -= circle.radius*1;
        }else if(closestPoint[0] === rectReferenceX + rect.width){
            closestPoint[0] += circle.radius*1;
        }

        if(closestPoint[1] === rectReferenceY){
            closestPoint[1] -= circle.radius*1;
        }else if(closestPoint[1] === rectReferenceY + rect.length){
            closestPoint[1] += circle.radius*1;
        }
    }

    // Determine collision
    var collision = false;
    var distance = getDistance( unrotatedCircleX, unrotatedCircleY, closestX, closestY );

    var rotClosestX, rotClosestY;

    rotClosestX = Math.cos(rect.angle + rect.omega - Math.PI / 2) * (closestPoint[0] - rectX) - Math.sin(rect.angle + rect.omega - Math.PI / 2) * (closestPoint[1] - rectY) + rectX;
    rotClosestY = Math.sin(rect.angle + rect.omega - Math.PI / 2) * (closestPoint[0] - rectX) + Math.cos(rect.angle + rect.omega - Math.PI / 2) * (closestPoint[1] - rectY) + rectY;

    /*ctx.beginPath();
    ctx.arc(rotClosestX, rotClosestY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = COLORS.yellow;
    ctx.fill();*/

    if ( distance < circle.radius ) {
        collision = true;
        //console.log(closestPoint);
    }
    else {
        collision = false;
    }

    return {col: collision, colX: rotClosestX, colY: rotClosestY, rt: rottop, rs:rotspd};
}

function colRect(rect1, rect2){
    if(rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true;
    }
}

function getDistance( fromX, fromY, toX, toY ) {
    var dX = Math.abs( fromX - toX );
    var dY = Math.abs( fromY - toY );

    return Math.sqrt( ( dX * dX ) + ( dY * dY ) );
}

function clamp(n,lower,upper) {
    return Math.max(lower, Math.min(upper, n));
}

function getNearestPointInPerimeter(l,t,w,h,xp,yp) {
    var r = l+w,
        b = t+h;

    var x = clamp(xp,l,r),
        y = clamp(yp,t,b);

    var dl = Math.abs(x-l),
        dr = Math.abs(x-r),
        dt = Math.abs(y-t),
        db = Math.abs(y-b);

    var m = Math.min(dl,dr,dt,db);

    return (m===dt) ? [x,t] :
        (m===db) ? [x,b] :
            (m===dl) ? [l,y] : [r,y];
}

function buildPaddles(){
    var z = 0;
    while(z < 100){
        placers = [];
        placers.push(new Placer(1, 10, 60, CONTROLS.b, [Math.round(Math.random()*WIDTH/2)+WIDTH/2, Math.round(Math.random()*HEIGHT)]));
        placers[placers.length-1].update();
        if(placers[placers.length-1].placeable === true){
            placers[placers.length-1].placed = true;
            break;
        }
        z++;
    }
    if(z === 100){
        placers = [];
        console.log("FAILED TO PLACE");
    }
}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    window.onmousemove = logMouseMove;

    /*ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);*/

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = COLORS.lightblue;
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([0, 0]);
    ctx.lineWidth = 1;

    if(gameRunning === true) {

        frameCount++;

        for(var i = 0; i < buttons.length; i++){
            buttons[i].update();
            if(buttons.length !== 0){
                buttons[i].draw();
            }
        }

        if(GAMESTATE === "GAME") {
            spawner.update();
            for (var i = 0; i < bots.length; i++) {
                bots[i].update();
            }
        }

        for(var i = 0; i < objects.length; i++){
            if(GAMESTATE === "GAME"){
                objects[i].update();
            }
            objects[i].draw();
        }

        if(GAMESTATE === "MENU"){

        }else if(GAMESTATE === "PLACE"){
            if(placers.length === 0 || placers[0].placed === false){
                if(keys && keys[49]){
                    placers = [];
                    placers.push(new Placer(1, 10, 60, CONTROLS.a, []));
                }else if(keys && keys[50]){
                    placers = [];
                    placers.push(new Placer(2, 5, 60, CONTROLS.a, []));
                }else if(keys && keys[51]){
                    placers = [];
                    placers.push(new Placer(3, 20, 20, CONTROLS.a, []));
                }else if(keys && keys[52]){
                    placers = [];
                    placers.push(new Placer(4, 10, 20, CONTROLS.a, []));
                }
            }

            if(placers.length > 0){
                placers[0].update();
                placers[0].draw();
                if(placers[0].finished === true){
                    placers = [];
                }
            }
        }else if(GAMESTATE === "GAME"){

            for(var z = 0; z < AICONTROLS.length; z++){
                AICONTROLS[z] = 0;
            }

            for(var i = 0; i < projectiles.length; i++){
                var dlt = false;
                projectiles[i].update();
                projectiles[i].draw();

                if(projectiles[i].type === 1){
                    if(projectiles[i].explodeTime <= 0){
                        for(var ex = 0; ex < 8; ex++){
                            projectiles.push(new Projectile(projectiles[i].x, projectiles[i].y, ex*Math.PI/4 + Math.PI/8, 0, 0));
                        }
                        projectiles.splice(i, 1);
                        dlt = true;
                    }
                }

                if(projectiles[i].type === 3){
                    if(frameCount % projectiles[i].spawnTimer === 0){
                        for(var ex = 0; ex < 4; ex++){
                            projectiles.push(new Projectile(projectiles[i].x, projectiles[i].y, ex*Math.PI/2 + projectiles[i].rotAngle, 0, 0));
                        }
                    }
                }

                if(dlt === false){
                    if( projectiles[i].x < 0){
                        players[1].points += projPoints[projectiles[i].type];
                        FONTSIZES.large2 = 100;
                        projectiles.splice(i, 1);
                        if(players[1].points % 10 === 0){
                            maxProjectiles++;
                        }
                    }else if( projectiles[i].x > WIDTH){
                        players[0].points += projPoints[projectiles[i].type];
                        FONTSIZES.large1 = 100;
                        projectiles.splice(i, 1);
                        if(players[0].points % 10 === 0){
                            maxProjectiles++;
                        }
                    }
                }

            }
        }

        //TIMERS AND OTHER STUFF

        if(FONTSIZES.large1 > 80){
            FONTSIZES.large1-=2;
        }
        if(FONTSIZES.large2 > 80){
            FONTSIZES.large2-=2;
        }

        ctx.fillStyle = COLORS.lightblue;
        ctx.textAlign = 'left';
        ctx.font = FONTSIZES.large1 + 'px quickPixel';
        ctx.fillText(players[0].points, 10, 40);
        ctx.textAlign = 'right';
        ctx.font = FONTSIZES.large2 + 'px quickPixel';
        ctx.fillText(players[1].points, WIDTH - 10, 40);

        clicked = false;

        /*imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        pixels = imageData.data;

        for (var y = 0; y < canvas.height; y++) {
            var xOffset = 20 * Math.sin(y * Math.PI / 20);
            for (var x = 0; x < canvas.width; x++) {
                // Clamp the source x between 0 and width
                var sx = Math.min(Math.max(0, x + xOffset), canvas.width);

                var destIndex = ((y * canvas.width) + x);
                var sourceIndex = ((y * canvas.width) + sx);

                imageData.data[destIndex] = pixels[sourceIndex];
                imageData.data[destIndex + 1] = pixels[sourceIndex + 1];
                imageData.data[destIndex + 2] = pixels[sourceIndex + 2];
            }
        }

        ctx.putImageData(imageData, 0, 0);*/

        /*ctx.setTransform(1,0,0,1,0,0); // reset transform

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;           // reset alpha
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        if(image.complete){
            for(var i = 0 ; i < HEIGHT; i ++){
                var wide = WIDTH - Math.sin(i/250)*WIDTH/8;
                ctx.scale(0.8, 0.8);
                ctx.putImageData(imageData, Math.abs(WIDTH/2 - wide/2), 0, 0, i, wide, 1);
                ctx.scale(1.25, 1.25);
                //ctx.drawImage(image, 0, i, WIDTH, 1, 0, i, WIDTH, 1);
            }
        }*/

        /*if(image.complete){
        image.src = canvas.toDataURL();
            for(var i = 0 ; i < HEIGHT/4; i ++){
                var wide = WIDTH - Math.sin(i/400)*WIDTH/8;
                ctx.drawImage(image, Math.abs(WIDTH/2 - wide/2), i*4, wide, 8, 0, i*4, WIDTH, 4);
            }
        }*/

        //CHROMATIC ABBERATION
        if(chromAbb === true){
            ctx.globalCompositeOperation="xor";
            chromaticAberration(ctx, 5, 0);
            ctx.globalCompositeOperation="source-over";
        }

        //GRID
        ctx.fillStyle = 'rgba(0, 0, 0,' + (Math.random()*0.25 + 0.1) + ')';

        for(var i = 0; i < HEIGHT; i+=8){
            ctx.fillRect(0, i, WIDTH, 4);
        }

        //GRADIENT
        ctx.rect(0, 0, WIDTH, HEIGHT);

        // create radial gradient
        var outerRadius = WIDTH * 0.8;
        var innerRadius = WIDTH * .3;
        var grd = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, innerRadius, WIDTH / 2, HEIGHT / 2, outerRadius);
        // light blue
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        // dark blue
        grd.addColorStop(1, 'rgba(0,0,0,' + 1 + ')');

        ctx.fillStyle = grd;
        ctx.fill();

    }
}

function chromaticAberration(ctx, intensity, phase){
    /* Use canvas to draw the original image, and load pixel data by calling getImageData
    The ImageData.data is an one-dimentional Uint8Array with all the color elements flattened. The array contains data in the sequence of [r,g,b,a,r,g,b,a...]
    Because of the cross-origin issue, remember to run the demo in a localhost server or the getImageData call will throw error
    */
    var imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    var data = imageData.data;

    var off = 8;

    if(glitchTimer < 6){
        off = 16;
        if(glitchTimer === 0){
            glitchTimer = Math.floor(Math.random()*750);
        }
    }

    for (var i = 0; i < data.length; i += 4) {
        // Setting the start of the loop to a different integer will change the aberration color, but a start integer of 4n-1 will not work
        if(data[i] !== 0){
            if(data[i-off] === 0){
                data[i] = 1;
            }else if(data[i+off+1] === 0){
                data[i+1] = 1;
                data[i+2] = 0;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);

    if(glitchTimer > 0){
        glitchTimer--;
    }
}


// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function Start(){
    if(gameRunning === false){
        SCORE = 0;
        frameCount = 0;
        //HIGHSCORE = localStorage.getItem("HighScorePong");
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

function logMouseMove(e) {
    e = event || window.event;

    var rect = canvas.getBoundingClientRect();

    mousePosX = e.clientX - rect.left;
    mousePosY = e.clientY - rect.top;
    //console.log(mousePosX + ", " + mousePosY);
}

canvas.onmouseup = function(){clicked = true;}

// ---------------------------------------------------------- RELOAD FUNCTION ------------------------------------------------------------------------ //

function Reload() {
    localStorage.setItem("HighScorePong", 0);
}

// ---------------------------------------------------------- GAME LOOP ------------------------------------------------------------------------ //

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);