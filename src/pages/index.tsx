import type { GetServerSideProps, NextPage } from 'next';
import { sanityClient, urlFor } from '../lib/utils/sanity';
import { Collection } from '../lib/types/typings';
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
  let n = 5;

  return (
    <div className="flex h-full min-h-screen flex-col dark:bg-gray-800 p-6">
      <Header />

      <main className={'my-auto h-full'}>
        <div className={'flex flex-col items-center justify-center py-2 '}>
          <div className={'collections-wrapper w-full   '}>
            <h1 className={'text-2xl font-bold mb-10'}>Collections.</h1>
            <div className={'collections flex bg-gray-100 rounded-xl w-full'}>
              <div
                className={
                  'w-full overflow-x-auto flex space-x-8 rounded-xl p-6'
                }
              >
                {collections &&
                  collections.map((collection) => (
                    <Link
                      key={collection._id}
                      href={`/nft/collection/${collection.slug.current.toString()}`}
                      className={'w-full'}
                    >
                      <div className="flex w-60 flex-col cursor-pointer items-center transition-all duration-200 hover:scale-105">
                        <img
                          className="h-96 w-60 rounded-2xl object-cover"
                          src={urlFor(collection.mainImage).url()}
                          alt=""
                        />

                        <div
                          className={
                            'flex flex-col justify-center items-center'
                          }
                        >
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

                {collections &&
                  collections.length < 4 &&
                  [...Array(n)].map((_, i) => (
                    <div
                      key={i + n + 1}
                      className="flex w-60 flex-col cursor-pointer items-center transition-all duration-200 hover:scale-105"
                    >
                      <div className="h-96 w-60 rounded-2xl object-cover bg-gray-300"></div>

                      <div
                        className={'flex flex-col justify-center items-center'}
                      >
                        <h2 className="text-3xl dark:text-white">
                          Coming Soon...
                        </h2>
                        <p className="mt-2 text-sm text-gray-400 dark:text-white">
                          ... ...
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
