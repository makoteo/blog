let quotes = [
    "May the odds be ever in your favor",
    "Here goes nothing",
    "50/50",
    "Pick one",
    "No way",
    "Choose one to begin",
    "Don't panic"
]
// Mary had a little lamb lol

let buttonTags = [
    ["Left", "Right"],
    ["Right", "Wrong"],
    ["1", "2"],
    ["True", "False"],
    ["Yes", "No"],
    ["Be", "Not Be"],
    ["All", "None"],
    ["Life", "Death"],
    ["Love", "Hate"],
    ["Green", "Red"],
    ["!", "?"],
    ["Left", "Right"],
    ["Order", "Chaos"]
]

let timerInterval = setInterval(decrementTimer, 1000);

$(document).ready(function(){

    if(document.referrer.includes("pre_game")){
        $('#modal').modal('show');
    }

    if($("#op1").length !== 0){ //Only main page includes op1, so only there will the quotes appear
        $("#quote").html(quotes[Math.floor(Math.random()*quotes.length)]);
        if (localStorage.getItem("minimal") === "true"){
            $(".mainContainer").hide();
            $('body').keydown(function (e){
                if(e.keyCode == 27){
                    $(".mainContainer").show();
                    $(".mainContainer")[0].scrollIntoView({behavior: 'smooth'});
                }
            });
        }
    }

    let root = document.querySelector(':root');
    let col;
    if (localStorage.getItem("bgcolor") === null) {
        col = (Math.floor(Math.random()*300) + 100) % 360;
    }else{
        col = parseInt(localStorage.getItem("bgcolor"))
    }
    //col = 112.5;
    //col = 40;
    let colD = col-10;
    //let colD = Math.floor((col - 15 - (20*((Math.abs(Math.sin(((col + 90)*6)))) - 0.2))) % 360);
    //if(colD < 0) colD = 360 + colD;
    //console.log(col, colD, Math.abs(Math.sin(((col+90)*6))))-0.2;
    root.style.setProperty('--main-color', 'hsl(' + col + ', 100%, 50%)');
    root.style.setProperty('--darker-main-color', 'hsl(' + colD + ', 100%, 45%)');
    root.style.setProperty('--lighter-main-color', 'hsl(' + colD + ', 100%, 75%)');

    $("#afterword").hide();

    let irand = Math.floor(Math.random()*buttonTags.length);
    if(localStorage.getItem("inputButton1") === null){
        $("#op1").text(buttonTags[irand][0]);
    }else{
        $("#op1").text(localStorage.getItem("inputButton1"));
    }

    if(localStorage.getItem("inputButton2") === null){
        $("#op2").text(buttonTags[irand][1]);
    }else{
        $("#op2").text(localStorage.getItem("inputButton2"));
    }

    $(".choiceButton").click(function(){

        $("#afterword").html("");
        $("#afterword").hide();

        $.ajax({
            url: '/guess',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                option: $(this).attr('id')
            }),
            success: function(response){
                if(response["header"] == "none"){
                    console.log(response["score"], response["score"] > 0);
                    $("#message").text(response["message"]);
                    $("#afterword").html(response["long"]);
                    if($("#afterword").html().length > 0){
                        $("#afterword").show();
                        if ((localStorage.getItem("scrollAfter") === "SB" && response["score"] > 0) || (localStorage.getItem("scrollAfter") !== "SB" && localStorage.getItem("scrollAfter") !== "N")) { 
                            // score based, so only if score > 0, second condition checks that none is not chosen
                            $("#afterword")[0].scrollIntoView({behavior: 'smooth'});
                        }
                        $("#quote").html("Game Over");
                    }else{
                        $("#quote").html(response["score"] + " points, 1:00 remaining");
                        let rand = Math.random()
                        if (rand > 0.9) {
                            rand = Math.floor(rand*buttonTags.length);
                            if(localStorage.getItem("inputButton1") === null){
                                $("#op1").text(buttonTags[rand][0]);
                            }

                            if(localStorage.getItem("inputButton2") === null){
                                $("#op2").text(buttonTags[rand][1]);
                            }
                        }
                    }
                }else if (response["header"] == "winner"){
                    window.location = "/highscore";
                }
            }
        })
    });
});

function decrementTimer(){

    if($("#quote").length == 0) return 0;

    let timetext = $("#quote").html();
    let regexRule = /[0-9]:[0-9][0-9]/i;
    timetext = timetext.match(regexRule, '');

    if(timetext == null) return 0;

    timetext = timetext[0];

    let minutes = parseInt(timetext.substr(0, 1))
    let seconds = parseInt(timetext.substr(2))

    if(seconds > 0 || minutes > 0){
        seconds--;
    }
    if(seconds == -1){
        minutes--;
        seconds = 59;
    }
    let leading0 = seconds.toString().length == 1 ? "0" : "";
    let newTimeStamp = minutes.toString() + ":" + leading0 + seconds.toString();
    console.log(newTimeStamp);

    $("#quote").html($("#quote").html().slice(0, -($("#quote").html().length - $("#quote").html().indexOf(":")) - 1) + newTimeStamp + " remaining");

    if(minutes == 0 && seconds == 0){
        $.ajax({
            url: '/timeout',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                text: "endgame"
            }),
            success: function(response){
                $("#message").text(response["message"]);
                $("#afterword").html(response["long"]);
                
                $("#afterword").show();
                $("#afterword")[0].scrollIntoView({behavior: 'smooth'});
                $("#quote").html(quotes[Math.floor(Math.random()*quotes.length)]);
                
            }
        })
    }
}