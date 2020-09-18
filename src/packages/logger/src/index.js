'use strict'
import format from 'date-fns/format'
;(typeof global !== 'undefined' ? global : self).globalThis =
  typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : self

const _console = globalThis.console

var timestampFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
const formatDate = () => format(new Date(), timestampFormat)

const writeToConsole = (level, ...args) => {
  if (typeof args[0] === 'object') {
    _console[level].call(_console, formatDate(), ...args)
  } else {
    _console[level].call(_console, `${formatDate()} ${args[0]}`, ...args.slice(1))
  }
}

globalThis.console = {
  ..._console,
  log: (...args) => writeToConsole('log', ...args),
  info: (...args) => writeToConsole('info', ...args),
  warn: (...args) => writeToConsole('warn', ...args),
  error: (...args) => writeToConsole('error', ...args),
}

export const configure = async cb => {
  const { overwrites, formatter } = cb({ console: _console, timestampFormat })
  timestampFormat = formatter || timestampFormat
  globalThis.console = Object.assign(globalThis.console, overwrites)
}
