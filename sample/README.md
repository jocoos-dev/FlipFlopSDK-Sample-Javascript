### Sample code 실행 방법
```sh
npm i
npm start
```

- appKey와 appSecret은 https://flipflop.tv 에서 발급받은 appKey 와 appSecret을 입력해 주세요.
- 브라우저에서 아래의 주소로 접속하면 확인할 수 있습니다.

http://localhost:3000?appKey=${appKey}&appSecret=${appSecret}

### Error

```
Error: Cannot find module '../scripts/start'
```
- 이런 에러가 발생하면, node_modules를 모두 삭제하고, `npm i`로 전체 재설치를 합니다.
