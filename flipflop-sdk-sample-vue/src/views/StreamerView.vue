<template>
  <div class="about">
    <VideoStreamer />
  </div>
</template>

<script>
// @ is an alias to /src
import VideoStreamer from '@/components/VideoStreamer.vue'

export default {
  name: 'StreamerView',
  components: {
    VideoStreamer
  }
}
</script>
