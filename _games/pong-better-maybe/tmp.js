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
var CONTROLS = {a: [87, 83], b: [38, 40], c:[69, 68], d: [100, 97]};
var FONTSIZES = {large1: 70, large2: 70};

var objects = [];
var projectiles = [];

var players = [];

var maxProjectiles = 2;

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
    this.maxRot = 0.04;
    this.angleAccel = 0.002;

    this.speed = 8;

    this.boundsY = bounds;

    this.ctrlReleased = [true, true];

    this.dividerSize = 10;

    this.update = function(){
        if(this.controls.length > 0) {
            if(this.type === 0){
                if (keys && keys[controls[0]]) {
                    if(this.y > this.boundsY[0]){
                        this.y -= this.speed;
                    }
                }
                if (keys && keys[controls[1]]) {
                    if(this.y+this.height < this.boundsY[1]){
                        this.y += this.speed;
                    }
                }
            }else if(this.type === 1){
                if (keys && keys[controls[0]] && this.ctrlReleased[0] === true) {
                    if(this.y > this.boundsY[0]){
                        this.y -= this.height+this.dividerSize;
                        this.ctrlReleased[0] = false;
                    }
                }
                if (keys && keys[controls[1]] && this.ctrlReleased[1] === true) {
                    if(this.y+this.height < this.boundsY[1]){
                        this.y += this.height+this.dividerSize;
                        this.ctrlReleased[1] = false;
                    }
                }

                if (keys && !keys[controls[0]]) {
                    this.ctrlReleased[0] = true;
                }
                if (keys && !keys[controls[1]]) {
                    this.ctrlReleased[1] = true;
                }
            }else if(this.type === 2){
                if (keys && keys[controls[0]] && this.omega < this.maxRot) {
                    this.omega+=this.angleAccel;
                }
                if (keys && keys[controls[1]] && this.omega > -this.maxRot) {
                    this.omega-=this.angleAccel;
                }
            }
        }
        this.angle+=this.omega;
        this.omega*=0.95;
    };

    this.draw = function(){
        ctx.fillStyle = COLORS.white;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle-Math.PI/2);
        ctx.fillRect(-this.width/2, 0, this.width, this.height);
        ctx.restore();

        if(this.type === 1){
            ctx.strokeStyle = COLORS.yellow;
            ctx.globalAlpha = 0.5;
            ctx.setLineDash([this.width/2, this.width/2]);
            ctx.strokeRect(this.x-this.width/2, this.boundsY[0], this.width, this.height);
            ctx.strokeRect(this.x-this.width/2, this.boundsY[0] + this.height + this.dividerSize, this.width, this.height);
            ctx.strokeRect(this.x-this.width/2, this.boundsY[0] + 2*this.height + 2*this.dividerSize, this.width, this.height);
            ctx.globalAlpha = 1;
            ctx.setLineDash([0, 0]);
        }

        ctx.strokeStyle = COLORS.red;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2*Math.cos(this.angle+Math.PI/2), this.y + this.width/2*Math.sin(this.angle+Math.PI/2));
        ctx.lineTo(this.x + this.width/2*Math.cos(this.angle+Math.PI/2) + this.length*Math.cos(this.angle), this.y + this.width/2*Math.sin(this.angle+Math.PI/2) + this.length*Math.sin(this.angle));
        ctx.stroke();
        ctx.strokeStyle = COLORS.white;
    };
}

