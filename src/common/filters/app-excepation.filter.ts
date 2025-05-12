import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class AppExcepationFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus ? exception.getStatus() : 500;
    const exceptionResponse = exception.getResponse();
    const error = typeof exceptionResponse === 'string' ? { message: exceptionResponse } : {message: exceptionResponse['message'][0]};

    response.status(status).json({
      status:status.toString().startsWith('4') ? 'fail' : 'error',
      statusCode: status,
      message: error.message,
      path:request.url,
      stack: exception.stack,
    });
  }
}
