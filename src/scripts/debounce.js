function debounce(time, fun) {

    let timeout = null
    let thisarg = null
    let args = []

    function delayed() {
        thisarg = this
        args = arguments

        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(function () {
            fun.apply(thisarg, args)
            timeout = null
        }, time)
    }
    return delayed
}


export { debounce }