import { ethers } from "ethers";
import { useEffect, useState } from "react";
import FiredGuys from "../artifacts/contracts/MyNFT.sol/FiredGuys.json";
import { NFT_PRICE, PINATA_FOLDER_ID } from "../constants";
import placeholder from "../placeholder.svg";
import Carousel from "./Carousel";
import { Footer } from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(
  "0xD3A5Ff1091f2568e78bBA37271c76cA129200Ea1",
  FiredGuys.abi,
  signer
);

function Home() {
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
      <Navbar />
      <Hero />
      <Carousel />

      <h2 className="text-black mb-10 font-extrabold tracking-tight leading-none md:text-3xl xl:text-4xl dark:text-white text-center w-full">
        Mint your own NFT
      </h2>
      <div className="mb-40">
        <div className="container" id="browse">
          <div className="grid grid-cols-3">
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
      <Footer />
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
    <div className="card" style={{ width: "18rem" }}>
      <img className="card-img-top" src={isMinted ? imageURI : placeholder} />
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
