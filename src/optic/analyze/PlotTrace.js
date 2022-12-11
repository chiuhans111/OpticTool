import OpticSystem from "../OpticSystem"
import * as tf from "@tensorflow/tfjs"
import RayTrace from "./RayTrace"

/**
 * 
 * @param {OpticSystem} system 
 * @returns 
 */
async function PlotTrace(system) {
    let raypos = []
    let raydir = []
    let N = 7

    // Go through every field and create rays
    for (let i = 0; i <= N; i++) {
        for (let field of system.fields) {
            let f = (i / N - 0.5)
            raypos.push(field.raypos(0, f, system))
            raydir.push(field.raydir(0, f, system))
        }
    }

    raypos = tf.tensor(raypos).transpose()
    raydir = tf.tensor(raydir).transpose()

    return Promise.all(RayTrace(system, raypos, raydir))
}

export default PlotTrace