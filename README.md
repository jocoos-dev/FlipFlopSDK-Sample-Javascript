## FlipFlop SDK for Javascript

Live Commerce Javascript SDK 

## 설치
```
npm i -s flipflop-sdk-javascript
```
## 사용법
### 라이브러리 가져오기

```javascript
import { FlipFlop } from 'flipflop-sdk-javascript/dist/flipflop';

```

### 라이브러리 초기화

https://flipflop.tv 에서 발급받은 appKey 와 appSecret을 입력해주세요

```javascript
// Initialize SDK
await FlipFlop.initialize(appKey: APP_KEY, appSecret: APP_SECRET)
```

### 라이브러리 인증

중복되지 않은 userID를 입력하세요. 
userName과 avatarProfileURL은 선택사항입니다.
인증에 성공하게 되면 사용할 수 있는 라이브러리 인스턴스를 반환합니다.

```javascript
await FlipFlop.authentication(userID, userName, avatarProfileURL)

```

### 유저 정보 업데이트
```javascript
sdk.updateUserInfo(userName: "Updated User");
```

### 라이브 방송 하기
```javascript
// 라이브 방송 객체 생성
let streamer = sdk.getStreamer()
// 라이브 방송 이벤트 콜백 등록
streamer.delegate = this

// 카메라프리뷰 및 마이크 시작 및 방송 준비
streamer.prepare(previewVideo)

// 방송을 시작합니다. 방송 타이틀과 내용 입력. onPrepared 이후에 호출해야 함
streamer.start(title: TITLE, content: CONTENT)

// 방송을 종료합니다.
streamer.stop()

// 라이브 방송 객체 메모리 해제
streamer.reset()

// 카메라 변경
streamer.switchCamera()
```

### 라이브 방송 이벤트 콜백
```javascript
StreamerDelegate { 
    
    // 방송 준비 이벤트
    onPrepared()
    // 방송 시작 이벤트
    onStarted(streamName)
    // 방송 중지 이벤트
    onStopped ()
    // 방송 종료 이벤트
    onCompleted()
    // 방송 채팅 메시지 이벤트
    onChatMessgeReceived(message)
    // 방송 에러 이벤트
    onError(error)
}
```

### 방송 보기
```javascript
// 플레이어 객체 생성
const player = sdk.getPlayer(videoKey)

// 플레이어 준비
player.prepare(viewer)

// 플레이어 시작. onPrepared 이후 호출
player.start()

// 플레이어 중지
player.stop()

// 플레이어 객체 메모리 해제
player.reset()

// 채팅 보내기
player.sendMessage(text: "Blar Blar Blar....")

// 채팅 히스토리 가져오기: ChatHistory[]
const histories = await player.getChatHistory()
```

### 방송 보기 이벤트 콜백
```javascript
PlayerDelegate {
    // 방송 준비 이벤트
    onPrepared(player)
    // 방송 시작 이벤트
    onStarted(player)
    // 방송 임시 정지 이벤트
    onPaused(player)
    // 방송 일시 정지 후 다시 시작 이벤트
    onResumed()
    // 방송 중지 이벤트
    onStopped()
    // 방송 종료 이벤트
    onCompleted()
    // 방송 에러 이벤트
    onError(error)
    // 방송 채팅 메시지 이벤트
    onChatMessgeReceived(message)
}
```

### 비디오 리스트 가져오기

비디오 리스트로더를 이용하여 next 함수 호출시 비디오 리스트를 가져옴
더 이상 가져올 비디오가 없으면 빈 배열이 내려옴

```javascript
const loader = sdk.getVideoListLoader();
const videos = await loader.next();
```

## License 
MIT
