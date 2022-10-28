import type { NextPage } from "next";

const NFT: NextPage = () => {
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-12">
      {/* Left Side */}
      <div className="lg:col-span-8 bg-gray-900">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center w-full h-full">
            hello
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="lg:col-span-4 bg-gray-800">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center w-full h-full">
            hello
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFT;
