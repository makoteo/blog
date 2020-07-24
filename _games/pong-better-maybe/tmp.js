var versionCode = "V 0.01";
var WIDTH = 1024;
var HEIGHT = 576;

var gameRunning = true;
var frameCount = 0;

var SCORE = 0;
var HIGHSCORE = 0;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var COLORS = {bg: "#081518", darkgreen: "#102E2F", lightgreen: "#2A7E63", lightblue: "#B6D3E7", yellow:"#CCAF66", red:"#D28A77", white:"#F9EFEC"};
var CONTROLS = {a: [87, 83, "W", "S"], b: [38, 40, "Up", "Dwn"], c:[69, 68, "E", "D"], d: [100, 97, "1", "4"], e: [82, 70, "R", "F"], f: [101, 98, "5", "2"], g: [84, 71, "T", "G"], h: [102, 99, "6", "3"]};
var FONTSIZES = {large1: 70, large2: 70, medium: 30};

var objects = [];
var projectiles = [];

var players = [];
var placers = [];
var buttons = [];

var maxProjectiles = 2;

var GAMESTATE = "PLACE";

var mousePosX = 0;
var mousePosY = 0;

var CONST = {dividerSize: 10, hingeWidth:5, bound: 5, nonplwid: WIDTH/30};

var clicked = false;

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, width, height, controls, type, bounds){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.length = this.height;
    this.controls = controls;
    this.type = type;

    this.angle = Math.PI/2;
    this.omega = 0;
    this.maxRot = 0.03;
    this.angleAccel = 0.003;

    this.speed = 8;

    this.boundsY = bounds;

    this.ctrlReleased = [true, true];

    this.dividerSize = CONST.dividerSize;

    this.hingeWidth = CONST.hingeWidth;

    this.opacities = [0, 1];
    this.prevY = this.y;

    this.update = function(){

        this.velY = 0;

        if(this.controls.length > 0) {
            if(this.type === 0){
                if (keys && keys[this.controls[0]]) {
                    if(this.y > this.boundsY[0]){
                        this.velY = -this.speed;
                    }
                }
                if (keys && keys[this.controls[1]]) {
                    if(this.y+this.height < this.boundsY[1]){
                        this.velY = this.speed;
                    }
                }
            }else if(this.type === 1){
                if (keys && keys[this.controls[0]] && this.ctrlReleased[0] === true && this.opacities[1] === 1) {
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
                }

                if (keys && !keys[this.controls[0]]) {
                    this.ctrlReleased[0] = true;
                }
                if (keys && !keys[this.controls[1]]) {
                    this.ctrlReleased[1] = true;
                }
            }else if(this.type === 2){
                if (keys && keys[this.controls[0]] && this.omega < this.maxRot) {
                    this.omega+=this.angleAccel;
                }
                if (keys && keys[this.controls[1]] && this.omega > -this.maxRot) {
                    this.omega-=this.angleAccel;
                }
            }
        }
        this.angle+=this.omega;
        this.omega*=0.95;
        this.y+=this.velY;

    };

    this.draw = function(){
        if(this.type === 0) {
            ctx.fillStyle = COLORS.white;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle - Math.PI / 2);
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
            ctx.arc(this.x, this.y, this.hingeWidth, 0, 2 * Math.PI, false);
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
        }

        if(GAMESTATE === "PLACE"){
            //MOUSE CLICKS
            if(this.type === 1){
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
            }

            this.textYOff = 0;
            this.textXOff = -1;
            if(this.x < WIDTH/2){
                this.textXOff = 1;
            }

            ctx.font = FONTSIZES.medium + 'px quickPixel';
            ctx.textAlign = 'center';
            ctx.fillText(this.controls[2], this.x + WIDTH/50*this.textXOff, this.y + this.height*0.4 + this.textYOff);
            ctx.fillText("-", this.x + WIDTH/50*this.textXOff, this.y + this.height*0.61 + this.textYOff);
            ctx.fillText(this.controls[3], this.x + WIDTH/50*this.textXOff, this.y + this.height*0.8 + this.textYOff);

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

function Projectile(x, y, angle){
    this.x = x;
    this.y = y;

    this.radius = 4;

    this.type = 0;

    this.angle = angle;
    this.speed = Math.round(Math.random()*5)+4;

    this.velX = this.speed*Math.cos(this.angle);
    this.velY = this.speed*Math.sin(this.angle);

    this.update = function(){
        //BOUNCES OFF SIDES
        if(this.y + this.velY < 0 || this.y + this.velY > HEIGHT){
            this.angle = (2*Math.PI - this.angle);
            this.velX = this.speed*Math.cos(this.angle);
            this.velY = this.speed*Math.sin(this.angle);
        }
        //BOUNCES OFF PADDLES
        for(var o in objects){
            //COULD HAVE DONE THIS THROUGH ORS BUT I'M TOO LAZY TO REDO IT
            var collision = false;

            var coltemp = colCircleRectangle(this, objects[o]);
            var rottop = coltemp.rt;

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

        }
        //UPDATE POSITION
        this.x += this.velX;
        this.y += this.velY;
    };

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = COLORS.white;
        ctx.fill();
        /*ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x +this.velX*12, this.y +this.velY*12);
        ctx.stroke();*/
    };
}

function Placer(type, width, height, controls){
    this.type = type;
    this.placed = false;
    this.finished = false;
    this.x = mousePosX;
    this.y = mousePosY;
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
        if(this.placed === false){
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
            }else if(this.type === 2){
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
        }
    };
}

