const MD5 = require('js-md5')

// function encript(text, pass) {
//     let hashpass = MD5(MD5(pass)).split('').map(e => e.charCodeAt(0))
//     let byteText = text.split('').map(function(e, i) { return e.charCodeAt(0) * hashpass[i % 32] })
//     let etext = ""
//     for (c in byteText) {
//         etext += String.fromCharCode(Math.floor(byteText[c] / 256))
//         etext += String.fromCharCode(byteText[c] % 256)
//     }
//     return window.btoa(etext)
// }

export default (etext, pass) => {
    let hashpass = MD5(MD5(pass)).split('').map(e => e.charCodeAt(0))
    let text = window.atob(etext)
    let byteText = []
    for (const t in text) {
        if (t % 2 == 1) {
            byteText.push(text.charCodeAt(t - 1) * 256 + text.charCodeAt(t))
        }
    }
    let dtext = ""
    byteText.forEach(function(e, i) {
        dtext += String.fromCharCode(e / hashpass[i % 32])
    })
    return dtext
}