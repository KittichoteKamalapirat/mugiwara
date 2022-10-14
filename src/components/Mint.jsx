import { ethers } from "ethers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FiredGuys from "../artifacts/contracts/MyNFT.sol/FiredGuys.json";
import { NFT_PRICE, PINATA_FOLDER_ID } from "../constants";
import placeholder from "../placeholder.svg";
import ether from "../img/ether.svg";
import { Footer } from "./Footer";

const provider = window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : null;

// get the end user
const signer = window.ethereum ? provider.getSigner() : null;

// get the smart contract
const contract = new ethers.Contract(
  "0xD3A5Ff1091f2568e78bBA37271c76cA129200Ea1",
  FiredGuys.abi,
  signer
);

function Mint() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    try {
      const count = await contract.count();
      setTotalMinted(parseInt(count));
    } catch (error) {
      console.log("count error", error.message);
    }
  };

  return (
    <div>
      <div
      // initial={{ opacity: 0, y: 100 }}
      // whileInView={{ opacity: 1, y: 0 }}
      // transition={{ duration: 1 }}
      >
        <h2 className="text-black mb-10 font-extrabold tracking-tight leading-none md:text-3xl xl:text-4xl dark:text-white text-center w-full">
          Mint your own NFT
        </h2>
        <div className="mb-40">
          <div id="browse" className="container">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-stretch">
              {Array(totalMinted + 1)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="col-span-1">
                    <NFTImage tokenId={i} getCount={getCount} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const metadataURI = `${PINATA_FOLDER_ID}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${PINATA_FOLDER_ID}/${tokenId}.png`;
  //   const imageURI = `img/${tokenId}.png`;
  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    try {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result);
      setIsMinted(result);
    } catch (error) {
      console.log("mint status error", error.message);
    }
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    try {
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther(NFT_PRICE),
      });

      await result.wait();
      getMintedStatus();
      getCount();
    } catch (error) {
      console.log("mint token error", error.message);
    }
  };

  async function getURI() {
    try {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    } catch (error) {
      console.log("get uri error", error.message);
    }
  }
  return (
    <div className="w-full mx-2 border">
      <img className="w-full" src={isMinted ? imageURI : placeholder} />
      <div className="px-2 my-2">
        <h5 className="card-title">ID #{tokenId}</h5>
        <p>Price</p>
        <div className="flex justify-start">
          <img className="w-4" src={ether} />
          <p className="font-bold">0.05</p>
        </div>

        <div className="flex flex-col justify-center">
          {!isMinted ? (
            <button
              className="bg-primary mt-2 px-4 py-2 rounded-sm text-grey-0"
              onClick={mintToken}
            >
              Mint
            </button>
          ) : (
            <button
              className="bg-grey-500 mt-2 px-4 py-2 rounded-sm btn-secondary"
              onClick={getURI}
            >
              Taken! Show URI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mint;
