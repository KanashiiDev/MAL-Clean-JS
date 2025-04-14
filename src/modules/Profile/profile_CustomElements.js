async function createCustomDiv(appLoc, header, content, editData) {
  $("#customAddContainer").remove();
  if (!document.querySelector("#customAddContainer")) {
    const cont = create("div", { id: "customAddContainer" });
    let appendLoc = appLoc ? appLoc : document.querySelector("#user-button-div");
    const isRight = appLoc === "right" || (appLoc && appLoc.classList[1]) ? 1 : 0;
    if (isRight) {
      appendLoc = $(".user-comments").before(cont);
    } else {
      appendLoc.insertAdjacentElement("afterend", cont);
    }
    const newDiv = create("div", { id: "customAddContainerInside" });
    const btnsDiv = create("div", { id: "customAddContainerInsideButtons", style: { display: "block", textAlignLast: "center" } });
    if (isRight) cont.classList.add("right");
    const closeButton = create("button", { class: "mainbtns btn-active-def", id: "closeButton", style: { width: "45px", float: "right", marginTop: "-5px" } }, translate("$close"));
    closeButton.addEventListener("click", function () {
      cont.remove();
    });
    newDiv.appendChild(closeButton);
    $(newDiv).append("<h4>" + (appLoc && appLoc !== "right" ? translate("$edit") : translate("$addCustom")) + " " + translate("$profileElement") + "</h4>");

    // Header
    const headerInput = create("input", { id: "header-input" });
    headerInput.setAttribute("placeholder", translate("$addTitleHere"));
    headerInput.value = header ? header : null;
    newDiv.appendChild(headerInput);

    // Content
    const contentInput = create("textarea", { id: "content-input" });
    contentInput.setAttribute("placeholder", translate("$addContentHere"));
    contentInput.value = content ? content : null;
    newDiv.appendChild(contentInput);

    // Preview Button
    const previewButton = create("button", { class: "mainbtns btn-active-def", id: "previewButton", style: { width: "48%" } }, translate("$preview"));
    previewButton.addEventListener("click", function () {
      if (!document.querySelector("#custom-preview-div")) {
        const previewDiv = create("div", { id: "custom-preview-div" });
        cont.prepend(previewDiv);
      }
      addSCEditorCommands();
      scParserActions("content-input", "bbRefresh");
      const headerText = DOMPurify.sanitize(headerInput.value) || translate("$noTitle");
      const contentText = DOMPurify.sanitize(scParserActions("content-input", "fromBBGetVal"), purifyConfig);
      document.querySelector("#custom-preview-div").innerHTML = `
      <h2>${translate("$preview")}</h2>
      ${
        isRight && svar.modernLayout
          ? `<h4 style="border: 0;margin: 15px 0 4px 4px;">${headerText}</h4>`
          : `<h5 style="${svar.modernLayout ? "font-size: 11px; margin: 0 0 8px 2px;" : ""}">${headerText}</h5>`
      }
      <div>${contentText}</div><br>`;
    });
    btnsDiv.appendChild(previewButton);

    // Add Button
    const addButton = create("button", { class: "mainbtns btn-active-def", id: "addButton", style: { width: "48%" } }, appLoc && appLoc !== "right" ? translate("$edit") : translate("$add"));
    addButton.addEventListener("click", function () {
      scParserActions("content-input", "bbRefresh");
      const headerText = headerInput.value;
      let contentText = scParserActions("content-input", "fromBBGetVal");

      if (headerText.length > 1 && contentText.length > 1) {
        const customElArray = [
          {
            header: headerText,
            content: contentText,
            isRight: isRight,
          },
        ];
        const customElBase64 = LZString.compressToBase64(JSON.stringify(customElArray));
        const customElbase64url = customElBase64.replace(/\//g, "_");
        if (editData) {
          editAboutPopup([editData, `customProfileEl/${customElbase64url}`], "editCustomEl");
        } else {
          editAboutPopup(`customProfileEl/${customElbase64url}`, "customProfileEl");
        }
      }
    });
    btnsDiv.appendChild(addButton);
    newDiv.appendChild(btnsDiv);
    document.getElementById("customAddContainer").appendChild(newDiv);

    //ScEditor - Required Commands and Formats
    if (typeof sceditor !== "undefined") {
      await addSCEditor(contentInput);
      scParserActions("content-input", "bbRefresh");
    }
  }

  //Animate Scroll to ScEditor
  $("html, body").animate(
    {
      scrollTop: $("#customAddContainer").offset().top - $(window).height() * 0.1,
    },
    500
  );
}

async function buildCustomElements(data) {
  let parts = data.split("/");
  let favarray = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "customProfileEl") {
      if (i + 1 < parts.length) {
        const data = decodeAndParseBase64(parts[i + 1]);
        if (data) {
          favarray.push(data);
        }
      }
    }
  }

  let mainGroup = create("div", { id: "custom-el-group" });
  let customElContent = create("div", { class: "customProfileEls", id: "customProfileEls" });
  let customElContentRight = create("div", { class: "customProfileEls right", id: "customProfileEls" });
  let sortItem1 = null;
  let sortItem2 = null;
  if (svar.modernLayout) {
    const appendLoc = document.querySelector("#user-button-div");
    appendLoc.insertAdjacentElement("afterend", customElContent);
  } else {
    $(".user-comments").before(customElContent);
    $(customElContent).css({ marginBottom: "30px", width: "810px" });
    mainGroup.classList.add("flex2x");
  }
  $(".user-comments").before(customElContentRight);

  function replaceCustomEls() {
    const sortItem1compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem1]));
    const sortItem1base64url = sortItem1compressedBase64.replace(/\//g, "_");
    const sortItem2compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem2]));
    const sortItem2base64url = sortItem2compressedBase64.replace(/\//g, "_");
    editAboutPopup([sortItem1base64url, sortItem2base64url], "replaceCustomEl");
    sortItem1 = null;
    sortItem2 = null;
  }
  favarray.forEach((arr, index) => {
    arr.forEach((item) => {
      const isRight = item.isRight ? 1 : 0;
      const customElContainer = create("div", { class: "custom-el-container" });
      if (isRight) customElContainer.classList.add("right");
      customElContainer.innerHTML = `
      <div class="fa fa-pen editCustomEl" order="${index}" title="${translate("$edit")}"></div>
      <div class="fa fa-sort sortCustomEl" order="${index}" title="${translate("sort")}"></div>
      <div class="fa fa-x removeCustomEl" order="${index}" title="${translate("$remove")}"></div>
      ${
        isRight && svar.modernLayout
          ? `<h4 class="custom-el-header" style="border: 0;margin: 15px 0 4px 4px;">${item.header}</h4>`
          : `<h5 class="custom-el-header" style="${svar.modernLayout ? "font-size: 11px; margin: 0 0 8px 2px;" : ""}">${item.header}</h5>`
      }
      <div class="${svar.modernLayout ? "custom-el-inner" : "custom-el-inner notAl"}">${item.content}</div>
      `;
      if (isRight) {
        customElContentRight.appendChild(customElContainer);
        if (svar.alstyle && !defaultMal) {
          $(".user-comments").css("top", "-50px");
        }
      } else {
        customElContent.appendChild(customElContainer);
      }
    });
  });
  customElContent.append(mainGroup);

  //Sort Custom Element click function
  document.querySelectorAll(".sortCustomEl").forEach((element) => {
    element.addEventListener("click", function () {
      const order = this.getAttribute("order");
      if (sortItem1 === null) {
        sortItem1 = order;
        $(".sortCustomEl").addClass("hidden");
        $(this).addClass("selected");
        $(this).parent().parent().children(".custom-el-container").children(".sortCustomEl").removeClass("hidden");
        $(this).parent().parent().children(".custom-el-container").children(".sortCustomEl").show();
      } else if (sortItem2 === null) {
        sortItem2 = order;
        if (sortItem2 !== sortItem1) {
          replaceCustomEls();
        }
        $(this).parent().parent().children(".custom-el-container").children(".sortCustomEl").hide();
        $(".sortCustomEl").removeClass("hidden").removeClass("selected");
      }
      if (sortItem1 === sortItem2) {
        sortItem1 = null;
        sortItem2 = null;
      }
    });
  });
  //Edit Custom Element click function -not-tested
  $(".editCustomEl").on("click", function () {
    const appLoc = $(this).parent()[0];
    const header = $(this).nextUntil(".custom-el-header").next(".custom-el-header").text();
    const content = $(this).nextUntil(".custom-el-inner").next(".custom-el-inner").html();
    const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
    const base64url = compressedBase64.replace(/\//g, "_");
    const editData = `customProfileEl/${base64url}`;
    createCustomDiv(appLoc, header, content, editData);
  });

  //Remove Custom Element click function
  $(".removeCustomEl").on("click", function () {
    const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
    const base64url = compressedBase64.replace(/\//g, "_");
    editAboutPopup(`customProfileEl/${base64url}/`, "removeCustomEl");
  });

  if (userNotHeaderUser) {
    $(".sortCustomEl").remove();
    $(".editCustomEl").remove();
    $(".removeCustomEl").remove();
  }

  // Spoiler Show - Hide
  setTimeout(function () {
    let showButtons = document.querySelectorAll(".show_button");
    showButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        let spoilerContent = this.nextElementSibling;
        spoilerContent.style.display = "inline-block";
        this.style.display = "none";
      });
    });

    let hideButtons = document.querySelectorAll(".hide_button");
    hideButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        let spoilerContent = this.closest(".spoiler").querySelector(".spoiler_content");
        spoilerContent.style.display = "none";
        this.closest(".spoiler").querySelector(".show_button").style.display = "inline-block";
      });
    });
  }, 0);
}
