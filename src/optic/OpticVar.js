class OpticVar {
    value = 0
    optimize = false
    constructor(value) {
        this.value = value || 0
    }

    _SP = ["value", "optimize"]
}

export default OpticVar