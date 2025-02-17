// content.js

console.log("[content.js] 스크립트 로드됨: 시작합니다.");

// 필터할 닉네임을 넣어주세요
const targetNicknames = [

];

// 채팅 메시지 노드를 처리하는 함수
function processChatNode(node) {
  if (!node) {
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  // 닉네임이 들어 있는 요소를 찾습니다.
  const nicknameElem = node.querySelector('.name_text__yQG50');
  if (!nicknameElem) {
    // 해당 요소가 없으면 그냥 리턴
    return;
  }

  // 실제 color가 들어 있는 nickname 컬러 요소
  const nicknameColorElem = node.querySelector('.live_chatting_username_nickname__dDbbj');
  // 닉네임 텍스트
  const nickname = nicknameElem.innerText.trim();


  if (!targetNicknames.includes(nickname)) {
    // 디버깅용 로그
    return;
  }
  
  // 채팅 메시지 텍스트를 찾습니다.
  const messageElem = node.querySelector('.live_chatting_message_text__DyleH');
  const messageText = messageElem ? messageElem.innerText.trim() : "";

  // nicknameColorElem에서 color 추출
  let colorValue = "";
  if (nicknameColorElem) {
    colorValue = nicknameColorElem.style.color;
    console.log(`[processChatNode] 닉네임 색상: "${colorValue}"`);
  } else {
    console.log(`[processChatNode] nicknameColorElem 요소가 없습니다. 인라인 스타일 색상 추출 불가`);
  }

  // 메시지 정보를 객체로 만듭니다.
  const chatData = {
    nickname: nickname,
    message: messageText,
    color: colorValue,
    timestamp: new Date().toISOString()
  };

  console.log("[processChatNode] 필터 대상 닉네임이므로 background로 메시지 전송 시도:", chatData);

  // 백그라운드 스크립트로 메시지를 전송합니다.
  try {
    chrome.runtime.sendMessage({ type: 'CHAT_MESSAGE', data: chatData }, (response) => {
      // 응답 콜백
      console.log("[content.js] background로부터의 응답:", response);
      if (chrome.runtime.lastError) {
        console.error("[content.js] 전송 중 에러 발생:", chrome.runtime.lastError);
      }
    });
  } catch (err) {
    console.error("[content.js] chrome.runtime.sendMessage에서 예외 발생:", err);
  }
}

// DOM의 변화를 감시하기 위해 MutationObserver 사용
const observer = new MutationObserver((mutationsList) => {

  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {

        if (node.nodeType === Node.ELEMENT_NODE) {
          // 채팅 메시지 요소인지 확인
          if (node.classList && node.classList.contains('live_chatting_list_item__0SGhw')) {
            processChatNode(node);
          } else {
            // 하위 여러 개 채팅 메시지가 있을 경우
            const chatNodes = node.querySelectorAll?.('.live_chatting_list_item__0SGhw');
            if (chatNodes.length > 0) {
              chatNodes.forEach(processChatNode);
            }
          }
        }
      });
    }
  }
});

// document.body에 대해 childList와 subtree 옵션으로 변화를 감시
observer.observe(document.body, { childList: true, subtree: true });

// 디버깅용 초기 메시지
console.log("[content.js] DOM MutationObserver 설정 완료.");
