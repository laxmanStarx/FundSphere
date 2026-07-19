import  prisma  from "../config/prisma"


export class AuthRepository {

    async findUserByEmail(email: string)
    {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }


    async createUser(data: {
        name: string;
        email: string;
        password: string;
    }) {
        return prisma.user.create({
            data,
        })
    }


    async findUserById(id: string)
    {
        return prisma.user.findUnique({
            where: {id},
        });
    }

    async createWallet(userId: string){
        return prisma.wallet.create({
            data: {
                userId,
            },
        });
    }

    async saveRefreshToken(
        token: string,
        userId: string,
        expiresAt: Date
    ){
        return prisma.refreshToken.create({
            data:
            {
                token,
                userId,
                expiresAt,
            }
        });
    }

    async updateLastLogin(userId: string)
    {
        return prisma.user.update({
            where: 
            {
                id: userId,
            },
            data: {
                lastLoginAt: new Date(),
            },
        })
    }


}