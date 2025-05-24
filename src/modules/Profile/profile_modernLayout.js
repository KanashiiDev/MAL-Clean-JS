async function applyModernLayout() {
  if (svar.modernLayout) {
    //CSS Fix for Modern Profile Layout
    let fixstyle = `
    .page-common #horiznav_nav.profile-nav > ul > li > a:not(.navactive){color: var(--color-main-text-light)!important;background:0!important}
    .page-common #horiznav_nav.profile-nav > ul > li > a.navactive,.page-common #horiznav_nav.profile-nav > ul > li > a:hover{color:  var(--color-link)!important;background:0!important}
    .maljsNavBtn{background: var(--color-foreground);border-radius: 5px;cursor: pointer;display: inline-block;padding: 10px!important;text-align: center;}
    .maljsProfileBadge{background: var(--color-foreground);-webkit-border-radius: 4px;border-radius: 5px;color: #e9e9e9;font-weight:600;
    display: inline-block;margin-left: 10px;padding: 10px;text-align: center;-webkit-transition: .3s;-o-transition: .3s;transition: .3s;position: absolute;
    bottom: 60px;right: -56px;max-width: 300px;max-height: 150px;overflow: hidden;}
    .maljsProfileBadge > * {width: auto; height: auto}
    .rainbow{-webkit-animation-duration: 20s;animation-duration: 20s;-webkit-animation-iteration-count: infinite;animation-iteration-count: infinite;
    -webkit-animation-name: rainbow;animation-name: rainbow;-webkit-animation-timing-function: ease-in-out;animation-timing-function: ease-in-out;cursor: default;}
    @keyframes rainbow{0%{background:rgb(0 105 255 / .71)}10%{background:rgb(100 0 255 / .71)}20%{background:rgb(255 0 139 / .71)}30%{background:rgb(255 0 0 / .71)}
    40%{background:rgb(255 96 0 / .71)}50%{background:rgb(202 255 0 / .71)}60%{background:rgb(0 255 139 / .71)}70%{background:rgb(202 255 0 / .71)}
    80%{background:rgb(255 96 0 / .71)}85%{background:rgb(255 0 0 / .71)}90%{background:rgb(255 0 139 / .71)}95%{background:rgb(100 0 255 / .71)}to{background:rgb(0 105 255 / .71)}}
    .l-listitem-3_2_items{margin-right:0}
    .l-listitem-list.row1{margin-right: 0px;margin-left: -46px}
    .l-listitem-list.row2{margin-left: 24px;}
    .l-listitem .c-aboutme-ttl-lv2{max-width: 420px;}
    .l-ranking-list_portrait-item{flex-basis: 66px;}
    .l-ranking-list_circle-item{flex-basis: 70px;}
    div#modern-about-me-expand-button,.c-aboutme-accordion-btn-icon{display:none}
    #banner a.header-right.mt4.mr0{z-index: 2;position: relative;margin: 60px 10px 0px !important;}
    #banner div i.fa.fa-ban{margin: 60px 0px 0px !important;position: relative;}
    .loadmore,.actloading,.listLoading {font-size: .8rem;font-weight: 700;padding: 14px;text-align: center;}
    .loadmore {cursor: pointer;background: var(--color-foreground);border-radius: var(--border-radius);margin-bottom: 25px;z-index: 2;position: relative;}
    #headerSmall + #menu {width:auto!important}
    .profile .user-profile-about.js-truncate-outer{border:var(--border) solid var(--border-color);}
    .profile .btn-truncate.js-btn-truncate.open {padding-bottom:0!important}
    .profile-about-user.js-truncate-inner img,.user-comments .comment .text .comment-text .userimg{-webkit-box-shadow:none!important;box-shadow:none!important}
    .user-profile .user-friends {display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-box-pack: start;-webkit-justify-content: start;-ms-flex-pack: start;justify-content: start}
    .user-profile .user-friends .icon-friend {margin: 5px!important;}
    .favs {-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;border: var(--border) solid var(--border-color);box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    display: -ms-grid !important;background-color: var(--color-foreground);padding: 10px;display: grid !important;grid-gap: 15px 5px !important;grid-template-columns: repeat(auto-fill, 70px) !important;
    -webkit-border-radius: var(--br);border-radius: var(--br);-webkit-box-pack: justify;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;margin-bottom:12px}
    .word-break img, .dark-mode .profile .user-profile-about .userimg, .profile .user-profile-about .userimg,
    .profile .user-profile-about a .userimg,.profile .user-profile-about .userimg.img-a-r {max-width: 100%;-webkit-box-shadow: none!important;box-shadow: none!important;}
    .profile .user-profile-about .quotetext{margin-left:0px;max-width:100%}
    .profile .user-profile-about iframe {max-width:100%}
    .profile .user-profile-about input.button {white-space: break-spaces;}
    #modern-about-me-inner {overflow:hidden}
     #modern-about-me-inner > *, #modern-about-me-inner .l-mainvisual {max-width:420px!important}
    .l-listitem-list-item {-webkit-flex-basis: 64px;flex-basis: 64px;-ms-flex-preferred-size: 64px;}
    .l-listitem-5_5_items {margin-right: -25px;}
    #horiznav_nav .navactive {color: var(--color-text)!important;background: var(--color-foreground2)!important;padding: 5px!important;}
    .dark-mode .page-common #horiznav_nav ul li,.page-common #horiznav_nav ul li {background: 0 !important}
    .favTooltip {border: var(--border) solid var(--border-color);-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    z-index:5;text-indent:0;-webkit-transition:.4s;-o-transition:.4s;transition:.4s;position: absolute;background-color: var(--color-foreground4);color: var(--color-text);
    padding: 5px;-webkit-border-radius: 6px;border-radius: 6px;opacity:0;width: -webkit-max-content;width: -moz-max-content;width: max-content;left: 0;right: 0;margin: auto;max-width: 420px;}
    .user-profile {width:auto!important}
    .favs .btn-fav, .user-badge, .icon-friend {overflow:hidden}
    .favs .btn-fav:hover, .user-badge:hover, .icon-friend:hover {overflow:visible!important}
    .favs .btn-fav:hover .favTooltip,.user-badge:hover .favTooltip, .icon-friend:hover .favTooltip{opacity:1}
    .user-profile .user-badges .user-badge:hover,.user-profile .user-friends .icon-friend:hover,.user-profile .user-friends .icon-friend:active{opacity:1!important}
    .dark-mode .user-profile .user-badges .user-badge,.user-profile .user-badges .user-badge {${defaultMal ? "margin:2px!important" : "margin: 4px!important"}}
    .max{max-height:99999px!important}`;

    var fixstylesheet = create("style", { id: "modernLayoutCSSFix" }, fixstyle.replace(/\n/g, ""));
    document.head.appendChild(fixstylesheet);
    document.body.style.setProperty("background", "var(--color-background)", "important");
    document.body.style.setProperty("--color-foreground", "var(--color-foregroundOP)", "important");
    document.body.style.setProperty("--color-foreground2", "var(--color-foregroundOP2)", "important");

    //Modern Profile Layout
    let about = document.querySelector(".user-profile-about.js-truncate-outer");
    let modernabout = document.querySelector("#modern-about-me");
    let avatar = document.querySelector(".user-image");
    let name = $('span:contains("s Profile"):first');
    let headerRight = document.querySelector("a.header-right.mt4.mr0");
    container.setAttribute("style", "margin: 0 auto;min-width: 320px;max-width: 1240px;left: -40px;position: relative;height: 100%;");
    if (!custombg) {
      banner.setAttribute("style", "background-color: var(--color-foreground);background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;");
    } else {
      if (svar.headerOpacity) {
        const headerSmall = document.getElementById("headerSmall");
        headerSmall.style.backgroundColor = "var(--fgo)!important";
        headerSmall.addEventListener("mouseenter", () => {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop === 0) {
            headerSmall.style.backgroundColor = "";
          }
        });
        banner.addEventListener("mouseenter", () => {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop === 0) {
            headerSmall.style.backgroundColor = "var(--fgo)!important";
          }
        });
      }
    }
    document.querySelector("#myanimelist").setAttribute("style", "min-width: 1240px;width:100%");
    set(1, "#myanimelist .wrapper", { sa: { 0: "width:100%;display:table" } });
    document.querySelector("#contentWrapper").insertAdjacentElement("beforebegin", banner);
    banner.append(container);
    headerRight ? banner.prepend(headerRight) : null;
    $('.header-right:contains("Profile Settings")').remove();
    if (isMainProfilePage && userNotHeaderUser && headerUserName !== "" && headerUserName !== "MALnewbie") {
      $(headerRight).wrapAll("<div class='profileRightActions'></div>").after(blockU);
    }
    container.append(avatar);
    about ? about.classList.add("max") : null;
    modernabout ? modernabout.classList.add("max") : null;
    if (set(0, about, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
      document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", about);
    }
    if (set(0, modernabout, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
      document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", modernabout);
      let l = document.querySelectorAll(".l-listitem");
      let a = "max-width:420px";
      set(2, ".l-listitem", { sal: { 0: "-webkit-box-pack: center;display: flex;-ms-flex-pack: center;justify-content: center;flex-wrap: wrap;flex-direction: row;" } });
      set(1, ".l-mainvisual", { sa: { 0: a } });
      set(1, ".intro-mylinks-wrap", { sa: { 0: a } });
      set(1, ".l-intro", { sa: { 0: a } });
      set(1, ".l-intro-text-wrap-1", { sa: { 0: a } });
      set(1, ".copy-wrap-1", { sa: { 0: a } });
      set(1, ".mylinks-ul", { sa: { 0: a } });
    }
    if (about || modernabout) {
      if (set(1, ".user-profile h1:first-child", { sa: { 0: "position: absolute;top: 50px;right: 0;" } })) {
        banner.append(document.querySelector(".user-profile h1:first-child"));
      }
      $('a:contains("About Me Design"):last').remove();
    }
    set(1, ".user-image img", { sa: { 0: "display: inline-block;max-height: 230px;max-width: 160px;width: 100%;box-shadow:none!important" } });
    set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
    document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
    set(1, ".user-statistics-stats.mt16", { sa: { 0: "margin-top:8px!important" } });
    $(".user-statistics-stats .stats.manga h5").addClass("mb12");
    set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
    document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
    avatar.setAttribute("style", "display: flex;height: inherit;align-items: flex-end;position: relative;width:500px;");
    name.css({ "font-size": "1.5rem", "font-weight": "800", left: "35px", top: "-35px", color: "var(--color-main-text-op)", opacity: ".93" });
    name.html(name.html().replace(/'s Profile/g, "\n"));
    avatar.append(name[0]);
    set(2, "#container span.profile-team-title.js-profile-team-title", { sl: { top: "18px" } });
    container.append(document.querySelector(".user-function.mb8"));

    if (username === headerUserName) {
      $(".user-function.mb8").addClass("display-none");
    }
    $(".user-function.mb8").children(".icon-gift").remove();
    $(".user-function.mb8").children(".icon-comment").remove();
    $(".user-function.mb8").children(".icon-request").addClass("maljsNavBtn");
    $(".user-function.mb8").children(".icon-message").addClass("maljsNavBtn");
    $(".user-function.mb8").children(".icon-remove").addClass("maljsNavBtn");
    if ($(".user-function.mb8").attr("class") === "user-function mb8 display-none" && $(".maljsProfileBadge").length) {
      $(".maljsProfileBadge").css({ bottom: "35px" });
    }

    set(1, "a.btn-profile-submit.fl-l", { sa: { 0: "width:49.5%" } });
    set(1, "a.btn-profile-submit.fl-r", { sa: { 0: "width:49.5%" } });

    if (set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } })) {
      set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } });
    }
    if (set(1, ".bar-outer.anime", { sa: { 0: "width:100%" } })) {
      set(1, ".bar-outer.manga", { sa: { 0: "width:100%" } });
    }
    set(1, ".user-function.mb8", { sa: { 0: "position: relative;left: 96.5%;top: -60px;display: flex;width: 100px;font-size: 1rem;justify-content: flex-end;gap: 6px;" } });
    set(2, ".user-function.mb8 a", { sal: { 0: "border:none!important;box-shadow:none!important" } });
    set(2, ".user-function.mb8 span", { sal: { 0: "border:none!important;box-shadow:none!important" } });

    if (set(1, ".content-container", { sa: { 0: `display: grid!important;grid-template-columns: 33% auto;${defaultMal ? "gap:10px" : ""};margin-top: 20px;justify-content: center;` } })) {
      set(1, ".container-left", { sa: { 0: "width:auto" } });
      set(1, ".container-right", { sa: { 0: "width:auto;min-width:800px" } });
    }

    if (set(1, "#content > table > tbody > tr > td.profile_leftcell", { sa: { 0: "width:auto" } })) {
      set(1, "#content > table > tbody > tr", { sa: { 0: `display: grid!important;grid-template-columns: 33% auto;${defaultMal ? "gap:10px" : ""};margin-top: 10px;justify-content: center;` } });
      set(1, "#content > table > tbody > tr > td.pl8", { sa: { 0: "width: auto;position:relative;min-width:800px" } });
    }
    if (!isMainProfilePage && svar.profileRemoveLeftSide) {
      $(".content-container,#content > table > tbody > tr").css("grid-template-columns", "0 96%");
      $(".container-left,#content > table > tbody > tr > td.profile_leftcell").css({ width: "0", overflow: "hidden", opacity: "0" });
      $(".container-right,#content > table > tbody > tr > td.pl8").css({ padding: "0", maxWidth: "1275px" });
      $(".boxlist.col-3").css({ maxWidth: "230px" });
      $(".boxlist.col-4").css({ width: "188px" });
    }
    set(1, ".user-profile", { sa: { 0: "width:auto;" } });
    set(2, ".user-profile li", { sal: { 0: "width:auto" } });
    set(1, ".quotetext", { sa: { 0: "margin-left:0;" } });
    if ($(".head-config").next().is(".boxlist-container.badge")) {
      $(".head-config").remove();
    }
    $("#contentWrapper > div:nth-child(2) > h1").remove();
    set(1, "#content > table > tbody > tr > td.pl8 > #horiznav_nav", { r: { 0: 0 } });
    set(1, ".container-right #horiznav_nav", { r: { 0: 0 } });
    document
      .querySelector("#contentWrapper")
      .setAttribute(
        "style",
        `width: 1375px;max-width: 1375px!important;min-width:500px; margin: auto;transition:.6s;opacity:1;${
          defaultMal ? "top: -30px!important" : "top: -40px!important"
        };border:0!important;box-shadow:none!important`
      );
    let more = document.querySelector(".btn-truncate.js-btn-truncate");
    if (more) {
      more.setAttribute("data-height", '{"outer":1000,"inner":90000}');
    }
    let s = document.querySelector("#statistics");
    if (s) {
      let mangaStats = document.querySelector("#statistics .stats.manga");
      let mangaUpdates = document.querySelector("#statistics .updates.manga");
      let animeStats = document.querySelector("#statistics .stats.anime");
      let animeUpdates = document.querySelector("#statistics .updates.anime");
      s.setAttribute("style", "width: 818px");
      s.children[1].append(mangaStats);
      s.children[2].prepend(animeUpdates);
      s.prepend(document.querySelector("#statistics > div:nth-child(2)"));
      document.querySelector(".container-right").prepend(s);
      $('h2:contains("Statistics"):last').remove();

      // if anime & manga stats empty - Remove
      if (animeStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00" && mangaStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00") {
        document.querySelector("#statistics").remove();
      } else {
        // if manga stats empty - Remove
        if (mangaStats && mangaStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00") {
          mangaStats.remove();
          mangaUpdates.remove();
          if (animeStats && animeStats.children[1].innerText !== "Days: 0.0\tMean Score: 0.00") {
            animeStats.parentElement.appendChild(animeUpdates);
          }
        }
        // if anime stats empty - Remove
        if (animeStats && animeStats.children[1].innerText === "Days: 0.0\tMean Score: 0.00") {
          animeStats.remove();
          animeUpdates.remove();
          if (mangaStats.parentElement && mangaStats.children[1].innerText !== "Days: 0.0\tMean Score: 0.00") {
            mangaStats.parentElement.appendChild(mangaUpdates);
          }
        }
      }
    }
    //Favorites
    if ($(".user-button.clearfix.mb12").length) {
      let favs = create("div", { class: "favs anime" });
      let favs2 = create("div", { class: "favs manga" });
      let favs3 = create("div", { class: "favs character" });
      let favs4 = create("div", { class: "favs people" });
      let favs5 = create("div", { class: "favs company" });
      $(".user-button.clearfix.mb12").after(favs, favs2, favs3, favs4, favs5);
      function getfavs() {
        let favc = ["#anime_favorites", "#manga_favorites", "#character_favorites", "#person_favorites", "#company_favorites"];
        let fave = [favs, favs2, favs3, favs4, favs5];
        let f, c;
        for (let l = 0; l < 5; l++) {
          f = document.querySelector(favc[l]);
          if (!f) {
            fave[l].remove();
          } else {
            fave[l].insertAdjacentElement("beforebegin", f.previousElementSibling);
            c = document.querySelectorAll(favc[l] + " ul > li");
            for (let x = 0; x < c.length; x++) {
              let r = c[x].querySelectorAll("span");
              for (let y = 0; y < r.length; y++) {
                r[y].remove();
              }
              c[x].setAttribute("style", "width:70px");
              fave[l].append(c[x]);
            }
            f.remove();
          }
        }
      }
      getfavs();
    }
    $(".favs").each(function (index) {
      $(this)
        .prev()
        .addBack()
        .wrapAll("<div class='user-favs' id='fav-" + index + "-div'></div>");
    });
    let userFavs = document.querySelectorAll("li.btn-fav");
    let userBadges = document.querySelectorAll(".user-badge");
    let userFriends = document.querySelectorAll(".icon-friend");
    let collection = Array.from(userFavs).concat(Array.from(userBadges), Array.from(userFriends));
    for (let btnFav of collection) {
      btnFav.tagName === "A" ? (btnFav.innerText = "") : "";
      btnFav.style.position = "relative";
      btnFav.style.display = "flex";
      btnFav.style.justifyContent = "center";
      if (btnFav.attributes.title) {
        btnFav.setAttribute("data-title", btnFav.attributes.title.textContent);
        btnFav.removeAttribute("title");
      }
      let title = btnFav.getAttribute("data-title");
      if (title) {
        let tt = create("div", { class: "favTooltip" }, title);
        btnFav.prepend(tt);
        btnFav.tagName === "A" || (btnFav.classList[0] && btnFav.classList[0] === "user-badge") ? (tt.style.marginTop = "-5px") : "";
        tt.style.top = -tt.offsetHeight - 4 + "px";
      }
    }
    if (document.querySelector(".container-right > h2.mb12")) {
      document.querySelector(".container-right > h2.mb12").remove();
    }
    if (!$(".profile .user-profile").length && $("#content > table > tbody > tr > td.profile_leftcell").length) {
      document.querySelector("#content > table > tbody > tr > td.profile_leftcell").classList.add("profile");
    }
    set(1, ".container-right > .btn-favmore", { r: { 0: 0 } });
    set(2, ".profile .user-profile h5", { sal: { 0: "font-size: 11px;margin-bottom: 8px;margin-left: 2px;" } });
    set(2, ".container-left h4", { sal: { 0: "font-size: 11px;margin-left: 2px;" } });
    //Remove Favorite Count
    const favHeader = document.querySelectorAll(".profile .user-profile .user-favs h5");
    for (let i = 0; i < favHeader.length; i++) {
      favHeader[i].innerText = favHeader[i].innerText.replace(/ \(\d+\)/, "");
    }
    set(1, ".favs", { sap: { 0: "box-shadow: none!important;" } });

    //Add Navbar to Profile Banner
    let nav = create("div", { class: "navbar", id: "navbar" });
    nav.innerHTML =
      '<div id="horiznav_nav" class="profile-nav" style="margin: 0;height: 45px;align-content: center;"><ul>' +
      '<li><a href="/profile/' +
      username +
      '">Overview</a></li><li><a href="/profile/' +
      username +
      '/statistics">Statistics</a></li>' +
      '<li><a href="/profile/' +
      username +
      '/favorites">Favorites</a></li><li><a href="/profile/' +
      username +
      '/reviews">Reviews</a></li>' +
      '<li><a href="/profile/' +
      username +
      '/recommendations">Recommendations</a></li><li><a href="/profile/' +
      username +
      '/stacks">Interest Stacks</a></li><li><a href="/profile/' +
      username +
      '/clubs">Clubs</a></li>' +
      '<li><a href="/profile/' +
      username +
      '/badges">Badges</a></li><li><a href="/profile/' +
      username +
      '/friends">Friends</a></li></ul></div>';
    banner.insertAdjacentElement("afterend", nav);
    nav.setAttribute("style", "z-index: 3;position: relative;background: #000;text-align: center;background-color: var(--color-foreground) !important;");
    let navel = document.querySelectorAll("#navbar #horiznav_nav > ul > li > a");
    $('h2:contains("Synopsis"):last').parent().addClass("SynopsisDiv");
    let n = current.split("/")[3];
    if (!n) {
      $(navel[0]).addClass("navactive");
    } else {
      n = n.charAt(0).toUpperCase() + n.slice(1);
      $(".navbar a:contains(" + n + ")").addClass("navactive");
    }
    set(0, navel, { sal: { 0: "margin: 0 30px;font-size: .9rem;box-shadow: none!important;" } });
  }
}
