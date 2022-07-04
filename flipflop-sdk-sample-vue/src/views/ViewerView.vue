<template>
  <div class="about">
    <VideoViewer />
  </div>
</template>

<script>
// @ is an alias to /src
import VideoViewer from '@/components/VideoViewer.vue'

export default {
  name: 'ViewerView',
  components: {
    VideoViewer
  }
}
</script>
