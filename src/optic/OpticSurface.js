import OpticMaterial from "./material/OpticMaterial"
import OpticVar from "./OpticVar"
import OpticShapeSpherical from "./shapes/OpticShapeSpherical"

class OpticSurface {
    thickness = new OpticVar(0)
    shape = new OpticShapeSpherical(0)
    material = new OpticMaterial(1.5)
    _SP = ["thickness", "shape", "material"]


    constructor(thickness, curvature, material) {
        this.thickness.value = thickness || this.thickness.value
        this.shape.curvature.value = curvature || this.shape.curvature.value
        this.material = material || this.material
    }

}


export default OpticSurface