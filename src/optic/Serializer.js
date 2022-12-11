import OpticSystem from "./OpticSystem"

class Serializer {
    classes = {}
    /**
     * 
     * @param {Array} classes 
     */
    constructor(classes) {
        for (let classdef of classes) {
            this.classes[classdef.name] = classdef
        }
    }

    serialize(object) {
        this._serialize(object)

        for (let i in object) {
            console.log(i)
            // this.serialize(object[i])
        }
    }

    _serialize(object) {
        console.log("type:", typeof object)
        console.log("class:", object.constructor.name)
    }
}


const serializer = new Serializer([
    OpticSystem
])


export default serializer
