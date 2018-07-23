---
layout: default
title: Games
---

{::nomarkdown}
<ul>
  <li><a class="active" href="#games">Games</a></li>
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
  <select>
    <option value="0">Unofficial</option>
    <option value="1">Official</option>
    <option value="2">In developement</option>
  </select>
</div>

<br>
<br>

<table>
    <tr>
        <th style="width:20px"><b>Unofficial Games</b></th>
        <th></th>
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

<table>
    <tr>
        <th style="width:20px"><b>Official Games</b></th>
        <th></th>
    </tr>
    <tr>
        <td id="columnTest"><a href="./games/voxel-biome/index.html"><img src="/blog/assets/PageImages/VoxelBiomeThingy.jpg"></a></td>
        <td><a href="./games/voxel-biome/index.html"><b>Voxel Biome</b></a><br> <p style="line-height:1.1;">A puzzle/strategy game with voxel graphics. Use cards to trade different biomes to save the enviroment from destruction.</p></td>
    </tr>
</table>

<script>

var gamesSelect = document.getElementById("gameTypes");
var selectedGames = gamesSelect.options[gamesSelect.selectedIndex].value;

</script>


{:/}