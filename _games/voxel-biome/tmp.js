var versionCode = "Alpha 0.9";
var WIDTH = 1200;
var HEIGHT = 675;
var gameRunning = false;
var SCORE = 0;
var GAMESCORE = 0;
var HIGHSCORE = 0;
var POLUTION = 0;

var DEBUG = false;

var voxels = [];

var frameCount = 0;

var thisFrameClicked = false;
var mouseHeld = false;

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

var forestPol = -5;
var fieldPol = -2;
var seaPol = -1;
var desertPol = +2;
var townPol = +5;
var cityPol = +10;
var oilRigPol = +12;

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

var frameTimer2 = 0;
// ---------------------------------------------------------- OBJECTS ------------------------------------------------------------------------ //

function Voxel(x, y, width, height, type){
    this.x = x;
    this.startY = y;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.stage = 0;

    this.id = currentID;

    this.internalTimer = 100;

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

    this.draw = function(){
        //DRAW EXAMPLE
        //ctx.fillStyle = "rgb(30, 20, 40)";
        //ctx.fillRect(x - width/2, y - height/2, width, height);
        if(this.type === 1) { //FIELD
            ctx.drawImage(voxelsG, 0, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            if(this.randomChance < 0.1){
                ctx.drawImage(voxelsG, 1500, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }else if(this.randomChance < 0.2){
                ctx.drawImage(voxelsG, 1500, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }

        }else if(this.type === 2) { //SEA

            ctx.drawImage(voxelsG, 300, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 2.1) { //SEA

            ctx.drawImage(voxelsG, 300, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

        }else if(this.type === 3) { //FOREST
            ctx.drawImage(voxelsG, 600, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }else if(this.type === 4) { //DESERT
            ctx.drawImage(voxelsG, 900, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);

            if(this.randomChance < 0.2){
                ctx.drawImage(voxelsG, 1500, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
            }
        }else if(this.type === 5) { //TOWN/CITY
            ctx.drawImage(voxelsG, 1200, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }else if(this.type === 5.1) {
            this.internalTimer = 0; //---------------------------------------- REMEMBER TO MOVE THIS LINE ALONG...
            ctx.drawImage(voxelsG, 1200, 0, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }

        if(this.turnToCityTerritory === true) {
            ctx.drawImage(voxelsG, 1800, 400, 298, 400, this.x - width / 2, this.y - height / 2, width, height);
        }

        if(DEBUG === true) {
            ctx.font = '20pt Courier New';
            ctx.textAlign = "center";
            ctx.fillText(this.id, this.x, this.y);
        }

    };
    this.update = function(){
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
                this.internalTimer--;
            }else{
                this.turnToCityTerritory = false;
            }
        }

        if(this.type === 5){
            this.internalTimer = 0;
        }

        if(this.internalTimer === 0){

            this.cityProperty = true;
            if(this.type === 1){
                this.type = 5.1;
            }else if(this.type === 2){
                this.type = 2.1;
            }
            this.turnToCityTerritory = false;

        }

    }
    this.animateUp = function(up){
        if(up === 0) {
            this.movingUp = true;
            this.maxHeight = 5;
        }else if(up === 1){
            this.movingUp = false;
        }else{
            this.movingUp = true;
            this.maxHeight =  20;
        }
    }
}

// ---------------------------------------------------------- BEFORE GAME RUN ------------------------------------------------------------------------ //

var maxGridLength = gridTest[0].length;
var movedif = 1;

for(var i = 0; i < gridTest[0].length; i++) {
    for(var j = 0; j < maxGridLength; j++) {
        if(gridTest[i][j] === 0){

        }else if(gridTest[i][j] === 1){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i)) - (WIDTH / 33 * (-15))), (HEIGHT / 14 * j/2) + (i * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 1));
        }else if(gridTest[i][j] === 2){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i)) - (WIDTH / 33 * (-15))), (HEIGHT / 14 * j/2) + (i * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 2));
        }else if(gridTest[i][j] === 3){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i)) - (WIDTH / 33 * (-15))), (HEIGHT / 14 * j/2) + (i * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 3));
        }else if(gridTest[i][j] === 4){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i)) - (WIDTH / 33 * (-15))), (HEIGHT / 14 * j/2) + (i * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 4));
        }else if(gridTest[i][j] === 5){
            voxels.push(new Voxel(WIDTH - ((WIDTH / 33 * (j - i)) - (WIDTH / 33 * (-15))), (HEIGHT / 14 * j/2) + (i * HEIGHT / 28) + ((maxGridLength + 10) * HEIGHT / 29) - (HEIGHT/33 * maxGridLength), WIDTH/16, WIDTH/12, 5.1));
        }
        //voxels.push(new Voxel((WIDTH / 10 * (j + 3)) + (i * WIDTH/20), HEIGHT - ((HEIGHT / 30 * 9) - (HEIGHT / 30 * (i + 1))), 75, 75));
    }
    //width--;
}

