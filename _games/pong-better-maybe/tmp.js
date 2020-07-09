var versionCode = "V 0.01";
var WIDTH = 1024;
var HEIGHT = 576;

var gameRunning = true;
var frameCount = 0;

var SCORE = 0;
var HIGHSCORE = 0;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var COLORS = {bg: "#081518", darkgreen: "#102E2F", lightgreen: "#2A7E63", whiteblue: "#B6C9E7", yellow:"#CCAF66", red:"#D28A77", white:"#F9EFEC"};
var CONTROLS = {a: [87, 83], b: [38, 40]};

var objects = [];
var projectiles = [];

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Object(x, y, width, height, controls){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.length = this.height;
    this.controls = controls;

    this.angle = Math.PI/4+Math.PI/2;

    this.speed = 7;

    this.update = function(){
        if(this.controls.length > 0) {
            if (keys && keys[controls[0]]) {
                this.y -= this.speed;
            }
            if (keys && keys[controls[1]]) {
                this.y += this.speed;
            }
        }
    };

    this.draw = function(){
        ctx.fillStyle = COLORS.white;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle-Math.PI/2);
        ctx.fillRect(-this.width/2, 0, this.width, this.height);
        ctx.restore();

        /*ctx.strokeStyle = COLORS.red;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length*Math.cos(this.angle), this.y + this.length*Math.sin(this.angle));
        ctx.stroke();
        ctx.strokeStyle = COLORS.white;*/
    };
}

function Projectile(x, y, angle){
    this.x = x;
    this.y = y;

    this.radius = 5;

    this.angle = 0;
    this.speed = 6;

    this.velX = this.speed*Math.cos(this.angle);
    this.velY = this.speed*Math.sin(this.angle);

    this.update = function(){
        if(this.y + this.velY < 0 || this.y + this.velY > HEIGHT){
            this.angle = (2*Math.PI - this.angle);
            this.velX = this.speed*Math.cos(this.angle);
            this.velY = this.speed*Math.sin(this.angle);
            console.log("Ey");
        }
        for(var o in objects){
            var t = intersect([{x: this.x, y: this.y}, {x: this.x+this.velX, y: this.y+this.velY}],[{x: objects[o].x, y: objects[o].y}, {x: objects[o].x + objects[o].length*Math.cos(objects[o].angle), y: objects[o].y + objects[o].length*Math.sin(objects[o].angle)}]);
            if(t === 'collinear') {continue;}
            if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
                this.angle = (Math.PI - this.angle) + (objects[o].angle-Math.PI/2)*2; // + (Math.random() * (1) - 0.5)
                this.velX = this.speed*Math.cos(this.angle);
                this.velY = this.speed*Math.sin(this.angle);
                console.log("OOF")
            }
        }
        this.x += this.velX;
        this.y += this.velY;
    };

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = COLORS.white;
        ctx.fill();
    };
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

objects.push(new Object(10, 10, 10, 100, CONTROLS.a));
objects.push(new Object(WIDTH-20, 10, 10, 100, CONTROLS.b));

projectiles.push(new Projectile(WIDTH/2, HEIGHT/2, 0));

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

    if(gameRunning === true) {

        frameCount++;

        for(var i = 0; i < objects.length; i++){
            objects[i].update();
            objects[i].draw();
        }

        for(var i = 0; i < projectiles.length; i++){
            projectiles[i].update();
            projectiles[i].draw();
        }

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