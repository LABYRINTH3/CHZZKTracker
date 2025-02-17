// filtered.js

const chatContainer = document.getElementById('chatContainer');

// 백그라운드와 연결 (Port를 통해 메시지를 수신)
const port = chrome.runtime.connect({ name: 'filtered' });

port.onMessage.addListener((chatData) => {
  // 새로운 채팅 메시지 요소 생성
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message';
  
  const nicknameSpan = document.createElement('span');
  nicknameSpan.className = 'nickname';
  nicknameSpan.textContent = chatData.nickname;
  // nicknameSpan.textContent = '\"'+ chatData.nickname + '\"' + " ,";

  // color가 정상적으로 넘어왔으면 적용, 없으면 원하는 기본값
  if (chatData.color) {
    nicknameSpan.style.color = chatData.color;  
  } else {
    nicknameSpan.style.color = 'rgb(90, 144, 192)'; // 기본값
  }

  const textSpan = document.createElement('span');
  textSpan.className = 'message';
  textSpan.textContent = ' ' + chatData.message;
  
  
  messageDiv.appendChild(nicknameSpan);
  messageDiv.appendChild(textSpan);
  
  chatContainer.appendChild(messageDiv);
  
  // 새로운 메시지가 보이면 스크롤 아래로 이동
  chatContainer.scrollTop = chatContainer.scrollHeight;
});
