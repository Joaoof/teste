/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import Logger from '@ioc:Adonis/Core/Logger'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: Exception, ctx: HttpContextContract) {
    console.log({ error })

    if (error.status === 422)
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: error.message,
        status: error.status,
        // eslint-disable-next-line dot-notation
        errors: error['messages']?.errors ? error['messages'].errors : '',
      })
    else if (error.code === 'E_ROW_NOT_FOUND')
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: 'resource not found',
        status: 404,
        // eslint-disable-next-line dot-notation
        errors: error['messages']?.errors ? error['messages'].errors : '',
      })
    else if (error.code === 'E_INVALID_AUTH_UID')
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: 'invalid credentials',
        status: 400,
      })
    else if (error.code === 'E_INVALID_AUTH_PASSWORD')
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: 'invalid password',
        status: 400,
      })
    // else if (error.code === 'E_AUTHORIZATION_FAILURE')
    //   return ctx.response.status(error.status).send({
    //     code: 'BAD_REQUEST',
    //     message: 'Not authorized',
    //     status: 403,
    //   })

    return super.handle(error, ctx)
  }
}
