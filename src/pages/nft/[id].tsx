import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../lib/utils/sanity';

import { Collection } from '../../lib/typings';

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
  return (
    <div className="flex flex-col dark:bg-gray-800 bg-gray-50  lg:max-h-screen">
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:min-h-screen ">
        {/* Left Side */}

        <div className="flex flex-1 px-12 py-4 flex-col lg:col-span-4 bg-gradient-to-br from-gray-800 to-teal-900 lg:justify-center">
          {/* Header */}
          <div className={'lg:hidden'}>
            <header className="flex items-center justify-between">
              <h1 className="text-xl font-thin dark:text-white w-52 cursor-pointer sm:w-80">
                <span className="font-extrabold underline decoration-teal-300 dark:text-teal-50">
                  Lyra
                </span>{' '}
                NFT Market Place
              </h1>
              <div className={'flex items-center'}>
                <button
                  className="flex rounded py-1 px-4 text-teal-300 text-xs font-bold lg:px-3 lg:py-1 lg:text-base border-teal-300 border-2 hover:bg-teal-300 hover:text-white transition-all duration-200"
                  onClick={address ? disconnect : connectWithMetaMask}
                >
                  {address ? (
                    <p className={'dark:text-white'}>
                      Disconnect:
                      <span className={'dark:text-teal-200 ml-1'}>
                        {address.substring(0, 3)}..
                        {address.substring(address.length - 3)}
                      </span>
                    </p>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </header>
            <hr className="border-gray-300 dark:border-gray-700 w-full my-4" />
          </div>
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
          <div className="invisible lg:visible ">
            <header className="flex items-center justify-between">
              <h1 className="text-xl font-thin dark:text-white w-52 cursor-pointer sm:w-80">
                <span className="font-extrabold underline decoration-teal-300 dark:text-teal-50">
                  Lyra
                </span>{' '}
                NFT Market Place
              </h1>
              <div className={'flex flex-col items-center'}>
                <button
                  className="flex rounded py-1 px-4 text-teal-300 text-xs font-bold lg:px-3 lg:py-1 lg:text-base border-teal-300 border-2 hover:bg-teal-300 hover:text-white transition-all duration-200"
                  onClick={address ? disconnect : connectWithMetaMask}
                >
                  {address ? (
                    <p className={'dark:text-white'}>
                      Disconnect:
                      <span className={'dark:text-teal-200 ml-1'}>
                        {address.substring(0, 3)}..
                        {address.substring(address.length - 3)}
                      </span>
                    </p>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </header>
            <hr className="border-gray-300 dark:border-gray-700 w-full my-4" />
          </div>
          <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
            <img
              className="w-80 object-cover pb-10 "
              src={urlFor(collection.previewImage).url()}
              alt={collection.title}
            />

            <h1 className="text-3xl dark:text-white font-bold lg:text-5xl lg:font-extrabold">
              {collection.nftCollectionName}
            </h1>

            <p className="text-xl text-teal-300 py-6">x/y remaining</p>

            <button
              className="h-16 w-80 px-3 bg-red-600 dark:text-white rounded"
              onClick={address ? disconnect : connectWithMetaMask}
            >
              {address
                ? `Mint NFT (${collection.price} ${collection.baseCurrency})`
                : 'Connect Wallet to Mint'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDropPage;
