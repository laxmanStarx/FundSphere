import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService = new AuthService()) {}
}