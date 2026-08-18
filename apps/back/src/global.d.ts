import type { CookieSerializeOptions, UnsignResult } from "@fastify/cookie";

declare module "fastify" {
  interface FastifyReply {
    setCookie(name: string, value: string, options?: CookieSerializeOptions): this;
    cookie(name: string, value: string, options?: CookieSerializeOptions): this;
    clearCookie(name: string, options?: CookieSerializeOptions): this;
    unsignCookie(value: string): UnsignResult;
  }
}
