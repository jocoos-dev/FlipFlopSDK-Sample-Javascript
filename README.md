## FlipFlop SDK for Javascript

Live Commerce Javascript SDK 

## 설치
```bash
$ npm i -s flipflop-sdk-javascript
```

## 사용법
### SDK 초기화
#### 1. 라이브러리 가져오기

```javascript
import { FlipFlop } from 'flipflop-sdk-javascript/dist/flipflop';
```

#### 2. 라이브러리 초기화
- https://flipflop.tv 에서 발급받은 appKey 와 appSecret을 입력해주세요

```javascript
// Initialize SDK
await FlipFlop.initialize(appKey: APP_KEY, appSecret: APP_SECRET)
```

#### 3. 라이브러리 인증

- 중복되지 않은 userID를 입력하세요.
    - 숫자 혹은 영문자만 입력 가능합니다. (a-zA-Z0-9)
    - 특수문자를 사용할 수 없습니다.
- userName과 avatarProfileURL은 선택사항입니다.
- 인증에 성공하게 되면 사용할 수 있는 라이브러리 인스턴스를 반환합니다.

```javascript
const sdk = await FlipFlop.authentication(userID, userName, avatarProfileURL)
```

#### 4. 유저 정보 업데이트
- 라이브러리 인증 단계에서 설정한 유저 이름을 수정
```javascript
sdk.updateUserInfo(userName: "Updated User");
```

### 라이브 방송 하기
#### 1. 라이브를 하기 위한 instance 생성
```javascript
// 라이브 방송 객체 생성
const streamer = sdk.getStreamer()
```

#### 2. 라이브 이벤트 콜백 등록
- 라이브를 할 떄 사용할 이벤트 콜백을 등록
```javascript
// 라이브 방송 이벤트 콜백 등록
const StreamerDelegate = {
    // 방송 준비 이벤트
    onPrepared: () => {},
    // 방송 시작 이벤트
    onStarted: (streamName) => {},
    // 방송 중지 이벤트
    onStopped : () => {},
    // 방송 종료 이벤트
    onCompleted: () => {},
    // 방송 채팅 메시지 가저오는 이벤트 콜백
    onChatMessgeReceived: (message) => {},
    // 방송 에러 이벤트
    onError: (error) => {},
    // 방송 채팅 연결 성공 이벤트
    onConnectSuccess: () => {},
    // 방송 채팅 연결 실패 이벤트
    onConnectFailure: () => {},
    // 방송 채팅 끊기 이벤트 (player.disconnect)
    onDisconnect: () => {}
}

streamer.delegate = StreamerDelegate
```

#### 3. 라이브 방송송출
```javascript
// 카메라프리뷰 및 마이크 시작 및 방송 준비
streamer.prepare(previewVideo)

// 방송을 시작합니다. 방송 타이틀과 내용 입력. onPrepared 이후에 호출해야 함
streamer.start(title: TITLE, content: CONTENT)
```

#### 4. 라이브 방송송출 중단
> 송출 종료 후, `keepAlive = true`를 통해 라이브를 지정된 시간(10분)이 지나야 라이브가 끝난 것으로 처리되게 할 수 있다. 기본값: false

```javascript
// 방송을 종료합니다.
// keepAlive = false (기본값): 바로 송출 종료
// keepAlive = true: 10분 후 라이브 종료
streamer.stop(keepAlive)

// 라이브 방송 객체 메모리 해제
streamer.reset()
```

#### 5. 채팅 메시지

- 메시지 보내기
```javascript
streamer.sendMessage(text: "Blar Blar Blar....", customType?)
```

- 메시지 받기
> StreamerDelegate의 onChatMessgeReceived를 통해 들어온 메시지를 처리한다


### 방송 보기
#### 1. 방송을 보기 위한 instance 생성
```javascript
// 플레이어 객체 생성
const player = sdk.getPlayer(videoKey)
```

