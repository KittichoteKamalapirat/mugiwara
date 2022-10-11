import { useState } from "react";
import { ethers } from "ethers";

function WalletBalance() {
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  console.log("balance", typeof balance);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Your Balance: {balance}</h5>
        {!balance ? (
          <button className="btn btn-success" onClick={() => getBalance()}>
            Show My Balance
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default WalletBalance;
