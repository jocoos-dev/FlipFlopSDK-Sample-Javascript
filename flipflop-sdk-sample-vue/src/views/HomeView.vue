<template>
  <div class="home">
    <SelectMode />
  </div>
</template>

<script>
// @ is an alias to /src
import SelectMode from '@/components/SelectMode.vue'

export default {
  name: 'HomeView',
  components: {
    SelectMode
  }
}
</script>
