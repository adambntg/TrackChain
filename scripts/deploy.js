async function main() {
    const CarServiceHistory = await ethers.getContractFactory("CarServiceHistory");
    const carServiceHistory = await CarServiceHistory.deploy();
  
    await carServiceHistory.deployed();
  
    console.log("CarServiceHistory deployed to:", carServiceHistory.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });