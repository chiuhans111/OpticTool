import OpticSystem from "./OpticSystem"
import * as tf from "@tensorflow/tfjs"




/**
 * @param system {OpticSystem} 
 * @param raypos {tf.Tensor}
 * @param raydir {tf.Tensor}
*/
function RayTrace(system) {
    tf.engine().startScope()
    let raypos = []
    let raydir = []
    let N = 11

    const R = 20

    for (let i = 0; i < N; i++) {
        let f = (i / N - 0.5) * R
        raypos.push([0, f * 1, -1])
        raydir.push([0, 0, 1])

        raypos.push([0, f * 1 + 10, -1])
        raydir.push([0, -0.5, 1])
    }

    raypos = tf.tensor(raypos).transpose()
    raydir = tf.tensor(raydir).transpose()

    let result = []
    result.push(raypos.arraySync())
    let surface = system.surfaces[0]

    let n1 = 1
    let z = 0
    for (let surface of system.surfaces) {
        let n2 = surface.material.index


        raypos = surface.trace(raypos.sub(tf.tensor([[0], [0], [z]])), raydir)
        let normal = surface.normal(raypos)


        raydir = raydir.div(raydir.mul(raydir).sum(0).sqrt()).mul(n1)
        normal = normal.mul(raydir.mul(normal).sum(0).sign())
        let tangent2 = tf.sub(1, raydir.mul(normal).sum(0))
        let displace = tf.sub(n2 ** 2, tangent2).sqrt().sub(tf.sub(n1 ** 2, tangent2).sqrt())
        raydir = raydir.add(normal.mul(displace))


        raypos = raypos.add(tf.tensor([[0], [0], [z]]))
        result.push(raypos.arraySync())
        n1 = n2
        z += surface.thickness
    }
    tf.engine().endScope()


    // result.push(raypos.add(raydir).arraySync())
    return result
}


export default RayTrace