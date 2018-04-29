var versionCode = "Alpha0.1";
var WIDTH = 500;
var HEIGHT = 500;
var gameRunning = false;
var SCORE = 0;
var HIGHSCORE = 0;

var floorHeight = HEIGHT/8;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
function Player(x, y, width, height, velocityY){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    var velocityY = velocityY;
    var velocityX = 0;

    this.draw = function(){
        ctx.fillStyle = "rgb(30, 20, 40)";
        ctx.fillRect(x - width/2, y - height/2, width, height);
    };
    this.update = function(){

        x += velocityX;

        if((y + height/2) < HEIGHT - floorHeight) {
            velocityY += 0.2;
            if(y < HEIGHT - floorHeight - 4) {
                y += velocityY;
            }else{
                y = HEIGHT - floorHeight - height/2;
            }
        }else{
            if(velocityY > 0) {
                velocityY = 0;
                y = HEIGHT - floorHeight - height/2;
            }else{
                y += velocityY;
            }
        }
    }
    this.setVelX = function(i){
        velocityX = i;
    }
    this.setVelY = function(i){
        velocityY = i;
    }

    this.getVelY = function(){
        return velocityY;
    }

    this.getheight = function(){
        return height;
    }

    this.getY = function(){
        return y;
    }
}

player = new Player(WIDTH/2, HEIGHT/2, 16, 32, 0); //Add the Player

function game(){
    ctx.fillStyle = "rgb(164, 197, 249)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(50, 181, 85)";
    ctx.fillRect(0, HEIGHT - floorHeight, WIDTH, floorHeight);

    player.draw();
    player.update();

    if(gameRunning == true) {
        document.getElementById("startMenu").setAttribute("hidden", "hidden");
        document.getElementById("resetMenu").setAttribute("hidden", "hidden");
    }

    player.setVelX(0);

    if (keys && keys[37]) {player.setVelX(-3)}
    if (keys && keys[39]) {player.setVelX(3)}
    if(player.getY() >= (HEIGHT - floorHeight - (player.getheight()/2))) {
        if (keys && keys[38]) {
            player.setVelY(-8)
        }
    }
    if (keys && keys[40]) {player.setVelY(player.getVelY() + 0.2)}
}

function Start(){
    if(gameRunning == false){
        gameRunning = true;
        document.getElementById("score").innerHTML = "Score: " + SCORE;
        HIGHSCORE = localStorage.getItem("HighScore");
    }
}

var keys;

window.addEventListener('keydown', function (e) {
    keys = (keys || []);
    keys[e.keyCode] = (e.type == "keydown");
})
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.type == "keydown");
})

function Reload() {
    localStorage.setItem("HighScore", 0);
    //localStorage.clear();
}

function repeatOften() {
    // Do whatever
    game();
    requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);