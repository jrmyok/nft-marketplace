import Link from 'next/link';
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

const Header = ({ className }: { className: string }) => {
  const connectWithMetaMask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  const router = useRouter();

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
    </Link>
  );
};

export default Header;
