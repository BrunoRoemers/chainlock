let contractAddress;

async function deployment() {
  const contractToDeploy = await hre.ethers.getContractFactory("VaultFactory");
  const contract = await contractToDeploy.deploy();
  await contract.deployed();
  
  //const vaultAdress = await contract.createVault();
  console.log("Contract deployed");
  console.log("Contract address: " + contract.address);
  //console.log(vaultAdress);
  contractAddress = contract.address;
}

async function deploy() {
  try {
    await deployment();
    return;
  } catch (err) {
    console.log("Error!");
    console.log(err);
    return;
  }
}

deploy();
