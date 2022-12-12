<template>
    <div>
        <label for="angle">angle=</label>
        <OpticVarInput id="angle" :step="0.02"
            :variable="field.angle" />
    </div>
</template>

<script>
import OpticField from '@/optic/OpticField'
import OpticVarInput from './common/OpticVarInput.vue'

export default {
    props: {
        field: OpticField
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

</style>