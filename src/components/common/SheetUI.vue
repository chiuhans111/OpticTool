<template>
    <div class="ui_sheet">
        <transition-group name="list" tag="div"
            class="ui_sheet-group">
            <div class="ui_sheet-row list-item"
                v-for="item, i in list" :key="getid(item)">
                <div class="row">
                    <div class="ui_sheet-row-ui">
                        <button class="ui_sheet-btn"
                            @click="delItem(i)">Del</button>
                        <button class="ui_sheet-btn"
                            @click="addItem(i)">Add</button>
                    </div>
                    <slot name="item" v-bind="[item, i]">

                    </slot>
                </div>
            </div>
        </transition-group>

        <div class="ui_sheet-row">
            <div class="row">
                <button
                    @click="addItem(list.length)">Add</button>
            </div>
        </div>
    </div>
</template>

<script>
import { toRaw } from 'vue'


export default {
    props: {
        list: Array,
        builder: Function
    },
    methods: {
        addItem(i) {
            this.list.splice(i, 0, this.builder(i))
        },
        delItem(i) {
            this.list.splice(i, 1)
        },
        getid(item) {
            item = toRaw(item)
            if (item._id_ === undefined) {
                let i = 0
                while (this.list.some(x => x._id_ == i)) i++
                item._id_ = i
            }
            return item._id_
        }
    }
}

</script>
<style lang="scss" scoped>

</style>