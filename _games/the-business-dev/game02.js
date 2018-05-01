var versionCode = "Alpha0.1";
var WIDTH = 500;
var HEIGHT = 500;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;

var gCoinProb = 10;
var sCoinProb = 30;

var floorHeight = HEIGHT/8;

var frameCount = 0;

var coins = [];
var clouds = [];

var coinG = new Image();
coinG.src = "CoinForBusinessTwo.png";

var groundG = new Image();
groundG.src = "GrassBottomBusiness.png";

var cloudG = new Image();
cloudG.src = "CloudBusiness.png";

var playerOneG = new Image();
playerOneG.src = "PlayerOneBusiness.png";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function Player(x, y, width, height, velocityY){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    var velocityY = velocityY;
    var velocityX = 0;
    var facing = 0;

    this.draw = function(){
        //ctx.fillStyle = "rgb(30, 20, 40)";
        //ctx.fillRect(x - width/2, y - height/2, width, height);

        if(velocityX < 0){
            facing = 0;
        }else if (velocityX > 0){
            facing = 1;
        }

        if(gameRunning === false){
            facing = 0;
        }

        if(facing === 0) {
            ctx.drawImage(playerOneG, 0, 0, 16, 32, x - width/2, y - height/2, width, height);
        }else{
            ctx.drawImage(playerOneG, 16, 0, 16, 32, x - width/2, y - height/2, width, height);
        }

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

        if(x <= 0 + width/2){
            velocityX = 0;
            x = 0 + width/2;
        }

        if(x + width/2 >= WIDTH){
            velocityX = 0;
            x = WIDTH - width/2;
        }

    }
    this.setVelX = function(i){
        velocityX = i;
    }
    this.setX = function(i){
        x = i;
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

    this.getwidth = function(){
        return width;
    }

    this.getY = function(){
        return y;
    }

    this.getX = function () {
        return x;
    }
}

function coin(){

    this.width = 20;
    this.height = 20;
    this.y = 0 - this.height;
    this.x = Math.floor((Math.random() * (WIDTH - this.height - 20)) + 10);

    this.prob = Math.floor((Math.random() * 100));

    this.value = 0;

    this.velX = Math.floor((Math.random() * 2) + 1);

    if(this.prob > 100 - gCoinProb){
        this.value = 3;
    }else if(this.prob > 100 - gCoinProb - sCoinProb){
        this.value = 2;
    }else{
        this.value = 1;
    }

    console.log(this.prob);

    this.draw = function(){
        //ctx.fillStyle = "rgb(240, 240, 00)";
        //ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        if(this.value === 1) {
            ctx.drawImage(coinG, 20, 0, 20, 20, this.x, this.y, this.width, this.height); //SILVER
        }else if(this.value === 2) {
            ctx.drawImage(coinG, 0, 0, 20, 20, this.x, this.y, this.width, this.height); //BRONZE
        }else if(this.value === 3) {
            ctx.drawImage(coinG, 40, 0, 20, 20, this.x, this.y, this.width, this.height); //GOLD
        }
        // x on map, y on tile map, width on tm, height on tm, x pos, y pos, width, height
    };
    this.update = function(){
        this.y+=3;
    }

}

function Cloud(){
    this.width = Math.floor((Math.random() * 100) + 100);
    this.height = this.width * 0.75;
    this.type = Math.floor((Math.random() * 3));
    this.xType = this.type*200;
    this.x = WIDTH;
    this.y = Math.floor((Math.random() * (HEIGHT - this.height - 20)) + 10);
    this.velX = Math.floor((Math.random() * 2) + 1);
    this.draw = function(){
        ctx.drawImage(cloudG, this.xType, 0, 200, 150, this.x, this.y, this.width, this.height);
    };
    this.update = function(){
        this.x -= this.velX;
    }
}

player = new Player(WIDTH/2, HEIGHT/2, 16, 32, 0); //Add the Player

function game(){
    ctx.fillStyle = "rgb(164, 197, 249)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < clouds.length; i++){
        clouds[i].update();
        clouds[i].draw();

        if(clouds[i].x + clouds[i].width + 50 < 0){
            clouds.splice(i, 1);
            console.log("Deleted!!");
        }

    }

    for(var i = 0; i < coins.length; i++){
        coins[i].update();
        coins[i].draw();

        if(coins[i].x + coins[i].width > player.getX() - (player.getwidth()/2) && coins[i].x < player.getX() + (player.getwidth()/2)){
            if(coins[i].y + coins[i].height > player.getY() -(player.getheight()/2) && coins[i].y < player.getY() + (player.getheight()/2)){
                if(coins[i].value === 1){
                    SCORE += 10;
                }else if(coins[i].value === 2){
                    SCORE += 20;
                }else if(coins[i].value === 3){
                    SCORE += 50;
                }

                if(SCORE > GAMESCORE){
                    GAMESCORE = SCORE;
                }

                document.getElementById("score").innerHTML = "" + SCORE;
                document.getElementById("gamescore").innerHTML = "" + GAMESCORE;

                coins.splice(i, 1);
            }
        }else if(coins[i].y > HEIGHT){
            if(coins[i].value === 1){
                SCORE -= 20;
            }else if(coins[i].value === 2){
                SCORE -= 40;
            }else if(coins[i].value === 3){
                SCORE -= 80;
            }

            document.getElementById("score").innerHTML = "" + SCORE;
            coins.splice(i, 1);
        }

    }

    player.draw();
    player.update();

    //ctx.fillStyle = "rgb(50, 181, 85)";
    //ctx.fillRect(0, HEIGHT - floorHeight, WIDTH, floorHeight);

    ctx.drawImage(groundG, 0, 0, 1000, 100, 0, HEIGHT - floorHeight, 1000, 100);

    if(gameRunning === true) {

        frameCount++;

        document.getElementById("startMenu").setAttribute("hidden", "hidden");
        document.getElementById("resetMenu").setAttribute("hidden", "hidden");

        player.setVelX(0);

        if (keys && keys[37] || keys && keys[65]) {player.setVelX(-3)}

        if (keys && keys[39] || keys && keys[68]) {player.setVelX(3)}

        if(player.getY() >= (HEIGHT - floorHeight - (player.getheight()/2))) {
            if (keys && keys[38] || keys && keys[87]) {
                player.setVelY(-8)
            }
        }

        if (keys && keys[40] || keys && keys[83]) {player.setVelY(player.getVelY() + 0.2)}

        //Spawning

        if(frameCount % 50 === 0){
            coins.push(new coin());
        }
        if(frameCount % 150 === 0){
            clouds.push(new Cloud());
        }

        if(SCORE < 0){
            gameRunning = false;
            player.setVelX(0);

            if(GAMESCORE > HIGHSCORE){
                HIGHSCORE = GAMESCORE;
            }

            document.getElementById("resetMenu").removeAttribute("hidden");
            document.getElementById("endScore").innerHTML = "Score: " + GAMESCORE;
            document.getElementById("endHighScore").innerHTML = "HighScore: " + HIGHSCORE;

            localStorage.setItem('HighScore', HIGHSCORE);
        }

    }
}

function Start(){
    if(gameRunning == false){
        SCORE = 0;
        GAMESCORE = 0;
        coins = [];
        clouds = [];
        player.setX(WIDTH/2);
        document.getElementById("score").innerHTML = "" + SCORE;
        HIGHSCORE = localStorage.getItem("HighScore");
        gameRunning = true;
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