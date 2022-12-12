import OpticMaterial from "./material/OpticMaterial"
import OpticField from "./OpticField"
import OpticSurface from "./OpticSurface"
import OpticVar from "./OpticVar"

class OpticSystem {
    surfaces = [
        new OpticSurface(3, 0.066667, new OpticMaterial(1.515)),
        new OpticSurface(4, -0.01316, new OpticMaterial(1)),
        new OpticSurface(1.5, -0.05882, new OpticMaterial(1.6438)),
        new OpticSurface(2.5, 0.0625, new OpticMaterial(1)),
        new OpticSurface(3, 0.022727, new OpticMaterial(1.515)),
        new OpticSurface(40, -0.07143, new OpticMaterial(1)),
        new OpticSurface(0, 0, new OpticMaterial(1))
    ]

    fields = [
        new OpticField(0),
        new OpticField(10),
        new OpticField(20),
    ]

    pupilDiameter = new OpticVar(10)
    pupilOffset = new OpticVar(10)

    update = 0

    _SP = ["surfaces", "fields", "pupilDiameter", "pupilOffset"]
}


export default OpticSystem