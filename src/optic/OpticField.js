import OpticSystem from "./OpticSystem"
import OpticVar from "./OpticVar"
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
    raypos(f, system) {
        const z = -1
        const y = f * system.pupilDiameter.value +
            (system.principlePlaneZ.value - z) * Math.sin(this.angle.value / 180 * Math.PI)
        return [0, y, z]
    }

    raydir(f) {
        return [0, -Math.sin(this.angle.value / 180 * Math.PI), Math.cos(this.angle.value / 180 * Math.PI)]
    }
}

export default OpticField