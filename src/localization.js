// localization.js
class LocalizationManager {
  constructor() {
      this.languages = __LANGUAGE_JSON__;
      this._initializeRawKeys();
      this._validateCurrentLanguage();
  }

  _initializeRawKeys() {
      const englishKeys = this.languages["English"]?.keys || {};
      Object.keys(englishKeys).forEach(key => {
          this.languages["$raw_keys"].keys[key] = key;
      });
  }

  _validateCurrentLanguage() {
      if (!this.currentLanguage || !this.languages[this.currentLanguage]) {
          this._fallbackToEnglish();
      }
  }

  _fallbackToEnglish() {
      const candidates = Object.keys(this.languages)
          .filter(key => key.includes(this.currentLanguage) && key !== "$raw_keys");
      
      const warningMsg = candidates.length
          ? `No "${this.currentLanguage}" language found. Falling back to English.\nPossible candidates: ${candidates.join(", ")}`
          : `No "${this.currentLanguage}" language found. Falling back to English.`;
      
      console.warn(warningMsg);
      this.currentLanguage = "English";
      this._saveSettings();
  }

  _saveSettings() {
      if (typeof svar?.save === 'function') {
          svar.save();
      }
  }

  translate(key, substitutions, fallback) {
      if (!key?.startsWith("$")) return key;
      
      let translation = this._findTranslation(key);
      if (!translation) {
          translation = fallback || key;
          if (!key.startsWith("$role_")) {
              console.warn(`[${this.scriptType}] Missing translation for key: ${key}`);
          }
      }
      
      return this._applySubstitutions(translation, substitutions);
  }

  _findTranslation(key) {
      if (this.languages[this.currentLanguage]?.keys[key]) {
          return this.languages[this.currentLanguage].keys[key];
      }
      
      const fallbacks = this.languages[this.currentLanguage]?.info?.fallback || [];
      for (const fallbackLang of fallbacks) {
          if (this.languages[fallbackLang]?.keys[key]) {
              return this.languages[fallbackLang].keys[key];
          }
      }
      
      return this.languages["English"]?.keys[key];
  }

  _applySubstitutions(text, substitutions) {
      if (!substitutions || !text) return text;
      
      if (Array.isArray(substitutions)) {
          return substitutions.reduce((result, sub, index) => 
              result.replace(new RegExp(`\\{${index}\\}`, 'g'), sub), 
              text
          );
      }
      return text.replace(/\{0\}/g, substitutions);
  }

  set currentLanguage(lang) {
      if (this.languages[lang] || lang === "$raw_keys") {
          this._currentLanguage = lang;
      } else {
          this._fallbackToEnglish();
      }
  }

  get currentLanguage() {
      return this._currentLanguage || "English";
  }

  set scriptType(type) {
      this._scriptType = type;
  }

  get scriptType() {
      return this._scriptType || "unknown";
  }

  get availableLanguages() {
    const baseLang = "English";
    const baseKeys = Object.keys(this.languages[baseLang]?.keys || {});
    const total = baseKeys.length;
  
    return Object.keys(this.languages)
      .map(lang => {
        const targetKeys = Object.keys(this.languages[lang]?.keys || {});
        const translated = baseKeys.filter(key => key in this.languages[lang].keys).length;
        const percentage = total > 0 ? Math.floor((translated / total) * 100) : 0;
  
        return {
          lang,
          keyCount: lang !== baseLang ? ` (${targetKeys.length} Keys)` : '',
          keyPercent: lang !== baseLang && percentage !== 100 ? ` (${percentage}%)` : '',
          authors: this.languages[lang]?.info?.authors?.length > 0 && this.languages[lang].info.authors[0] !== "KanashiiDev"
            ? ` [${this.languages[lang].info.authors.join(", ")}]`
            : "",
          missingKeys: baseKeys.filter(key => !(key in this.languages[lang].keys))
        };
      });
  }
}

// Global instance creation
window.LocalizationManager = LocalizationManager;
window.localization = new LocalizationManager();

// Initialize with settings
if (typeof svar !== 'undefined') {
  localization.currentLanguage = svar.currentLanguage;
  localization.scriptType = svar.scriptType;
}

// Global functions
window.translate = function(key, subs, fallback) {
  return localization.translate(key, subs, fallback);
};

window.setLanguage = function(lang) {
  localization.currentLanguage = lang;
};

window.getAvailableLanguages = function() {
  return localization.availableLanguages;
};

// Language selector initialization
function initLanguageSelector() {
  const languageSelect = document.createElement('select');
  languageSelect.id = 'language-selector';
  languageSelect.className = 'language-switcher';

  getAvailableLanguages().forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.lang;
      option.textContent = lang.lang + lang.keyPercent + lang.authors;
      if (lang.missingKeys.length) {
        console.warn(`[${lang.lang}] Missing Keys: ${lang.missingKeys}`);
      }
      languageSelect.appendChild(option);
  });

  languageSelect.value = localization.currentLanguage;

  languageSelect.addEventListener("change", (e) => {
      setLanguage(e.target.value);
      if (typeof svar !== 'undefined') {
          svar.currentLanguage = e.target.value;
          svar.save();
      }
      location.reload(); // Reload to apply language changes
  });

  return languageSelect;
}