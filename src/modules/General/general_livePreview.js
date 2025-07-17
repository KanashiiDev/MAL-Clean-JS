let previewStatus = 0; // 0 = initialized, 1 = DOM has been created, 2 = fetched

function createPreviewElements(parent) {
  const container = create("div", {
    class: "preview-result-container",
    id: "preview-result-container",
  });

  const header = create("div", {
    class: "normal_header",
    id: "preview-result-header",
    style: "display: flex; align-items: center; justify-content: space-between;",
  });

  const headerTitle = create("span", {}, "Preview");

  const charCount = create("span", {
    id: "live-preview-charcount",
    style: "font-size: 12px;color: var(--color-main-text-light);margin-left: auto;font-weight: 400;",
  });

  header.append(headerTitle, charCount);

  const content = create("div", {
    class: "mal-tab-item preview active",
    id: "preview-result",
  });

  container.append(header, content);
  parent.append(container);
}

async function fetchPreviewHTML(text, csrfToken) {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("csrf_token", csrfToken);

  const response = await fetch("https://myanimelist.net/bbcode/preview", {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await response.json();
  return data.html;
}

async function showPreview(selector, parentSelector) {
  const textarea = document.querySelector(selector);
  if (!textarea) return;

  const text = textarea.value.trim();
  if (text.length === 0 || previewStatus < 1) return;

  const parent = await waitForElement(parentSelector);
  if (!parent) return;

  //First execution, create the preview box.
  if (previewStatus === 0) {
    createPreviewElements(parent);
    previewStatus = 1;
  }

  if (previewStatus >= 1) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]')?.content;
    if (!csrfToken) return;

    try {
      const html = await fetchPreviewHTML(text, csrfToken);
      const previewDiv = document.getElementById("preview-result");
      if (previewDiv) {
        previewDiv.innerHTML = html;
        previewStatus = 2;
      }
    } catch (err) {
      console.error("Preview fetch error:", err);
    } finally {
      document.getElementById("live-preview-spinner")?.remove();
    }
  }
}

// Add Live Preview
if (svar.editorLivePreview) {
  $(document).ready(function () {
    addLivePreview();
    if (pageIsForum) {
      const forumBtn = document.querySelectorAll("button[rel*='topic']");
      forumBtn.forEach((element) => {
        element.addEventListener("click", async function () {
          addLivePreview();
        });
      });
    }
  });
}

function addLivePreview() {
  waitForElement(".sceditor-container textarea").then((textarea) => {
    if (!textarea) return;

    //When an external value is given, the input should be triggered.
    const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
    if (descriptor?.configurable) {
      Object.defineProperty(textarea, "value", {
        configurable: true,
        enumerable: true,
        get() {
          return descriptor.get.call(this);
        },
        set(val) {
          descriptor.set.call(this, val);
          this.dispatchEvent(new Event("input", { bubbles: true }));
        },
      });
    }

    //Text Character Count
    function stripVisibleTextFromBBCode(bbcodeText) {
      const hiddenTags = ["img", "yt", "video", "code", "spoiler"];
      hiddenTags.forEach((tag) => {
        const pattern = new RegExp(`\\[${tag}.*?\\](.*?)\\[\\/${tag}\\]`, "gis");
        bbcodeText = bbcodeText.replace(pattern, "");
      });
      bbcodeText = bbcodeText.replace(/\[.*?\]/g, "");
      return bbcodeText.trim();
    }

    textarea.addEventListener("input", (e) => {
      const value = e.target.value.trim();
      const header = document.getElementById("preview-result-header");
      const charCount = document.getElementById("live-preview-charcount");
      const container = document.getElementById("preview-result-container");

      // Update the character count
      if (charCount) {
        const fullLength = textarea.value.length;
        const visibleLength = stripVisibleTextFromBBCode(textarea.value).trim().length;
        const label = visibleLength === 1 ? "character" : "characters";
        const labelFull = fullLength === 1 ? "character" : "characters";
        charCount.textContent = `(${fullLength}  ${labelFull})`;
        charCount.title = `Text: ${visibleLength} ${label} / Full: ${fullLength} ${labelFull}`;
      }

      //Should the preview be deleted?
      if (value.length === 0 && previewStatus > 0) {
        container?.remove();
        previewStatus = 0;
        return;
      }

      // Loading spinner
      if (header && !document.getElementById("live-preview-spinner")) {
        const spinner = create("i", {
          class: "fa fa-circle-o-notch fa-spin malCleanSpinner",
          id: "live-preview-spinner",
        });
        header.appendChild(spinner);
      }

      const parentSelector = ".sceditor-outer";

      if (previewStatus === 0) {
        // Create the box
        waitForElement(parentSelector).then((parent) => {
          if (parent) {
            createPreviewElements(parent);
            previewStatus = 1;
          }
        });
      }

      // Wait and update the preview.
      clearTimeout(textarea._previewTimeout);
      textarea._previewTimeout = setTimeout(() => {
        showPreview(".sceditor-container textarea", parentSelector);
      }, 2000);
    });
  });
}
