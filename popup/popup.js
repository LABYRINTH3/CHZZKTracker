// popup.js

document.getElementById('openFiltered').addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("filter/filtered.html"),
      type: "popup",  // 팝업 타입 창을 생성합니다.
      // width: 430,     
      // height: 1000     
    });
  });
  