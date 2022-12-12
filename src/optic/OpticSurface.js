import OpticMaterial from "./material/OpticMaterial"
import OpticVar from "./OpticVar"
import OpticShapeSpherical from "./shapes/OpticShapeSpherical"
import serializer from "../scripts/Serializer"

@serializer.serializable(
    "s", {
    thickness: "t",
    shape: "s",
    material: "n",
})
class OpticSurface {
    thickness = new OpticVar(0)
    shape = new OpticShapeSpherical(0)
    material = new OpticMaterial(1.5)

    constructor(thickness, curvature, material) {
        this.thickness.value = thickness || this.thickness.value
        this.shape.curvature.value = curvature || this.shape.curvature.value
        this.material = material || this.material
    }
}


export default OpticSurface