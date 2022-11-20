// This is manual dependency injection. See why we do DI in the README.
// Yes, this is not the optimal way to do it, but there's not a nice way to do it in Typescript Nodejs.
import { PrismaClient } from '@prisma/client';
import { WalletService } from '../services/wallet/walletService';
import { WalletRepository } from '../repositories/wallet/walletRepository';
import { NftService } from '../services/nft/nftService';
import { NftRepository } from '../repositories/nft/nftRepository';

const prisma = new PrismaClient();

const repositories = {
  wallet: new WalletRepository(prisma),
  nft: new NftRepository(prisma),
};

export const Services = {
  wallet: new WalletService(repositories.wallet),
  nft: new NftService(repositories.nft),
};
