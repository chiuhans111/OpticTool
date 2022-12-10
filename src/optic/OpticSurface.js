import OpticMaterial from "./OpticMaterial"
import * as tf from "@tensorflow/tfjs"

class OpticSurface {
    thickness = 0
    curvature = 0
    material = new OpticMaterial(1.5)

    component = "OpticSurfaceComponent"

    constructor(thickness, curvature, material) {
        this.thickness = thickness || this.thickness
        this.curvature = curvature || this.curvature
        this.material = material || this.material
    }

    /**
     * @param raypos {tf.Tensor}
     * @param raydir {tf.Tensor}
    */
    trace(raypos, raydir) {
        const c = this.curvature
        if (c == 0) {
            const l = raypos.gather(2).div(raydir.gather(2)).mul(-1)
            return raypos.add(raydir.mul(l))
        } else {
            const A = raydir.mul(raydir).sum(0).mul(c)
            const B = raypos.mul(raydir).sum(0).mul(c).sub(raydir.gather(2)).mul(2)
            const C = raypos.mul(raypos).sum(0).mul(c).sub(raypos.gather(2).mul(2))
            const l = B.mul(-1).sub(B.mul(B).sub(A.mul(C).mul(4)).sqrt()).div(A).div(2)
            return raypos.add(raydir.mul(l))
        }
    }

    normal(raypos) {
        const c = this.curvature
        if (c == 0) {
            return raypos.mul(0).add(tf.tensor([[0], [0], [-1]]))
        } else {
            let n = raypos.sub(tf.tensor([[0], [0], [1 / c]]))
            return n.div(n.mul(n).sum(0).sqrt())
        }
    }


    shape(r) {
        const r2 = r ** 2
        return r2 * this.curvature / (1 + Math.sqrt(1 - r2 * this.curvature ** 2))
    }
}


export default OpticSurface