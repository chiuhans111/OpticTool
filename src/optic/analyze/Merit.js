import OpticSystem from "../OpticSystem"
import * as tf from "@tensorflow/tfjs"
import RayTrace from "./RayTrace"


/**
 * 
 * @param {OpticSystem} system 
 * @returns 
 */
function Merit(system) {
    return tf.tidy(() => {

        let merit = tf.tensor([0])

        for (let field of system.fields) {
            merit = tf.tidy(() => {
                const raypos1 = []
                const raydir1 = []
                const N = 3

                // Go through every field and create rays
                for (let i = 0; i <= N; i++) {
                    const f = i / N
                    const N2 = 3 * f + 1

                    for (let j = 0; j <= N2; j++) {
                        const f2 = j / N2 - 0.5
                        const fx = f * Math.cos(f2 * Math.PI)
                        const fy = f * Math.sin(f2 * Math.PI)
                        raypos1.push(field.raypos(fx, fy, system))
                        raydir1.push(field.raydir(fx, fy, system))
                    }
                }

                const raypos = tf.tensor(raypos1).transpose()
                const raydir = tf.tensor(raydir1).transpose()

                const result = RayTrace(system, raypos, raydir)
                const spot = result[result.length - 1]

                const delta = spot.sub(spot.gather(0, 1).expandDims(1))

                const error = delta.mul(delta)
                const mask = error.isNaN().logicalNot()
                const maxerror = error.where(mask, 0).max().add(1e5)
                return merit.add(error.where(mask, maxerror).sum())
            })
        }

        return merit
    })
}

export default Merit