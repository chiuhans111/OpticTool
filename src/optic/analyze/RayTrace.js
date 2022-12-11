import OpticSystem from "../OpticSystem"
import * as tf from "@tensorflow/tfjs"


/**
 * @param {OpticSystem} system 
 * @param {tf.Tensor} raypos
 * @param {tf.Tensor} raydir 
*/
function RayTrace(system, raypos, raydir) {
    tf.engine().startScope()
    
    let result = []
    result.push(raypos.array())

    let n1 = 1
    let z = 0
    for (let surface of system.surfaces) {
        let n2 = surface.material.index


        raypos = surface.shape.trace(raypos.sub(tf.tensor([[0], [0], [z]])), raydir)
        let normal = surface.shape.normal(raypos)


        raydir = raydir.div(raydir.mul(raydir).sum(0).sqrt()).mul(n1)
        normal = normal.mul(raydir.mul(normal).sum(0).sign())
        let tangent2 = tf.sub(1, raydir.mul(normal).sum(0))
        let displace = tf.sub(n2 ** 2, tangent2).sqrt().sub(tf.sub(n1 ** 2, tangent2).sqrt())
        raydir = raydir.add(normal.mul(displace))


        raypos = raypos.add(tf.tensor([[0], [0], [z]]))
        result.push(raypos.array())
        n1 = n2

        z += surface.thickness.value
    }
    tf.engine().endScope()


    // result.push(raypos.add(raydir).arraySync())
    return result
}


export default RayTrace