var versionCode = "Alpha 0.9";
var WIDTH = 800;
var HEIGHT = 500;
var gameRunning = true;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;
var frameCount = 0;

var floorHeight = HEIGHT - HEIGHT/3;
var walkHeight = HEIGHT - HEIGHT/4;

var cameraX = 0;
var cameraXMax = 300;

var enemyCastleX = 100;
var playerCastleX = WIDTH + cameraXMax - 100;
var castleWidth = 100;
var castleHeight = 100;

var playerTroops = [];
var enemyTroops = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Soldier(x, y, width, height, team, type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.team = team;
    this.health = 0;
    this.attackDmg = 0;
    this.attackTimer = 0;

    this.internalTimer = 0;

    if(type === 0){

        this.health = 20;
        this.attackDmg = 10;
        this.attackTimer = 60;
        this.knockBack = 5;

        if(team === 0){
            this.speedDef = -2;
        }else{
            this.speedDef = 2;
        }

    }else{
        this.speedDef = 3;
        this.knockBack = 5;
    }

    this.speed = this.speedDef;

    this.draw = function(){
        if(team === 0) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillRect(this.x - this.width / 2 - cameraX, this.y - this.height / 2, this.width, this.height);
        }else{
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(this.x - this.width / 2 - cameraX, this.y - this.height / 2, this.width, this.height);
        }

        /* IMAGE EXAMPLE
        ctx.drawImage(playerOneG, 0, 0, 16, 32, x - width/2, y - height/2, width, height);
        */

    };
    this.update = function(){

        this.x+=this.speed;

        this.internalTimer++;

        if(this.team === 1) {
            if (this.speed < 0) {
                this.speed++;
            } else {
                this.speed = this.speedDef;
            }
        }else{
            if (this.speed > 0) {
                this.speed--;
            } else {
                this.speed = this.speedDef;
            }
        }

        if(this.team === 0) {

            if (this.x < enemyCastleX + castleWidth / 2 + this.width / 2) {
                this.speed = 0;
                if (castlesEnemy.health > 0) {
                    if(this.internalTimer % this.attackTimer === 0){
                        castlesEnemy.health-= this.attackDmg;
                    }
                }
            }

            for (var i = 0; i < enemyTroops.length; i++) {

                if (this.x <= enemyTroops[i].x + enemyTroops[i].width) {
                    if(this.internalTimer % this.attackTimer === 0) {
                        this.speed = enemyTroops[i].knockBack;
                        this.health -= enemyTroops[i].attackDmg;
                    }else{
                        this.speed = 0;
                    }
                }

            }

        }else if(this.team === 1) {

            if (this.x > playerCastleX - castleWidth / 2 - this.width / 2) {
                this.speed = 0;
                if (castlesPlayer.health > 0) {
                    if(this.internalTimer % this.attackTimer === 0){
                        castlesPlayer.health-= this.attackDmg;
                    }
                }
            }

            for (var i = 0; i < playerTroops.length; i++) {

                if (this.x >= playerTroops[i].x - playerTroops[i].width) {
                    if(this.internalTimer % this.attackTimer === 0) {
                        this.speed = -playerTroops[i].knockBack;
                        this.health -= playerTroops[i].attackDmg;
                    }else{
                        this.speed = 0;
                    }
                }

            }

        }

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

function Castle(team, health){
    this.x = 0;
    this.health = health;
    this.healthBarWidth = 60;
    this.healthBarMargin = 2;
    this.team = team;
    if(this.team === 0) {
        this.x = enemyCastleX;
    }else{
        this.x = playerCastleX;
    }
    this.y = walkHeight - 55;
    this.width = castleWidth;
    this.height = castleHeight;

    this.healthMultiplier = (this.healthBarWidth - 2*this.healthBarMargin) / this.health;

    this.draw = function(){
        ctx.fillStyle = "rgb(30, 20, 40)";
        ctx.fillRect(this.x - this.width/2 - cameraX, this.y - this.height/2, this.width, this.height);

        ctx.fillStyle = "rgb(30, 20, 40)";
        ctx.fillRect(this.x - this.width/2 - cameraX + 20, this.y - this.height/2 - 100,this.healthBarWidth, 10);

        ctx.fillStyle = "rgb(0, 200, 0)";
        ctx.fillRect(this.x - this.width/2 - cameraX + 20 + this.healthBarMargin, this.y - this.height/2 - 100 + this.healthBarMargin, this.health * this.healthMultiplier, 10 - 2*this.healthBarMargin);

        /* IMAGE EXAMPLE
        ctx.drawImage(playerOneG, 0, 0, 16, 32, x - width/2, y - height/2, width, height);
        */

    };
    this.update = function(){

    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

castlesEnemy = new Castle(0, 100);
castlesPlayer = new Castle(1, 100);

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function getTroopOne(){
    playerTroops.push(new Soldier(playerCastleX, walkHeight - 16, 16, 32, 0, 0));
}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    //SKY FILL
    ctx.fillStyle = "rgb(164, 197, 249)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(90, 193, 42)";
    ctx.fillRect(0, floorHeight, WIDTH, HEIGHT);
    ctx.fillRect(0, walkHeight, WIDTH, HEIGHT);

    /* EXAMPLE FOR LOOP
    for(var i = 0; i < coins.length; i++){
        coins[i].update();
        coins[i].draw();
    }
    */

    /* IMAGE DRAW EXAMPLE
    ctx.drawImage(groundG, 0, 0, 1000, 100, 0, HEIGHT - floorHeight, 1000, 100);
    */

    if(gameRunning === true) {

        frameCount++;

        castlesEnemy.update();
        castlesEnemy.draw();

        castlesPlayer.update();
        castlesPlayer.draw();

        if(frameCount % 500 === 0){
            enemyTroops.push(new Soldier(enemyCastleX, walkHeight - 16, 16, 32, 1, 0));
        }

        for(var i = 0; i < playerTroops.length; i++){

            playerTroops[i].update();
            playerTroops[i].draw();

            if(playerTroops[i].health <= 0){
                playerTroops.splice(i, 1);
            }

        }
        for(var i = 0; i < enemyTroops.length; i++){

            enemyTroops[i].update();
            enemyTroops[i].draw();

            if(enemyTroops[i].health <= 0){
                enemyTroops.splice(i, 1);
            }

        }

        /* HIDE ALL DIVS
        document.getElementById("startMenu").setAttribute("hidden", "hidden");
        document.getElementById("resetMenu").setAttribute("hidden", "hidden");
        document.getElementById("instructionsMenu").setAttribute("hidden", "hidden");
        */

        if (keys && keys[37] || keys && keys[65]) {if(cameraX >= 5){cameraX-=5;}}
        if (keys && keys[39] || keys && keys[68]) {if(cameraX <= cameraXMax){cameraX+=5;}}

        /* SPAWNING
        if(frameCount % spawnRate === 0){
            addWave();
        }
        */

        /* ON LOSS
        if(Lose condition){
            gameRunning = false;
            localStorage.setItem('HighScoreBusiness', HIGHSCORE);
        }
        */

    }
}

// ---------------------------------------------------------- RESET FUNCTION ------------------------------------------------------------------------ //

function Start(){
    if(gameRunning == false){
        SCORE = 0;
        frameCount = 0;

        /* RESET ARRAYS (EXAMPLE)
        coins = [];
        */

        //document.getElementById("score").innerHTML = "" + SCORE;
        //document.getElementById("gamescore").innerHTML = "" + GAMESCORE;
        //document.getElementById("scorediv").removeAttribute("hidden");
        //document.getElementById("gamescorediv").removeAttribute("hidden");
        HIGHSCORE = localStorage.getItem("HighScoreBusiness");
        gameRunning = true;
    }
}

/* EXAMPLE DIV HIDE
function ShowInstructions(){
    document.getElementById("startMenu").setAttribute("hidden", "hidden");
    document.getElementById("resetMenu").setAttribute("hidden", "hidden");
    document.getElementById("instructionsMenu").removeAttribute("hidden");
}
*/

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