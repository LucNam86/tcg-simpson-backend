import { z } from 'zod';
import { Result, ok, err } from '@shared/Result';

const EmailSchema = z.email();

export type Email = z.infer<typeof EmailSchema> & { readonly _brand: 'Email' };

export function makeEmail(value: string): Result<Email, string> {
  const result = EmailSchema.safeParse(value);
  if (!result.success) {
    return err(result.error.issues[0].message);
  }
  return ok(result.data.toLowerCase() as Email);
}