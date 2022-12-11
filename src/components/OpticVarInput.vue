<template>
    <div class="optic_var_input" :class="{
        'optic_var_input-editmode': editmode
    }">
        <input ref="input" type="number"
            v-model="variable.value" :step="step">
    </div>
</template>

<script>
import OpticVar from '@/optic/OpticVar'

export default {
    props: {
        variable: OpticVar,
        step: Number
    },
    data() {
        return {
            editmode: false,
            tweakmode: false,
            tweaked: false,
        }
    },
    methods: {
        mousedown(event) {
            if (!this.editmode) {
                event.preventDefault()
                this.tweakmode = true
                this.tweaked = false
            }
        },
        mouseup(event) {
            if (this.tweakmode && !this.tweaked) {
                this.editmode = true
                this.tweakmode = false
                this.$refs.input.focus()
            }
            this.tweakmode = false
        },
        mousemove(event) {
            if (this.tweakmode) {
                this.tweaked = true
                this.variable.value += event.movementX * this.step
            }
        },
        reset() {
            this.editmode = false
            this.tweakmode = false

        }
    },
    mounted() {
        this.$refs.input.addEventListener("mousedown", this.mousedown)
        addEventListener("mouseup", this.mouseup)
        addEventListener("mousemove", this.mousemove)
        this.$refs.input.addEventListener("blur", this.reset)
    },
    beforeUnmount() {
        this.$refs.input.removeEventListener("mousedown", this.mousedown)
        removeEventListener("mouseup", this.mouseup)
        removeEventListener("mousemove", this.mousemove)
        this.$refs.input.removeEventListener("blur", this.reset)

    },

}

</script>

<style scoped lang="scss">
.optic_var_input {
    display: inline-block;

    input {
        cursor: ew-resize;
        border: solid 1px #EEE;
    }

    &-editmode {
        input {
            cursor: text;
            background: white;
        }
    }

}
</style>