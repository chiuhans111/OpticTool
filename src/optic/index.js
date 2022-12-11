import OpticSystem from "./OpticSystem"
import * as tf from "@tensorflow/tfjs"
tf.setBackend('cpu')
const system = new OpticSystem()

export default {
    system
}