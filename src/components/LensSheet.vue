<template>
    <div>
        <p>Lens Data</p>
        <div class="lens-sheet_row"
            v-for="surface, i in system.surfaces" :key="i">
            <component :is="surface.component"
                :surface="surface">
            </component>
            <div class="lens-sheet_row-end">
                <button @click="addSurface(i)"
                    class="btn_add">Add</button>
                <button
                    @click="system.surfaces.splice(i, 1)">Del</button>

            </div>
        </div>
        <button
            @click="addSurface(system.surfaces.length)">Add</button>
        <p>t=thickness, c=curvature (1/R), n=index of
            refraction</p>
    </div>
</template>

<script>
import OpticSurface from '@/optic/OpticSurface'
import OpticSystem from '@/optic/OpticSystem'
import OpticSurfaceComponent from './surface/OpticSurfaceComponent.vue'
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
.lens-sheet_row {
    position: relative;
    margin: 5px;
    width: fit-content;

    &-end {
        display: flex;
        position: absolute;
        left: 100%;
        top: 0;
    }
}

.btn_add {
    position: relative;
    top: -10px;
}
</style>