import { Wallet, Prisma, PrismaClient } from '@prisma/client';

export class WalletRepository {
  constructor(private prisma: PrismaClient) {}

  async getWallet(address: string): Promise<Wallet | null> {
    return await this.prisma.wallet.findUnique({
      where: {
        address: address,
      },
    });
  }

  async newWallet(data: Prisma.WalletUncheckedCreateInput) {
    await this.prisma.wallet.upsert({
      where: {
        address: data.address,
      },
      create: data,
      update: data,
    });
  }
}
