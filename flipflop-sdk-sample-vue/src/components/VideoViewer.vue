<template>
  <div class="viewer-container">
    <h2>Viewer</h2>
    <div style="display:flex"><label style="margin-right: 5px">appKey</label><input :disabled="false" type="text" v-model="appKey" placeholder="appKey"></div>
    <div style="display:flex"><label style="margin-right: 5px">appSecret</label><input :disabled="false" type="text" v-model="appSecret" placeholder="appSecret"></div>
    <div style="display:flex"><label style="margin-right: 5px">videoKey</label><input :disabled="false" type="text" v-model="videoKey" placeholder="videoKey" style="margin-bottom: 10px"></div>
    <div class="button-group">
      <button :disabled="false" @click="start">start</button>
    </div>
    <div class="video-viewer-group" data-vjs-player>
      <video
        id="video-viewer"
        width="1080"
        height="720"
        class="video-js vjs-default-skin vjs-big-play-centered"
        x-webkit-ariplay="allow"
        playsinline
        controls
        crossorigin="anonymous"
        data-setup='{"muted": true, "autoplay": true, "preload": "auto", "controls": true, "liveui": false}'
      >
        <source type="application/x-mpegurl" :src="video.url" />
      </video>
    </div>
    <div v-if="video.state === 'LIVE'" class="video-chat-group">
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
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { FlipFlop } from 'flipflop-sdk-javascript/dist/flipflop'

export default {
  name: 'VideoStreamer',
  data: () => ({
    appKey: '',
    appSecret: '',
    userId: 'GUEST',
    userName: 'GUEST',
    videoKey: '',
    chatState: 'Waiting',
    messages: [],
    video: {},
    message: '',
    videoEl: null
  }),
  methods: {
    send (e) {
      e.preventDefault()

      if (this.message.trim().length === 0) {
      // Toast.warn('Enter messages to send')
        return
      }

      if (this.player) {
        this.player.sendMessage(this.message)
      }
      this.message = ''
    },
    async start () {
      if (!this.player) {
        await FlipFlop.initialize(this.appKey, this.appSecret)
        this.sdk = await FlipFlop.authentication(this.userId, this.userName)

        this.videoEl = videojs('video-viewer')

        this.player = this.sdk.getPlayer(this.videoKey)

        const viewerDelegate = {
          onPrepare: () => {
            console.log('onPrepare')
          },
          onStart: (title) => {
            console.log('onStart')
          },
          onStop: () => {
            console.log('onStopped')
          },
          onError: (error) => {
            if (error) {
              console.error(error)
            }
          },
          onChatMessageReceived: (messages) => {
            if (this.video.src) {
              return
            }

            if (messages) {
              this.messages = messages
            }
          },
          onConnectFailure: () => {
            this.chatState = 'Failure'
          },
          onChatReceived: (message) => {
            this.messages = this.messages.concat(message)
          }
        }

        this.player.prepare(viewerDelegate)
        this.video = await this.player.start()

        this.videoEl.on('error', () => {
          let retry = 0
          if (retry < 4) {
            console.log(`Video source went wrong! Retrying.. ${++retry}`)
            setTimeout(() => {
              console.log(this.player)
              if (this.player.src !== null) {
                this.videoEl.src(this.props.src)
                this.videoEl.play()
              }
            }, 3000)
          }
        })
      }

      this.videoEl.src({ type: 'application/x-mpegURL', src: this.video.url })

      console.log('this.video', this.video, this.videoEl, this.videoEl.src)
    }
  },
  async mounted () {
  },
  async unmounted () {
    if (this.player) {
      this.player.reset()
    }
  },
  beforeUnmount () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style scoped>
.viewer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
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
