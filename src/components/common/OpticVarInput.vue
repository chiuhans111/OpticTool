<template>
    <div class="optic_var_input" :class="{
        'optic_var_input-editmode': editmode,
        'optic_var_input-optimize': variable.optimize
    }">
        <input class="draggable" ref="input" type="number"
            v-model="variable.value" :step="step">

        <div ref="menu" class="optic_var_input-menu"
            v-if="editmode" @mousedown="menuclick">
            <div class="ui_block">
                <div class="ui_block-body">
                    <div class="content">
                        <input type="checkbox"
                            name="optimize" id="optimize"
                            v-model="variable.optimize">
                        <label
                            for="optimize">Optimize</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import OpticVar from '@/optic/OpticVar'
import { throttle } from '@/scripts/throttle'

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
            tempValue: this.variable.value
        }
    },
    methods: {
        mousedown(event) {
            this.tempValue = this.variable.value
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
                this.tempValue += event.movementX * this.step
                this.updatevalue()
            }
        },
        reset(event) {
            this.editmode = false
            this.tweakmode = false
        },
        menuclick(event) {
            event.preventDefault()
        },
        updatevalue: throttle(10, function () {
            this.variable.value = this.tempValue
        })
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

    }

}

</script>

<style scoped lang="scss">
.optic_var_input {
    display: inline-block;
    position: relative;

    input.draggable {
        cursor: ew-resize;
    }

    &-editmode {
        input.draggable {
            cursor: text;
            background: #333;
        }
    }

    &-optimize {
        input.draggable {
            background-color: darkcyan;
        }
    }

    &-menu {
        z-index: 1;
        position: absolute;

        top: 100%;
        left: 0;

        width: max-content;
        height: fit-content;
        box-sizing: border-box;
    }

}
</style>