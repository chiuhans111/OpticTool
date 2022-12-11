import OpticMaterial from "./material/OpticMaterial"
import OpticField from "./OpticField"
import OpticSurface from "./OpticSurface"
import OpticVar from "./OpticVar"

class OpticSystem {
    surfaces = [
        new OpticSurface(6.1, 0.04, new OpticMaterial(1.5108)),
        new OpticSurface(2.8, -0.01, new OpticMaterial(1)),
        new OpticSurface(1.3, -0.01, new OpticMaterial(1.6042)),
        new OpticSurface(5.9, 0.04, new OpticMaterial(1)),
        new OpticSurface(7.4, 0.02, new OpticMaterial(1.5108)),
        new OpticSurface(35, -0.04, new OpticMaterial(1)),
        new OpticSurface(0, 0, new OpticMaterial(1))
    ]

    fields = [
        new OpticField(0),
        new OpticField(10),
        new OpticField(20),
    ]

    pupilDiameter = new OpticVar(20)
    principlePlaneZ = new OpticVar(10)
}


export default OpticSystem