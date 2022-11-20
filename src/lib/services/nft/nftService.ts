import { NftRepository } from '../../repositories/nft/nftRepository';
import { Prisma, Nft } from '@prisma/client';
import axios from 'axios';

export class NftService {
  constructor(private nftRepository: NftRepository) {}

  async getNft(address: string): Promise<Nft | null> {
    return await this.nftRepository.getNft(address);
  }

  async updateNft(
    address: string,
    data: Prisma.WalletUpdateInput
  ): Promise<Nft | null> {
    return await this.nftRepository.updateNft(address, data);
  }

  async getWalletNfts(
    address: string
  ): Promise<{ tokenUri: string; name: string }[] | null> {
    const options = {
      method: 'GET',
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: { chain: 'goerli', format: 'decimal' },
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.MORALIS_API_KEY || '',
      },
    };

    try {
      const { data } = await axios.request({ ...options });

      const results: { tokenUri: string; name: string }[] = data.result.map(
        (nft: any) => ({
          name: JSON.parse(nft.metadata)?.name,
          tokenUri: JSON.parse(nft.metadata)?.image,
        })
      );

      const filteredResults = results.filter(
        (data) => !!data?.tokenUri && !!data?.name
      );

      return filteredResults;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
