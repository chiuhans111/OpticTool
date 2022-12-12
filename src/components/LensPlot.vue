<template>
    <div class="lens_plot ui_block">
        <div class="ui_block-header ">
            <p>Plot</p>
        </div>
        <div class=" ui_block-body">
            <div ref="container"
                class="lens_plot-container">
                <canvas ref="canvas"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
import OpticSystem from '@/optic/OpticSystem'
import PlotTrace from '@/optic/analyze/PlotTrace'

import { asyncThrottle } from '@/scripts/throttle'
import ViewState from './ViewControl'


export default {
    props: {
        system: OpticSystem
    },
    data() {
        return {
            canvas: null,
            ctx: null,
            ViewState: ViewState
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
            if (this.ctx === null) return

            /**@type {HTMLCanvasElement} */
            const canvas = this.canvas
            /**@type {CanvasRenderingContext2D} */
            const ctx = this.ctx


            // RAYTRACE
            const result = await Promise.all(PlotTrace(this.system).map(x => x.array()))

            // Plot
            ctx.resetTransform()
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.translate(canvas.width / 2, canvas.height / 2)

            let ttl = 0

            for (let surface of this.system.surfaces) {
                ttl += surface.thickness.num()
            }




            let Rlist = []
            let Rmax = 0
            for (let j = 1; j < result.length; j++) {
                let R = 0
                for (let i = 0; i < result[0][0].length; i++) {
                    let y = result[j][1][i]
                    if (isNaN(y)) continue
                    R = Math.max(R, Math.abs(y))
                }
                Rlist.push(R)
                Rmax = Math.max(R, Rmax)
            }

            let scale = canvas.width / ttl * 0.9

            scale = Math.min(scale, canvas.height / Rmax / 2 * 0.9)

            ctx.scale(scale, scale)
            ctx.translate(-ttl / 2, 0)


            ctx.lineWidth = 2 / scale

            ctx.strokeStyle = "#333"
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(ttl, 0)
            ctx.stroke()


            ctx.strokeStyle = '#EEE'



            const N = 50

            let z0 = 0

            ctx.fillStyle = '#111'


            for (let j = 0; j < this.system.surfaces.length; j++) {
                let surface = this.system.surfaces[j]
                let R = Rlist[j]

                let isSolid = j < this.system.surfaces.length - 1 && surface.material.index > 1

                if (isSolid) {
                    R = Math.max(R, Rlist[j + 1])
                }

                ctx.beginPath()
                for (let i = 0; i <= N; i++) {
                    let r = (i / N - 0.5) * 2 * R
                    let z = surface.shape.surface(r)
                    if (isNaN(r) || isNaN(z)) continue
                    if (i == 0)
                        ctx.moveTo(z0 + z, r)
                    else
                        ctx.lineTo(z0 + z, r)
                }

                if (isSolid) {
                    let nextsurface = this.system.surfaces[j + 1]

                    for (let i = 0; i <= N; i++) {
                        let r = -(i / N - 0.5) * 2 * R
                        let z = nextsurface.shape.surface(r)
                        if (isNaN(r) || isNaN(z)) continue
                        ctx.lineTo(z0 + z + surface.thickness.value, r)
                    }

                    ctx.closePath()
                    ctx.fill()
                }
                ctx.stroke()


                if (surface == ViewState.focusedSurface) {
                    ctx.save()
                    ctx.strokeStyle = "orange"
                    ctx.lineWidth = 3 / scale
                    ctx.beginPath()
                    for (let i = 0; i <= N; i++) {
                        let r = (i / N - 0.5) * 2 * R
                        let z = surface.shape.surface(r)
                        if (isNaN(r) || isNaN(z)) continue
                        if (i == 0)
                            ctx.moveTo(z0 + z, r)
                        else
                            ctx.lineTo(z0 + z, r)
                    }
                    ctx.stroke()
                    ctx.restore()
                }


                z0 += surface.thickness.value
            }


            // Draw Rays
            ctx.lineWidth = 1.5 / scale

            for (let i = 0; i < result[0][0].length; i++) {
                ctx.strokeStyle = ViewState.colorlist[i % this.system.fields.length % ViewState.colorlist.length]
                ctx.beginPath()
                for (let j = 0; j < result.length; j++) {
                    let y = result[j][1][i]
                    let z = result[j][2][i]
                    if (j == 0) ctx.moveTo(z, y)
                    else ctx.lineTo(z, y)
                }
                ctx.stroke()
            }

        }, 50)
    },
    watch: {
        system: {
            handler() {
                this.update()
            },
            deep: true
        },
        ViewState: {
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
    width: 500px;

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