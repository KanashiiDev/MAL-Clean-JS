const pageIsForum = /\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href);
const pageIsForumTopic = /\/forum\/.?topicid([\w-]+)?\/?/.test(location.href);
const pageIsForumBoard = /\/forum\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href);
const pageIsAniManga =
  /\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) &&
  !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current) &&
  !/\/(ownlist|season|adapted|recommendations)/.test(current) &&
  !document.querySelector("#content > .error404");
const pageIsAniMangaPHP = /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(location.href);
const pageIsProfile = /\/(profile)\/.?([\w]+)?\/?/.test(current);
const pageIsCharacter = /\/(character)\/.?([\w-]+)?\/?/.test(current);
const pageIsClubs = /\/(clubs)/.test(current);
const pageIsPeople = /\/(people)\/.?([\w-]+)?\/?/.test(current);
const pageIsNews = /\/news\/\d/.test(location.href);
const pageIsCompany = /(anime|manga)\/(producer)\/.?([\w-]+)?\/?/.test(current);
let blockU = create("i", { class: "fa fa-ban mt4 ml12 blockUserIcon" });
blockU.onclick = () => {
  blockUser(username);
};

let userModules = [];
let sortedModules, activeModules;

let exportModule = function ({ name, description, category, author, urlMatch, code, dropdown, css, id, defaultValue = true, priority = 0 }) {
  if (svar[id] === undefined) {
    svar[id] = defaultValue;
    svar.save();
  }
  userModules.push({
    name,
    id,
    description,
    category,
    author,
    urlMatch,
    code,
    dropdown,
    css,
    priority,
  });
};

// User Modules Context
const context = {
  url: window.location.href,
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  utils: {
    log: console.log,
    injectCSS: (css) => {
      try {
        const style = document.createElement("style");
        style.textContent = minifyCSS(css);
        document.head.append(style);
        return true;
      } catch (e) {
        console.error("CSS injection failed:", e);
        return false;
      }
    },
  },
  debug: false,
};

//Run User Modules
async function runModules(ctx) {
  sortedModules = [...userModules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  if (ctx.debug) ctx.utils.log(`Checking ${sortedModules.length} modules...`);
  activeModules = sortedModules.filter((mod) => {
    try {
      return typeof mod.urlMatch === "function" ? mod.urlMatch() && svar[mod.id] : false;
    } catch (e) {
      console.error(`urlMatch error in module ${mod.name}:`, e);
      return false;
    }
  });

  for (const mod of activeModules) {
    try {
      if (ctx.debug) ctx.utils.log(`[P${mod.priority || 0}] [${mod.category}] ${mod.name}: Running...`);
      if (mod.css) {
        const cssInjected = ctx.utils.injectCSS(mod.css);
        if (cssInjected && ctx.debug) {
          ctx.utils.log(`CSS injected for ${mod.name}`);
        }
      }

      await mod.code();
    } catch (e) {
      console.error(`Error in module ${mod.name}:`, e);
    }
  }
  svar.save();
}

//Run User Modules Dropdown
async function runModulesDropdown() {
  for (const mod of sortedModules) {
    try {
      await mod.dropdown();
    } catch (e) {
      console.error(`Error in module ${mod.name}:`, e);
    }
  }
}

let moduleTimer;
moduleTimer = setTimeout(async () => {
  await runModules(context);
  if (userModules.length > 1) {
    clearTimeout(moduleTimer);
  }
}, 1000);

if (pageIsAniManga) {
  await colorFromCover();
  pageFixes("anime-manga");
  getAiringTime();
  await loadAniSong();
  if (svar.moreFavs) {
    addMoreFavs("anime_manga");
  }
  if (svar.animeRelation) {
    getRelations();
  }
  if (svar.customCover) {
    getCustomCover("cover");
    loadCustomCover(1, "cover");
  }
  if (svar.animeTag) {
    getTags();
  }
  if (svar.animeBanner) {
    getBannerImage();
  }
}

if (pageIsCharacter) {
  await colorFromCover();
  pageFixes("character");
  if (svar.moreFavs) {
    addMoreFavs("character");
  }
  if (svar.customCharacterCover) {
    getCustomCover("character");
    loadCustomCover(1, "character");
  }
}
if (pageIsPeople) {
  if (svar.moreFavs) {
    addMoreFavs("people");
  }
}
if (pageIsCompany) {
  if (svar.moreFavs) {
    addMoreFavs("company");
  }
}

if (pageIsProfile) {
  addLoading("add", translate("$loadingProfile", username), 1, 1);
  if (svar.profileNewComments && isMainProfilePage) {
    newProfileComments(1);
  }
  //Add Block User Button
  if (isMainProfilePage && userNotHeaderUser && headerUserName !== "" && headerUserName !== "MALnewbie") {
    $("a.header-right").after(blockU);
  }
}

if (svar.newComments && location.href.includes("https://myanimelist.net/comments.php")) {
  newProfileComments();
}
