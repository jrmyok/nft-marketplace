import Link from 'next/link';

import {
  useAddress,
  useDisconnect,
  useLogin,
  useLogout,
  useMetamask,
  useUser,
  useSDK,
} from '@thirdweb-dev/react';

import swr from 'swr';
import { fetcher, requests } from '../lib/utils/requests';
import { useEffect } from 'react';
import { useQueryUser } from '../lib/hooks/useQueryWallet';

const Header = ({ className }: { className?: string }) => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectWithMetamask = useMetamask();
  const login = useLogin();
  const { user: thirdwebUser } = useUser();

  const logout = useLogout();

  useEffect(() => {
    if (thirdwebUser) {
      requests.post('/api/wallet', {
        address: thirdwebUser.address,
      });
    }
  }, [thirdwebUser]);

  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.log(err);
    }

    await logout();
  };

  return (
    <Link className={`${className}`} href={'/'}>
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-thin dark:text-white w-52 cursor-pointer sm:w-80">
          <span className="font-extrabold underline decoration-teal-300 dark:text-teal-50">
            Lyra
          </span>{' '}
          NFT Market Place
        </h1>
        <div className={'flex items-center'}>
          {address ? (
            <button
              className="flex rounded py-1 px-4 text-teal-300 text-xs font-bold lg:px-3 lg:py-1 lg:text-base border-teal-300 border-2 hover:bg-teal-300 hover:text-white transition-all duration-200"
              onClick={disconnect}
            >
              <p className={'dark:text-white'}>
                Disconnect:
                <span className={'dark:text-teal-200 ml-1'}>
                  {address.substring(0, 3)}..
                  {address.substring(address.length - 3)}
                </span>
              </p>
            </button>
          ) : (
            <button
              className="flex rounded py-1 px-4 text-teal-300 text-xs font-bold lg:px-3 lg:py-1 lg:text-base border-teal-300 border-2 hover:bg-teal-300 hover:text-white transition-all duration-200"
              onClick={connectWithMetamask}
            >
              Connect Wallet
            </button>
          )}
          <div className={'p-2'} />

          {address ? (
            <>
              {thirdwebUser ? (
                <button
                  onClick={handleLogout}
                  className="flex rounded py-1 px-4 text-teal-300 text-xs font-bold lg:px-3 lg:py-1 lg:text-base border-teal-300 border-2 hover:bg-teal-300 hover:text-white transition-all duration-200"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => login()}
                  className="flex rounded py-1 px-4 text-teal-300 text-xs font-bold lg:px-3 lg:py-1 lg:text-base border-teal-300 border-2 hover:bg-teal-300 hover:text-white transition-all duration-200"
                >
                  Login with Wallet
                </button>
              )}
            </>
          ) : (
            <>Connect your wallet to access authentication.</>
          )}
        </div>
      </header>

      <hr className="border-gray-300 dark:border-gray-700 w-full my-4" />
    </Link>
  );
};

export default Header;
