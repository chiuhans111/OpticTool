<template>
  <div class="container">
    <div class="row">
      <h2>Optic Tool </h2>
      <div></div>
      <button @click="open">Open</button>
      <button @click="save">Save</button>
      <div></div>
      <button @click="undo">Undo
        {{ this.stateHead - 1 }}</button>
      <button @click="redo">Redo
        {{ this.state.length - this.stateHead }}</button>
    </div>
    <div class="row top_row">
      <LensPlot :system="system"></LensPlot>
      <AnalyzePlot :system="system"></AnalyzePlot>
    </div>
    <div class="row">
      <LensSheet :system="system"></LensSheet>
      <FieldSheet :system="system"></FieldSheet>
      <OptimizeWizard :system="system"></OptimizeWizard>
    </div>
    <div class="row">
      <div class="content">
        <h3>About this project</h3>
        <p>Developer: <a
            href="https://chiuhans111.github.io">Hans
            Chiu</a></p>
        <p>Project repo: <a
            href="https://github.com/chiuhans111/OpticTool">https://github.com/chiuhans111/OpticTool</a>
        </p>
      </div>
      <div class="content">
        <h3>How to use?</h3>
        <p>Drag the input box to modify value.</p>
        <p>Click the input box to edit and set optimization
          variable.</p>
      </div>
    </div>
  </div>
</template>

<script>
import LensSheet from './components/LensSheet.vue'
import LensPlot from './components/LensPlot.vue'
import optic from './optic'
import serializer from './scripts/Serializer'
import FieldSheet from './components/FieldSheet.vue'
import AnalyzePlot from './components/AnalyzePlot.vue'
import OptimizeWizard from './components/OptimizeWizard.vue'
import { throttle } from './scripts/throttle'
import { debounce } from './scripts/debounce'
import { toRaw } from 'vue'
export default {
  name: 'App',
  data() {
    return {
      system: optic.system,
      state: [],
      no_record: false,
      stateHead: 0
    }
  },
  components: {
    LensSheet,
    LensPlot,
    FieldSheet,
    AnalyzePlot,
    OptimizeWizard
  },
  mounted() {
    this.push()
  },
  methods: {
    undo() {
      this.no_record = true
      if (this.stateHead > 1)
        this.stateHead--
      if (this.state.length > 0) {
        this.load(this.state[this.stateHead - 1])
      }
    },
    redo() {
      this.no_record = true
      if (this.stateHead < this.state.length)
        this.stateHead++
      if (this.state.length > 0) {
        this.load(this.state[this.stateHead - 1])
      }
    },
    load(str) {
      this.system = serializer.deserialize(str)
    },
    push: debounce(200, throttle(500, function () {
      this.state.splice(this.stateHead)
      let str = serializer.serialize(toRaw(this.system))
      if (this.state.length == 0 || str !== this.state[this.state.length - 1]) {
        this.state.push(str)
        this.stateHead += 1
      }
    })),

    open() {
      let a = document.createElement('input')
      a.type = 'file'
      let vm = this
      a.onchange = function () {
        const reader = new FileReader()
        reader.readAsText(a.files[0], "UTF-8")
        reader.onload = function (e) {
          vm.load(e.target.result)
        }
      }
      a.click()


    },
    save() {
      let filename = "lens.json"
      var contents = serializer.serialize(toRaw(this.system))
      var blob = new Blob([contents], { type: 'text/plain' })
      var file = new File([blob], filename, { type: "text/plain" })
      let a = document.createElement('a')
      let e = document.createEvent('MouseEvents')
      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/obj', a.download, a.href].join(':')
      a.click()
    }
  },
  watch: {
    system: {
      handler() {
        if (!this.no_record)
          this.push()
        this.no_record = false
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.top_row>div {
  height: 450px;
}
</style>
