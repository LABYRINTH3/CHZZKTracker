// popup.js

document.getElementById('openFiltered').addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("filter/filtered.html"),
      type: "popup",  // 팝업 타입 창을 생성합니다.
      width: 430,     // 창의 너비를 600px로 지정
      height: 1000     // 창의 높이를 400px로 지정
    });
  });
  