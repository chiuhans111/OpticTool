<template>
    <div>
        <label for="thickness">t=</label>
        <OpticVarInput id="thickness" :step="0.01"
            :variable="surface.thickness" />
        <span>, </span>
        <label for="curvature">c=</label>
        <OpticVarInput id="curvature" type="number"
            :step="0.0001"
            :variable="surface.shape.curvature" />
        <span>, </span>
        <label for="material">n=</label>
        <input id="material" type="number" step="0.01"
            min="1" max="99"
            v-model.number="surface.material.index">

        <span> (R={{ (1 /
                surface.shape.curvature.value).toFixed(2)
        }})
        </span>

    </div>
</template>

<script>
import OpticSurface from '@/optic/OpticSurface'
import OpticVarInput from './OpticVarInput.vue'

export default {
    props: {
        surface: OpticSurface
    },
    components: {
        OpticVarInput
    },
    data() {
        return {
        }
    },
}
</script>

<style>
input {
    width: 60px;
    height: 20px;
    margin: 0px 3px;
}
</style>