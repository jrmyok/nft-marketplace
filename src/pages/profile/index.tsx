import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '../api/auth/[...thirdweb]';
import Header from '../../components/Header';
import { Services } from '../../lib/utils/servicesDI';
import useSWR from 'swr';
import { fetcher } from '../../lib/utils/requests';
import NftCard from '../../components/NftCard';

interface Props {
  address: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUser(context.req as NextApiRequest);

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const address = user.address;

  const wallet = await Services.wallet.getWallet(address);

  if (!wallet) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      address,
    },
  };
};

const Profile = ({ address }: Props) => {
  const { data: nfts } = useSWR(`/api/wallet/${address}/nfts`, fetcher, {
    refreshInterval: 10000,
  });

  console.log(nfts);

  return (
    <div className="flex h-full min-h-screen flex-col dark:bg-gray-800 p-6">
      <Header />

      <div className={''}>
        <h1 className={'text-2xl font-bold'}>Your Collection.</h1>
        <div>
          {nfts?.map((nft: { name: string; tokenUri: string }, n: number) => (
            <NftCard key={n} name={nft.name} tokenUri={nft.tokenUri} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