function Button(x, y, width, height, use, text){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.use = use;
    this.text = text;

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

function Player(id){
    this.id = id;
    this.points = 0;
    this.paddles = 0;
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

players.push(new Player(0));
players.push(new Player(1));

objects.push(new Object(10, HEIGHT/2-50, 10, 100, CONTROLS.a, 0, [0, HEIGHT]));
objects.push(new Object(WIDTH-10, HEIGHT/2-50, 10, 100, CONTROLS.b, 0, [0, HEIGHT]));

objects.push(new Object(200, HEIGHT/2, 5, 60, CONTROLS.c, 2, [HEIGHT/2-50-100-10, HEIGHT/2-50+100+10]));
objects.push(new Object(WIDTH-200, HEIGHT/2, 5, 60, CONTROLS.d, 2, [HEIGHT/2-50-100-10, HEIGHT/2-50+100+10]));

objects.push(new Object(300, HEIGHT/2-30, 10, 60, CONTROLS.e, 1, [HEIGHT/2-30-60-10, HEIGHT/2-30+60+10]));

buttons.push(new Button(WIDTH - WIDTH/20, HEIGHT- HEIGHT/30, WIDTH/10, HEIGHT/15, "play", "PLAY"));

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function colCircleRectangle ( circle, rect ) {

    var rectX = rect.x - rect.width/2*Math.cos(rect.angle - Math.PI / 2 );
    var rectY = rect.y - rect.width/2*Math.sin(rect.angle - Math.PI / 2 );

    var rectReferenceX = rectX;
    var rectReferenceY = rectY;

    // Rotate circle's center point back
    var unrotatedCircleX = Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x + circle.velX - rectX ) - Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y + circle.velY - rectY ) + rectX;
    var unrotatedCircleY = Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x + circle.velX - rectX ) + Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y + circle.velY - rectY ) + rectY;

    var unrotatedCircleXB = Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x - rectX ) - Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y - rectY ) + rectX;
    var unrotatedCircleYB = Math.sin(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.x - rectX ) + Math.cos(Math.PI*2 - (rect.angle - Math.PI / 2)) * ( circle.y - rectY ) + rectY;

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

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    window.onmousemove = logMouseMove;

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

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

        for(var i = 0; i < objects.length; i++){
            if(GAMESTATE === "GAME"){
                objects[i].update();
            }
            objects[i].draw();
        }

        if(GAMESTATE === "PLACE"){
            if(placers.length === 0 || placers[0].placed === false){
                if(keys && keys[49]){
                    placers = [];
                    placers.push(new Placer(1, 10, 60, CONTROLS.a));
                }else if(keys && keys[50]){
                    placers = [];
                    placers.push(new Placer(2, 5, 60, CONTROLS.a));
                }
            }

            if(placers.length > 0){
                placers[0].update();
                placers[0].draw();
                if(placers[0].finished === true){
                    placers = [];
                }
            }
        }

        if(GAMESTATE === "GAME"){
            for(var i = 0; i < projectiles.length; i++){
                projectiles[i].update();
                projectiles[i].draw();

                if( projectiles[i].x < 0){
                    players[1].points++;
                    FONTSIZES.large2 = 90;
                    projectiles.splice(i, 1);
                    if(players[1].points % 10 === 0){
                        maxProjectiles++;
                    }
                }else if( projectiles[i].x > WIDTH){
                    players[0].points++;
                    FONTSIZES.large1 = 90;
                    projectiles.splice(i, 1);
                    if(players[0].points % 10 === 0){
                        maxProjectiles++;
                    }
                }
            }
            if(projectiles.length < maxProjectiles){
                var rnd = Math.random();
                if(rnd < 0.5){
                    projectiles.push(new Projectile(WIDTH/2, HEIGHT/2 - 10, 0));
                }else{
                    //projectiles.push(new Projectile(10, HEIGHT, Math.PI/2*3));
                    projectiles.push(new Projectile(WIDTH/2, HEIGHT/2 - 10, Math.PI));
                }
            }
        }

        //TIMERS AND OTHER STUFF

        if(FONTSIZES.large1 > 70){
            FONTSIZES.large1-=2;
        }
        if(FONTSIZES.large2 > 70){
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