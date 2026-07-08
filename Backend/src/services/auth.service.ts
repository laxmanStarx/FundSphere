import { AuthRepository } from "../repositories/auth.repository";

export class AuthService {
  constructor(private authRepository = new AuthRepository()){} 
    
  
  async register(data: {
        name: string;
        email:string;
        password: string

    
  }){
  }
}