import { Body, Controller, Get, Post, Query, Request, Res, UseGuards } from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { useLogger } from "evlog/nestjs";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { SignInUserDto } from "src/user/dto/signin-user.dto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ConfigService } from "@nestjs/config";

@UseGuards(ThrottlerGuard)
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private accessTokenCookieOptions(includeMaxAge = true): Record<string, unknown> {
    const production = this.configService.get<boolean>("production");
    const cookieDomain = this.configService.get<string>("cookie_domain");

    const cookieOptions: Record<string, unknown> = {
      httpOnly: true,
      secure: production,
      sameSite: "lax",
      path: "/",
    };

    if (includeMaxAge) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60;
    }

    if (production && cookieDomain) {
      cookieOptions.domain = cookieDomain;
    }

    return cookieOptions;
  }

  private setAccessTokenCookie(res: FastifyReply, access_token: string) {
    res.setCookie("access_token", access_token, this.accessTokenCookieOptions(true));
  }

  private clearAccessTokenCookie(res: FastifyReply) {
    res.clearCookie("access_token", this.accessTokenCookieOptions(false));
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("login")
  async signIn(@Body() userData: SignInUserDto, @Res() res: FastifyReply) {
    const access_token = await this.authService.signIn(userData);
    this.setAccessTokenCookie(res, access_token);
    return res.code(200).send({ success: true });
  }

  @Get("logout")
  logout(@Res() res: FastifyReply) {
    this.clearAccessTokenCookie(res);
    return res.send({ success: true });
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("signup")
  async signUp(@Body() userData: CreateUserDto, @Res() res: FastifyReply) {
    const access_token = await this.authService.signUp(userData);
    this.setAccessTokenCookie(res, access_token);
    return res.code(200).send({ success: true });
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req: FastifyRequest & { user?: unknown }) {
    return req.user;
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Get("google")
  redirectToGoogle(@Res() res: FastifyReply) {
    const url = this.authService.getGoogleAuthUrl();
    return res.code(302).redirect(url);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Get("google/callback")
  async handleGoogleCallback(@Query("code") code: string, @Res() res: FastifyReply) {
    const log = useLogger();
    const returnUrl = this.authService.getFrontUrl();

    try {
      const access_token = await this.authService.handleGoogleCallback(code);
      this.setAccessTokenCookie(res, access_token);
      return res.code(302).redirect(returnUrl);
    } catch (error) {
      log.error(error instanceof Error ? error : new Error(String(error)));
      const separator = returnUrl.includes("?") ? "&" : "?";
      return res.code(302).redirect(`${returnUrl}${separator}authError=google`);
    }
  }
}
