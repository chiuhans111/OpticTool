function asyncThrottle(time, fun) {
    let timeout = null
    let dirty = false
    let thisarg = null
    let args = []
    async function delayed() {
        dirty = true
        thisarg = this
        args = arguments

        if (timeout == null) {
            timeout = 0
            await fun.apply(thisarg, args)
            dirty = false

            timeout = setTimeout(function () {
                timeout = null
                if (dirty) delayed.apply(thisarg, args)
            }, time)
        }
    }
    return delayed
}

function throttle(time, fun) {
    let timeout = null
    let dirty = false
    let thisarg = null
    let args = []
    function delayed() {
        dirty = true
        thisarg = this
        args = arguments
        if (timeout == null) {
            fun.apply(thisarg, args)
            dirty = false

            timeout = setTimeout(function () {
                timeout = null
                if (dirty) delayed.apply(thisarg, args)
            }, time)
        }
    }
    return delayed
}

export { throttle, asyncThrottle }