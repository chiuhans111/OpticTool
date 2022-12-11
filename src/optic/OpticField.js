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
    raypos(fx, fy, system) {
        const R = system.pupilDiameter.value
        const PZ = system.principlePlaneZ.value
        const a = this.angle.value

        const z = -1
        const x = fx * R
        const y = fy * R + (PZ - z) * Math.sin(a / 180 * Math.PI)
        return [x, y, z]
    }

    raydir(fx, fy) {
        return [0, -Math.sin(this.angle.value / 180 * Math.PI), Math.cos(this.angle.value / 180 * Math.PI)]
    }
}

export default OpticField