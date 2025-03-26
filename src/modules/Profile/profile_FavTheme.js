async function buildFavSongs(data) {
  let parts = data.split("/");
  let favarray = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "favSongEntry") {
      if (i + 1 < parts.length) {
        const base64 = parts[i + 1].replace(/_/g, "/");
        const lzbase64 = LZString.decompressFromBase64(base64);
        let dec = JSON.parse(lzbase64);
        favarray.push(dec);
      }
    }
  }

  let opGroup = create("div", { id: "op-group" });
  let edGroup = create("div", { id: "ed-group" });
  let FavContent = create("div", { class: "favThemes", id: "favThemes" });
  let sortItem1 = null;
  let sortItem2 = null;
  if (svar.modernLayout) {
    $(FavContent).insertBefore($("#content > div > div.container-left > div li.icon-statistics.link").parent());
  } else {
    $("#content > div > div.container-right > h2").nextUntil(".user-comments").wrapAll("<div class='favContainer' id='user-def-favs'></div>");
    $(".user-comments").before(FavContent);
    $(FavContent).css({ marginBottom: "30px", width: "810px", display: "inline-block" });
    opGroup.classList.add("flex2x");
    edGroup.classList.add("flex2x");
  }

  if ((customCSS && customCSS.constructor === Array && customCSS[1]) || (customCSS && customCSS.constructor !== Array) || svar.modernLayout) {
    const favbg = document.createElement("style");
    favbg.textContent = `.favThemes .fav-theme-container {background: var(--color-foreground);}`;
    document.head.appendChild(favbg);
  }

  favarray.forEach((arr, index) => {
    arr.forEach((item) => {
      const favSongContainer = create("div", { class: "fav-theme-container", type: item.themeType });
      favSongContainer.innerHTML = `
        <div class="fa fa-sort sortFavSong"order=${index} title="Sort"></div>
        <div class="fa fa-x removeFavSong" order=${index} title="Remove"></div>
        <div class="fav-theme-inner">
        <a href='https://myanimelist.net/anime/${item.animeUrl}/'>
        ${`<img src="${item.animeImage ? item.animeImage : "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c"}" class="anime-image" alt="${
          item.animeTitle
        }">`}</a>
        <div class="fav-theme-header">
        <h2>${item.animeTitle}</h2>
        <a class="favThemeSongTitle" style="cursor:pointer">${item.songTitle.replace(/(\(eps \d.*\))/, "")}</a>
        </div></div>
        <div class="video-container">
        <video controls>
        <source src="${item.songSource}" type="video/webm">
        Your browser does not support the video tag.
        </video>
        </div>
        `;
      FavContent.appendChild(favSongContainer);
    });
  });

  FavContent.append(opGroup, edGroup);

  const favThemes = document.querySelector(".favThemes");
  const animeContainers = favThemes.querySelectorAll(".fav-theme-container");

  animeContainers.forEach((container) => {
    const type = container.getAttribute("type");
    if (type === "OP") {
      opGroup.appendChild(container);
      if ($(opGroup).children().length === 1) {
        $(opGroup).before(`<h5>Openings</h5>`);
      }
    } else if (type === "ED") {
      edGroup.appendChild(container);
    }
    if ($(edGroup).children().length === 1) {
      $(edGroup).before(`<h5>Endings</h5>`);
    }
  });
  function toggleShowMore(groupSelector) {
    let limit = svar.modernLayout ? 5 : 6;
    const accordionButton = create(
      "a",
      { class: "anisong-accordion-button", id: `${groupSelector}-accordion-button`, style: { display: "none" } },
      '<i class="fas fa-chevron-down mr4"></i>\nShow More\n'
    );
    if ($(`#${groupSelector}-accordion-button`).length === 0) {
      $(`#${groupSelector}`).append(accordionButton);
    }

    if ($(`#${groupSelector} .fav-theme-container`).length > limit) {
      $(`#${groupSelector} .fav-theme-container`).slice(limit).hide();
      $(`#${groupSelector}-accordion-button`).show();
    }
    $(`#${groupSelector}-accordion-button`).on("click", function () {
      var isVisible = $(`#${groupSelector} .fav-theme-container`).slice(limit).is(":visible");
      if (isVisible) {
        $(`#${groupSelector} .fav-theme-container`).slice(limit).slideUp();
        $(this).html('<i class="fas fa-chevron-down mr4"></i> Show More');
      } else {
        $(`#${groupSelector} .fav-theme-container`).slice(limit).slideDown();
        $(this).html('<i class="fas fa-chevron-up mr4"></i> Show Less');
      }
    });
  }
  toggleShowMore("op-group");
  toggleShowMore("ed-group");
  function replaceFavSongs() {
    const sortItem1compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem1]));
    const sortItem1base64url = sortItem1compressedBase64.replace(/\//g, "_");
    const sortItem2compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem2]));
    const sortItem2base64url = sortItem2compressedBase64.replace(/\//g, "_");
    editAboutPopup([sortItem1base64url, sortItem2base64url], "replaceFavSong");
    sortItem1 = null;
    sortItem2 = null;
  }
  //Sort Favorite Song click function
  document.querySelectorAll(".sortFavSong").forEach((element) => {
    element.addEventListener("click", function () {
      const order = this.getAttribute("order");
      if (sortItem1 === null) {
        sortItem1 = order;
        $(".sortFavSong").addClass("hidden");
        $(this).addClass("selected");
        $(this).parent().parent().children(".fav-theme-container").children(".sortFavSong").removeClass("hidden");
        $(this).parent().parent().children(".fav-theme-container").children(".sortFavSong").show();
      } else if (sortItem2 === null) {
        sortItem2 = order;
        if (sortItem2 !== sortItem1) {
          replaceFavSongs();
        }
        $(this).parent().parent().children(".fav-theme-container").children(".sortFavSong").hide();
        $(".sortFavSong").removeClass("hidden").removeClass("selected");
      }
      if (sortItem1 === sortItem2) {
        sortItem1 = null;
        sortItem2 = null;
      }
    });
  });
  //Remove Favorite Song click function
  $(".removeFavSong").on("click", function () {
    const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
    const base64url = compressedBase64.replace(/\//g, "_");
    editAboutPopup(`favSongEntry/${base64url}/`, "removeFavSong");
  });

  //Favorite Song Title click function
  $(".favThemeSongTitle").on("click", function () {
    if (!svar.modernLayout) {
      const title = $(this).prev();
      title.css("white-space", title.css("white-space") === "nowrap" || title.css("white-space") === "nowrap" ? "normal" : "nowrap");
      $(this).css("white-space", $(this).css("white-space") === "nowrap" || $(this).css("white-space") === "nowrap" ? "normal" : "nowrap");
    }
    const videoContainer = $(this).parent().parent().parent().children(".video-container");
    const currentDisplay = videoContainer.css("display");
    videoContainer.css("display", currentDisplay === "none" || currentDisplay === "" ? "block" : "none");
  });
  if (userNotHeaderUser) {
    $(".sortFavSong").remove();
    $(".removeFavSong").remove();
  }
}
