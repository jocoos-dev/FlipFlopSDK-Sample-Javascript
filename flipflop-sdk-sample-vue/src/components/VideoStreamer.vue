<template>
  <div class="streamer-container">
    <h2>Streamer</h2>
    <p>{{ streamState }}</p>
    <div style="margin-bottom: 10px;" v-if="videoKey !== ''"><span>videoKey: </span>&nbsp;&nbsp;<span>{{ videoKey }}</span></div>
    <div style="display:flex"><label style="margin-right: 5px">appKey</label><input :disabled="streamState !== 'Initialized'" type="text" v-model="appKey" placeholder="appKey"></div>
    <div style="display:flex"><label style="margin-right: 5px">appSecret</label><input :disabled="streamState !== 'Initialized'" type="text" v-model="appSecret" placeholder="appSecret" style="margin-bottom: 10px"></div>
    <div class="button-group">
      <button :disabled="streamState !== 'Initialized'" @click="init">init</button>
      <button :disabled="streamState !== 'Prepare'" @click="start">start</button>
      <button :disabled="streamState !== 'Started'" @click="stop">stop</button>
    </div>
    <video
      id="screen-video"
      width="1080"
      height="720"
      muted
      autoPlay
      playsInline
    ></video>
    <div class="video-chat-group">
      <div class="message-scroller">
        <div><span>{{ chatState }}</span></div>
        <div v-for="(messageItem, index) in messages" :key="messageItem.name + '-' + index">
          <div><span>{{ messageItem.user.username }}</span>&nbsp;&nbsp;<span>{{messageItem.message}}</span></div>
        </div>
      </div>
    </div>
      <form class="chat-form" v-on:submit="send">
        <input type="text" v-model="message" placeholder="type chat message...">
        <button>Send</button>
      </form>
  </div>
</template>

<script>
import { FlipFlop } from 'flipflop-sdk-javascript/dist/flipflop'
export default {
  name: 'VideoStreamer',
  data: () => ({
    appKey: '',
    appSecret: '',
    userId: 'ADMIN',
    userName: 'ADMIN',
    streamState: 'Initialized',
    chatState: 'Waiting',
    messages: [],
    message: '',
    videoKey: ''
  }),
  methods: {
    send (e) {
      e.preventDefault()

      if (this.message.trim().length === 0) {
      // Toast.warn('Enter messages to send')
        return
      }

      this.streamer.sendMessage(this.message)
      this.message = ''
    },
    async init () {
      if (!this.appKey || !this.appSecret) {
        alert('appKey and appSecret is required')
      }

      if (!this.streamer) {
        await FlipFlop.initialize(this.appKey, this.appSecret)
        this.sdk = await FlipFlop.authentication(this.userId, this.userName)
        this.streamer = this.sdk.getStreamer()
        const StreamerDelegate = {
          onPrepare: () => {
            this.streamState = 'Prepare'
          },
          onStart: (title) => {
            this.streamState = 'Started'
          },
          onStop: () => {
            this.streamState = 'Stopped'
          },
          onCompleted: () => {
            this.streamState = 'onCompleted'
          },
          onConnectSuccess: () => {
            this.chatState = 'Connected'
          },
          onConnectFailure: () => {
            this.chatState = 'Failure'
          },
          onChatReceived: (message) => {
            message.elapsedTime = Date.now() - message.created_at
            console.log('1234', this.messages)

            this.messages = this.messages.concat(message)
          }
        }
        this.streamer.delegate = StreamerDelegate
        const previewVideo = document.getElementById('screen-video')
        this.streamer.prepare(previewVideo)
      }
    },
    async start () {
      this.video = await this.streamer.start('Sample Title', 'Sample Content')
      console.log('HERE IS THE VIDEO ****************')
      console.log('this.video', this.video)
      this.videoKey = this.video.video_key
    },
    stop () {
      if (!window.confirm('Do you want to stop LIVE?')) {
        return
      }

      if (this.streamer) {
        this.streamer.stop()
      }
    }
  },
  async mounted () {
  },
  async unmounted () {
    if (this.streamer) {
      this.streamer.reset()
    }
  }
}
</script>
<style scoped>
.streamer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-group button + button {
  margin-left: 10px;
}

.video-chat-group {
    height: 500px;
    overflow: scroll;
    width: 1080px;
    display: flex;
    text-align: left;
}

.message-scroller * {
  overflow-anchor: none;
}

.message-scroller:after {
  content: "";
  display: block;
  overflow-anchor: auto;
  height: 1px;
}
</style>
