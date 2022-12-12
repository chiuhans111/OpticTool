/**
 * @param {string} str 
 * @returns 
 */
function compress(str) {
    str = str.replaceAll(/"([^",{}]+)":/g, "$1:")
    str = str.replaceAll(/{_:"([^",{}]+)",/g, "{$1,")
    str = str.replaceAll(/true/g, "_1")
    str = str.replaceAll(/false/g, "_0")
    return str
}

/**
 * @param {string} str 
 * @returns 
 */
function decompress(str) {
    str = str.replaceAll(/_1/g, "true")
    str = str.replaceAll(/_0/g, "false")
    str = str.replaceAll(/{([^",{}]+),/g, '{_:"$1",')
    str = str.replaceAll(/([^,"{}]+):/g, '"$1":')
    return str
}

export { compress, decompress }