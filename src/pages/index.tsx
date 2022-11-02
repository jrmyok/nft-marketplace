import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { sanityClient, urlFor } from '../lib/utils/sanity';
import { Collection } from '../lib/typings';
import Link from 'next/link';
import Header from '../components/Header';

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
    <div className="flex h-full min-h-screen flex-col dark:bg-gray-800 p-6">
      <Head>
        <title>Lyra NFT Market Place</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <Header />

      <main className={'my-auto h-full'}>
        <div
          className={'flex flex-col items-center justify-center py-2 my-auto'}
        >
          {collections &&
            collections.map((collection) => (
              <Link
                key={collection._id}
                href={`/nft/${collection.slug.current.toString()}`}
              >
                <div className="flex flex-col cursor-pointer items-center transition-all duration-200 hover:scale-105">
                  <div className="">
                    <img
                      className="h-96 w-60 rounded-2xl object-cover"
                      src={urlFor(collection.mainImage).url()}
                      alt=""
                    />
                  </div>

                  <div className={'flex flex-col justify-center items-center'}>
                    <h2 className="text-3xl dark:text-white">
                      {collection.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400 dark:text-white">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
