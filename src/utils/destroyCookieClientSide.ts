export function destroyCookieClientSide(name: string) {
  var cookies = document.cookie.split(';')

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim()
    var eqPos = cookie.indexOf('=')
    var cookieName = eqPos > -1 ? cookie.substring(0, eqPos) : cookie

    if (cookieName === name) {
      document.cookie =
        cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=' + '/'
      document.cookie =
        cookieName +
        '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=graodegente.com.br; path=' +
        '/'
    }
  }
}
