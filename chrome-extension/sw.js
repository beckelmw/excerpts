chrome.action.onClicked.addListener(openGithub);

async function getTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].id;
}

async function openGithub() {
  const tabId = await getTabId();
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    files: ["script.js"],
  });

  chrome.tabs.create({ url: result[0].result });
}
