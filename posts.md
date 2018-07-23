---
layout: default
title: Games
---

{::nomarkdown}

<center><h1>Posts!</h1></center>

{:/}

<table>
  {% for post in site.posts %}
    <tr>
      <td><a href="/blog{{ post.url }}">{{ post.title }}</a></td>
    </tr>
  {% endfor %}
</table>