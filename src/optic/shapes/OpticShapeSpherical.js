import * as tf from "@tensorflow/tfjs"
import { toRaw } from "vue"
import OpticVar from "../OpticVar"

function ensurevalue(v) {
    if (v instanceof tf.Tensor) {
        return v.arraySync()[0]
    }
    else return v
}

class OpticShapeSpherical {
    curvature = new OpticVar(0)

    _SP = ["curvature"]

    constructor(curvature) {
        this.curvature.value = curvature
    }

    /** Find intersection position
    * @param {tf.Tensor} raypos position of the ray, shape = [3(x,y,z), N]
    * @param {tf.Tensor} raydir direction of the ray, shape = [3(x,y,z), N]
    * @returns {tf.Tensor} intersection position
    */
    trace(raypos, raydir) {
        const c = toRaw(this.curvature.value)
        return tf.tidy(() => {
            let l = raypos.gather(2).div(raydir.gather(2)).mul(-1)

            if (ensurevalue(c) != 0) {

                const A = raydir.mul(raydir).sum(0).mul(c)
                const B = raypos.mul(raydir).sum(0).mul(c).sub(raydir.gather(2)).mul(2)
                const C = raypos.mul(raypos).sum(0).mul(c).sub(raypos.gather(2).mul(2))
                l = B.mul(-1).sub(B.mul(B).sub(A.mul(C).mul(4)).sqrt()).div(A).div(2)
                A.dispose()
                B.dispose()
                C.dispose()
            }

            return raypos.add(raydir.mul(l))
        })
    }

    /** Find the normal vector
    * @param {tf.Tensor} raypos position of the ray, shape = [3(x,y,z), N]
    * @returns {tf.Tensor} normal vector at given position
    */
    normal(raypos) {
        const c = toRaw(this.curvature.value)

        return tf.tidy(() => {
            let p = raypos.mul(0).add(tf.tensor([[0], [0], [-1]]))
            if (ensurevalue(c) != 0) {
                let n = raypos.sub(tf.tensor([[0], [0], [1]]).div(c))
                p = n.div(n.mul(n).sum(0).sqrt())
            }

            return p
        })
    }


    surface(r) {
        const r2 = r ** 2
        return r2 * this.curvature.value / (1 + Math.sqrt(1 - r2 * this.curvature.value ** 2))
    }
}

export default OpticShapeSpherical