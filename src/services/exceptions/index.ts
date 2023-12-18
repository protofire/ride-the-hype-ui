import { IS_PRODUCTION } from '~/config/constants'
import { asError } from './utils'

export class CodedException extends Error {
  constructor(thrown?: unknown) {
    super()

    this.message = thrown ? ` (${asError(thrown).message})` : ''
  }

  public log(): void {
    // Filter out the logError fn from the stack trace
    if (this.stack) {
      const newStack = this.stack
        .split('\n')
        .filter((line) => !line.includes(logError.name))
        .join('\n')
      try {
        this.stack = newStack
      } catch (e) {}
    }

    // Log only the message on prod, and the full error on dev
    console.error(IS_PRODUCTION ? this.message : this)
  }

  public track(): void {
    this.log()

    if (IS_PRODUCTION) {
      // capture exception with some service like Sentry
    }
  }
}

type ErrorHandler = (thrown?: unknown) => CodedException

export const logError: ErrorHandler = function logError(...args) {
  const error = new CodedException(...args)
  error.log()
  return error
}

export const trackError: ErrorHandler = function trackError(...args) {
  const error = new CodedException(...args)
  error.track()
  return error
}
