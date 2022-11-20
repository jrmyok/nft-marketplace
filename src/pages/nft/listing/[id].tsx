import { useRouter } from 'next/router';
import {
  useActiveListings,
  useContract,
  useListing,
  useUser,
} from '@thirdweb-dev/react';
import Header from '../../../components/Header';
import NftCard from '../../../components/NftCard';
import { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { BigNumber } from 'ethers';
import { requests } from '../../../lib/utils/requests';

interface Props {
  id: string;
  marketPlaceContractAddress: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query?.id as string;
  const marketPlaceContractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;

  return {
    props: {
      id,
      marketPlaceContractAddress,
    },
  };
};

const Listing = ({ id, marketPlaceContractAddress }: Props) => {
  const { contract } = useContract(marketPlaceContractAddress, 'marketplace');

  const { data: nft, isLoading, error } = useListing(contract, id);

  const { user: thirdwebUser } = useUser();

  useEffect(() => {
    if (thirdwebUser) {
      requests.post('/api/wallet', {
        address: thirdwebUser.address,
      });
    }
  }, [thirdwebUser]);

  const buyoutListing = async () => {
    try {
      await contract?.buyoutListing(BigNumber.from(id), 1);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col dark:bg-gray-800 p-6">
      <Header />
      <div
        className={`flex flex-col items-center justify-center w-full h-full`}
      >
        {isLoading && <div>Loading...</div>}

        {error && <div className="text-red-500">error</div>}
        {nft && (
          <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
            <NftCard
              name={nft.asset.name as string}
              tokenUri={nft.asset.image as string}
              price={nft.buyoutCurrencyValuePerToken?.displayValue || 0}
              description={nft.asset.description as string}
              currency={nft.buyoutCurrencyValuePerToken.symbol as string}
            />
            {/* check if logged in and if logged in make button buy nft */}
            {thirdwebUser ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={buyoutListing}
              >
                Buy NFT
              </button>
            ) : (
              <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded">
                Login to Buy NFT
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listing;
