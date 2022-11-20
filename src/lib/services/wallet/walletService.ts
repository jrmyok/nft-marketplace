import { WalletRepository } from '../../repositories/wallet/walletRepository';
import { Prisma, Wallet } from '@prisma/client';

import { sanityClient, urlFor } from '../../../lib/utils/sanity';
import { Collection } from '../../../lib/types/typings';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export class WalletService {
  constructor(private walletRepository: WalletRepository) {}

  async getWallet(address: string): Promise<Wallet | null> {
    return await this.walletRepository.getWallet(address);
  }

  async newWallet(address: string) {
    try {
      const query = `
  *[_type == "collection"]{
  _id,
  title,
  address,
  description,
  nftCollectionName,
  price,
  baseCurrency,
  mainImage {
    asset
  },
  previewImage {
    asset
  },
  slug {
    current
  },
  creator-> {
    _id,
    name,
    address,
    slug {
      current
    },
  },
}
  `;

      const collections = await sanityClient.fetch<Collection[]>(query);

      const nfts = await Promise.all(
        collections.map(async (collection) => {
          const sdk = ThirdwebSDK.fromPrivateKey(
            process.env.ADMIN_PRIVATE_KEY || '',
            'goerli'
          );

          const contract = await sdk.getContract(collection.address);
          return await contract.erc721.getOwned(address);
        })
      );

      console.log(nfts[0][0].metadata);

      await this.walletRepository.newWallet({ address, nfts: {} });
    } catch (e) {
      console.log(e);
    }
  }
}
