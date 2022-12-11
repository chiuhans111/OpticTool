<template>
    <div class="ui_sheet ui_block">
        <div class="ui_block-header">
            <p>Lens Data</p>
        </div>
        <div class="ui_block-body">

            <div class="ui_sheet-row"
                v-for="surface, i in system.surfaces"
                :key="i" @mousedown="hover(surface)">
                <div class="row">
                    <div class="ui_sheet-row-ui">
                        <button
                            @click="system.surfaces.splice(i, 1)">Del</button>
                        <button
                            @click="addSurface(i)">Add</button>
                    </div>
                    <OpticSurfaceComponent
                        :surface="surface">
                    </OpticSurfaceComponent>
                </div>
            </div>
            <div class="ui_sheet-row">
                <div class="row">
                    <div class="ui_sheet-row-ui">
                        <button
                            @click="addSurface(system.surfaces.length)">Add</button>
                    </div>
                </div>
            </div>

            <p>t=thickness, c=curvature (1/R), n=index of
                refraction</p>
        </div>
    </div>
</template>

<script>
import OpticSurface from '@/optic/OpticSurface'
import OpticSystem from '@/optic/OpticSystem'
import OpticSurfaceComponent from './OpticSurfaceComponent.vue'
import ViewState from './ViewControl'

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
        },
        hover(surface) {
            ViewState.focusedSurface = surface
        }
    }
}


</script>
<style lang="scss" scoped>

</style>