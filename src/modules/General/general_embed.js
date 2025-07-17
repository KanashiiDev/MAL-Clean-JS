// Forum Embed
if (svar.embedForum && /\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href)) {
  createEmbed([".message-wrapper > div.content", ".forum.thread .message"]);
}

// News Embed
if (svar.embedNews && /\/(news)\/.?([\w-]+)?\/?/.test(location.href)) {
  createEmbed([".news-container", ".news-related-database"]);
}
