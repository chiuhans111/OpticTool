import OpticSystem from "../OpticSystem"
import * as tf from "@tensorflow/tfjs"
import Merit from "./Merit"
import { toRaw } from "vue"

/**
 * 
 * @param {OpticSystem} system 
 * @returns 
 */
async function Optimize(system) {


    let variables = []
    variables.push(system.pupilOffset)
    for (let surface of system.surfaces) {
        variables.push(surface.shape.curvature)
        variables.push(surface.thickness)
    }

    variables = variables.filter(x => x.optimize)

    let rawVariables = variables.map(toRaw)
    let x0 = rawVariables.map(x => x.num())


    async function evaluate(x) {
        rawVariables.map((variable, i) => {
            variable.value = x[i]
        })
        return (await Merit(system).array())[0]
    }

    async function evaluateAll(seeds, scores) {
        for (let i = 0; i < seeds.length; i++) {
            scores[i] = await evaluate(seeds[i])
        }
    }

    const seeds = [x0]

    seeds.push(x0.map(x => x + (Math.random() - 0.5) * 1))
    seeds.push(x0.map(x => x + (Math.random() - 0.5) * 0.01))
    seeds.push(x0.map(x => x + (Math.random() - 0.5) * (Math.abs(x) + 0.01) * 0.5))
    seeds.push(x0.map(x => x + (Math.random() - 0.5) * (Math.abs(x) + 0.01) * 0.5))
    seeds.push(x0.map(x => x + (Math.random() - 0.5) * (Math.abs(x) + 0.1) * 0.1))
    seeds.push(x0.map(x => x + (Math.random() - 0.5) * (Math.abs(x) + 0.1) * 0.1))

    const N = seeds.length


    const scores = []
    const newScores = []
    const newSeeds = []
    await evaluateAll(seeds, scores)

    let bestScore = scores[0]
    let bestSeed = seeds[0]


    async function iterate(F = 0.9) {
        for (let i = 0; i < N; i++) {
            const a = Math.floor(Math.random() * N)
            const b = Math.floor(Math.random() * N)
            const c = Math.floor(Math.random() * N)
            const z = Math.floor(Math.random() * N)

            const A = seeds[a]
            const B = seeds[b]
            const C = seeds[c]

            newSeeds[i] = seeds[i].map((x, j) => {
                if (j !== z && Math.random() < 0.3) return x
                return A[j] + (B[j] - C[j]) * F
            })
        }

        await evaluateAll(newSeeds, newScores)

        for (let i = 0; i < N; i++) {
            if (!isNaN(newScores[i]) && newScores[i] < scores[i]) {
                scores[i] = newScores[i]
                seeds[i] = newSeeds[i]

                if (isNaN(bestScore) || scores[i] < bestScore) {
                    bestScore = scores[i]
                    bestSeed = seeds[i]
                }
            }
        }

        return bestScore
    }

    function apply() {
        rawVariables.map((x, i) => {
            x.value = null
        })
        variables.map((x, i) => {
            x.value = bestSeed[i]
        })
    }

    return [iterate.bind(this), apply.bind(this)]
}

export default Optimize