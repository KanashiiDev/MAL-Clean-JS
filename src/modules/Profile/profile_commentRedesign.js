async function newProfileComments(profile) {
  let mainCont = profile ? $("#lastcomment") : $("#content");
  if (profile) {
    mainCont.css("max-width", "818px");
  } else {
    $('#content div:not(.borderClass):contains("Pages ")').hide();
  }
  let currPage = 1;
  let oldprofileLinkArray = [];
  let addedComCount = 0;
  const loading = create("div", { class: "user-history-loading actloading" }, translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>');

  function parseProfileHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const section = doc.querySelector("#message")?.outerHTML;
    const match = /uid:(\d+)/.exec(section);
    return match ? match[1] : null;
  }

  async function getProfileId(profileUrl) {
    try {
      const response = await fetch(profileUrl);
      const html = await response.text();
      return parseProfileHTML(html);
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  async function getNextComments(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc;
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  async function fetchAndUpdateComments(element, url, newCommentsContainer, append = false) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const comments = Array.from(doc.querySelectorAll("div[id^=comBox] > table > tbody > tr")).reverse();
      let sender = $(doc).find("div[id^=com] > .dark_text a").last()[0];
      let receiver = doc.querySelector("#content > div.borderClass.com-box-header a:last-child");
      receiver.innerText = "@" + receiver.innerText.replace("'s Profile", "");
      let isNameMatch = receiver.innerText !== "@" + sender.innerText ? 0 : 1;
      comments.forEach((comment, index) => {
        $(comment).find(".picSurround").addClass("image").find("img").css("height", "55px");
        if (!append && index === 0) {
          if (!isNameMatch) {
            $(comment).find(".spaceit").prepend(receiver, "<br>");
          }
          if (profile) {
            $(comment).find("div[id^=com]").first().css({ display: "inline-block", width: "calc(100% - 100px)" });
            $(comment).find(".picSurround").css({ display: "inline-block" });
          }
          element.innerHTML = comment.innerHTML;
        } else {
          newCommentsContainer.appendChild(comment.cloneNode(true));
        }
      });

      // Create a “Load More” button if there is a “Prev” link
      const prevLink = $(doc).find('a:contains("Prev")').attr("href");
      if (prevLink) {
        await createLoadMoreButton(prevLink, newCommentsContainer, element, "child");
      }
      return comments.length;
    } catch (error) {
      console.error(`Could not retrieve comments: ${error}`);
    }
  }

  // Create a button to hide/show comments
  async function createToggleButton(newCommentsContainer, commentsCount) {
    if (commentsCount > 1) {
      const commCount = commentsCount - 1 === 29 ? "29+" : commentsCount - 1;
      const buttonDiv = create("div", { class: "newCommentsCommentButton" });
      const buttonLabel = create("span", { class: "commentButtonLabel" }, commCount);
      const button = create("a", { class: "commentButton fa fa-comment", style: { paddingRight: "5px", cursor: "pointer" } });
      buttonDiv.append(button, buttonLabel);
      button.addEventListener("click", () => {
        newCommentsContainer.style.display = newCommentsContainer.style.display === "none" ? "inline-block" : "none";
      });
      return buttonDiv;
    }
  }

  // Create load more button
  function createLoadMoreButton(url, newCommentsContainer, element, className) {
    let loadMoreButton = newCommentsContainer.querySelector(".newCommentsLoadMoreButton." + className);
    if (loadMoreButton) return;
    loadMoreButton = create("a", { class: "newCommentsLoadMoreButton " + className }, "Load More");
    loadMoreButton.addEventListener("click", async () => {
      mainCont.append(loading);
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Loading...";
      if (element) {
        await fetchAndUpdateComments(element, url, newCommentsContainer, true);
      } else {
        const doc = await getNextComments(url);
        if (doc) comToCom(url, doc);
      }
      loadMoreButton.disabled = false;
      loadMoreButton.remove();
    });
    newCommentsContainer.appendChild(loadMoreButton);
    if (profile) mainCont.append($('a.btn-form-submit:contains("All Comments")').parent());
  }

  // Main
  async function comToCom(url, doc) {
    url = url.replace(/&*show=\d*/g, "");
    const idIndex = url.indexOf("id=");
    let mainDelay = 500;
    if (idIndex === -1) return;
    const baseUrl = "/comtocom.php?id1=" + url.substring(idIndex + 3) + "&id2=";
    let isProfilePage = document.location.href.includes("profile");
    $("div[id^=comBox]").not(".newCommentsContainerMain").css("display", "none");
    if (doc) {
      let els = doc.querySelectorAll("div[id^=comBox]");
      for (const el of els) {
        el.style.display = "none";
        mainCont.append(el, profile ? $('a.btn-form-submit:contains("All Comments")').parent() : $('div[style="text-align: right;"]'));
      }
    }
    let elements = isProfilePage ? document.querySelectorAll("div[id^=comBox]") : document.querySelectorAll("div[id^=comBox] > table > tbody > tr");
    for (const el of elements) {
      if (!el.getAttribute("comActive")) {
        mainDelay = 500;
        let profileLink = isProfilePage ? el.querySelector(".image")?.href : el.querySelector(".picSurround > a")?.href;
        if (doc && profile) {
          profileLink = el.querySelector(".picSurround > a")?.href;
        }
        const elParent = profile ? $(el) : $(el).parent().parent().parent();
        elParent.css("display", "none");
        if (!profileLink) continue;
        if (oldprofileLinkArray.indexOf(profileLink) === -1) {
          oldprofileLinkArray.push(profileLink);
          const profileId = await getProfileId(profileLink);
          if (!profileId) continue;
          const commentsUrl = `${baseUrl}${profileId}&last=1`;
          const linkButton = create("a", { class: "newCommentsLinkButton fa fa-link", href: commentsUrl, target: "_blank" });
          const newCommentsContainer = create("div", { class: "newCommentsContainer", style: { display: "none", width: "100%" } });
          const commentsCount = await fetchAndUpdateComments(el, commentsUrl, newCommentsContainer);
          const toggleButton = await createToggleButton(newCommentsContainer, commentsCount);
          if (profile) elParent.addClass("comment-profile");
          if (toggleButton) {
            elParent.prepend(linkButton), elParent.append(toggleButton, newCommentsContainer);
          }
          mainCont.append(loading);
          elParent.find("div[id^=com]").first().css("min-height", "55px");
          elParent.addClass("comment newCommentsContainerMain");
          addedComCount++;
        } else {
          mainCont.children().remove("br");
          elParent.remove();
          mainDelay = 50;
        }
        el.setAttribute("comActive", "1");
        elParent.css("display", "");
        await delay(mainDelay);
      }
    }
    loading.remove();
    currPage += 1;
    let nextPage = $(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    if (doc) {
      nextPage = $(doc).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    } else if (currPage === 2 && profile) {
      let profileCount = await getNextComments(url);
      nextPage = $(profileCount).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    }
    if (nextPage) {
      await createLoadMoreButton(nextPage, mainCont[0], null, "parent");
    }
    if ($(".newCommentsLoadMoreButton.parent")[0]) {
      if (addedComCount < 6) {
        $(".newCommentsLoadMoreButton.parent")[0].style.display = "none";
        $(".newCommentsLoadMoreButton.parent")[0].click();
      } else {
        $(".newCommentsLoadMoreButton.parent")[0].style.display = "block";
        loading.remove();
        addedComCount = 0;
      }
    }
  }
  let comcomUrl = profile ? $('a:contains("All Comments")')?.attr("href") : location.href;
  let checkComBox = document.querySelectorAll("div[id^=comBox]");
  if (comcomUrl && checkComBox.length > 0) comToCom(comcomUrl);
}
