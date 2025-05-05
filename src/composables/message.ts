function success(msg: string, duration?: number) {
  // eslint-disable-next-line no-console
  console.log('success', msg, duration)
}
function info(msg: string, duration?: number) {
  // eslint-disable-next-line no-console
  console.log('info', msg, duration)
}
function warning(msg: string, duration?: number) {
  // eslint-disable-next-line no-console
  console.log('warning', msg, duration)
}
function error(msg: string, duration?: number) {
  // eslint-disable-next-line no-console
  console.log('error', msg, duration)
}

export const message = {
  success,
  info,
  warning,
  error,
}
