<template>
    <div class="ui_sheet ui_block">
        <p>Lens Data</p>
        <div class="ui_sheet-row"
            v-for="surface, i in system.surfaces" :key="i">
            <div class="row">
                <div class="ui_sheet-row-ui">
                    <button
                        @click="system.surfaces.splice(i, 1)">-</button>
                    <button
                        @click="addSurface(i)">+</button>
                </div>
                <OpticSurfaceComponent :surface="surface"></OpticSurfaceComponent>
            </div>
        </div>
        <div class="ui_sheet-row">
            <div class="row">
                <div class="ui_sheet-row-ui">
                    <button
                        @click="addSurface(system.surfaces.length)">+</button>
                </div>
            </div>
        </div>

        <p>t=thickness, c=curvature (1/R), n=index of
            refraction</p>
    </div>
</template>

<script>
import OpticSurface from '@/optic/OpticSurface'
import OpticSystem from '@/optic/OpticSystem'
import OpticSurfaceComponent from './OpticSurfaceComponent.vue'

export default {
    props: {
        system: OpticSystem
    },
    components: {
        OpticSurfaceComponent
    },
    methods: {
        addSurface(i) {
            this.system.surfaces.splice(i, 0, new OpticSurface())
        }
    }
}


</script>
<style lang="scss" scoped>
</style>