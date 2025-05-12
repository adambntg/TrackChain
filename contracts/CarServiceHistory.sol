// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CarServiceHistory {
    // Struct untuk menyimpan data service
    struct ServiceRecord {
        uint256 timestamp;
        string workshopName;
        string serviceType;
        uint256 mileage;
        string[] partsReplaced;
        string notes;
    }

    // Struct untuk data mobil
    struct Car {
        address currentOwner;
        string make;
        string model;
        uint256 year;
        string vin; // Vehicle Identification Number
        ServiceRecord[] serviceHistory;
    }

    // Mappings
    mapping(string => Car) public cars; // Menggunakan VIN sebagai key
    mapping(string => bool) public vinExists;

    // Events
    event CarRegistered(string vin, address owner, string make, string model, uint256 year);
    event ServiceAdded(string vin, uint256 timestamp, string workshop, string serviceType);

    // Modifier
    modifier onlyCarOwner(string memory vin) {
        require(cars[vin].currentOwner == msg.sender, "Not the car owner");
        _;
    }

    modifier validVin(string memory vin) {
        require(vinExists[vin], "VIN not registered");
        _;
    }

    // Fungsi untuk mendaftarkan mobil baru
    function registerCar(
        string memory vin,
        string memory make,
        string memory model,
        uint256 year
    ) public {
        require(!vinExists[vin], "VIN already registered");
        require(bytes(vin).length > 0, "VIN cannot be empty");

        cars[vin] = Car({
            currentOwner: msg.sender,
            make: make,
            model: model,
            year: year,
            vin: vin,
            serviceHistory: new ServiceRecord[](0)
        });

        vinExists[vin] = true;
        emit CarRegistered(vin, msg.sender, make, model, year);
    }

    // Fungsi untuk menambah riwayat service
    function addServiceRecord(
        string memory vin,
        string memory workshopName,
        string memory serviceType,
        uint256 mileage,
        string[] memory partsReplaced,
        string memory notes
    ) public validVin(vin) onlyCarOwner(vin) {
        cars[vin].serviceHistory.push(ServiceRecord({
            timestamp: block.timestamp,
            workshopName: workshopName,
            serviceType: serviceType,
            mileage: mileage,
            partsReplaced: partsReplaced,
            notes: notes
        }));

        emit ServiceAdded(vin, block.timestamp, workshopName, serviceType);
    }

    // Fungsi untuk mendapatkan info mobil
    function getCarInfo(string memory vin) public view validVin(vin) returns (
        address owner,
        string memory make,
        string memory model,
        uint256 year,
        uint256 serviceCount
    ) {
        Car storage car = cars[vin];
        return (
            car.currentOwner,
            car.make,
            car.model,
            car.year,
            car.serviceHistory.length
        );
    }

    // Fungsi untuk mendapatkan riwayat service
    function getServiceHistory(string memory vin, uint256 index) public view validVin(vin) returns (
        uint256 timestamp,
        string memory workshopName,
        string memory serviceType,
        uint256 mileage,
        string[] memory partsReplaced,
        string memory notes
    ) {
        ServiceRecord storage record = cars[vin].serviceHistory[index];
        return (
            record.timestamp,
            record.workshopName,
            record.serviceType,
            record.mileage,
            record.partsReplaced,
            record.notes
        );
    }

    // Fungsi untuk transfer kepemilikan
    function transferOwnership(string memory vin, address newOwner) public validVin(vin) onlyCarOwner(vin) {
        require(newOwner != address(0), "Invalid new owner address");
        cars[vin].currentOwner = newOwner;
    }
}