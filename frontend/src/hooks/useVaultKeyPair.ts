import { EthEncryptedData } from "@metamask/eth-sig-util"
import { useCallback, useEffect, useState } from "react"
import Wallet from "../objects/Wallet.interface"
import importPrivateKeyBase64 from "../utils/crypto/importPrivateKeyBase64"
import importPublicKeyBase64 from "../utils/crypto/importPublicKeyBase64"
import lock from "../utils/hooks/lock"

const mockData: {
  [address: string]: {
    encryptedVaultPrivateKey: EthEncryptedData,
    decryptedVaultPublicKey: string,
  }
} = {
  '0xaef1bf9a5413cad02a69cdc1ff07c26c5a429264': {
    encryptedVaultPrivateKey: {
      version: "x25519-xsalsa20-poly1305",
      nonce: "MfpzbvndSxBnykU92iulNQCYqQf116tA",
      ephemPublicKey: "aPedJPtETxw2bzvoc3KVZMfhjKlOcuhtDuhKZtXDgh8=",
      ciphertext: "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"
    },
    decryptedVaultPublicKey: "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyJdKa3lV1YQ+JZz0hpgB8TBFRjm+5vp3yNCya26wkmkUj+bZXsqGt9B3kmCeLmpS2NodjILu6gGBkhKq65YvZrDPWvToB8Ueut7dAhgYEvXzkIlNwfqfC1zmFgzcXQ/wqcJVKA9mzPV4lA0/EXKFZR9OLzfAkQeTCpAt7NFTg3QvZNO9FF10OVEjSPINqvlmDs8/psNzolswersMnSa5+BHVKZEhcXmO6QEL/E6h669JpgooJjZyrP+TQn3qfbomkDvH78ku0NJS1MIf2oM2ThQJMuGSxRT6WAHtiujUpsVHD/1gqYAOQZYVbBsKhQZkoll+jaVpr+bpdhvVmg7BGM4NHM2iHxiOFCaUxhUaP2kSE7Txp7qyB7q8O6gvDZOUVUqjRkkl6PNWTZR7syt7ZKyB5nuR6C7yWW3RTIvunapBvqiJDCqKYYhsndgBxR8srXM0ytvsGmfZZ/VMqUNnDMp6y7h1381vjVGaVH6G3F/EEdUnIWs1LDi6P0McVlXn212llD341jSz5dXY95/0bKxObrGX0dVj1kbH8xnAjwOr2X9kNS9JiujrNZjlGRL/5pd78alP3p/La93CKUiAOdaSAqbRgfsV+BxOSspCQHrJz3eR3KY/AXQo/tlKZlE7rfLhUSBfGF0nYvePCAeXcRHA4Q3E2VAtvE+skTN3wPMCAwEAAQ=="
  },
  '0xd14c391361ade0e98396c203228220ce52c6b8e3': {
    encryptedVaultPrivateKey: {
      version: "x25519-xsalsa20-poly1305",
      nonce: "DNaEC6e4z6IIjh8rwCaTW7bKLoMEj0l5",
      ephemPublicKey: "ING6SgF1pRjI83jy3hDf1BhctkRWcnYL85omhpbqdzo=",
      ciphertext: "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"
    },
    decryptedVaultPublicKey: "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAu/NalXEPNTF8u1MCCDM3VxtbyjlWOEKQ08PWYJi5FTZIiYc7xuG7K/w0csRH4AGvfKNjgW1fwptaM2h3coSiIuKxuPshvbAPKF6sJp9wrt6DBKwvko6lEhCT28LK0f4AHIsnLTVHSC1wuY2RATyvc6wb1ASZZQKSSFVsNp1SxULiO/yaaeM7OFBlfzDMsEf7SUtH3sVruJX2ALthR1DPj/lxxkz7QQX0LfHllHm2sGR0EQ+3lKOKj+pOgy0gtH+b7sdbkW3upq0D+OclZ0L/kdZuCPhWCSdrGysHWVgjVgN9VgU8Rj3/bGJz7I31qEyCvlTDFfS6YfCdX3hQ1k9ejAoM0eRTrGMozvSNmxVHULxzNGYrXdXzol8UJk2yVq4qu4Vctj9znfgGrjqACvZ5UNeB8FMzNqbr4tR8lKjCqX367ktWU4I1MADg3iezL/kSKWX8XjFhUWIIaq6NctzcX//h31dlguHegEIxvS4j+X31FlWnAIGib8FNgI6B0J3NiVhasTNZA0bt3FYpOg9m5UA64jn8LYC4P8INF9tPDFeOzRBZTJosh81hT8E0m6JeAqI8owy0duTSngf+0If9UOT66Wg2GQVq2MqNOwM5CIWs9SIYEXyjS/5pN03tekmdWKGnPFWA1mLc+a+xbg6F1ef1Wn/iuJ12eAgHEdjvXsMCAwEAAQ=="
  }
}

