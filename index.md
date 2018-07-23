---
layout: default
title: Games
---

{::nomarkdown}
<ul>
  <li><a class="active" href="#games" selected>Games</a></li>
  <li><a href="#news">Posts</a></li>
  <li><a href="#contact">Information</a></li>
  <li><a href="#about">About</a></li>
</ul>
<br>
{:/}

## **Hi!!** 

Welcome to the website. Below are my games! 

{::nomarkdown}

<center><h1>Games!</h1></center>

<div class="custom-select" style="width:200px;">
  <select id="gamesPicked">
    <option value="0">All</option>
    <option value="1">Official</option>
    <option value="2">Unofficial</option>
  </select>
</div>

<br>
<br>

<table>
    <tr>
        <th style="width:20px" id="GamesTitle"><b>Unofficial Games</b></th>
        <th></th>
    </tr>
    <tr>
        <td id="columnTest"><a href="./games/voxel-biome/index.html"><img src="/blog/assets/PageImages/VoxelBiomeThingy.jpg"></a></td>
        <td><a href="./games/voxel-biome/index.html"><b>Voxel Biome</b></a><br> <p style="line-height:1.1;">A puzzle/strategy game with voxel graphics. Use cards to trade different biomes to save the enviroment from destruction.</p></td>
    </tr>
    <tr>
        <td id="columnTest"><a href="./games/flying-cube/index.html"><img src="/blog/assets/PageImages/ThumbnailAnnoyingCubeNotScaled.jpg"></a></td>
        <td><a href="./games/flying-cube/index.html"><b>Annoying Cube</b></a> <br> <p style="line-height:1.1;">A basic copy of the well known original 'Flappy Bird'. Has some further additions though! Pick between two different game modes! Use Space or the mouse to jump. </p></td>
    </tr>
    <tr>
        <td><a href="./games/the-business-dev/index.html"><img src="/blog/assets/PageImages/BusinessNotScaled.jpg"></a></td>
        <td><a href="./games/the-business-dev/index.html"><b>The Business</b></a> <b style="color:red;">- Discontinued</b> <br> <p>An original game based on an interesting loss system. Control with arrow keys. Collect coins to generate profit. </p></td>
    </tr>
    <tr>
        <td><a href="./games/defend-the-castle/index.html"><img src="/blog/assets/PageImages/SideScrollerThingyThing.jpg"></a></td>
        <td><a href="./games/defend-the-castle/index.html"><b>Defend the Castle</b></a> <b style="color:red;">- Discontinued</b> <br> <p>A shot at making a 'defend the castle' type game. Wasn't ever finished however.</p></td>
    </tr>
</table>

<script>

var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);
</script>

<script>
var e = document.getElementById('gamesPicked');
var gamePicked = e.options[e.selectedIndex].value;

if(gamePicked === 0){
    document.getElementById('GamesTitle').innerHTML = "<b>All</b>";
    console.log("Hi!!");
}else if(gamePicked === 1){
      document.getElementById('GamesTitle').innerHTML = "<b>Official</b>";
      console.log("Hi!!");
}else if(gamePicked === 2){
    document.getElementById('GamesTitle').innerHTML = "<b>Unofficial</b>";
    console.log("Hi!!");
}

</script>


{:/}