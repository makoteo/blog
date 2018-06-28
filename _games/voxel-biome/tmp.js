var versionCode = "Alpha 0.9";
var WIDTH = 1200;
var HEIGHT = 675;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;

var TEMPPOINTS = 0;
var POINTS = 0;
var POLUTION = 0;

var YEAR = 1;
var SEASON = "Spring";

var GAMESPEED = 2;

var DEBUG = false;

var voxels = [];

var frameCount = 0;

var thisFrameClicked = false;
var mouseHeld = false;

var animationOffset = 0;

var gridTest = [

    [1, 2, 2, 2, 2, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 2, 2, 2, 2, 1, 1, 1],
    [2, 1, 1, 1, 1, 2, 1, 1],
    [2, 2, 2, 2, 2, 1, 1, 1]

];

var gridRoll = [

    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

var mapSideLength = gridTest[0].length;

var selected = [];
var clickSelected = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var voxelsG = new Image();
voxelsG.src = "BiomeGame.png";

var voxelsGUI = new Image();
voxelsGUI.src = "VoxelBiomeUI.png";

var currentID = 0;

var mousePos;
var mousePosX;
var mousePosY;
var mouseDownTimer = 0;
var tempMouseTimer = 0;

var buildType = 0;

var forests = 0;
var deserts = 0;
var fields = 0;
var seas = 0;
var towns = 0;
var cities = 0;
var oilrigs = 0;
var desertFactories = 0;
var forestFactories = 0;
var Mountains = 0;

var forestPol = -6;
var fieldPol = -3;
var seaPol = -2;
var desertPol = +1;
var townPol = +3;
var cityPol = +8;
var oilRigPol = +10;
var desertFactoryPol = +12;
var forestFactoryPol = +12;
var MountainPol = -1;

var forestDesc1 = "All those leaves";
var forestDesc2 = "are bound to ";
var forestDesc3 = "reduce pollution.";

var fieldDesc1 = "There's a few";
var fieldDesc2 = "flowers. Could ";
var fieldDesc3 = "mean something.";

var seaDesc1 = "The algae may";
var seaDesc2 = "reduce a little ";
var seaDesc3 = "of that pollution.";

var desertDesc1 = "There's not ";
var desertDesc2 = "much here, just ";
var desertDesc3 = "some sandstorms.";

var townDesc1 = "Will soon grow";
var townDesc2 = "into something";
var townDesc3 = "really bad.";

var cityDesc1 = "Your biggest";
var cityDesc2 = "enemy. A LOT ";
var cityDesc3 = "of pollution.";

var oilRigDesc1 = "They're taking";
var oilRigDesc2 = "the seas too!";
var oilRigDesc3 = "More pollution!!";

var desertFactoryDesc1 = "They're taking";
var desertFactoryDesc2 = "the deserts as";
var desertFactoryDesc3 = "well?!";

var forestFactoryDesc1 = "No no no...";
var forestFactoryDesc2 = "This is getting";
var forestFactoryDesc3 = "really bad...";

var MountainDesc1 = "They block cities";
var MountainDesc2 = "from spreading.";
var MountainDesc3 = "Big plus!";

var frameTimer2 = 0;
var yearVisible = true;
var yearlength = 1800;

var actionSelected = 0;

var tempMouseTimer2 = 0;
var tempMouseTimer3 = 0;

var cardYOffset = [0, 0, 0];

var cardSelected = 0;

var cardCombos = [

    [1, 2],
    [1, 3],
    [1, 5],
    [4, 1],
    [4, 5],
    [1, 3],
    [3, 5],
    [4, 1],
    [1, 3]

];

var cardNeedGiveCombos = [

    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [2, 1],
    [3, 2],
    [2, 1],
    [3, 2]

];

var cardPosX = [0, 0, 0];

var cards = [[1, 2], [1, 3], [1, 5]];

var cardNeedGive = [[1, 1], [1, 1], [1, 1]];

var cardOpacity = 1;

var tileSelectedByCard = [];

var tradeButtonOffset1 = 0;
var tradeButtonOffset2 = 0;

var word1 = "";
var word2 = "";

var num1 = 0;
var num2 = 0;
// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Voxel(x, y, width, height, type){
    this.x = x;
    this.startY = y;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    this.id = currentID;

    this.internalTimer = yearlength;

    this.turnToCityTerritory = false;

    this.cityProperty = false;

    if(this.id/mapSideLength !== 0) {
        if(this.id/mapSideLength === 1) {
            gridRoll[Math.ceil(this.id / (mapSideLength) + 1)].push(this.id);
        }else{
            gridRoll[Math.ceil(this.id / (mapSideLength) + 0.1)].push(this.id);
        }
    }else{
        gridRoll[1].push(this.id);
    }

    currentID++;

    this.movingUp = false;

    this.maxHeight = 5;

    this.randomChance = Math.random();

    this.opac1 = 1;
    this.opac2 = 0;
    this.opac3 = 0;

    this.falling = false;
    this.typeToChangeTo = 0;
    this.hasFallen = false;

    this.cardSelected = false;

    this.toBeDestroyed = false;

    this.draw = function(){
        //DRAW EXAMPLE
        //ctx.fillStyle = "rgb(30, 20, 40)";
        //ctx.fillRect(x - width/2, y - height/2, width, height);
        if(this.type === 1) { //FIELD
            if(SEASON === "Spring" || SEASON === "Fall") {
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
                if(this.opac3 > 0.05 && this.opac1 > 0.8){
                    this.opac3 -= 0.05;
                }
            }else if (SEASON === "Summer"){
                if(this.opac3 < 0.95){
                    this.opac3 += 0.05;
                }
                if(this.opac1 > 0.05 && this.opac3 > 0.8){
                    this.opac1 -= 0.05;
                }
            }else{
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
                if(this.opac3 > 0.05){
                    this.opac3 -= 0.05;
                }
            }

            ctx.drawImage(voxelsG, 0, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 0, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac3;
            ctx.drawImage(voxelsG, 0, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

            if(this.randomChance < 0.1){
                ctx.drawImage(voxelsG, 1500, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }else if(this.randomChance < 0.2){
                ctx.drawImage(voxelsG, 1500, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }

        }else if(this.type === 2) { //SEA

            if(SEASON === "Spring" || SEASON === "Summer" || SEASON === "Fall" ) {
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
            }
            /*else{
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
            }*/

            ctx.drawImage(voxelsG, 300, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 300, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

        }else if(this.type === 2.1) { //SEA

            ctx.drawImage(voxelsG, 300, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 3) { //FOREST

            if(SEASON === "Spring" || SEASON === "Summer") {
                if(this.opac1 > 0.05){
                    this.opac1 = 0;
                }
                if(this.opac3 > 0.05){
                    this.opac3 -= 0.05;
                }
            }else if (SEASON === "Fall"){
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
                if(this.opac3 > 0.05){
                    this.opac3 -= 0.05;
                }
            }else{
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
                if(this.opac3 < 0.95){
                    this.opac3 += 0.05;
                }
            }

            ctx.drawImage(voxelsG, 600, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 600, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac3;
            ctx.drawImage(voxelsG, 900, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

        }else if(this.type === 3.1) { // FOREST FACTORY
            ctx.drawImage(voxelsG, 600, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }else if(this.type === 4) { //DESERT

            if(SEASON === "Spring" || SEASON === "Summer" || SEASON === "Fall" ) {
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
            }else{
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
            }

            ctx.drawImage(voxelsG, 900, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 1800, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

            if(this.randomChance < 0.2){
                ctx.drawImage(voxelsG, 1500, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }
        }else if(this.type === 4.1) { //DESERT
            ctx.drawImage(voxelsG, 900, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }else if(this.type === 5) { //MOUNTAIN

            ctx.drawImage(voxelsG, 1500, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 6) { //TOWN

            ctx.drawImage(voxelsG, 1200, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 6.1) {
            this.internalTimer = 0; //---------------------------------------- REMEMBER TO MOVE THIS LINE ALONG...

            if(SEASON === "Spring" || SEASON === "Summer" || SEASON === "Fall") {
                if(this.opac1 > 0.05){
                    this.opac1 -= 0.05;
                }
            }else{
                if(this.opac1 < 0.95){
                    this.opac1 += 0.05;
                }
            }

            ctx.drawImage(voxelsG, 1200, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = this.opac1;
            ctx.drawImage(voxelsG, 1200, 800, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            ctx.globalAlpha = 1;

        }

        if(this.turnToCityTerritory === true || this.toBeDestroyed === true) {
            ctx.drawImage(voxelsG, 1800, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }

        if(DEBUG === true) {
            ctx.font = '20pt Courier New';
            ctx.textAlign = "center";
            ctx.fillText(this.id, this.x, this.y);
        }

    };
    this.update = function(){

        if(this.type === 6.1 && this.opac1 > 0 && SEASON !== "Winter"){
            this.opac1 = 0;
        }

        if(this.movingUp === false) {
            if(this.y < this.startY){
                this.y++;
            }
        }else{
            if(this.y > this.startY - this.maxHeight){
                this.y--;
            }
        }

        if(this.turnToCityTerritory === true){
            if(this.internalTimer > 0) {
                this.internalTimer-=GAMESPEED;
            }else{
                this.turnToCityTerritory = false;
            }
        }

        if(this.type === 6){
            this.internalTimer = 0;
        }

        if(this.falling === true){

            this.fallSpeed = 5;

            if(this.hasFallen === false){
                this.y += this.fallSpeed;
                this.hasFallen = true;
            }

            if(this.y % y <= 4){
                this.y+=this.fallSpeed;
            }else{
                this.y = y;
                this.type = this.typeToChangeTo;
                this.falling = false;
            }
        }

        if(this.internalTimer === 0){

            this.cityProperty = true;
            if(this.type === 1){
                this.type = 6.1;
            }else if(this.type === 2){
                this.type = 2.1;
            }else if(this.type === 4){
                this.type = 4.1;
            }else if(this.type === 3){
                this.type = 3.1;
            }
            this.turnToCityTerritory = false;

        }

        if(tileSelectedByCard.length > 0){
            for(var t = 0; t < tileSelectedByCard.length; t++){
                if(tileSelectedByCard[t] === this.id){
                    this.animateUp(2);
                    this.cardSelected = true;
                    break;
                }
            }
        }else{
            this.cardSelected = false;
        }

        if(this.cardSelected === false){
            this.toBeDestroyed = false;
        }

        this.animateUp = function(up){
            if(up === 0) {
                this.movingUp = true;
                this.maxHeight = 5;
            }else if(up === 1){
                this.movingUp = false;
            }else {
                this.movingUp = true;
                this.maxHeight = 20;
            }
        }

        this.fallAwayAndReplace = function(changeType){
            this.falling = true;
            this.typeToChangeTo = changeType;
        }

        if(this.type === 0 || this.type === 5){
            this.cityProperty = false;
        }
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

var maxGridLength = gridTest[0].length;

for(var i = 0; i < gridTest[0].length; i++) {
    for(var j = 0; j < maxGridLength; j++) {
        if(gridTest[i][j] === 0){

        }else if(gridTest[i][j] === 1){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 1));
        }else if(gridTest[i][j] === 2){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 2));
        }else if(gridTest[i][j] === 3){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 3));
        }else if(gridTest[i][j] === 4){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 4));
        }else if(gridTest[i][j] === 5){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15))) - WIDTH/50, (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 5));
        }else if(gridTest[i][j] === 6){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i + 1)) - (WIDTH / 33 * (-15)) - WIDTH/50), (HEIGHT / 14 * j/2) + ((i - 2) * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 6.1));
        }
        //voxels.push(new Voxel((WIDTH / 10 * (j + 3)) + (i * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 9) - (HEIGHT / 30 * (i + 1))), 75, 75));
    }
    //width--;
}

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //

function onClick(xObj, yObj, widthObj, heightObj){
    if((((mousePosX - WIDTH/30) > xObj)) && ((mousePosX - WIDTH/30 < (xObj + widthObj))) && (((mousePosY - WIDTH/30) > yObj)) && (((mousePosY - WIDTH/30) < (yObj + heightObj)))) {
        return true;
    }
}

function switchUpCards(cardNumber){
    //cards[cardNumber] = cardCombos[randomx];

    cards.splice(cardNumber, 1);
    cardNeedGive.splice(cardSelected - 1, 1);

    cardSelected = 0;

}

// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){

    frameCount+=GAMESPEED;

    if(tempMouseTimer2 > 0){
        tempMouseTimer2--;
    }

    if(cardSelected !== 0){
        if(animationOffset < 200){
            animationOffset+=5;
        }
    }else{
        if(animationOffset > 0){
            animationOffset-=5;
        }
    }

    //SKY FILL
    ctx.fillStyle = "rgb(5, 8, 15)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < voxels.length; i++){

        var voxel = voxels[i];

        voxel.update();
        voxel.draw();

        if(voxels[i].type === 1){
            fields++;
        }else if(voxel.type === 2){
            seas++;
        }else if(voxel.type === 2.1){
            oilrigs++;
        }else if(voxel.type === 3){
            forests++;
        }else if(voxel.type === 3.1){
            forestFactories++;
        }else if(voxel.type === 4){
            deserts++;
        }else if(voxel.type === 4.1){
            desertFactories++;
        }else if(voxel.type === 5){
            Mountains++;
        }else if(voxel.type === 6){
            cities++;
        }else if(voxel.type === 6.1){
            towns++;
        }

        if(selected.length > 0) {
            if (voxel.id === selected[0]) {
                if(voxel.id === clickSelected[0]){
                    voxel.animateUp(2);
                }else{
                    if(voxel.cardSelected === false){
                        voxel.animateUp(0);
                    }
                }
            } else {
                if(voxel.id === clickSelected[0]){
                    voxel.animateUp(2);
                }else{
                    if(voxel.cardSelected === false){
                        voxel.animateUp(1);
                    }
                }
            }
        }

        if(voxels[i].id !== selected[0]) {
            if (((mousePosX > voxels[i].x + voxels[i].width / 3)) &&
                ((mousePosX < voxels[i].x + voxels[i].width - voxels[i].width / 3)) &&
                ((mousePosY > voxels[i].y + voxels[i].height / 8)) &&
                ((mousePosY < voxels[i].y + voxels[i].height - voxels[i].height / 3))) {

                //voxels[i].animateUp(0);

                selected.unshift(voxels[i].id);

                if(thisFrameClicked === true && tempMouseTimer < 1){
                    if(voxels[i].id === clickSelected[0]) {
                        clickSelected = [];
                    }else{
                        if(cardSelected !== 0 && tileSelectedByCard.length < cardNeedGive[cardSelected - 1][0]){
                            clickSelected.unshift(voxels[i].id);
                        }
                        if(cardSelected !== 0){
                            if(cards[cardSelected - 1][0] === voxels[i].type){
                                tileSelectedByCard.unshift(voxels[i].id);
                                //voxels[i].fallAwayAndReplace(cards[cardSelected - 1][1]);
                                //switchUpCards(cardSelected - 1);
                            }
                        }
                    }
                    tempMouseTimer = 10;
                }

            } else {
                if(thisFrameClicked === true) {
                    if (voxels[i].id === clickSelected[0]) {
                        clickSelected.unshift(999);
                    }
                }
            }
        }else{
            if (((mousePosX > voxels[i].x + voxels[i].width / 3)) &&
                ((mousePosX < voxels[i].x + voxels[i].width - voxels[i].width / 3)) &&
                ((mousePosY > voxels[i].y + voxels[i].height / 8)) &&
                ((mousePosY < voxels[i].y + voxels[i].height - voxels[i].height / 8))) {

                if(thisFrameClicked === true && tempMouseTimer < 1){
                    if(voxels[i].id === clickSelected[0]) {
                        clickSelected = [];
                    }else{
                        if(cardSelected === 0){
                            clickSelected.unshift(voxels[i].id);
                        }
                        if(cardSelected !== 0){
                            if(cards[cardSelected - 1][0] === voxels[i].type){
                                if(tileSelectedByCard.length >= cardNeedGive[cardSelected - 1][1]){
                                    voxels[i].toBeDestroyed = true;
                                }
                                tileSelectedByCard.unshift(voxels[i].id);
                                //voxels[i].fallAwayAndReplace(cards[cardSelected - 1][1]);
                                //switchUpCards(cardSelected - 1);
                            }
                        }
                        if(buildType !== 0) {
                            voxels[i].type = buildType;
                        }
                    }
                    tempMouseTimer = 10;
                }else if(mouseHeld === true){
                    if(buildType !== 0) {
                        voxels[i].type = buildType;
                    }
                }

            } else {
                selected.unshift(999);

            }
        }

    }

    POLUTION = (fields * fieldPol) + (seas * seaPol) + (forests * forestPol) + (deserts * desertPol)
        + (cities * cityPol) + (oilrigs * oilRigPol) + (towns * townPol) + (forestFactories * forestFactoryPol) + (Mountains * MountainPol);

    // PLAYER TURN ---------------------------------------------------------------------------------------------------------------------------------------------------

    if(frameCount % yearlength === 0){
        if(cards.length < 3){
            var randomx = Math.floor(Math.random() * (cardCombos.length));

            cards.push(cardCombos[randomx]);
            cardNeedGive.push(cardNeedGiveCombos[randomx]);

            cardYOffset[cards.length - 1] = 50;
        }

    }

    var xPosCard = [0, 0, 0];
    var yPosCard = [0, 0, 0];
    var cardWidth = WIDTH/8;
    var cardHalfWidth = cardWidth/2;
    var cardHeight = HEIGHT/3.375;
    var cardOffset = WIDTH/10;
    var cardMoveSpeed = 5;

    if(tempMouseTimer2 > 0){
        tempMouseTimer2--;
    }

    if(cardSelected !== 0 && tileSelectedByCard.length > cardNeedGive[cardSelected - 1][0]){
        tileSelectedByCard.splice(0, 1);
    }

    //CARD CLICK/MOUSEOVER --------------------------------------------------------------------------------------------------------

    var clickCheck = false;
    var opaqueCheck = false;

    if (onClick(WIDTH/2 - 150, (-100) + animationOffset + tradeButtonOffset1, 150, 40)) {
        tradeButtonOffset1 = 5;
    }else{
        tradeButtonOffset1 = 0;
    }

    if (onClick(WIDTH/2, (-100) + animationOffset + tradeButtonOffset2, 150, 40)) {
        tradeButtonOffset2 = 5;
    }else{
        tradeButtonOffset2 = 0;
    }

    if(cardSelected !== 0 && (thisFrameClicked) && (tempMouseTimer3 < 1) && mouseHeld === false && tileSelectedByCard.length === cardNeedGive[cardSelected - 1][0]) {
        var biomesTraded = 0;
        if (onClick(WIDTH/2 - 150, (-100) + animationOffset + tradeButtonOffset1, 150, 40)) {
            for(var z = 0; z < tileSelectedByCard.length; z++) {
                for(var p = 0; p < voxels.length; p++) {
                    if (voxels[p].id === tileSelectedByCard[z]) {
                        if(voxels[p].toBeDestroyed === false){
                            voxels[p].type = (cards[cardSelected - 1][1]);
                        }else{
                            voxels[p].type = 0;
                            voxels[p].toBeDestroyed = false;
                        }
                        //cardSelected = 0;
                        biomesTraded++;
                    }
                }
            }
            cardNeedGive.splice(cardSelected - 1, 1);
            cards.splice(cardSelected - 1, 1);
            tempMouseTimer3 = 1;
            tileSelectedByCard = [];
            cardSelected = 0;
        }
    }

    if(tempMouseTimer3 > 0){
        tempMouseTimer3--;
    }

    if(cardSelected !== 0 && (thisFrameClicked) && (tempMouseTimer2 < 1) && mouseHeld === false && tileSelectedByCard.length === cardNeedGive[cardSelected - 1][0]) {
        if (onClick(WIDTH/2, (-100) + animationOffset + tradeButtonOffset2, 150, 40)) {
            tileSelectedByCard = [];
            cardSelected = 0;
        }
    }

    for(var g = 0; g < cards.length; g++){

        if(cardYOffset[g] < 0){
            cardYOffset[g]+=cardMoveSpeed;
        }

        if (onClick(cardPosX[g], HEIGHT - HEIGHT / 8 - cardYOffset[g], WIDTH / 8, HEIGHT / 3.375)) {
            if(g + 1 === cardSelected){
                cardOpacity = 0.3;
            }
            console.log("Opacity!!");
            opaqueCheck = true;
        } else {
            console.log("No opacity");
            if(opaqueCheck === false){
                cardOpacity = 1;
            }
        }

        if(onClick(cardPosX[g], HEIGHT - HEIGHT/8 - cardYOffset[g] + animationOffset, cardOffset, cardHeight)){
            if(cardYOffset[g] < 100){
                cardYOffset[g]+=cardMoveSpeed;
            }
        }else if(cardYOffset[g] > 0 && cardSelected !== (g+1)){
            cardYOffset[g]-=cardMoveSpeed;
        }

        if((thisFrameClicked) && (tempMouseTimer2 < 1) && mouseHeld === false) {
            if (onClick(cardPosX[g], HEIGHT - HEIGHT / 8 - cardYOffset[g] + animationOffset, WIDTH / 10, HEIGHT / 3.375)) {
                clickCheck = true;
                if (cardSelected !== (g + 1) && tempMouseTimer2 < 1) {
                    cardSelected = g + 1;
                } else {
                    cardSelected = 0;
                    tileSelectedByCard = [];
                }
                tempMouseTimer2 = 20;
                cardYOffset[g] = 100;
            } else {
                if (clickCheck === false && cardSelected !== 0 && (tileSelectedByCard.length > cardNeedGive[cardSelected - 1][0] || tileSelectedByCard.length === 0)) {
                    //tileSelectedByCard = [];
                    //cardSelected = 0;
                }
            }

            if(onClick(cardPosX[g], HEIGHT + HEIGHT/7 - cardYOffset[g] + animationOffset - HEIGHT/90, WIDTH/10, HEIGHT/45)){
                switchUpCards(g);
            }
        }
    }

    //CARDMOUSEOVER END ---------------------------------------------------------------------------------------------------

    // CITY TURN ---------------------------------------------------------------------------------------------------------------------------------

    TEMPPOINTS += (((fields) + (seas) + (forests * 2) - (deserts) + (Mountains))/1000) * GAMESPEED;
    if(frameCount % yearlength === 0){
        yearVisible = true;
        if(SEASON === "Spring"){
            SEASON = "Summer";
        }else if(SEASON === "Summer"){
            SEASON = "Fall";
        }else if(SEASON === "Fall"){
            SEASON = "Winter";
        }else if(SEASON === "Winter"){
            SEASON = "Spring";
            YEAR++;
        }
    }

    for(var b = 0; b < 8; b++){
        if(frameCount % yearlength === yearlength - 200 + b*25){
            if(yearVisible === false){
                yearVisible = true;
            }else {
                yearVisible = false;
            }
        }
    }

    POINTS = Math.round(TEMPPOINTS);

    if(frameCount % yearlength === 0){

        for(var f = 0; f < voxels.length; f++){

            if(voxels[f].type === 6 || (voxels[f].cityProperty === true && voxels[f].type !== 2.1) || voxels[f].type === 6.1) {
                var diceRollCity = Math.random();

                if (diceRollCity < 0.3) {
                    if (voxels[f].type === 6.1) {
                        voxels[f].type = 6;
                    }else{
                        diceRollCity = 0.4;
                    }
                }
                if (diceRollCity >= 0.3){

                    var diceRollCity2 = Math.floor(Math.random() * 4);

                    for (var m = 0; m < gridRoll.length; m++) {
                        for (var n = 0; n < gridRoll[1].length; n++) {
                            if (gridRoll[m][n] === voxels[f].id) {

                                if (diceRollCity2 === 1) {
                                    if (voxels[gridRoll[m - 1][n]] != null && voxels[gridRoll[m - 1][n]].type !== 5) {
                                        voxels[gridRoll[m - 1][n]].turnToCityTerritory = true;
                                    }
                                } else if (diceRollCity2 === 2) {
                                    if (voxels[gridRoll[m][n - 1]] != null && voxels[gridRoll[m][n - 1]].type !== 5) {
                                        voxels[gridRoll[m][n - 1]].turnToCityTerritory = true;
                                    }
                                } else if (diceRollCity2 === 3) {
                                    if (voxels[gridRoll[m + 1][n]] != null && voxels[gridRoll[m + 1][n]].type !== 5) {
                                        voxels[gridRoll[m + 1][n]].turnToCityTerritory = true;
                                    }
                                }else{
                                    if (voxels[gridRoll[m][n + 1]] != null&& voxels[gridRoll[m][n + 1]].type !== 5) {
                                        voxels[gridRoll[m][n + 1]].turnToCityTerritory = true;
                                    }
                                }

                            }
                        }
                    }

                }

            }
        }
    }

    if(selected.length > 1){
        selected.splice(1, 1);
    }

    if(clickSelected.length > 1){
        clickSelected.splice(1, 1);
    }

    window.onmousemove = logMouseMove;

    if(tempMouseTimer > 0){
        tempMouseTimer--;
    }

    if(thisFrameClicked === true){
        if(mouseDownTimer < 20) {
            mouseDownTimer++;
        }else{
            mouseHeld = true;
        }

    }else{
        mouseDownTimer = 0;
    }

    if (keys && keys[49]){buildType = 1;}
    if (keys && keys[50]){buildType = 2;}
    if (keys && keys[51]){buildType = 3;}
    if (keys && keys[52]){buildType = 4;}
    if (keys && keys[53]){buildType = 5;}
    if (keys && keys[54]){buildType = 6.1;}
    if (keys && keys[48]){buildType = 0;}

    if (keys && keys[114] && frameTimer2 < 1){

        if(DEBUG === false){
            DEBUG = true;
            frameTimer2 = 15;
        }else{
            DEBUG = false;
            frameTimer2 = 15;
        }

    }

    if (keys && keys[27]){cardSelected = 0; tileSelectedByCard = [];}

    if(frameTimer2 > 0){
        frameTimer2--;
    }


    // DRAWING ---------------------------------------------------------------------------------------------------------------------------------

    if(POLUTION < 10){
        ctx.fillStyle = "rgba(51, 13, 13, 0)";
    }else if(POLUTION < 20){
        ctx.fillStyle = "rgba(51, 13, 13, 0.1)";
    }else if(POLUTION < 40){
        ctx.fillStyle = "rgba(51, 13, 13, 0.2)";
    }else if(POLUTION < 50){
        ctx.fillStyle = "rgba(51, 13, 13, 0.3)";
    }else{
        ctx.fillStyle = "rgba(51, 13, 13, 0.4)";
    }

    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.font = '20pt Courier New';
    ctx.fillStyle = "rgb(255, 255, 255)";

    ctx.textAlign="center";
    ctx.fillText("Points: " + POINTS,WIDTH/2,HEIGHT/10 - animationOffset);

    if(POLUTION < 0){
        ctx.fillStyle = "rgb(0, 200, 0)";
    }else if(POLUTION < 50){
        ctx.fillStyle = "rgb(255, 140, 0)";
    }else{
        ctx.fillStyle = "rgb(200, 0, 0)";
    }

    ctx.fillText("Pollution: " + POLUTION + "%",WIDTH/2,HEIGHT/6 - animationOffset);

    ctx.font = '15pt Courier New';
    ctx.fillStyle = "rgb(255, 255, 255)";

    ctx.textAlign="left";
    ctx.fillText("Fields: " + fields,WIDTH/90 - animationOffset,HEIGHT/10);
    ctx.fillText("Seas: " + seas,WIDTH/90 - animationOffset,HEIGHT/10 + (HEIGHT/15));
    ctx.fillText("Forests: " + forests,WIDTH/90 - animationOffset,HEIGHT/10 + (HEIGHT/15)*2);
    ctx.fillText("Deserts: " + deserts,WIDTH/90 - animationOffset,HEIGHT/10 + (HEIGHT/15)*3);
    ctx.fillText("Mountains: " + Mountains,WIDTH/90 - animationOffset,HEIGHT/10 + (HEIGHT/15)*4);
    ctx.fillText("Cities: " + cities,WIDTH/90 - animationOffset,HEIGHT/10 + (HEIGHT/15)*5);

    if(yearVisible === true) {
        ctx.fillStyle = "rgb(255, 255, 255)";
    }else{
        ctx.fillStyle = "rgb(200, 0, 0)";
    }

    ctx.textAlign = "center";
    ctx.fillText("Year " + YEAR + " - " + SEASON, WIDTH / 2, HEIGHT / 4 - HEIGHT/50 - animationOffset);

    ctx.fillStyle = "rgba(30, 30, 30, 0.5)";
    ctx.fillRect(WIDTH - WIDTH/7 + animationOffset, HEIGHT/20, WIDTH/8, HEIGHT/2.5);

    //GUI -------------------------------------------------------------------------------------------------------------------------------------------

    for(var b = 0; b < cards.length; b++){
        if(cards[b][0] === 1 && cards[b][1] === 3){
            xPosCard[b] = 0;
            if(cardNeedGive[b][0] === 2){
                yPosCard[b] = 400;
            }else if(cardNeedGive[b][0] === 3){
                yPosCard[b] = 400;
                xPosCard[b] = 900;
            }
        }else if(cards[b][0] === 1 && cards[b][1] === 2){
            xPosCard[b] = 900;
        }else if(cards[b][0] === 1 && cards[b][1] === 5){
            xPosCard[b] = 1200;
        }else if(cards[b][0] === 4 && cards[b][1] === 1){
            xPosCard[b] = 300;
            if(cardNeedGive[b][0] > 1){
                yPosCard[b] = 400;
                xPosCard[b] = 600;
            }
        }else if(cards[b][0] === 4 && cards[b][1] === 5){
            xPosCard[b] = 600;
        }else if(cards[b][0] === 3 && cards[b][1] === 5){
            xPosCard[b] = 300;
            yPosCard[b] = 400;
        }else{
            xPosCard[b] = 0;
        }
    }

    for(var q = 0; q < cards.length; q++) {
        cardPosX[q] = WIDTH / 2 - cardHalfWidth - cardOffset * ((cards.length) / 2) + 2 * (WIDTH / 8 - WIDTH / 10) + cardOffset * q;
    }

    for(var l = 0; l < cards.length; l++){
        if(cardSelected !== (l+1) || cardSelected === 0){
            ctx.drawImage(voxelsGUI, xPosCard[l], yPosCard[l], 300, 400, cardPosX[l], HEIGHT - HEIGHT/8 - cardYOffset[l] + animationOffset, WIDTH/8, cardHeight);
            ctx.textAlign = "center";
            ctx.font = "bold 8pt Courier";
            ctx.fillStyle = "red";
            ctx.fillText("Discard", cardPosX[l] + cardHalfWidth, HEIGHT + HEIGHT/7 - cardYOffset[l] + animationOffset);
        }else{
            ctx.globalAlpha = cardOpacity;
            ctx.drawImage(voxelsGUI, xPosCard[l], yPosCard[l], 300, 400, cardPosX[l], HEIGHT - HEIGHT/8 - cardYOffset[l], WIDTH/8, cardHeight);
            ctx.globalAlpha = 1;
        }
    }

    if(cardSelected !== 0 && !(cards.length < 1)){
        if((cards[cardSelected - 1][0]) === 1){
            word1 = "Field";
        }else if((cards[cardSelected - 1][0]) === 4){
            word1 = "Desert";
        }

        if(cards[cardSelected - 1][1] === 1){
            word2 = "Field";
        }else if(cards[cardSelected - 1][1] === 2){
            word2 = "Sea";
        }else if(cards[cardSelected - 1][1] === 3){
            word2 = "Forest";
        }else if(cards[cardSelected - 1][1] === 5){
            word2 = "Mountain";
        }
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = '15pt Courier New';

    if(cardSelected !== 0){
        num1 = cardNeedGive[cardSelected - 1][0];
        num2 = cardNeedGive[cardSelected - 1][1];
    }
    ctx.fillText("Pick " + num1 + " " + word1 + "(s) to turn into " + num2 + " " + word2 + "(s)", WIDTH/2, (-150) + animationOffset);

    if(num2 - num1 !== 0){
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = '10pt Courier New';
        ctx.fillText("The last tile you pick (the one with the red cross) will be destroyed.", WIDTH/2, (-130) + animationOffset);
    }


    if(cardSelected !== 0 && tileSelectedByCard.length === cardNeedGive[cardSelected - 1][0]){
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = '15pt Courier New';
        var rectWidth = 150;
        var rectHeight = 40;
        ctx.fillStyle = "gray";
        ctx.fillRect(WIDTH/2 - rectWidth, (-100) + animationOffset + tradeButtonOffset1, rectWidth, rectHeight);
        ctx.fillStyle = "rgb(35, 35, 35)";
        ctx.fillRect(WIDTH/2 - rectWidth + 2, (-100) + animationOffset + 2 + tradeButtonOffset1, rectWidth - 4, rectHeight - 4);

        ctx.fillStyle = "white";
        ctx.fillText("Accept", WIDTH/2 - rectWidth/2, (-100) + animationOffset + 2 + rectHeight/2 + tradeButtonOffset1);

        ctx.fillStyle = "gray";
        ctx.fillRect(WIDTH/2, (-100) + animationOffset + tradeButtonOffset2, rectWidth, rectHeight);
        ctx.fillStyle = "rgb(35, 35, 35)";
        ctx.fillRect(WIDTH/2 + 2, (-100) + animationOffset + 2 + tradeButtonOffset2, rectWidth - 4, rectHeight - 4);

        ctx.fillStyle = "white";
        ctx.fillText("Decline", WIDTH/2 + rectWidth/2, (-100) + animationOffset + 2 + rectHeight/2 + tradeButtonOffset2);
    }

    //TOOLTIP -----------------------------------------------------------------------------------------------------------------------------------------

    if(clickSelected.length > 0){
        for(i = 0; i < voxels.length; i++){

            var selectedVoxelType;

            if(voxels[i].id === clickSelected[0]){
                selectedVoxelType = voxels[i].type;
                //break;
            }
            if(selectedVoxelType === 1){

                ctx.drawImage(voxelsG, 0, 0, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Fields" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(fieldDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(fieldDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(fieldDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(fieldPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + fieldPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 2){
                ctx.drawImage(voxelsG, 300, 0, 298, 400, WIDTH - WIDTH/9 + animationOffset, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Sea" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(seaDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(seaDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(seaDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(seaPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + seaPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);
            }else if(selectedVoxelType === 2.1){
                ctx.drawImage(voxelsG, 300, 400, 298, 400, WIDTH - WIDTH/9 + animationOffset, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Oil Rig" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(oilRigDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(oilRigDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(oilRigDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(oilRigPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + oilRigPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);
            }else if(selectedVoxelType === 3){

                ctx.drawImage(voxelsG, 600, 0, 298, 400, WIDTH - WIDTH/9 + animationOffset, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Forest" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(forestDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(forestDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(forestDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(forestPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + forestPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 3.1){

                ctx.drawImage(voxelsG, 600, 400, 298, 400, WIDTH - WIDTH/9 + animationOffset, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Industrial Unit" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(forestFactoryDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(forestFactoryDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(forestFactoryDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(forestFactoryPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + forestFactoryPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 4){

                ctx.drawImage(voxelsG, 900, 0, 298, 400, WIDTH - WIDTH/9 + animationOffset, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Desert" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(desertDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(desertDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(desertDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(desertPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + desertPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 4.1) {

                ctx.drawImage(voxelsG, 900, 400, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign = "center";
                ctx.fillText("Factory", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(desertFactoryDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                ctx.fillText(desertFactoryDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                ctx.fillText(desertFactoryDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                ctx.font = '10pt Courier New';
                if (desertFactoryPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                } else {
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + desertFactoryPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

            }else if(selectedVoxelType === 5) {

                ctx.drawImage(voxelsG, 1500, 800, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign = "center";
                ctx.fillText("Mountains", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(MountainDesc1, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + HEIGHT / 40 + HEIGHT / 50);
                ctx.fillText(MountainDesc2, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 2 + HEIGHT / 50);
                ctx.fillText(MountainDesc3, WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 3 + HEIGHT / 50);

                ctx.font = '10pt Courier New';
                if (MountainPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                } else {
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + MountainPol.toString() + "%", WIDTH - WIDTH / 13 + animationOffset, HEIGHT / 4 + (HEIGHT / 40) * 5 + HEIGHT / 50);

            }else if(selectedVoxelType === 6){

                ctx.drawImage(voxelsG, 1200, 400, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("City" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(cityDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(cityDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(cityDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(cityPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + cityPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 6.1){

                ctx.drawImage(voxelsG, 1200, 0, 298, 400, WIDTH - WIDTH / 9 + animationOffset, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Town" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(townDesc1 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(townDesc2 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(townDesc3 , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(townPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + townPol.toString() + "%" , WIDTH - WIDTH/13 + animationOffset, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }
        }
    }

    forests = 0;
    deserts = 0;
    fields = 0;
    seas = 0;
    cities = 0;
    oilrigs = 0;
    towns = 0;
    desertFactories = 0;
    forestFactories = 0;
    Mountains = 0;

    if(gameRunning === true) {



        /* HIDE ALL DIVS
        document.getElementById("startMenu").setAttribute("hidden", "hidden");
        document.getElementById("resetMenu").setAttribute("hidden", "hidden");
        document.getElementById("instructionsMenu").setAttribute("hidden", "hidden");
        */

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

    if([32, 37, 38, 39, 40, 114].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

}, false);
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.type == "keydown");
}, false);

function logMouseMove(e) {
    e = event || window.event;

    var rect = canvas.getBoundingClientRect();

    mousePosX = e.clientX - rect.left + WIDTH/30;
    mousePosY = e.clientY - rect.top + WIDTH/30;
    //console.log(mousePosX + ", " + mousePosY);
}

document.addEventListener("mousedown", clickedTrue);

document.addEventListener("mouseup", clickedFalse);

function clickedTrue(){
    thisFrameClicked = true;
}

function clickedFalse(){
    thisFrameClicked = false;
    mouseHeld = false;
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