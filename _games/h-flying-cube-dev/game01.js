var versionCode = "1.3";
var WIDTH = 500;
var HEIGHT = 500;
var gameRunning = false;
var SCORE = 0;
var HIGHSCORE = 0;
var pipes = [];
var clouds = [];
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var frameCount = 0;
var gameSpeed = 3;
var spawnRate = 150;
var waiting = false;
var pause = false;
var pipesX = [];
var speedUpTextTimer = 0;
var speedUpTextVisible = false;
var gameMode = "Infinite";
function Player(x, y, width, height, velY){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velY = velY;
    this.draw = function(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, width, height);
        if(gameRunning == true){
            ctx.fillStyle = "black";
            if(velY < 0){
                ctx.fillRect(x + 4, y+2, 3, 7);
                ctx.fillRect(x + width - 4 - 2, y+2, 3, 7);
            }else{
                ctx.fillRect(x + 4, y+7, 3, 7);
                ctx.fillRect(x + width - 4 - 2, y+7, 3, 7);
            }
        }else{
            if(pipes.length > 0){
                ctx.fillStyle = "red";
                ctx.font = "15px Arial";
                ctx.fillText("x",x + 2,y + 14);
                ctx.fillText("x",x + width - 8,y + 14);
            }else{
                ctx.fillStyle = "black";
                ctx.fillRect(x + 4, y+7, 3, 7);
                ctx.fillRect(x + width - 4 - 2, y+7, 3, 7);
            }
        }
    };
    this.setVelY = function(i){
        velY = i;
    };
    this.getX = function(){
        return x;
    };
    this.getY = function(){
        return y;
    };
    this.setY = function(i){
        y = i;
    };
    this.getWidth = function(){
        return width;
    };
    this.getHeight = function(){
        return height;
    };
    this.update = function(){
        if(gameRunning == true){ // If player is playing
            if(y>0 && y<HEIGHT-height){
                y+=velY; //Add the velocity, which can be negative (When going down)
            }
            if(y>HEIGHT-height){ //Make canvas boundaries
                y=HEIGHT - height - 1;
                velY = -3;
            }else if(y<0){
                y = 1;
            }
            velY+=0.2;
        }else{
            if(y + height < HEIGHT){ //Make player fall down after they die
                if(pipes.length > 0){
                    velY = 2;
                    y+=velY;
                }
            }
        }
    }
}
function Pipe(){
    this.top = Math.random() * (HEIGHT/2 - 50) + 50;
    this.bottom = Math.random() * (HEIGHT/2 - 50) + 50;
    this.x = WIDTH + 20;
    this.w = 40;
    this.speed = gameSpeed;
    this.hit = false;
    this.move = true;
    this.moving = Math.random();
    this.topmove = Math.floor((Math.random() * ((this.top - 5) - 0)) + 0);
    this.bottommove = Math.floor((Math.random() * ((this.bottom + 5) - 0)) + 0);
    this.goingup = false; //Just to know the velocity direction...
    this.update = function(){

        if(this.move === true){
            this.x -= this.speed;
        }

        if(HEIGHT - this.top - this.bottom < 125){ //If gap is too small
            if(this.bottom > 30){ //So bottom pipe doesn't go to low
                this.bottom-=1;
            }
            if(this.top > 30){ // So top pipe doesn't go to low
                this.top-=1;
            }
            // Mechanism to move them apart...
        }
        if(this.moving <= 0.1){
            if((this.goingup == true) && (Math.round(this.top)>Math.round(this.topmove))){
                this.top-=0.5;
                this.bottom+=0.5;
            }
            if((this.goingup == true) && (Math.round(this.top)==Math.round(this.topmove))){
                this.goingup = false;
            }
            if((this.goingup==false)&&(Math.round(this.bottom)>Math.round(this.bottommove))){
                this.top+=0.5;
                this.bottom-=0.5;
            }
            if((this.goingup==false)&&(Math.round(this.bottom)== Math.round(this.bottommove))){
                this.goingup = true;
            }
        }
    };

    this.getX = function(){
        return this.x;
    };

    this.hits = function(x, y, width, height){
        if (y < this.top || y + height > HEIGHT - this.bottom) {
            if (x + width > this.x && x < this.x + this.w) {
                this.hit = true;
                return true;
            }
        }
    };
    this.draw = function(){
        ctx.fillStyle = "#2ed136";
        if(this.hit == true){
            ctx.fillStyle = "red";
        }
        ctx.fillRect(this.x, 0, this.w, this.top);
        ctx.fillRect(this.x, HEIGHT-this.bottom, this.w, this.bottom);

        ctx.fillStyle = "green";
        if(this.hit == true){
            ctx.fillStyle = "darkred";
        }
        //top pipe
        ctx.rect(this.x, 0, this.w, this.top);
        ctx.beginPath();
        ctx.moveTo(this.x,0);
        ctx.lineTo(this.x, this.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + this.w,0);
        ctx.lineTo(this.x + this.w, this.top);
        ctx.stroke();
        //bottom pipe
        ctx.beginPath();
        ctx.moveTo(this.x,HEIGHT);
        ctx.lineTo(this.x, HEIGHT - this.bottom);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + this.w,HEIGHT);
        ctx.lineTo(this.x + this.w, HEIGHT - this.bottom);
        ctx.stroke();
        //top pipe topper
        ctx.fillRect(this.x - 5, this.top - 10, this.w + 10, 10);
        //bottom pipe topper
        ctx.fillRect(this.x - 5, HEIGHT - this.bottom - 10, this.w + 10, 10);
    }
}
function Cloud(){
    this.width = Math.floor((Math.random() * 50) + 50);
    this.height = Math.floor((Math.random() * 20) + 30);
    this.x = WIDTH;
    this.y = Math.floor((Math.random() * (HEIGHT - this.height - 20)) + 10);
    this.velX = Math.floor((Math.random() * 2) + 1);
    this.draw = function(){
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.update = function(){
        this.x -= this.velX;
    }
}
player = new Player(50, HEIGHT/2 - 10, 20, 20, 0); //Add the Player

function game(){

    ctx.fillStyle = "#86b0f4"; //Sky color
    ctx.fillRect(0,0,WIDTH,HEIGHT); //Background
    for(var i = 0; i < clouds.length; i++){
        clouds[i].draw();
    }
    for(var i = 0; i < pipes.length; i++){
        pipes[i].draw();
    }

    player.draw();
    player.update();

    if(gameRunning == true) {
        if (waiting == false) {
            frameCount++;
        }
        document.getElementById("startMenu").setAttribute("hidden", "hidden");
        document.getElementById("resetMenu").setAttribute("hidden", "hidden");
        document.getElementById("modeMenu").setAttribute("hidden", "hidden");
        for (var i = 0; i < clouds.length; i++) {
            clouds[i].update();
            if (clouds[i].x + clouds[i].width < 0) {
                clouds.splice(i, 1);
            }
        }

        pipesX = [];

        for (var i = 0; i < pipes.length; i++) {
            pipesX.push(pipes[i].getX());
        }

        if(gameMode === "Speed") {
            for (var j = 0; j < pipesX.length - 1; j++) { //TRY AGAIN!!
                if ((pipesX[j + 1] - pipesX[j] < 370) && (pipesX[j + 1] - pipesX[j] > 0) && (pipesX[j + 1] != pipesX[j])) {
                    pipes[j + 1].move = false;
                    console.log("Slowdown... ");
                } else {
                    pipes[j + 1].move = true;
                }
            }
        }

        for (var i = 0; i < pipes.length; i++) {
            pipes[i].update();
            if (pipes[i].hits(player.getX(), player.getY(), player.getWidth(), player.getHeight())) {
                gameRunning = false;
                frameCount = 0;
                document.getElementById("resetMenu").removeAttribute("hidden");
                if (SCORE > HIGHSCORE) {
                    HIGHSCORE = SCORE;
                }
                localStorage.setItem("HighScore", HIGHSCORE);
                document.getElementById("endScore").innerHTML = "Score: " + SCORE;
                document.getElementById("endHighScore").innerHTML = "HighScore: " + HIGHSCORE;
            }
            if (pipes[i].x < (0 - pipes[i].w)) {
                pipes.splice(i, 1);
                SCORE++;
                document.getElementById("score").innerHTML = "Score: " + SCORE;
            }
        }

        if(gameMode === "Infinite") {
            if ((frameCount % spawnRate === 0)) {
                pipes.push(new Pipe());
            }
        }else{
            if ((frameCount % spawnRate === 0) && !(frameCount % 2000 <= 200)) {
                pipes.push(new Pipe());
            }
        }

        if (frameCount % 150 === 0) {
            clouds.push(new Cloud());
        }

        if (gameMode === "Speed") {
            if (frameCount % 2000 === 0) { //2000
                gameSpeed += 1;
                speedUpTextTimer = 150;
                if (spawnRate > 40) {
                    spawnRate -= 15;
                }
                console.log("Speed up!! ");
            }
        }else{

        }

        if(speedUpTextTimer > 0){
            speedUpTextTimer--;
            speedUpTextVisible = true;
        }else{
            speedUpTextVisible = false;
        }

        if(speedUpTextVisible === true){
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("SPEED UP AHEAD!!",WIDTH/2, HEIGHT/2);
        }

    }
}
function Jump(){
    player.setVelY(-4);
}

function setGameMode(i){
    if(i === 1){
        gameMode = "Infinite";
    }else{
        gameMode = "Speed";
    }
    Start()
}

function changeToModeMenu(){
    document.getElementById("startMenu").setAttribute("hidden", "hidden");
    document.getElementById("resetMenu").setAttribute("hidden", "hidden");
    document.getElementById("modeMenu").removeAttribute("hidden");
}

function Start(){
    if(gameRunning == false){
        gameRunning = true;
        pipes = [];
        clouds = [];
        SCORE = 0;
        gameSpeed = 3;
        spawnRate = 130;
        speedUpTextTimer = 0;
        document.getElementById("score").innerHTML = "Score: " + SCORE;
        player.setY(240);
        HIGHSCORE = localStorage.getItem("HighScore");
    }
    player.setVelY(-3);
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 32) {
        Jump();
    }
};

function Reload() {
    localStorage.setItem("HighScore", 0);
    //localStorage.clear();
}
/*window.setInterval(function(){
    game();
}, 10);*/

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);