import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";

import { HttpStatus } from "../constants/httpStatus";

export class AuthController {
  constructor(
    private authService = new AuthService()
  ) {}

  async register(req: Request, res: Response) {
    const user = await this.authService.register(req.body);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const result = await this.authService.login(req.body);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }

  async me(req: Request, res: Response) {
  const user = await this.authService.me(req.user!.id);

  return res.status(HttpStatus.OK).json({
    success: true,
    data: user,
  });
}
}