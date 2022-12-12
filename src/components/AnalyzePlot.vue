<template>
    <div class="analyze_plot ui_block">
        <div class="ui_block-header">
            <p>Spot Diagram</p>
        </div>
        <div class="ui_block-body">
            <div ref="container"
                class="analyze_plot-container">
                <canvas ref="canvas"></canvas>
            </div>
        </div>
    </div>
</template>


<script>
import OpticSystem from '@/optic/OpticSystem'
import SpotTrace from '@/optic/analyze/SpotTrace'
import { toRaw } from 'vue'

import { asyncThrottle } from '@/scripts/throttle'
import { stopForAxis } from '@tensorflow/tfjs-core/dist/ops/slice_util'
import ViewState from './ViewControl'


export default {
    props: {
        system: OpticSystem
    },
    data() {
        return {
            canvas: null,
            ctx: null
        }
    },
    methods: {
        resize() {
            const rect = this.$refs.container.getBoundingClientRect()
            this.$refs.canvas.width = rect.width
            this.$refs.canvas.height = rect.height
            this.update()
        },
        update: asyncThrottle(10, async function () {
            if (this.ctx === null) {
                console.error('ctx not ready')
            }
            /**@type {HTMLCanvasElement} */
            const canvas = this.canvas
            /**@type {CanvasRenderingContext2D} */
            const ctx = this.ctx


            // RAYTRACE
            const result = await SpotTrace(this.system).array()

            // Plot
            ctx.resetTransform()
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.translate(canvas.width / 2, canvas.height / 2)


            ctx.beginPath()
            let ymax = result[1][0]
            let ymin = result[1][0]


            for (let i = 0; i < result[0].length; i++) {
                let y = result[1][i]
                if (isNaN(y)) continue
                ymax = Math.max(y, ymax)
                ymin = Math.min(y, ymin)
            }

            let scale = canvas.height / (ymax - ymin + 2) * 0.8

            ctx.scale(scale, scale)
            ctx.translate(0, -(ymax + ymin) / 2)
            ctx.lineWidth = 1 / scale
            for (let i = 0; i < result[0].length; i++) {
                ctx.beginPath()
                ctx.strokeStyle = ViewState.colorlist[i % this.system.fields.length % ViewState.colorlist.length]
                let x = result[0][i]
                let y = result[1][i]
                ctx.rect(x - 1 / scale, y - 1 / scale, 2 / scale, 2 / scale)
                ctx.stroke()
            }
        })
    },
    watch: {
        system: {
            handler() {
                this.update()
            },
            deep: true
        }
    },

    mounted() {
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext('2d')
        addEventListener("resize", this.resize)
        this.resize()
    },
    unmounted() {
        removeEventListener("resize", this.resize)
    }
}
</script>

<style scoped lang="scss">
.analyze_plot {
    position: relative;
    width: 200px;
    height: 100%;

    &-container {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;

        canvas {
            position: absolute;
            background-color: black;
            border-radius: 4px;
        }
    }
}
</style>