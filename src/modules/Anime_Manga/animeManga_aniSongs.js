/* eslint-disable no-use-before-define */
async function loadAniSong() {
  if (svar.animeSongs) {
    //Anisongs for MAL
    //fork of anisongs by morimasa
    //https://greasyfork.org/en/scripts/374785-anisongs
    const anisongs_temp = {
      last: null,
      target: null,
      id: null,
    };
    const songCache = localforage.createInstance({ name: "MalJS", storeName: "anisongs" });
    let currentpath =
      current.match(/(anime|manga)\/([0-9]+)\/*\/?(.*)/) &&
      !/\/(ownlist|season|recommendations)/.test(current) &&
      !document.querySelector("#content > .error404") &&
      !current.split("/")[4] &&
      !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current)
        ? current.match(/(anime|manga)\/([0-9]+)\/*\/?(.*)/)
        : null;
    if (currentpath && currentpath[1] === "anime") {
      anisongs_temp.id = currentpath[2];
      anisongs_temp.target = document.querySelector(".rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)");
      if (anisongs_temp.last !== anisongs_temp.id) {
        if (anisongs_temp.target) {
          anisongs_temp.last = anisongs_temp.id;
          launch(anisongs_temp.id);
        } else {
          setTimeout(anisong, 500);
        }
      }
    } else if (currentpath && currentpath[1] === "manga") {
      cleaner(anisongs_temp.target);
      anisongs_temp.last = 0;
    } else {
      anisongs_temp.last = 0;
    }
    const options = { cacheTTL: 604800000, class: "anisongs" };
    let anisongdata, op1, ed1;
    const API = {
      //Get Songs from JikanAPI
      async getSongs(mal_id) {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${anisongs_temp.id}/themes`);
        return res.json();
      },
      //Get Videos from AnimeThemesAPI
      async getVideos(anilist_id) {
        const include = ["animethemes.animethemeentries.videos", "animethemes.song", "animethemes.song.artists"].join(",");
        const res = await fetch(`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=MyAnimeList&filter[external_id]=${anisongs_temp.id}&include=${include}`);
        return res.json();
      },
    };
    class VideoElement {
      constructor(parent, url) {
        this.url = url;
        this.parent = parent;
        this.make();
      }
      toggle() {
        if (this.el.parentNode) {
          this.el.remove();
        } else {
          this.parent.append(this.el);
        }
      }
      make() {
        const box = document.createElement("div"),
          vid = document.createElement("video");
        vid.src = this.url;
        vid.controls = true;
        vid.preload = true;
        vid.volume = 0.5;
        box.append(vid);
        this.el = box;
      }
    }
    class Videos {
      constructor(id) {
        this.id = id;
      }
      async get() {
        const { anime } = await API.getVideos(this.id);
        if (anime.length === 0) {
          return {
            OP: [],
            ED: [],
          };
        }
        //Sort and Remove Dubbed OP-ED
        let d = anime ? anime[0].animethemes.sort((a, b) => a.sequence - b.sequence) : null;
        let t = [];
        for (let x = 0; x < d.length; x++) {
          let reg = /Dubbed/;
          if (d[x].group && !d[x].group.match(reg)) {
            t.push(d[x]);
          } else if (!d[x].group) {
            t.push(d[x]);
          }
        }
        return Videos.groupTypes(t);
      }
      static groupTypes(songs) {
        const groupBy = (xs, key) => {
          return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        return groupBy(songs, "type");
      }
      static merge(entries, videos) {
        const cleanTitle = (song) => {
          return song.replace(/^\d{1,2}:/, "");
        };
        const findUrl = (n) => {
          let url;
          if (videos[n]) {
            if (videos[n].animethemeentries[0] && videos[n].animethemeentries[0].videos[0]) {
              url = videos[n].animethemeentries[0].videos[0].link;
            }
            if (url) url = url.replace(/staging\./, "");
          }
          return url;
        };
        if (videos) {
          return entries.map((e, i) => {
            let u = null;
            for (let x = 0; x < videos.length; x++) {
              let vid = videos[x];
              let link = vid.animethemeentries[0].videos[0] && vid.animethemeentries[0].videos[0].link ? vid.animethemeentries[0].videos[0].link : null;
              let m = 0;
              let title = DOMPurify.sanitize(cleanTitle(e));
              title = title
                .replace(/(\w\d+\: |)/gm, "")
                .replace(/\((?!.*(Ver\.|ver\.))(.*?)\)+?/g, "")
                .replace(/(.*)( by )(.*)/g, "$1")
                .replace(/(.*)( feat. | ft. )(.*)/g, "$1")
                .replace(/(Produced|\WProduced)/g, "")
                .replace(/["']/g, "")
                .replace(/<.*>/g, "")
                .replace(/[^\w\s\(\)\[\]\,\-\:]/g, "")
                .trim();
              title = DOMPurify.sanitize(title);
              let title2 = vid.song.title ? vid.song.title : null;
              title2 = DOMPurify.sanitize(title2);
              title2 = title2
                .replace(/\((?!.*(Ver\.|ver\.))(.*?)\)+?/g, "")
                .replace(/(.*)( by )(.*)/g, "$1")
                .replace(/(.*)( feat. | ft. )(.*)/g, "$1")
                .replace(/(Produced|\WProduced)/g, "")
                .replace(/["']/g, "")
                .replace(/<.*>/g, "")
                .replace(/[^\w\s\(\)\[\]\,\-\:]/g, "")
                .trim();
              title2 = DOMPurify.sanitize(title2);
              let ep = cleanTitle(e)
                .replace(/(.*).((eps|ep) (\w.*\ |)(.*)\))/gm, "$5")
                .replace(/\s/g, "");
              let epdata = vid.animethemeentries[0].episodes;
              let ep2 = epdata && (epdata.constructor !== Array || epdata.length === 1) ? (epdata.constructor !== Array ? epdata.replace(/\s/g, "") : epdata) : null;
              let eps = [];
              if (vid.animethemeentries.length > 1) {
                for (let y = 0; y < vid.animethemeentries.length; y++) {
                  eps.push(vid.animethemeentries[y].episodes);
                }
                eps = eps.join("-").split("-").map(Number);
                eps = eps[0] + "-" + eps[eps.length - 1];
              }
              let artistmatch;
              if (vid.type === "OP" && title) {
                op1 = title;
              }
              if (vid.type === "ED" && title) {
                ed1 = title;
              }
              if (m === 0 && vid.sequence) {
                if (i + 1 === vid.sequence && stringSimilarity(title, vid.song.title) > 0.8) {
                  u = link;
                  m = 1;
                }
                if (i === vid.sequence || i + 1 === vid.sequence || i + 2 === vid.sequence) {
                  if (stringSimilarity(title, title2) > 0.8) {
                    u = link;
                    m = 1;
                  }
                }
              }
              if (m === 0 && vid.song.artists !== null && vid.song.artists[0] && vid.song.title !== null) {
                let artist = cleanTitle(e)
                  .replace(/\(([^CV: ].*?)\)+?/g, "")
                  .replace(/(.*)( by )(.*)/g, "$3")
                  .replace(/( feat\. | feat\.| ft\. )/g, ", ")
                  .replace(/["']/g, "")
                  .replace(/\s\[.*\]/gm, "")
                  .trim();
                let artistv2 = artist.replace(/(\w.*)( x )(\w.*)/g, "$1");
                let artist2 = cleanTitle(e)
                  .replace(/(.*)by \w.*\(([^eps ].*?)\)(.*(eps |ep ).*)/g, "$2")
                  .replace(/( feat\. | feat\.| ft\. )/g, ", ")
                  .replace(/["']/g, "")
                  .replace(/\s\[.*\]/gm, "")
                  .trim();
                let artists = [];
                let matches = [];
                let match;
                for (let y = 0; y < vid.song.artists.length; y++) {
                  artists.push(
                    vid.song.artists[y].name
                      .replace(/\((.*?)\).?/g, "")
                      .replace(/(.*)( by )(.*)/g, "$3")
                      .replace(/( feat\. | feat\.| ft\. )/g, ", ")
                      .replace(/["']/g, "")
                      .replace(/\s\[.*\]/gm, "")
                      .trim()
                  );
                }
                artists = artists.join(", ");
                const cv = /\(CV: ([^\)]+)\)/g;
                if (artist.match(cv)) {
                  while ((match = cv.exec(artist)) !== null) {
                    matches.push(match[1]);
                  }
                  matches = matches.join(", ");
                }
                if (
                  m === 0 &&
                  (stringSimilarity(artist, artists) > 0.82 ||
                    stringSimilarity(artist2, artists) > 0.9 ||
                    stringSimilarity(artistv2, artists) > 0.9 ||
                    (matches.length > 0 && stringSimilarity(artists, matches) > 0.82))
                ) {
                  artistmatch = 1;
                  if (stringSimilarity(title, vid.song.title) > 0.8 || (i === vid.sequence && stringSimilarity(title, title2) > 0.8) || (!vid.sequence && stringSimilarity(title, title2) > 0.8)) {
                    u = link;
                    m = 1;
                  }
                }
              }
              if (m === 0 && !vid.song.artists.length && vid.song.title !== null) {
                if (stringSimilarity(title, vid.song.title) > 0.8 || (i === vid.sequence && stringSimilarity(title, title2) > 0.8) || (!vid.sequence && stringSimilarity(title, title2) > 0.8)) {
                  u = link;
                  m = 1;
                }
              }
              if (m === 0 && (ep === ep2 || ep === eps)) {
                u = link;
                m = 1;
              }
              if (m === 0 && ((vid.sequence && artistmatch && vid.slug && videos.length < 10) || (!vid.sequence && vid.slug && videos.length < 10))) {
                if (anisongdata && anisongdata.openings.length > 0 && vid.type === "OP") {
                  let n = vid.slug.replace(/(OP)(.*\d)(.*)/g, "$2");
                  if (n === (i + 1).toString() && (!vid.sequence || (artistmatch && i + 1 === vid.sequence))) {
                    u = link;
                    m = 1;
                  }
                }
                if (anisongdata && anisongdata.endings.length > 0 && vid.type === "ED" && ed1 !== undefined && op1 !== undefined && ed1 !== op1) {
                  let n = vid.slug.replace(/(ED)(.*\d)(.*)/g, "$2");
                  if ((!vid.sequence && n === (i + 1).toString()) || (artistmatch && n === (i + 1).toString() && i + 1 === vid.sequence)) {
                    u = link;
                    m = 1;
                  }
                }
              }
              if (m === 0 && artistmatch && videos.length === 1) {
                u = link;
                m = 1;
              }
            }
            return {
              title: cleanTitle(e),
              url: u,
            };
          });
        }
        return entries.map((e, i) => {
          return {
            title: cleanTitle(e),
          };
        });
      }
    }

    function insert(songs, parent) {
      if (!songs || !songs.length) {
        let song = create("div", { class: "song" }, "");
        parent.append(song);
      } else {
        songs.forEach((song, i) => {
          song.title = song.title.replace(/(".*")/, "<b>" + "$1" + "</b>");
          const txt = `${i + 1}. ${song.title || song}`;
          const node = create("div", { class: "theme-songs js-theme-songs" }, txt);
          parent.appendChild(node);
          if (song.url) {
            let play = create("div", { class: "oped-preview-button oped-preview-button-gray" });
            node.prepend(play);
            const vid = new VideoElement(node, song.url);
            play.addEventListener("click", () => vid.toggle());
            node.classList.add("has-video");
          }
        });
      }
    }

    function createTargetDiv(text, target, pos) {
      let el = document.createElement("div");
      el.appendChild(document.createElement("h2"));
      el.children[0].innerText = text;
      el.classList = options.class;
      target.insertBefore(el, target.children[pos]);
      return el;
    }

    function cleaner(target) {
      if (!target) return;
      let el = target.querySelectorAll(`.${options.class}`);
      el.forEach((e) => target.removeChild(e));
      $(".rightside.js-scrollfix-bottom-rel div.di-t > .di-tc.va-t:has(h2)").remove();
      set(1, ".rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)", {
        sa: {
          0: "display: grid!important;grid-template-columns: 1fr 1fr;grid-column-gap: 10px;",
        },
      });
      $(".rightside.js-scrollfix-bottom-rel .di-b.ar").remove();
    }

    function placeData(data) {
      let nt = create("div", { class: "theme-songs js-theme-songs" });
      let nt2 = nt.cloneNode(true);
      cleaner(anisongs_temp.target);
      let op = createTargetDiv("Openings", anisongs_temp.target, 0);
      if (data.opening_themes.length === 1) {
        op.children[0].innerText = "Openings";
      }
      if (data.opening_themes.length === 0) {
        op.append(nt);
        nt.innerHTML =
          "No opening themes have been added to this title. Help improve our database by adding an opening theme " +
          "<a class='embed-link' href='https://myanimelist.net/dbchanges.php?aid=" +
          anisongs_temp.id +
          "&t=theme'>" +
          "here" +
          "</a>";
      }
      let ed = createTargetDiv("Endings", anisongs_temp.target, 1);
      if (data.ending_themes.length === 1) {
        ed.children[0].innerText = "Endings";
      }
      if (data.ending_themes.length === 0) {
        ed.append(nt2);
        nt2.innerHTML =
          "No ending themes have been added to this title. Help improve our database by adding an ending theme " +
          "<a class='embed-link' href='https://myanimelist.net/dbchanges.php?aid=" +
          anisongs_temp.id +
          "&t=theme'>" +
          "here" +
          "</a>";
      }
      insert(data.opening_themes, op);
      insert(data.ending_themes, ed);

      async function addAccordion(div) {
        const aniSongsDiv = document.querySelector(div);
        const themeSongs = aniSongsDiv.querySelectorAll(".theme-songs");
        if (themeSongs.length > 4) {
          const accordionButton = create("a", { class: "anisong-accordion-button", style: { display: "none" } });
          const extraSongs = create("div", { class: "anisong-extra-songs", style: { display: "none" } });
          accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
          for (let i = 4; i < themeSongs.length; i++) {
            extraSongs.appendChild(themeSongs[i]);
          }
          aniSongsDiv.append(extraSongs, accordionButton);
          accordionButton.style.display = "block";
          accordionButton.addEventListener("click", function () {
            if (extraSongs.style.display === "none") {
              extraSongs.style.display = "block";
              accordionButton.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
            } else {
              extraSongs.style.display = "none";
              accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
            }
          });
        }
        for (let x = 0; x < themeSongs.length; x++) {
          const favorite = create("div", { class: "fav fa-star" }, "");
          favorite.onclick = async () => {
            if (!$(favorite).parent().find("video").length) {
              $(favorite).parent().find(".oped-preview-button").click();
            }
            const animeTitle = $(".title-name").text()
              ? $(".title-name").text()
              : document.title
                  .replace(/(.*)(\|.*)/, "$1")
                  .replace(/(.*)(\(.*\).*)/, "$1")
                  .trim();
            const title = $(favorite).parent().text().substring(2);
            const type = $(favorite).parent().prev("h2").text();
            const src = $(favorite).parent().find("video").attr("src");
            let img;
            async function imgLoad() {
              img = document.querySelector("div:nth-child(1) > a > img");
              set(0, img, { sa: { 0: "position: fixed;opacity:0!important;" } });
              if (img && img.src) {
                set(0, img, { sa: { 0: "position: relative;opacity:1!important;" } });
              } else {
                await delay(250);
                await imgLoad();
              }
            }
            await imgLoad();
            const favArray = [
              {
                animeTitle: animeTitle,
                animeImage: img.src,
                animeUrl: anisongs_temp.id,
                songTitle: title.replace(/(\(eps \d.*\))/, ""),
                songSource: src,
                themeType: type === "Openings" ? "OP" : "ED",
              },
            ];
            const compressedBase64 = LZString.compressToBase64(JSON.stringify(favArray));
            const base64url = compressedBase64.replace(/\//g, "_");
            editAboutPopup(`favSongEntry/${base64url}`, "favSongEntry");
            $(favorite).parent().find(".oped-preview-button").click();
          };
          if (themeSongs[x].className === "theme-songs js-theme-songs has-video" && headerUserName !== "") {
            themeSongs[x].append(favorite);
          }
        }
      }
      addAccordion("div.di-t > div.anisongs:nth-child(1)");
      addAccordion("div.di-t > div.anisongs:nth-child(2)");
      let aniSongsMainDiv = document.querySelector("div.di-t:has(.anisongs)");
      if (aniSongsMainDiv) {
        let lastCheck = nativeTimeElement(Math.floor(data.time / 1000));
        let AniSongsReCheck = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
        let AniSongsFooter = create(
          "div",
          { class: "anisongs-footer", style: { textAlign: "right", marginRight: "5px" } },
          "Themes provided from " + '<a href="https://animethemes.moe/">AnimeThemes.moe</a><br>' + "Last Update: " + lastCheck + " "
        );
        AniSongsFooter.append(AniSongsReCheck);
        AniSongsReCheck.onclick = () => {
          songCache.removeItem(anisongs_temp.id);
          window.location.reload();
        };
        aniSongsMainDiv.append(AniSongsFooter);
      }
    }
    async function launch(currentid) {
      // get from cache and check TTL
      const cache = (await songCache.getItem(currentid)) || {
        time: 0,
      };
      if (cache.time + options.cacheTTL < Date.now()) {
        let mal_id = currentid;
        let status;
        let _videos;
        const apiUrl = `https://api.jikan.moe/v4/anime/${currentid}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            status = data.data.status;
          });
        if (mal_id && ["Finished Airing", "Currently Airing"].includes(status)) {
          const { data } = await API.getSongs(mal_id);
          let { openings: opening_themes, endings: ending_themes } = data;
          // add songs to cache if they're not empty and query videos
          if (opening_themes.length || ending_themes.length) {
            if (["Finished Airing", "Currently Airing"].includes(status)) {
              try {
                anisongdata = data;
                _videos = await new Videos(currentid).get();
                opening_themes = Videos.merge(opening_themes, _videos.OP);
                ending_themes = Videos.merge(ending_themes, _videos.ED);
              } catch (e) {
                console.log("Anisongs", e);
              }
            }
            if (_videos) {
              await songCache.setItem(currentid, { opening_themes, ending_themes, time: Date.now() });
            }
          }
          // place the data onto site
          if (await songCache.getItem(currentid)) {
            placeData({
              opening_themes,
              ending_themes,
            });
          }
          return "Downloaded songs";
        } else {
          return "No malid";
        }
      } else {
        // place the data onto site
        placeData(cache);
        return "Used cache";
      }
    }
  }
}