#### 2. 방송보기 이벤트 콜백 등록
- 방송을 볼 떄 사용할 이벤트 콜백을 등록
```javascript
 const PlayerDelegate = {
    // 방송 준비 이벤트
    onPrepared: (player) => {},
    // 방송 시작 이벤트
    onStarted: (player) => {},
    // 방송 임시 정지 이벤트
    onPaused: (player) => {},
    // 방송 일시 정지 후 다시 시작 이벤트
    onResumed: () => {},
    // 방송 중지 이벤트
    onStopped: () => {},
    // 방송 종료 이벤트
    onCompleted: () => {},
    // 방송 에러 이벤트
    onError: (error) => {},
    // 방송 채팅 메시지 수신시 이벤트
    onChatReceived: (message) => {},
    // 방송 채팅 메시지 가저오는 이벤트 콜백
    onChatMessgeReceived: (messages) => {},
    // 방송 채팅 연결 성공 이벤트
    onConnectSuccess: () => {},
    // 방송 채팅 연결 실패 이벤트
    onConnectFailure: () => {},
    // 방송 채팅 끊기 이벤트 (player.disconnect)
    onDisconnect: () => {}
}

// 플레이어 준비
player.prepare(PlayerDelegate)
```

#### 3. 방송보기 시작
```javascript
// 플레이어 시작. onPrepared 이후 호출
// isObserver: 스트리머 혹은 어드민 계정일 경우 true (default: false)
player.start(isObserver)
```

#### 4. 방송보기 중지
```javascript
// 플레이어 중지
player.stop()

// 플레이어 객체 메모리 해제
player.reset()
```

#### 5. 채팅 메시지
- 메시지 보내기
```javascript
// 채팅 보내기
player.sendMessage(text: "Blar Blar Blar....", customType?)
```

- 메시지 받기
> PlayerDelegate의 onChatMessgeReceived를 통해 들어온 메시지를 처리한다

- 메시지 가져오기
```javascript
// 방송 진입 시점 이전 채팅 히스토리 가져오기: ChatHistory[]
const histories = await player.getPastMessages()

// 방송 채팅 메시지 가져오기
const messages = await player.getChatMessages(option)
```

#### 채팅 메시지 가져오기 옵션 (getChatMessages option)

|     params     |   value              |             default value            |   description    |
|:--------------:|:--------------------:|:------------------------------------:|:----------------:|
|  custom_types  |  string OR string[]  |               모든 타입                | player.sendMessage 함수를 통해 사용자가 임의로 넣은 타입 |
| message_types  |  string OR string[]  |               모든 타입                | MESSAGE, DM, JOIN, LEAVE, COMMAND, ADMIN |
|   timestamp    |  number  |timestamp, message_id 둘다 비어 있으면 비디오 시작시간 기준| messaeg id 혹은 timestamp를 기준으로 메시지를 가져온다 (둘 중 하나만 사용)|
|   message_id   |  number  |timestamp, message_id 둘다 비어 있으면 비디오 시작시간 기준| messaeg id 혹은 timestamp를 기준으로 메시지를 가져온다 (둘 중 하나만 사용) |
|   prev_size    |  number  |              20              | timestamp 혹은 message id 기준으로 이전에 가져올 메시지 수
|   next_size    |  number  |              20              | timestamp 혹은 message id 기준으로 이후에 가져올 메시지 수  |
|  is_inclusive  |  boolean |             false            | 기준 시점을 포함해서 메시지를 가져올지 여부  |


#### message_types 설명
|  message_type  |   custom_type    |   description    |
|:--------------:|:----------------:|:----------------:|
|  MESSAGE       |  -  |  일반 메시지 |
|  DM            |  -  |  귓속말 메시지 |
|  JOIN          |  -  |  사용자 채팅방 진입 메시지 |
|  LEAVE         |  -  |  사용자 채팅방 이탈 메시지 |
|  COMMAND       |  -  |  클라이언트가 보내는 명령 메시지 (공지변경, 대표상품변경 등) |
|  ADMIN         |  UPDATE  |  방송 정보 업데이트에 관한 메시지 |
|  ADMIN         |  INACTIVE  |  방송 송출 일시중단  |
|  ADMIN         |  ACTIVE  |  방송 송출 재개  |
|  ADMIN         |  CLOSE  |  방송 종료  |
|  ADMIN         |  DISCONNECT  |  방송 강제종료  |

### 비디오 리스트 가져오기

비디오 리스트로더를 이용하여 next 함수 호출시 비디오 리스트를 가져옴
더 이상 가져올 비디오가 없으면 빈 배열이 내려옴

```javascript
const loader = sdk.getVideoListLoader();
const videos = await loader.next();
```    
    
## License 
MIT License

© 2014 Jocoos. All rights reserved.
