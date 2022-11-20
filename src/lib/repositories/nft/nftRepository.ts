import { Nft, Prisma, PrismaClient } from '@prisma/client';

export class NftRepository {
  constructor(private prisma: PrismaClient) {}

  async getNft(address: string): Promise<Nft | null> {
    return await this.prisma.nft.findUnique({
      where: {
        address: address,
      },
    });
  }

  async updateNft(
    address: string,
    data: Prisma.NftUpdateInput
  ): Promise<Nft | null> {
    return await this.prisma.nft.update({
      where: {
        address: address,
      },
      data: data,
    });
  }
}
