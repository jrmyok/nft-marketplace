import { MediaRenderer } from '@thirdweb-dev/react';
import Card from './Card';
import { BigNumber } from 'ethers';

interface Props {
  name: string;
  tokenUri: string;
  price?: number | BigNumber | string;
  currency?: string;
  description?: string;
}

const NftCard = (nft: Props) => {
  return (
    <Card className={'w-60 shadow-xl'}>
      <MediaRenderer
        src={nft.tokenUri}
        style={{
          objectFit: 'contain',
        }}
        className={
          'h-[244px] w-full rounded-lg transition duration-300 ease-in-out hover:scale-105'
        }
      />
      <hr className={'my-4'} />
      <div>
        <h1>
          <span className={'font-bold'}>{nft.name} </span> |{' '}
          <span>{nft.description}</span>
        </h1>
      </div>

      {nft.price && (
        <div className={'flex justify-between items-center mt-4'}>
          <h1>
            <span className={'font-bold'}> Price: </span>
            {nft.price as unknown as string}
            <span> {nft.currency}</span>
          </h1>
        </div>
      )}
    </Card>
  );
};

export default NftCard;