// ---------------------------------------------------------- FUNCTIONS ------------------------------------------------------------------------ //



// ---------------------------------------------------------- GAME FUNCTION ------------------------------------------------------------------------ //

function game(){
    //SKY FILL
    ctx.fillStyle = "rgb(5, 8, 15)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for(var i = 0; i < voxels.length; i++){
        voxels[i].update();
        voxels[i].draw();

        if(voxels[i].type === 1){
            fields++;
        }else if(voxels[i].type === 2){
            seas++;
        }else if(voxels[i].type === 2.1){
            oilrigs++;
.1        }else if(voxels[i].type === 3){
            forests++;
        }else if(voxels[i].type === 4){
            deserts++;
        }else if(voxels[i].type === 5){
            cities++;
        }else if(voxels[i].type === 5.1){
            towns++;
        }

        if(selected.length > 0) {
            if (voxels[i].id === selected[0]) {
                if(voxels[i].id === clickSelected[0]){
                    voxels[i].animateUp(2);
                }else{
                    voxels[i].animateUp(0);
                }
            } else {
                if(voxels[i].id === clickSelected[0]){
                    voxels[i].animateUp(2);
                }else{
                    voxels[i].animateUp(1);
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
                        clickSelected.unshift(voxels[i].id);
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
                        clickSelected.unshift(voxels[i].id);
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

    POLUTION = (fields * fieldPol) + (seas * seaPol) + (forests * forestPol) + (deserts * desertPol) + (cities * cityPol) + (oilrigs * oilRigPol) + (towns * townPol);

    frameCount++;

    // CITY TURN ---------------------------------------------------------------------------------------------------------------------------------

    if(frameCount % 100 === 0){

        for(var f = 0; f < voxels.length; f++){

            if(voxels[f].type === 5 || voxels[f].cityProperty === true || voxels[f].type === 5.1) {
                var diceRollCity = Math.random();

                if (diceRollCity < 0.3) {
                    if (voxels[f].type === 5.1) {
                        voxels[f].type = 5;
                    }
                }else{

                    var diceRollCity2 = Math.floor(Math.random() * 4);

                    for (var m = 0; m < gridRoll.length; m++) {
                        for (var n = 0; n < gridRoll[1].length; n++) {
                            if (gridRoll[m][n] === voxels[f].id) {

                                if (diceRollCity2 === 1) {
                                    if (voxels[gridRoll[m - 1][n]] != null) {
                                        voxels[gridRoll[m - 1][n]].turnToCityTerritory = true;
                                    }
                                } else if (diceRollCity2 === 2) {
                                    if (voxels[gridRoll[m][n - 1]] != null) {
                                        voxels[gridRoll[m][n - 1]].turnToCityTerritory = true;
                                    }
                                } else if (diceRollCity2 === 3) {
                                    if (voxels[gridRoll[m + 1][n]] != null) {
                                        voxels[gridRoll[m + 1][n]].turnToCityTerritory = true;
                                    }
                                }else{
                                    if (voxels[gridRoll[m][n + 1]] != null) {
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
    if (keys && keys[53]){buildType = 5.1;}
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
    ctx.fillText("Time Remaining: 2:00",WIDTH/2,HEIGHT/10);

    if(POLUTION < 0){
        ctx.fillStyle = "rgb(0, 200, 0)";
    }else if(POLUTION < 50){
        ctx.fillStyle = "rgb(255, 140, 0)";
    }else{
        ctx.fillStyle = "rgb(200, 0, 0)";
    }

    ctx.fillText("Pollution: " + POLUTION + "%",WIDTH/2,HEIGHT/6);

    ctx.font = '15pt Courier New';
    ctx.fillStyle = "rgb(255, 255, 255)";

    ctx.textAlign="left";
    ctx.fillText("Fields: " + fields,WIDTH/90,HEIGHT/10);
    ctx.fillText("Seas: " + seas,WIDTH/90,HEIGHT/10 + (HEIGHT/15));
    ctx.fillText("Forests: " + forests,WIDTH/90,HEIGHT/10 + (HEIGHT/15)*2);
    ctx.fillText("Deserts: " + deserts,WIDTH/90,HEIGHT/10 + (HEIGHT/15)*3);
    ctx.fillText("Cities: " + cities,WIDTH/90,HEIGHT/10 + (HEIGHT/15)*4);

    ctx.fillStyle = "rgba(30, 30, 30, 0.5)";
    ctx.fillRect(WIDTH - WIDTH/7, HEIGHT/20, WIDTH/8, HEIGHT/2.5);

    if(clickSelected.length > 0){
        for(i = 0; i < voxels.length; i++){

            var selectedVoxelType;

            if(voxels[i].id === clickSelected[0]){
                selectedVoxelType = voxels[i].type;
                //break;
            }
            if(selectedVoxelType === 1){

                ctx.drawImage(voxelsG, 0, 0, 298, 400, WIDTH - WIDTH / 9, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Fields" , WIDTH - WIDTH/13, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(fieldDesc1 , WIDTH - WIDTH/13, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(fieldDesc2 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(fieldDesc3 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(fieldPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + fieldPol.toString() + "%" , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 2){
                ctx.drawImage(voxelsG, 300, 0, 298, 400, WIDTH - WIDTH/9, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Sea" , WIDTH - WIDTH/13, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(seaDesc1 , WIDTH - WIDTH/13, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(seaDesc2 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(seaDesc3 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(seaPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + seaPol.toString() + "%" , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);
            }else if(selectedVoxelType === 2.1){
                ctx.drawImage(voxelsG, 300, 400, 298, 400, WIDTH - WIDTH/9, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Oil Rig" , WIDTH - WIDTH/13, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(oilRigDesc1 , WIDTH - WIDTH/13, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(oilRigDesc2 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(oilRigDesc3 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(oilRigPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + oilRigPol.toString() + "%" , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);
            }else if(selectedVoxelType === 3){

                ctx.drawImage(voxelsG, 600, 0, 298, 400, WIDTH - WIDTH/9, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Forest" , WIDTH - WIDTH/13, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(forestDesc1 , WIDTH - WIDTH/13, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(forestDesc2 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(forestDesc3 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(forestPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + forestPol.toString() + "%" , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 4){

                ctx.drawImage(voxelsG, 900, 0, 298, 400, WIDTH - WIDTH/9, HEIGHT/18, WIDTH/15, WIDTH/11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Desert" , WIDTH - WIDTH/13, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(desertDesc1 , WIDTH - WIDTH/13, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(desertDesc2 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(desertDesc3 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(desertPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + desertPol.toString() + "%" , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 5){

                ctx.drawImage(voxelsG, 1200, 400, 298, 400, WIDTH - WIDTH / 9, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("City" , WIDTH - WIDTH/13, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(cityDesc1 , WIDTH - WIDTH/13, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(cityDesc2 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(cityDesc3 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(cityPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + cityPol.toString() + "%" , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

            }else if(selectedVoxelType === 5.1){

                ctx.drawImage(voxelsG, 1200, 0, 298, 400, WIDTH - WIDTH / 9, HEIGHT / 18, WIDTH / 15, WIDTH / 11.25);

                ctx.font = '12pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.textAlign="center";
                ctx.fillText("Town" , WIDTH - WIDTH/13, HEIGHT/4);

                ctx.font = '9pt Courier New';
                ctx.fillStyle = "rgb(255, 255, 255)";

                ctx.fillText(townDesc1 , WIDTH - WIDTH/13, HEIGHT/4 + HEIGHT/40 + HEIGHT/50);
                ctx.fillText(townDesc2 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*2 + HEIGHT/50);
                ctx.fillText(townDesc3 , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*3 + HEIGHT/50);

                ctx.font = '10pt Courier New';
                if(townPol <= 0) {
                    ctx.fillStyle = "rgb(0, 200, 0)";
                }else{
                    ctx.fillStyle = "rgb(200, 0, 0)";
                }

                ctx.fillText("Pollution: " + townPol.toString() + "%" , WIDTH - WIDTH/13, HEIGHT/4 + (HEIGHT/40)*5 + HEIGHT/50);

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