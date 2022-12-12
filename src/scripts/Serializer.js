import { compress, decompress } from "./compress"

class Serializer {
    classdefs = {}
    classnames = {}

    serializable(classname, param2v) {
        const serializer = this
        return function decorator(Class) {
            if (classname in serializer.classdefs) console.error("duplicated classname", classname)
            if (Class.name in serializer.classnames) console.error("duplicated class", Class.name)
            const v2param = {}
            for (let i in param2v) v2param[param2v[i]] = i
            serializer.classdefs[classname] = {
                Class, param2v, v2param
            }
            serializer.classnames[Class.name] = classname
            return Class
        }
    }

    serialize(object) {
        return compress(JSON.stringify(this._serialize(object)))
    }

    _serialize(object) {
        if (object instanceof Array) {
            return object.map(x => this._serialize(x))
        } else if (object instanceof Object) {
            const obj = {}
            if (object.constructor.name in this.classnames) {
                obj._ = this.classnames[object.constructor.name]
                const p2v = this.classdefs[obj._].param2v
                for (let i in p2v) obj[p2v[i]] = this._serialize(object[i])
            } else {
                for (let i in object) obj[i] = this._serialize(object[i])
            }
            return obj
        }
        return object
    }

    deserialize(str, obj) {
        return this._deserialize(JSON.parse(decompress(str)), obj)
    }

    _deserialize(object) {
        if (object instanceof Array) {
            return object.map(x => this._deserialize(x))
        } else if (object instanceof Object) {
            if (object._ && object._ in this.classdefs) {
                const classdef = this.classdefs[object._]
                const obj = new classdef.Class()
                const v2p = classdef.v2param
                for (let i in v2p) obj[v2p[i]] = this._deserialize(object[i])
                return obj
            } else {
                const obj = {}
                for (let i in object) obj[i] = this._deserialize(object[i])
                return obj
            }
        } return object
    }
}

const serializer = new Serializer()

export default serializer
