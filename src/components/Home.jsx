import WalletBalance from "./WalletBalance";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import FiredGuys from "../artifacts/contracts/MyNFT.sol/FiredGuys.json";
import { CONTRACT_ADDRESS, PINATA_FOLDER_ID } from "../constants";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, FiredGuys.abi, signer);

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    try {
      const count = await contract.count();
      console.log(parseInt(count));
      setTotalMinted(parseInt(count));
    } catch (error) {
      console.log("count error", error.message);
    }
  };

  return (
    <div>
      <WalletBalance />

      <h1>Fired Guys NFT Collection</h1>
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const metadataURI = `${PINATA_FOLDER_ID}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${PINATA_FOLDER_ID}/${tokenId}.png`;
  //   const imageURI = `img/${tokenId}.png`;

  console.log("imageURI", imageURI);
  console.log("metadataURI", metadataURI);
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
        value: ethers.utils.parseEther("0.05"),
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
      <img
        className="card-img-top"
        src={isMinted ? imageURI : "img/placeholder.png"}
      ></img>
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
