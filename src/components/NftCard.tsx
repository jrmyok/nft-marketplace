import { MediaRenderer } from '@thirdweb-dev/react';
import Card from './Card';

interface Props {
  name: string;
  tokenUri: string;
  price?: number;
  currency?: string;
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
      <h1>{nft.name}</h1>

      {nft.price && (
        <div className={'flex justify-between items-center mt-4'}>
          <h1 className={'text-xl font-bold'}>{nft.price}</h1>
          <h1 className={'text-xl font-bold'}>{nft.currency}</h1>
        </div>
      )}
    </Card>
  );
};

export default NftCard;
