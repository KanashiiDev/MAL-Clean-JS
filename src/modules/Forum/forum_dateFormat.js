function changeDate(d) {
  let dateData =
    document.querySelectorAll(".message-header > .date").length > 0 ? document.querySelectorAll(".message-header > .date") : document.querySelectorAll(".content > div.user > div.item.update");
  let lastPost = d ? d : document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4)");
  if (lastPost) {
    for (let x = 0; x < lastPost.length; x++) {
      let t = d ? lastPost[x].innerHTML : $(lastPost[x]).find("br").get(0).nextSibling.nodeValue;
      let t2 = d
        ? t.replace(/\s{2,}/g, " ").replace(/(\w.*\d.*) (\d.*\:\d{2}.*\W.\w)(\sby.*)/gm, '<span class ="replyDate">$1 $2</span>$3')
        : t
            .replace(/\s{2,}/g, " ")
            .replace(/(\w.*\d.*) (\d.*\:\d{2}.*\W.\w)/gm, '<span class ="replyDate">$1</span>')
            .replace(",", " ");
      lastPost[x].innerHTML = lastPost[x].innerHTML.replace(t, t2);
    }
  }
  let topicDate = Array.prototype.slice
    .call(document.querySelectorAll("#forumTopics tr[data-topic-id] .lightLink"))
    .concat(Array.prototype.slice.call(document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4) span")));
  if (d) {
    topicDate = document.querySelectorAll("span.replyDate");
  }
  dateData = topicDate.length ? topicDate : dateData;
  let date, datenew;
  const timeRegex = /\d{1,2}:\d{2} [APM]{2}/;
  const yearRegex = /\b\d{4}\b/;
  for (let x = 0; x < dateData.length; x++) {
    if (!dateData[x].getAttribute("dated")) {
      date = !timeRegex.test(dateData[x].innerText) ? dateData[x].innerText + ", 00:00 AM" : dateData[x].innerText;
      datenew = date.includes("Yesterday") || date.includes("Today") || date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
      date = yearRegex.test(date) ? date : date.replace(/(\,)/, " " + new Date().getFullYear());
      datenew ? (date = dateData[x].innerText) : date;
      let timestamp = new Date(date).getTime();
      const timestampSeconds = dateData[x].getAttribute("data-time") ? dateData[x].getAttribute("data-time") : Math.floor(timestamp / 1000);
      dateData[x].title = dateData[x].innerText;
      dateData[x].innerText = datenew ? date : nativeTimeElement(timestampSeconds);
      dateData[x].setAttribute("dated", 1);
    }
  }
}
if (svar.forumDate && location.href === "https://myanimelist.net/forum/") {
  let replyDate = Array.prototype.slice.call(document.querySelectorAll("span.date.di-ib")).concat(Array.prototype.slice.call(document.querySelectorAll("span.information.di-ib")));
  changeDate(replyDate);
}
if (svar.forumDate && /\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href)) {
  changeDate();
  if (document.querySelectorAll(".content > div.user > div.item.update").length) {
    let target = document.querySelector(".messages.replies.parents");
    let observer = new MutationObserver(function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        changeDate();
      }
    });
    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }
}
