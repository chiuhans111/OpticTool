import OpticSystem from "./OpticSystem"
import OpticVar from "./OpticVar"
import serializer from "../scripts/Serializer"

@serializer.serializable(
    "f", {
    angle: "a",
})
class OpticField {
    angle = new OpticVar(0)

    constructor(angle) {
        this.angle.value = angle || this.angle.value
    }

    /**
     * 
     * @param {Number} f 
     * @param {OpticSystem} system 
     * @returns 
     */
    raypos(fx, fy, system) {
        const R = system.pupilDiameter.num() / 2
        const PZ = system.pupilOffset.num()
        const a = this.angle.num()

        const z = -1
        const x = fx * R
        const y = fy * R + (PZ - z) * Math.sin(a / 180 * Math.PI)
        return [x, y, z]
    }

    raydir(fx, fy) {
        return [0, -Math.sin(this.angle.num() / 180 * Math.PI), Math.cos(this.angle.num() / 180 * Math.PI)]
    }
}

export default OpticField