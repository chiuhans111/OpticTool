import OpticSystem from "../OpticSystem"
import * as tf from "@tensorflow/tfjs"
import RayTrace from "./RayTrace"

/**
 * 
 * @param {OpticSystem} system 
 * @returns 
 */
function SpotTrace(system) {
    let raypos = []
    let raydir = []
    let N = 5

    // Go through every field and create rays
    for (let i = 0; i <= N; i++) {


        let f = i / N

        let N2 = f * 16 + 1
        for (let j = 0; j < N2; j++) {

            let f2 = j / N2

            let fx = f * Math.cos(f2 * Math.PI * 2)
            let fy = f * Math.sin(f2 * Math.PI * 2)

            for (let field of system.fields) {
                raypos.push(field.raypos(fx, fy, system))
                raydir.push(field.raydir(fx, fy, system))
            }
        }
    }

    raypos = tf.tensor(raypos).transpose()
    raydir = tf.tensor(raydir).transpose()

    let result = RayTrace(system, raypos, raydir)
    let spot = result[result.length - 1]

    return spot
}

export default SpotTrace