<template>
  <div class="container">
      <div>
        <LensPlot :system="system"></LensPlot>
      </div>
      <div class="row">
        <LensSheet :system="system"></LensSheet>
        <FieldSheet :system="system"></FieldSheet>
      </div>
  </div>
</template>

<script>
import LensSheet from './components/LensSheet.vue'
import LensPlot from './components/LensPlot.vue'
import optic from './optic'
import serializer from './optic/Serializer'
import FieldSheet from './components/FieldSheet.vue'

export default {
  name: 'App',
  data() {
    return {
      system: optic.system
    }
  },
  components: {
    LensSheet,
    LensPlot,
    FieldSheet
},
  mounted(){
    serializer.serialize(this.system)
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
