---
layout: default
title: Main
---

## **Hi!!** 

Welcome to the website.

{::nomarkdown}

<center><a href="./games"><h3>Popular Games:</h3></a></center>

<br>

<table>
    <tr>
        <th style="width:20px"><b id="GamesTitle">Popular</b></th>
        <th></th>
    </tr>
    <tr class="all official">
        <td><a href="./games/voxel-biome/index.html"><img src="/blog/assets/PageImages/VoxelBiomeThingy.jpg"></a></td>
        <td><a href="./games/voxel-biome/index.html"><b>Voxel Biome (In developement)</b></a><br> <p style="line-height:1.1;">A puzzle/strategy game with voxel graphics. Use cards to trade different biomes to save the enviroment from destruction.</p></td>
    </tr>
    <tr class="all unofficial">
        <td><a href="./games/flying-cube/index.html"><img src="/blog/assets/PageImages/ThumbnailAnnoyingCubeNotScaled.jpg"></a></td>
        <td><a href="./games/flying-cube/index.html"><b>Annoying Cube</b></a> <br> <p style="line-height:1.1;">A basic copy of the well known original 'Flappy Bird'. Has some further additions though! Pick between two different game modes! Use Space or the mouse to jump. </p></td>
    </tr>
    <tr class="all unofficial">
        <td></td>
        <td style="width:100%" id="bottomCentered"><a href="./games">More Games!</a></td>
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

{:/}

{::nomarkdown}

<center><h3>New Posts:</h3></center>

{:/}

<table>
  {% for post in site.posts %}
    <tr>
      <td><a href="/blog{{ post.url }}">{{ post.title }}</a></td>
      <td>{{ post.excerpt }}</td>
    </tr>
  {% endfor %}
</table>