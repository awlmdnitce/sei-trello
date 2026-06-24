chrome.runtime.onMessage.addListener((msg, _sender) => {
  if (msg.from === 'content' && msg.subject === 'showPageAction') {
    // chrome.pageAction was removed in Manifest V3; the action icon is always visible by default
  }
  if (msg.from === 'content' && msg.subject === 'showOptionsPage') {
    chrome.runtime.openOptionsPage();
  }
});
