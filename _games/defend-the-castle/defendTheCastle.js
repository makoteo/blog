var versionCode = "Alpha 0.9";
var WIDTH = 800;
var HEIGHT = 500;
var gameRunning = true;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;
var GAMEMONEY = 0;
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
var clouds = [];
var soldierSlots = [1, 2, 0, 0];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var stickManOneG = new Image();
stickManOneG.src = "StickManOne.png";

var cloudG = new Image();
cloudG.src = "CloudBusiness.png";

var manOneCost = 25;
var giantOneCost = 100;

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

    this.frame = 0;

    if(type === 0){

        this.health = 20;
        this.attackDmg = 5;
        this.attackTimer = 60;
        this.knockBack = 3;
        this.knockBackResistance = 0;

        this.width = 16;
        this.height = 32;

        this.frameSwitch = 10;

        this.yOffset = 0;

        if(team === 0){
            this.speedDef = -2;
        }else{
            this.speedDef = 2;
        }

    }else if(type === 1){

        this.health = 50;
        this.attackDmg = 10;
        this.attackTimer = 60;
        this.knockBack = 7;
        this.knockBackResistance = 1;

        this.width = 32;
        this.height = 64;

        this.frameSwitch = 20;

        this.yOffset = 16;

        if(team === 0){
            this.speedDef = -1;
        }else{
            this.speedDef = 1;
        }

    }else{

    }

    this.speed = this.speedDef;

    this.draw = function(){
        if(team === 0) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            //ctx.fillRect(this.x - this.width / 2 - cameraX, this.y - this.height / 2, this.width, this.height);
            if(this.frame === 0) {
                ctx.drawImage(stickManOneG, 0, 0, 32, 64, this.x - this.width / 2 - cameraX, this.y - this.height / 2 - this.yOffset, this.width, this.height);
            }else{
                ctx.drawImage(stickManOneG, 32, 0, 32, 64, this.x - this.width / 2 - cameraX, this.y - this.height / 2 - this.yOffset, this.width, this.height);
            }
        }else{
            ctx.fillStyle = "rgb(0, 0, 0)";
            //ctx.fillRect(this.x - this.width / 2 - cameraX, this.y - this.height / 2, this.width, this.height);

            if(this.frame === 0) {
                ctx.drawImage(stickManOneG, 64, 0, 32, 64, this.x - this.width / 2 - cameraX, this.y - this.height / 2 - this.yOffset, this.width, this.height);
            }else{
                ctx.drawImage(stickManOneG, 96, 0, 32, 64, this.x - this.width / 2 - cameraX, this.y - this.height / 2 - this.yOffset, this.width, this.height);
            }
        }

        /* IMAGE EXAMPLE
        ctx.drawImage(playerOneG, 0, 0, 16, 32, x - width/2, y - height/2, width, height);
        */

    };
    this.update = function(){

        this.x+=this.speed;

        this.internalTimer++;

        if(this.internalTimer % this.frameSwitch === 0){

            if(this.frame === 0){
                this.frame = 1;
            }else{
                this.frame = 0;
            }

        }

        if(this.team === 1) {
            if (this.speed < 0) {
                this.speed+=0.2;
            } else {
                this.speed = this.speedDef;
            }
        }else{
            if (this.speed > 0) {
                this.speed-=0.2;
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

                if (this.x <= enemyTroops[i].x + enemyTroops[i].width && this.x >= enemyTroops[i].x - enemyTroops[i].width/2) {
                    if(this.internalTimer % this.attackTimer <= 3) {
                        this.speed = enemyTroops[i].knockBack - this.knockBackResistance;
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
                    if(this.internalTimer % this.attackTimer <= 3){
                        castlesPlayer.health-= this.attackDmg;
                    }
                }
            }

            for (var i = 0; i < playerTroops.length; i++) {

                if (this.x >= playerTroops[i].x - playerTroops[i].width && this.x <= playerTroops[i].x + playerTroops[i].width/2) {
                    if(this.internalTimer % this.attackTimer === 0) {
                        this.speed = -playerTroops[i].knockBack + this.knockBackResistance;
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


function Cloud(){
    this.width = Math.floor((Math.random() * 50) + 150);
    this.height = this.width * 0.75;
    this.type = Math.floor((Math.random() * 3));
    this.xType = this.type*200;
    this.x = WIDTH + cameraXMax;
    this.y = Math.floor((Math.random() * (HEIGHT - this.height - 20)) + 10);
    this.velX = Math.floor((Math.random() * 2) + 1);
    this.draw = function(){
        ctx.drawImage(cloudG, this.xType, 0, 200, 150, this.x - cameraX, this.y, this.width, this.height);
    };
    this.update = function(){
        this.x -= this.velX;
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

castlesEnemy = new Castle(0, 100);
castlesPlayer = new Castle(1, 100);

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function getTroop(i){
    if(soldierSlots[i] === 1) {
        if(GAMEMONEY >= manOneCost) {
            playerTroops.push(new Soldier(playerCastleX, walkHeight - 16 + 5 - Math.floor((Math.random() * 10) - 5), 0, 0, 0, 0));
            GAMEMONEY-=manOneCost;
        }
    }else if(soldierSlots[i] === 2){
        if(GAMEMONEY >= giantOneCost) {
            playerTroops.push(new Soldier(playerCastleX, walkHeight - 16 + 5 - Math.floor((Math.random() * 10) - 5), 0, 0, 0, 1));
            GAMEMONEY-=giantOneCost;
        }
    }
}


// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    //SKY FILL
    ctx.fillStyle = "rgb(164, 197, 249)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < clouds.length; i++){

        clouds[i].update();
        clouds[i].draw();

    }

    ctx.fillStyle = "rgb(90, 193, 42)";
    ctx.fillRect(0, floorHeight, WIDTH, HEIGHT);

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

        if(frameCount % 10 === 0){
            GAMEMONEY++;
        }

        castlesEnemy.update();
        castlesEnemy.draw();

        castlesPlayer.update();
        castlesPlayer.draw();

        if(frameCount % 250 === 0){
            enemyTroops.push(new Soldier(enemyCastleX, walkHeight - 16 + 5 - Math.floor((Math.random() * 10) - 5), 16, 32, 1, 0));
        }

        if(frameCount % 300 === 0){
            clouds.push(new Cloud());
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
                if(enemyTroops[i].type = 1){
                    GAMEMONEY += 10;
                }else if(enemyTroops[i].type = 2){
                    GAMEMONEY += 50;
                }
                enemyTroops.splice(i, 1);
            }

        }

        ctx.fillStyle = "rgb(48, 32, 0)";
        ctx.fillRect(WIDTH/2 - 185, HEIGHT*0.8, 90, 90);
        ctx.fillRect(WIDTH/2 - 87, HEIGHT*0.8, 90, 90);
        ctx.fillRect(WIDTH/2 + 12, HEIGHT*0.8, 90, 90);
        ctx.fillRect(WIDTH/2 + 110, HEIGHT*0.8, 90, 90);

        ctx.fillStyle = "rgb(135, 99, 22)";
        ctx.fillRect(WIDTH/2 - 195, HEIGHT*0.79, 90, 90);
        ctx.fillRect(WIDTH/2 - 97, HEIGHT*0.79, 90, 90);
        ctx.fillRect(WIDTH/2 + 2, HEIGHT*0.79, 90, 90);
        ctx.fillRect(WIDTH/2 + 100, HEIGHT*0.79, 90, 90);

        var xSlots = [WIDTH/2 - 170, WIDTH/2 - 70, WIDTH/2 + 30, WIDTH/2 + 130];
        var xBoxSlots = [WIDTH/2 - 195, WIDTH/2 - 97, WIDTH/2 + 2, WIDTH/2 + 100];

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font="15px Arial";
        ctx.textBaseline="middle";
        ctx.textAlign="center";

        for(var i = 0; i < soldierSlots.length; i++) {
            if (soldierSlots[i] === 1) {
                ctx.drawImage(stickManOneG, 0, 0, 32, 64, xSlots[i] + 8, HEIGHT * 0.8 + 16, 16, 32);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillText("25", xSlots[i] + 16, HEIGHT * 0.95, 100);
                if(GAMEMONEY < manOneCost){
                    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                    ctx.fillRect(xBoxSlots[i], HEIGHT*0.79, 90, 90);
                }
            }else if(soldierSlots[i] === 2) {
                ctx.drawImage(stickManOneG, 0, 0, 32, 64, xSlots[i], HEIGHT * 0.8, 32, 64);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillText("100", xSlots[i] + 16, HEIGHT * 0.95, 100);
                if(GAMEMONEY < giantOneCost){
                    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                    ctx.fillRect(xBoxSlots[i], HEIGHT*0.79, 90, 90);
                }
            }
        }
        ctx.textAlign="right";
        ctx.font="bold 25px Courier";
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText(GAMEMONEY.toString(), WIDTH - 20, 20, 100)

        //ctx.drawImage(stickManOneG, 0, 0, 32, 64, x2, HEIGHT*0.8, 32, 64);
        //ctx.fillText("100", x2 + 16, HEIGHT*0.95, 100);

        //ctx.drawImage(stickManOneG, 0, 0, 32, 64, x3, HEIGHT*0.8, 32, 64);
        //ctx.fillText("100", x3 + 16, HEIGHT*0.95, 100);

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