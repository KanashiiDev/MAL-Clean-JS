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
        const style = create("style", { id: " userModuleCSS" }, minifyCSS(css));
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
