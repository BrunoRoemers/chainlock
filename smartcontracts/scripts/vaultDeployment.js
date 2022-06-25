let contractAddress: string;

async function deployment(callerAddress: string): void {
  const owner = await hre.ethers.getSigners();
  const contractToDeploy = await hre.ethers.getContractFactory("Vault");
  const contract = await contractToDeploy.deploy(callerAddress);
  await contract.deployed();

  console.log("Contract deployed");
  console.log("Contract address: " + contract.address);
  contractAddress = contract.address;
}

async function deploy(callerAddress: string): void {
  try {
    await deployment(callerAddress);
    return;
  } catch (err) {
    console.log("Error!");
    console.log(err);
    return;
  }
}

const callerAddress: string = "0x97ecddd4c4Ecd402e6aaf63F8bD576Dd2f259aaF";
deploy(callerAddress);
