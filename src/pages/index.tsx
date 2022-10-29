import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { sanityClient, urlFor } from '../lib/utils/sanity';
import { Collection } from '../lib/typings';

interface Props {
  collections: Collection[];
}

export const getServerSideProps: GetServerSideProps = async () => {
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

  try {
    const collections = await sanityClient.fetch(query);
    return {
      props: {
        collections,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        collections: [],
      },
    };
  }
};
const Home = ({ collections }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 dark:bg-gray-800">
      <Head>
        <title>Lyra NFT Market Place</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold font-extralight dark:text-gray-200">
        <span className="font-extrabold underline decoration-teal-300 dark:text-teal-50">
          Lyra
        </span>{' '}
        NFT Market Place
      </h1>

      <main>
        <div>
          {collections &&
            collections.map((collection) => (
              <div
                key={collection._id}
                className="flex flex-col cursor-pointer items-center transition-all duration-200 hover:scale-105"
              >
                <div className="">
                  <img
                    className="h-96 w-60 rounded-2xl object-cover"
                    src={urlFor(collection.mainImage).url()}
                    alt=""
                  />
                </div>

                <div>
                  <h2 className="text-3xl dark:text-white">
                    {collection.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-400 dark:text-white">
                    {collection.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Home;