interface Options {
  onDialogSuccess?: () => void
  onDialogCancel?: () => void
}

interface Return {
  vaultKeyPair: CryptoKeyPair | undefined
  isDialogOpen: boolean
  isBusy: boolean
  forgetVaultKeyPair: () => void
}

const useVaultKeyPair = (
  wallet: Wallet | undefined,
  address: string | undefined, 
  vaultAddress: string | undefined,
  options?: Options
): Return => {
  // TODO 1. access the vault smart contract
  // TODO 2. find the key pair associated with the address
  // TODO 3. decrypt the private key using metamask (private key of wallet)
  // TODO 4. return the key pair

  const [ vaultKeyPair, setVaultKeyPair ] = useState<CryptoKeyPair | undefined>()
  const [ isDialogOpen, setIsDialogOpen ] = useState<boolean>(false)
  const [ isBusy, setIsBusy] = useState<boolean>(false)

  const decryptDialog = useCallback(async (wallet: Wallet, address: string, encryptedVaultPrivateKey: EthEncryptedData) => {
    try {
      // signal dialog open
      setIsDialogOpen(true)

      const decryptedVaultPrivateKey = await wallet.decryptWithPrivateKey(address, encryptedVaultPrivateKey).finally()
      
      // callback when user clicks on "decrypt"
      options?.onDialogSuccess && options.onDialogSuccess()

      return decryptedVaultPrivateKey
    } catch {
      // callback when user clicks on "cancel"
      options?.onDialogCancel && options.onDialogCancel()
    } finally {
      // signal dialog closed
      setIsDialogOpen(false)
    }
  }, [options])

  // set the vault key pair...
  useEffect(() => {
    if (wallet && address && vaultAddress && !isBusy && !vaultKeyPair) {
      lock(setIsBusy, async () => {
        // TODO create impl...
        // NOTE: This is the private key of the current user (address) in the given vault.
        //       It is stored in the vault smart contract in encrypted form because it has to stay private...
        //       The righful owner of this private key can decrypt it with metamask to get access to their vault private key.
        //       With the vault private key, they can unlock the passwords to which they have access.
        const encryptedVaultPrivateKey: EthEncryptedData = mockData[address].encryptedVaultPrivateKey

        // decrypt the private vault key with metamask (prompt)
        const decryptedVaultPrivateKey = await decryptDialog(wallet, address, encryptedVaultPrivateKey)
        if (!decryptedVaultPrivateKey) {
          return
        }
        
        // TODO create impl...
        // NOTE: This is the public key of the current user (address) in the given vault.
        //       It is stored in the smart contract in plain text, such that other users can share/encrypt passwords for this user.
        //       The current user should also encrypt with their public vault key any passwords it saves,
        //       such that it can retrieve the passwords at a later date with their private vault key.
        const decryptedVaultPublicKey = mockData[address].decryptedVaultPublicKey
        
        setVaultKeyPair({
          privateKey: await importPrivateKeyBase64(decryptedVaultPrivateKey),
          publicKey: await importPublicKeyBase64(decryptedVaultPublicKey),
        })
      })
    }
  }, [wallet, address, vaultAddress, isBusy, vaultKeyPair, decryptDialog])

  // unset the vault key pair...
  useEffect(() => {
    if (!wallet || !address || !vaultAddress) {
      setVaultKeyPair(undefined)
    }
  }, [wallet, address, vaultAddress])

  const forgetVaultKeyPair = useCallback(() => setVaultKeyPair(undefined), [])

  return { vaultKeyPair, forgetVaultKeyPair, isDialogOpen, isBusy }
}

export default useVaultKeyPair
