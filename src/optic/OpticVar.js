import serializer from "../scripts/Serializer"

@serializer.serializable(
    "v", {
    value: "v",
    optimize: "o"
})

class OpticVar {
    value = 0
    optimize = false
    constructor(value) {
        this.value = value || 0
    }

    num() {
        const value = Number(this.value)
        return isNaN(value) ? 0 : value
    }
}

export default OpticVar