<template>
    <div>
        <label for="thickness">t=</label>
        <input id="thickness" type="number" step="0.05"
            v-model.number="surface.thickness">
        <span>, </span>
        <label for="curvature">c=</label>
        <input id="thickness" type="number" step="0.002"
            v-model.number="surface.curvature">
        <span>, </span>
        <label for="material">n=</label>
        <input id="material" type="number" step="0.01"
            min="1" max="99"
            v-model.number="surface.material.index">
    </div>
</template>

<script>
import OpticSurface from '@/optic/OpticSurface'

export default {
    props: {
        surface: OpticSurface
    },
    data() {
        return {
            thickness: 0
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