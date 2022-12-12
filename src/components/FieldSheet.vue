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
            <div class="ui_sheet-row"
                v-for="field, i in system.fields" :key="i">
                <div class="row">
                    <div class="ui_sheet-row-ui">
                        <button
                            @click="system.fields.splice(i, 1)">Del</button>
                        <button
                            @click="addField(i)">Add</button>
                    </div>
                    <OpticFieldComponent :field="field">
                    </OpticFieldComponent>
                </div>
            </div>
            <div class="ui_sheet-row">
                <div class="row">
                    <div class="ui_sheet-row-ui">
                        <button
                            @click="addField(system.fields.length)">Add</button>
                    </div>
                </div>
            </div>
            <div class="content">
                <p>D=Entrance Diameter, Z=Distance to the pupil</p>
            </div>
        </div>
    </div>
</template>

<script>
import OpticField from '@/optic/OpticField'
import OpticSystem from '@/optic/OpticSystem'
import OpticFieldComponent from './OpticFieldComponent.vue'
import OpticVarInput from './common/OpticVarInput.vue'
export default {
    props: {
        system: OpticSystem
    },
    components: {
        OpticFieldComponent,
        OpticVarInput
    },
    methods: {
        addField(i) {
            this.system.fields.splice(i, 0, new OpticField())
        }
    }
}


</script>
<style lang="scss" scoped>

</style>