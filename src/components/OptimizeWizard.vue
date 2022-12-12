<template>
    <div class="optimize_wizard ui_block">
        <div class="ui_block-header">Optimizer</div>
        <div class="ui_block-body">
            <div class="row content">
                <input type="checkbox"
                    name="updateOnSystemChange"
                    id="updateOnSystemChange"
                    v-model="updateOnSystemChange">
                <label for="updateOnSystemChange">Update
                    merit on
                    change</label>
            </div>
            <div class="row content">
                <p>Current Merit: {{
                        merit.toPrecision(6)
                }}
                </p>

            </div>
            <div class="row content">
                <button @click="updateMerit">Calculate
                    Current</button>

                <button @click="stop"
                    v-if="this.iterate">Stop!</button>
                <button @click="optimize"
                    v-else>Optimize!</button>
            </div>
            <div class="row content">
                <label for="maxIteration">Max:</label>
                <input type="number" name="maxIteration"
                    id="maxIteration"
                    v-model="maxIteration">
                <p>Iterations: {{ iterations }}</p>
            </div>

            <div class="row content">
                <input type="checkbox" name="updateView"
                    id="updateView" v-model="updateView">
                <label for="updateView">Update
                    view</label>
            </div>
        </div>
    </div>
</template>

<script>
import OpticSystem from '@/optic/OpticSystem'
import Optimize from '@/optic/analyze/Optimize'
import Merit from '@/optic/analyze/Merit'
import { throttle } from '@/scripts/throttle'

export default {
    props: {
        system: OpticSystem
    },
    data() {
        return {
            merit: 0,
            iterate: null,
            apply: null,
            iterations: 0,
            maxIteration: 20,
            timeout: null,
            updateOnSystemChange: true,
            updateView: false
        }
    },
    methods: {
        updateMerit: throttle(10, function () {
            this.merit = Merit(this.system).arraySync()[0]
        }),
        async optimize() {
            this.iterations = 0
            let [iterate, apply] = await Optimize(this.system)
            this.iterate = iterate
            this.apply = apply
            this.update()
        },
        update() {
            if (this.timeout) clearTimeout(this.timeout)
            if (this.iterations >= this.maxIteration) this.stop()
            else if (this.iterate) {
                let vm = this
                this.iterate().then((merit) => {
                    this.merit = merit
                    if (this.updateView) this.apply()
                    vm.timeout = setTimeout(() => {
                        vm.iterations += 1
                        vm.update()
                    }, 0)
                })
            }
        },
        stop() {
            if (this.apply) {
                this.system.update += 1
                this.apply()
                this.apply = null
            }
            this.updateMerit()
            this.iterate = null
            clearTimeout(this.timeout)
            this.timeout = null
        }
    },
    watch: {
        system: {
            handler() {
                if (this.updateOnSystemChange && !this.iterate) {
                    this.updateMerit()
                }
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.optimize_wizard {
    max-width: 300px;
}
</style>