const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarServiceHistory Contract", function () {
  let carServiceHistory;
  let owner, otherAccount;

  before(async function () {
    // Mendapatkan akun-akun yang tersedia
    [owner, otherAccount] = await ethers.getSigners();
  });

  beforeEach(async function () {
    // Mendapatkan factory untuk kontrak
    const CarServiceHistoryFactory = await ethers.getContractFactory(
      "CarServiceHistory"
    );

    // Deploy kontrak - cara yang lebih sederhana dan benar untuk Hardhat
    carServiceHistory = await CarServiceHistoryFactory.deploy();
  });

  describe("Car Registration", function () {
    it("Should register a new car", async function () {
      const vin = "1HGCM82633A123456";
      const make = "Mazda";
      const model = "RX-7";
      const year = 1979 ;

      // Test pendaftaran mobil baru
      await expect(carServiceHistory.registerCar(vin, make, model, year))
        .to.emit(carServiceHistory, "CarRegistered")
        .withArgs(vin, owner.address, make, model, year);

      // Verifikasi data mobil
      const [ownerAddress, carMake, carModel, carYear] =
        await carServiceHistory.getCarInfo(vin);
      expect(ownerAddress).to.equal(owner.address);
      expect(carMake).to.equal(make);
      expect(carModel).to.equal(model);
      expect(carYear).to.equal(year);
    });

    it("Should prevent duplicate VIN registration", async function () {
      const vin = "1HGCM82633A654321";
      await carServiceHistory.registerCar(vin, "Toyota", "Camry", 2021);

      await expect(
        carServiceHistory.registerCar(vin, "Honda", "Civic", 2022)
      ).to.be.revertedWith("VIN already registered");
    });
  });
});
