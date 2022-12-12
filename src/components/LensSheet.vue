<template>
    <div class="ui_sheet ui_block">
        <div class="ui_block-header">
            <p>Lens Data</p>
        </div>
        <div class="ui_block-body">

            <SheetUI :list="system.surfaces"
                :builder="buildSurface">
                <template #item="[surface, i]">
                    <OpticSurfaceComponent
                        :surface="surface" :key="i">
                    </OpticSurfaceComponent>
                </template>
            </SheetUI>

            <div class="content">
                <p>t=thickness, c=curvature (1/R), n=index
                    of
                    refraction</p>
            </div>
        </div>
    </div>
</template>

<script>
import OpticSurface from '@/optic/OpticSurface'
import OpticSystem from '@/optic/OpticSystem'
import SheetUI from './common/SheetUI.vue'
import OpticSurfaceComponent from './OpticSurfaceComponent.vue'
import ViewState from './ViewControl'

export default {
    props: {
        system: OpticSystem
    },
    components: {
        OpticSurfaceComponent,
        SheetUI
    },
    methods: {
        buildSurface(i) {
            return new OpticSurface()
        },
        hover(surface) {
            ViewState.focusedSurface = surface
        }
    }
}


</script>
<style lang="scss" scoped>

</style>