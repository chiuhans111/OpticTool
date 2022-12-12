import OpticSystem from "../OpticSystem"
import * as tf from "@tensorflow/tfjs"
import { toRaw } from "vue"


/**
 * @param {OpticSystem} system 
 * @param {tf.Tensor} raypos
 * @param {tf.Tensor} raydir 
*/
function RayTrace(system, raypos, raydir) {
    return tf.tidy(() => {

        let result = []
        result.push(raypos)

        let n1 = 1
        let z = tf.tensor(0)
        for (let surface of system.surfaces) {
            let n2 = Number(surface.material.index) || 1


            raypos = surface.shape.trace(raypos.sub(tf.tensor([[0], [0], [1]]).mul(z)), raydir)
            let normal = surface.shape.normal(raypos)


            raydir = raydir.div(raydir.mul(raydir).sum(0).sqrt()).mul(n1)
            normal = normal.mul(raydir.mul(normal).sum(0).sign())
            let cos = raydir.mul(normal).sum(0)
            let tangent2 = tf.sub(n1 ** 2, cos.mul(cos))
            let displace = tf.sub(n2 ** 2, tangent2).sqrt().sub(tf.sub(n1 ** 2, tangent2).sqrt())
            raydir = raydir.add(normal.mul(displace))


            raypos = raypos.add(tf.tensor([[0], [0], [1]]).mul(z))
            result.push(raypos)
            n1 = n2

            z = z.add(toRaw(surface.thickness.num()))
        }


        // result.push(raypos.add(raydir).arraySync())

        return result
    })
}


export default RayTrace