export default (param) => {
    let cookies = document.cookie.split(";")
        .map(function(e) { return e.split('=').map(function(e) { return e.trim() }) })
        .filter(function(e) { return e[0] === param })
    if (cookies.length > 0) {
        return cookies['0']['1']
    } else {
        return ''
    }
}