function Projectile(x, y, angle){
    this.x = x;
    this.y = y;

    this.radius = 5;

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
            /*var t = intersect([{x: this.x, y: this.y}, {x: this.x+this.velX*1.2, y: this.y+this.velY*1.2}],[{x: objects[o].x + objects[o].width/2*Math.cos(objects[o].angle+Math.PI/2), y: objects[o].y + objects[o].width/2*Math.sin(objects[o].angle+Math.PI/2)}, {x: objects[o].x + objects[o].length*Math.cos(objects[o].angle) + objects[o].width/2*Math.cos(objects[o].angle-Math.PI/2), y: objects[o].y + objects[o].width/2*Math.sin(objects[o].angle-Math.PI/2) + objects[o].length*Math.sin(objects[o].angle)}]);
            if(t === 'collinear') {continue;}
            if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
                var rndOff = 0;
                if(this.type === 0){
                    rndOff = (this.y - (objects[o].y + objects[o].height/2))/100;
                }
                this.angle = (Math.PI - this.angle) + (objects[o].angle-Math.PI/2)*2 - rndOff*Math.sign(this.velX)+ (Math.random() * (0.4) - 0.2); // + (Math.random() * (1) - 0.5)
                this.velX = this.speed*Math.cos(this.angle);
                this.velY = this.speed*Math.sin(this.angle);
                objects[o].omega*=0.8;
            }else{
                t = intersect([{x: this.x, y: this.y}, {x: this.x+this.velX*1.2, y: this.y+this.velY*1.2}],[{x: objects[o].x + objects[o].width/2*Math.cos(objects[o].angle+Math.PI/2), y: objects[o].y + objects[o].width/2*Math.sin(objects[o].angle+Math.PI/2)}, {x: objects[o].x + objects[o].length*Math.cos(objects[o].angle) + objects[o].width/2*Math.cos(objects[o].angle-Math.PI/2), y: objects[o].y + objects[o].width/2*Math.sin(objects[o].angle-Math.PI/2) + objects[o].length*Math.sin(objects[o].angle)}]);
                if(t === 'collinear') {continue;}
                if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
                    var rndOff = 0;
                    if(this.type === 0){
                        rndOff = (this.y - (objects[o].y + objects[o].height/2))/100;
                    }
                    this.angle = (Math.PI - this.angle) + (objects[o].angle-Math.PI/2)*2 - rndOff*Math.sign(this.velX)+ (Math.random() * (0.4) - 0.2); // + (Math.random() * (1) - 0.5)
                    this.velX = this.speed*Math.cos(this.angle);
                    this.velY = this.speed*Math.sin(this.angle);
                    objects[o].omega*=0.8;
                }
            }*/
            var t = intersect([{x: this.x, y: this.y}, {x: this.x+this.velX*1.2, y: this.y+this.velY*1.2}],[{x: objects[o].x, y: objects[o].y}, {x: objects[o].x + objects[o].length*Math.cos(objects[o].angle), y: objects[o].y + objects[o].length*Math.sin(objects[o].angle)}]);
            if(t === 'collinear') {continue;}
            if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
                var rndOff = 0;
                if(this.type === 0){
                    rndOff = (this.y - (objects[o].y + objects[o].height/2))/100;
                }
                this.angle = (Math.PI - this.angle) + (objects[o].angle-Math.PI/2)*2 - rndOff*Math.sign(this.velX)+ (Math.random() * (0.4) - 0.2); // + (Math.random() * (1) - 0.5)
                this.velX = this.speed*Math.cos(this.angle);
                this.velY = this.speed*Math.sin(this.angle);
                objects[o].omega*=0.8;
            }else if(this.type === 2){
                t = intersect([{x: this.x, y: this.y}, {x: this.x+this.velX*1.2, y: this.y+this.velY*1.2}],[{x: objects[o].x, y: objects[o].y}, {x: objects[o].x + objects[o].length*Math.cos(objects[o].angle+objects[o].omega/2), y: objects[o].y + objects[o].length*Math.sin(objects[o].angle+objects[o].omega/2)}]);
                if(t === 'collinear') {continue;}
                if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
                    var rndOff = 0;
                    if(this.type === 0){
                        rndOff = (this.y - (objects[o].y + objects[o].height/2))/100;
                    }
                    this.angle = (Math.PI - this.angle) + (objects[o].angle-Math.PI/2)*2 - rndOff*Math.sign(this.velX)+ (Math.random() * (0.4) - 0.2); // + (Math.random() * (1) - 0.5)
                    this.velX = this.speed*Math.cos(this.angle);
                    this.velY = this.speed*Math.sin(this.angle);
                    objects[o].omega*=0.8;
                }
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

function Player(id){
    this.id = id;
    this.points = 0;
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

players.push(new Player(0));
players.push(new Player(1));

objects.push(new Object(10, HEIGHT/2-50, 10, 100, CONTROLS.a, 0, [0, HEIGHT]));
objects.push(new Object(WIDTH-10, HEIGHT/2-50, 10, 100, CONTROLS.b, 0, [0, HEIGHT]));

objects.push(new Object(200, HEIGHT/2-50, 10, 100, CONTROLS.c, 2, [HEIGHT/2-50-100-10, HEIGHT/2-50+100+10]));
objects.push(new Object(WIDTH-200, HEIGHT/2-50, 10, 100, CONTROLS.d, 1, [HEIGHT/2-50-100-10, HEIGHT/2-50+100+10]));

projectiles.push(new Projectile(WIDTH/2, HEIGHT/2, 0));
projectiles.push(new Projectile(WIDTH/2, HEIGHT/2, Math.PI));

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function intersect(s1, s2){
    if(((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)) === 0) {
        return 'collinear';
    }
    var tA =  ((s2[0].y - s2[1].y)*(s1[0].x - s2[0].x) + (s2[1].x - s2[0].x)*(s1[0].y - s2[0].y))/
        ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)),
        tB =  ((s1[0].y - s1[1].y)*(s1[0].x - s2[0].x) + (s1[1].x - s1[0].x)*(s1[0].y - s2[0].y))/
            ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y));
    return [tA, tB];
}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
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

        for(var i = 0; i < objects.length; i++){
            objects[i].update();
            objects[i].draw();
        }

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
                projectiles.push(new Projectile(WIDTH/2, HEIGHT/2, 0));
            }else{
                projectiles.push(new Projectile(WIDTH/2, HEIGHT/2, Math.PI));
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