import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask,
} from '@thirdweb-dev/react';
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../../lib/utils/sanity';

import { Collection } from '../../../lib/types/typings';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

import toast, { Toaster } from 'react-hot-toast';
import Header from '../../../components/Header';

import useSWR from 'swr';
import { fetcher, requests } from '../../../lib/utils/requests';

interface Props {
  collection: Collection;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
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
}`;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};

const NFTDropPage = ({ collection }: Props) => {
  const connectWithMetaMask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  const [priceInEth, setPriceInEth] = useState<string>();

  const [unclaimedSupply, setUnclaimedSupply] = useState<BigNumber>();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [loading, setLoading] = useState(true);

  const contract = useContract(collection.address, 'nft-drop');
  const nftDrop = contract.contract;

  useEffect(() => {
    if (!nftDrop) return;

    console.log(contract);

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll();
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
    };
    fetchPrice();
  }, [nftDrop]);

  useEffect(() => {
    if (!nftDrop) return;

    const fetchNftDropData = async () => {
      setLoading(true);
      const total = await nftDrop.totalSupply();
      const unclaimed = await nftDrop.totalUnclaimedSupply();
      setUnclaimedSupply(unclaimed);
      setTotalSupply(total);
      setLoading(false);
    };
    fetchNftDropData();
  }, [nftDrop]);

  const mintNft = () => {
    if (!nftDrop || !address) return;
    const quantity = 1;

    setLoading(true);
    const notification = toast.loading('Minting NFT...', {
      style: {
        borderRadius: '10px',
        background: 'white',
        color: 'green',
      },
    });

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt;
        const claimedTokenId = tx[0].id;
        const claimedNFT = await tx[0].data();

        await requests.post('/api/nft', {
          walletId: address,
          address: claimedTokenId,
          data: claimedNFT.toString(),
        });

        toast('Successfully minted NFT!', {
          duration: 8000,
          style: {
            borderRadius: '10px',
            background: 'green',
            color: 'white',
          },
        });
      })
      .catch((err) => {
        console.log(err);
        toast('Failed to mint NFT', {
          style: {
            borderRadius: '10px',
            background: 'red',
            color: 'white',
            fontWeight: 'bold',
            padding: 20,
          },
        });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(notification);
      });
  };

  return (
    <div className="flex flex-col dark:bg-gray-800 bg-gray-50  lg:max-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:min-h-screen ">
        {/* Left Side */}

        <div className="flex flex-1 px-12 py-4 flex-col lg:col-span-4 bg-gradient-to-br from-gray-800 to-teal-900 lg:justify-center">
          {/* Header */}
          <Header className={'lg:hidden'} />

          {/* Left */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="bg-gradient-to-br from-white to-teal-100 p-2 rounded-xl">
              <img
                className={'w-80 rounded-xl object-cover lg:h-96 lg:w-72'}
                src={urlFor(collection.mainImage).url()}
                alt={collection.title}
              />
            </div>
            <div className="p-5 text-center space-y-2">
              <h1 className={'text-2xl font-bold dark:text-white'}>
                {collection.title}
              </h1>
              <h2 className={'text-xl font-light text-gray-100'}>
                {collection.description}
              </h2>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 p-12 flex-col lg:col-span-8">
          <Header className={'invisible lg:visible'} />

          <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
            <img
              className="w-80 object-cover pb-10 "
              src={urlFor(collection.previewImage).url()}
              alt={collection.title}
            />

            <h1 className="text-3xl dark:text-white font-bold lg:text-5xl lg:font-extrabold">
              {collection.nftCollectionName}
            </h1>
            {loading ? (
              <p className="text-xl text-teal-300 py-6">
                Loading Supply Count..
              </p>
            ) : (
              <p className="text-xl text-teal-300 py-6">
                <>
                  {unclaimedSupply?.toString()} / {totalSupply?.toString()}{' '}
                  remaining.
                </>
              </p>
            )}

            <button
              disabled={loading || unclaimedSupply?.toString() === '0'}
              className="h-16 w-80 px-3 bg-red-600 dark:text-white rounded disabled:bg-gray-600"
              onClick={address ? mintNft : connectWithMetaMask}
            >
              {loading ? (
                <>Loading</>
              ) : unclaimedSupply?.toString() === '0' ? (
                <>Sold Out</>
              ) : !address ? (
                'Connect Wallet to Mint'
              ) : (
                `Mint NFT (${priceInEth} ETH)`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDropPage;
