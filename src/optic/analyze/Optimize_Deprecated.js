import OpticSystem from "../OpticSystem"
import * as tf from "@tensorflow/tfjs"
import Merit from "./Merit"
import { toRaw } from "vue"

/**
 * 
 * @param {OpticSystem} system 
 * @returns 
 */
function Optimize(system) {


    let variables = []

    for (let surface of system.surfaces) {
        variables.push(surface.shape.curvature)
        variables.push(surface.thickness)
    }

    variables = variables.filter(x => x.optimize)
    let rawVariables = variables.map(toRaw)

    console.log(variables)

    let gradientFunctions = []

    for (let variable of rawVariables) {
        gradientFunctions.push(tf.grad(function f(tensor) {
            let original = variable.value
            variable.value = tensor
            let result = Merit(system)
            variable.value = original
            return result
        }))
    }


    let step = Merit(system).arraySync()*0.5

    for (let iteration = 0; iteration < 10; iteration++) {
        let gradients = []

        for (let i = 0; i < variables.length; i++) {
            let gradient = 0
            try {
                gradient = gradientFunctions[i](tf.tensor([rawVariables[i].value])).arraySync()
            } catch (e) {
                console.log('gradient error', e)
            }

            if (isNaN(gradient)) {
                console.log('gradient NAN', variables)
                gradient = 0
            }

            gradients.push(gradient)
        }


        const magnitude = gradients.map(x => x * x).reduce((a, b) => a + b) + 1
        gradients = gradients.map(x => x / magnitude)

        console.log(gradients)

        for (let i = 0; i < variables.length; i++) {
            variables[i].value -= gradients[i] * step
        }
        step *= 0.6

    }
}

export default Optimize