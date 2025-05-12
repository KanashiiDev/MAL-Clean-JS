//Add Custom Profile Colors
async function applyCustomColors(customcolors) {
  let styleElement = document.getElementById("customProfileColors");
  const colorStyles = `
  .profile .statistics-updates .data .graph .graph-inner.watching, .profile .user-statistics .stats-status .circle.watching:after,
  .profile .user-statistics .stats-graph .graph.watching {background:${customcolors[0]}!important}
  .profile .statistics-updates .data .graph .graph-inner.completed, .profile .user-statistics .stats-status .circle.completed:after,
  .profile .user-statistics .stats-graph .graph.completed {background:${customcolors[1]}!important}
  .profile .statistics-updates .data .graph .graph-inner.on_hold, .profile .user-statistics .stats-status .circle.on_hold:after,
  .profile .user-statistics .stats-graph .graph.on_hold {background:${customcolors[2]}!important}
  .profile .statistics-updates .data .graph .graph-inner.dropped, .profile .user-statistics .stats-status .circle.dropped:after,
  .profile .user-statistics .stats-graph .graph.dropped {background:${customcolors[3]}!important}
  .profile .statistics-updates .data .graph .graph-inner.plan_to_watch, .profile .user-statistics .stats-status .circle.plan_to_watch:after,
  .profile .user-statistics .stats-graph .graph.plan_to_watch {background:${customcolors[4]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.reading, .profile .user-statistics .stats-status .circle.reading:after,
  .profile .user-statistics .stats-graph .graph.reading {background:${customcolors[5]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.completed, .profile .user-statistics .stats-status .circle.manga.completed:after,
  .profile .user-statistics .stats-graph .graph.manga.completed {background:${customcolors[6]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.on_hold, .profile .user-statistics .stats-status .circle.manga.on_hold:after,
  .profile .user-statistics .stats-graph .graph.manga.on_hold {background:${customcolors[7]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.dropped, .profile .user-statistics .stats-status .circle.manga.dropped:after,
  .profile .user-statistics .stats-graph .graph.manga.dropped {background:${customcolors[8]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.plan_to_read, .profile .user-statistics .stats-status .circle.manga.plan_to_read:after,
  .profile .user-statistics .stats-graph .graph.plan_to_read {background:${customcolors[9]}!important}
  .profile #profile-stats-anime-genre-table table .list-item .data.ratio > div .mal-progress .mal-progress-bar.primary{background:${customcolors[10]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#338543"]{fill:${customcolors[0]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#2d4276"]{fill:${customcolors[1]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#c9a31f"]{fill:${customcolors[2]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#832f30"]{fill:${customcolors[3]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#338543"]{fill:${customcolors[5]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#2d4276"]{fill:${customcolors[6]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#c9a31f"]{fill:${customcolors[7]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#832f30"]{fill:${customcolors[8]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #338543;"]{color:${customcolors[0]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #2d4276;"]{color:${customcolors[1]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #c9a31f;"]{color:${customcolors[2]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #832f30;"]{color:${customcolors[3]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #338543;"]{color:${customcolors[5]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #2d4276;"]{color:${customcolors[6]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #c9a31f;"]{color:${customcolors[7]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #832f30;"]{color:${customcolors[8]}!important}
  .profile #myanimelist li.btn-fav .title.fs10{color:${customcolors[10]}!important}
  #myanimelist #horiznav_nav.profile-nav > ul > li > a.navactive,#myanimelist .user-function .icon-user-function:not(.disabled) i,
  #myanimelist a:not(.user-function.mb8 a):not(.profile-nav > ul > li > a):not(.icon-team-title):not(.header-profile-link):not(.header-menu-dropdown.header-profile-dropdown a):not(#nav ul a):not(.header-list-dropdown ul li a),
  #myanimelist a:visited:not(.profile-nav > ul > li > a):not(.icon-team-title):not(.header-menu-dropdown.header-profile-dropdown a):not(#nav ul a):not(.header-list-dropdown ul li a) {color:${
    customcolors[10]
  }!important;}
  .loadmore:hover, .favThemes .fav-theme-container .sortFavSong:hover, .favThemes .fav-theme-container .removeFavSong:hover,
  #myanimelist #header-menu > div.header-menu-unit.header-profile.js-header-menu-unit > a:hover,#myanimelist #menu > #menu_left > #nav > li > a:hover,#myanimelist .header-list-button .icon:hover,
  #myanimelist .header-notification-dropdown .header-notification-dropdown-inner .header-notification-item > .inner.is-read .header-notification-item-header .category,
  #myanimelist a:not(.user-function.mb8 a):not(.icon-team-title):not(.header-profile-link):hover,.header-list .header-list-dropdown ul li a:hover,.header-profile-dropdown.color-pc-constant ul li a:hover,
  .page-common #nav.color-pc-constant li a:hover,.profile #myanimelist #header-menu ul > li > a:hover,#myanimelist > div.header-menu-unit.header-profile.js-header-menu-unit > a:hover,
  #myanimelist #top-search-bar.color-pc-constant #topSearchButon:hover,#myanimelist .header-message-button:hover .icon,#myanimelist .header-notification-button:hover .icon,
  #myanimelist #menu #topSearchText:hover:not(:focus-within) + #topSearchButon i:before,.dark-mode .profile #myanimelist #menu #nav ul a:hover,#myanimelist #horiznav_nav.profile-nav > ul > li > a:hover,
  .profile #myanimelist #menu #nav ul a:hover {
  color:${tinycolor(customcolors[10]).brighten(25)}!important;}
  span.di-ib.po-r{color:${customcolors[11]}!important}`;
  if (!styleElement) {
    styleElement = create("style", { id: "customProfileColors" });
    document.head.appendChild(styleElement);
  }
  styleElement.innerHTML = colorStyles.replace(/\n/g, "");
}
