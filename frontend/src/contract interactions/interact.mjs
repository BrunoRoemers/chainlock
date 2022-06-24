import { ethers } from "ethers"

const vaultAddress = '';
const vaultABI = '';

let contract;

try {
    const { ethereum } = window;

    if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        contract = new ethers.Contract(vaultAddress, vaultABI, signer);
    }
}
catch (err) {
    console.log('Install metamask first');
    console.log(err);
}

function getData() {
    const data = contract.getPassword(await signer.getAddress());
    data.forEach(element => {
        let elems = element.split('~#~');
        let platform = elems[0];
        let encrypted_username = elems[1];
        let encrypted_password = elems[2];
    });
}