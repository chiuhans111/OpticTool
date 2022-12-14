import serializer from "../../scripts/Serializer"

@serializer.serializable(
    "n", {
    index: "n",
})
class OpticMaterial {
    index = 1
    constructor(index) {
        this.index = index || this.index
    }
}

export default OpticMaterial