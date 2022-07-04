<template>
  <div className='demo-container'>
      <div className='demo-content'>
        <h1 className='font-bold text-40'>DEMO</h1>
        <div className='flex-center'>
          <div class="card demo-group">
            <div class="demo-content-group">
              <h1>Streamer</h1>
            </div>
            <router-link to="/streamer">
              <img src="../assets/FlipflopStreamer.png" width="287" height="160"/>
            </router-link>
          </div>
          <div class="card demo-group">
            <div class="demo-content-group">
              <h1>Viewer</h1>
            </div>
            <router-link to="/viewer">
              <img src="../assets/FlipflopViewer.png" width="287" height="160"/>
            </router-link>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'SelectMode'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
