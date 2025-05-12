require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true, // Aktifkan viaIR
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
