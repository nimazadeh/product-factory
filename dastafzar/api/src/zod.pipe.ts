import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";

/** Validates a request payload against a Zod schema; Persian field errors, no internals leaked. */
@Injectable()
export class ZodPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}
  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errors = result.error.issues.map((i) => ({ field: i.path.join(".") || "body", message: i.message }));
      throw new BadRequestException({ message: "داده ارسالی معتبر نیست", errors });
    }
    return result.data;
  }
}
