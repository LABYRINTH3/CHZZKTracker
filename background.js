// background.js

console.log("[background.js] Service Worker 로드됨.");

// filtered.html과 연결될 Port 변수
let filteredPort = null;

// 다른 페이지(filtered.html)에서 연결 요청이 오면 처리
chrome.runtime.onConnect.addListener((port) => {
  console.log("[background.js:onConnect] 포트 연결 이벤트 발생. 포트 이름:", port.name);

  if (port.name === 'filtered') {
    filteredPort = port;
    console.log("[background.js:onConnect] filteredPort 연결됨:", filteredPort);

    port.onDisconnect.addListener(() => {
      console.log("[background.js:onDisconnect] filteredPort 연결이 해제됨.");
      filteredPort = null;
    });
  }
});

// content script로부터 메시지를 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[background.js:onMessage] 메시지 수신:", request, sender);

  if (request.type === 'CHAT_MESSAGE') {
    console.log("[background.js:onMessage] CHAT_MESSAGE 타입 수신. data:", request.data);

    // 연결된 filtered 페이지가 있으면 메시지를 전달
    if (filteredPort) {
      console.log("[background.js:onMessage] filteredPort로 메시지를 전달합니다.");
      filteredPort.postMessage(request.data);
    } else {
      console.warn("[background.js:onMessage] filteredPort가 null이어서 메시지를 전달할 수 없음.");
    }
    // sendResponse 예시 (필요하면 사용)
    sendResponse({ status: "OK", receivedData: request.data });
  } else {
    console.log("[background.js:onMessage] 알 수 없는 타입의 메시지. 무시함.");
    sendResponse({ status: "Unknown message type" });
  }
});

// 확장 프로그램이 설치(혹은 업데이트)될 때 알람 생성
chrome.runtime.onInstalled.addListener(() => {
  console.log("[background.js:onInstalled] 확장 프로그램 설치/업데이트됨. 알람 생성");
  chrome.alarms.create('keepAliveAlarm', { periodInMinutes: 1 });
});

// 알람 리스너
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAliveAlarm') {
    console.log("[background.js:onAlarm] 주기적으로 서비스 워커 깨어남. 알람 이름:", alarm.name);
    // 여기에 “유지”를 위한 어떠한 동작을 수행할 수 있음
  }
});

console.log("[background.js] 스크립트 끝.");


chrome.runtime.onConnect.addListener((port) => {
  console.log("[background.js] onConnect. port name:", port.name);
  if (port.name === 'filtered') {
    filteredPort = port;
    console.log("[background.js] filtered.html 연결 성공!");

    port.onDisconnect.addListener(() => {
      console.log("[background.js] filtered.html 연결 해제!");
      filteredPort = null;
    });
  }
});

