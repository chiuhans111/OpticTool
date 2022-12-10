<template>
  <div class="container">
      <div>
        <LensPlot :system="system"></LensPlot>
      </div>
      <div>
        <LensSheet :system="system"></LensSheet>
      </div>
  </div>
</template>

<script>
import LensSheet from './components/LensSheet.vue'
import LensPlot from './components/LensPlot.vue'
import optic from './optic'

export default {
  name: 'App',
  data() {
    return {
      system: optic.system
    }
  },
  components: {
    LensSheet,
    LensPlot
  },
  watch: {
    system: {
      handler() {
      },
      deep: true
    }
  }
}
</script>

<style>

</style>
