require("@nomiclabs/hardhat-waffle");
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
  },

  networks: {
    // matic: {
    //   url: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_APP",
    //   accounts: ["MATIC_PRIVATE_KEY"]
    // }
    hardhat: {
      url: process.env.RPC_URL,
      // chainId: 1337,
      chainId: 31337,
    },
  },
};
