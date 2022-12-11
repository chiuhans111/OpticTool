<template>
    <div class="lens_plot ui_block">
        <div ref="container" class="lens_plot-container">
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>

<script>
import OpticSystem from '@/optic/OpticSystem'
import RayTrace from '@/optic/RayTrace'
import _ from 'lodash'
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
        update: _.throttle(function () {
            console.log('update')
            /**@type {HTMLCanvasElement} */
            const canvas = this.canvas
            /**@type {CanvasRenderingContext2D} */
            const ctx = this.ctx
            ctx.resetTransform()
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            ctx.translate(canvas.width / 2, canvas.height / 2)

            let ttl = 0

            for (let surface of this.system.surfaces) {
                ttl += surface.thickness.value
            }

            let scale = canvas.width / ttl * 0.8
            ctx.scale(scale, scale)
            ctx.lineWidth = 1 / scale


            ctx.translate(-ttl / 2, 0)


            // RAYTRACE
            const result = RayTrace(this.system)
            ctx.strokeStyle = 'blue'
            for (let i = 0; i < result[0][0].length; i++) {
                ctx.beginPath()
                for (let j = 0; j < result.length; j++) {
                    let y = result[j][1][i]
                    let z = result[j][2][i]
                    if (j == 0) ctx.moveTo(z, y)
                    else ctx.lineTo(z, y)
                }
                ctx.stroke()
            }


            ctx.lineWidth = 2 / scale
            ctx.strokeStyle = 'black'

            const N = 30

            let z0 = 0
            for (let surface of this.system.surfaces) {
                let R = 15

                ctx.beginPath()
                for (let i = 0; i <= N; i++) {
                    let r = (i / N - 0.5) * 2 * R
                    let z = surface.shape.surface(r)

                    if (i == 0)
                        ctx.moveTo(z0 + z, r)
                    else
                        ctx.lineTo(z0 + z, r)

                }
                ctx.stroke()
                z0 += surface.thickness.value
            }
        }, 50)
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
.lens_plot {
    position: relative;
    height: 500px;
    max-width: 700px;

    &-container {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }
}
</style>