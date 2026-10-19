import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

/** One error shape for the whole API: { statusCode, message, errors? , path, timestamp }.
    5xx details are logged server-side and never leaked to clients. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("API");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    if (!isHttp || status >= 500) this.logger.error(exception instanceof Error ? exception.stack : String(exception));

    let message = "خطای داخلی سرور — دوباره تلاش کنید";
    let errors: unknown;
    if (isHttp) {
      const body = exception.getResponse() as Record<string, unknown> | string;
      if (typeof body === "object") { message = String(body.message ?? exception.message); errors = body.errors; }
      else message = body;
    }
    res.status(status).json({ statusCode: status, message, ...(errors ? { errors } : {}), path: req.url, timestamp: new Date().toISOString() });
  }
}
