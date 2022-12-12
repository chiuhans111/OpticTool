import OpticSurface from "./OpticSurface"
import OpticSystem from "./OpticSystem"
import OpticVar from "./OpticVar"
import OpticField from "./OpticField"
import OpticShapeSpherical from "./shapes/OpticShapeSpherical"
import OpticMaterial from "./material/OpticMaterial"

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
        return JSON.stringify(this._serialize(object))
    }

    _serialize(object) {
        if (object._SP) {
            let obj = { _class: object.constructor.name }
            for (let i of object._SP) {
                obj[i] = this._serialize(object[i])
            }
            return obj
        } else if (object instanceof Array) {
            return object.map(x => this._serialize(x))
        } else if (object instanceof Object) {
            let obj = {}
            for (let i in object) {
                obj[i] = this._serialize(object[i])
            }
            return obj
        } return object
    }

    deserialize(str, obj) {
        return this._deserialize(JSON.parse(str), obj)
    }

    _deserialize(object) {
        if (object._class) {
            let classdef = this.classes[object._class]
            if (classdef) {
                let obj = new classdef()
                for (let i of obj._SP) {
                    obj[i] = this._deserialize(object[i])
                }
                return obj
            } else {
                console.error("no class define:", object._class)
            }
        } else if (object instanceof Array) {
            return object.map(x => this._deserialize(x))
        } else if (object instanceof Object) {
            let obj = {}
            for (let i in object) {
                obj[i] = this._deserialize(object[i])
            }
            return obj
        } return object
    }
}


const serializer = new Serializer([
    OpticSystem, OpticSurface,
    OpticVar, OpticField,
    OpticShapeSpherical,
    OpticMaterial
])


export default serializer
