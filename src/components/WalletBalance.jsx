import { useState } from "react";
import { ethers } from "ethers";

function WalletBalance() {
  const [balance, setBalance] = useState("");

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div>
      <div>
        {!balance ? (
          <a
            className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={window.ethereum ? () => getBalance() : undefined}
            // href={!window.ethereum ? "#install-metamask" : undefined}
            href={window.ethereum ? undefined : "#install-metamask"}
          >
            Show my balance
          </a>
        ) : (
          <h5 className="text-lg">Your Balance: {balance}</h5>
        )}
      </div>
    </div>
  );
}

export default WalletBalance;
