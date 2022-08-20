$(document).ready(function() {

    console.log("hello");

    loaded = false;

    if (localStorage.getItem("bgcolor") !== null) {
        $('#colorCheck').prop('checked', false);
        $('#colorRange').prop('disabled', false);
    }
    setRangeBar(false);

    if (localStorage.getItem("scrollAfter") === "N") {
        $('#scoreMes2').prop('checked', true);
    }else if (localStorage.getItem("scrollAfter") === "SB") {
        $('#scoreMes3').prop('checked', true);
    }

    if (localStorage.getItem("minimal") !== "true") {
        $('#minCheck').prop('checked', false);
    }

    if (localStorage.getItem("inputButton1") !== null) {
        $('#inputButton1').val(localStorage.getItem("inputButton1"));
    }

    if (localStorage.getItem("inputButton2") !== null) {
        $('#inputButton2').val(localStorage.getItem("inputButton2"));
    }

    loaded = true;

    $("#colorCheck").change(function(){
        // Enable and Disable the color selector
        console.log("mlep");
        let checked = $("#colorCheck").is(":checked");
        $('#colorRange').prop('disabled', checked);

        setRangeBar(checked);
    });

    $("#minCheck").change(function(){
        let checked = $("#minCheck").is(":checked");
        if(checked){
            localStorage.setItem('minimal', "true");
        }else{
            localStorage.setItem('minimal', "false");
        }
    });

    $(document).on('input', '#colorRange', function() {
        // Get color
        let color = parseInt($('#colorRange').prop('value'));

        color = (color + 100) % 360;

        console.log(color);
        
        let colorD = color-10;

        let root = document.querySelector(':root');

        root.style.setProperty('--main-color', 'hsl(' + color + ', 100%, 50%)');
        root.style.setProperty('--darker-main-color', 'hsl(' + colorD + ', 100%, 45%)');
        root.style.setProperty('--lighter-main-color', 'hsl(' + colorD + ', 100%, 75%)');

        localStorage.setItem('bgcolor', color);
    });

    $("input[name='scoreMes']").change(function(){
        if ($(this).val() === 'scoreMes1') {
            localStorage.setItem('scrollAfter', "A");
        }else if ($(this).val() === 'scoreMes2') {
            localStorage.setItem('scrollAfter', "N");
        }else if ($(this).val() === 'scoreMes3') {
            localStorage.setItem('scrollAfter', "SB");
        }
    });

    $("input[name='buttonName']").keyup(function(){
        if($(this).val() !== ""){
            localStorage.setItem($(this).prop('id'), $(this).val());
        }else{
            localStorage.removeItem($(this).prop('id'));
        }
    });

});

function setRangeBar(checked){
    // Set the value of the color selector to the current color
    color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
    console.log(color);

    color = color.split(",")[0];
    color = color.replace("hsl(", "");
    color = parseInt(color);
    console.log(color);

    color = (color + 260) % 360;
    $('#colorRange').prop('value', color);
            
    if(!loaded) return 0;
    
    if(!checked){
        console.log("saving");
        localStorage.setItem('bgcolor', color);
    }else{
        localStorage.removeItem("bgcolor");
    }
}