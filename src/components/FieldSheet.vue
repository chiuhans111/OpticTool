<template>
    <div class="ui_sheet ui_block">
        <div class="ui_block-header">
            <p>Field Data</p>
        </div>
        <div class="ui_block-body">
            <div class="content">
                <label for="diameter">D=</label>
                <OpticVarInput id="diameter" :step="0.01"
                    :variable="system.pupilDiameter" />

                <label for="Z">Z=</label>
                <OpticVarInput id="Z" :step="0.01"
                    :variable="system.pupilOffset" />
            </div>
            <SheetUI :list="system.fields"
                :builder="buildField">
                <template #item="[field, i]">
                    <OpticFieldComponent :field="field"
                        :key="i">
                    </OpticFieldComponent>
                </template>
            </SheetUI>

            <div class="content">
                <p>D=Entrance Diameter, Z=Distance to the
                    pupil</p>
            </div>
        </div>
    </div>
</template>

<script>
import OpticField from '@/optic/OpticField'
import OpticSystem from '@/optic/OpticSystem'
import OpticFieldComponent from './OpticFieldComponent.vue'
import OpticVarInput from './common/OpticVarInput.vue'
import SheetUI from './common/SheetUI.vue'
export default {
    props: {
        system: OpticSystem
    },
    components: {
        OpticFieldComponent,
        OpticVarInput,
        SheetUI
    },
    methods: {
        buildField(i) {
            return new OpticField()
        }
    }
}


</script>
<style lang="scss" scoped>

</style>