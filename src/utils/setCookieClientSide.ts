export function setCookieClientSide(
  name: string,
  value: string,
  daysToExpire?: number,
  path?: string,
) {
  let expires = ''

  if (daysToExpire) {
    const date = new Date()
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  } else {
    const date = new Date()
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }

  if (!path || path === '') {
    path = '/'
  }

  document.cookie =
    name +
    '=' +
    value +
    expires +
    '; domain=/;' +
    (path ? '; path=' + path : '')
  return
}
