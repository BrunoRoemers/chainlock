import { EthEncryptedData } from "@metamask/eth-sig-util"
import { useCallback, useEffect, useState } from "react"
import Wallet from "../objects/Wallet.interface"
import importPrivateKeyBase64 from "../utils/crypto/importPrivateKeyBase64"
import importPublicKeyBase64 from "../utils/crypto/importPublicKeyBase64"
import lock from "../utils/hooks/lock"

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
        const encryptedVaultPrivateKey: EthEncryptedData = {
          version: "x25519-xsalsa20-poly1305",
          nonce: "DNaEC6e4z6IIjh8rwCaTW7bKLoMEj0l5",
          ephemPublicKey: "ING6SgF1pRjI83jy3hDf1BhctkRWcnYL85omhpbqdzo=",
          ciphertext: "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"
        }

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
        const decryptedVaultPublicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAu/NalXEPNTF8u1MCCDM3VxtbyjlWOEKQ08PWYJi5FTZIiYc7xuG7K/w0csRH4AGvfKNjgW1fwptaM2h3coSiIuKxuPshvbAPKF6sJp9wrt6DBKwvko6lEhCT28LK0f4AHIsnLTVHSC1wuY2RATyvc6wb1ASZZQKSSFVsNp1SxULiO/yaaeM7OFBlfzDMsEf7SUtH3sVruJX2ALthR1DPj/lxxkz7QQX0LfHllHm2sGR0EQ+3lKOKj+pOgy0gtH+b7sdbkW3upq0D+OclZ0L/kdZuCPhWCSdrGysHWVgjVgN9VgU8Rj3/bGJz7I31qEyCvlTDFfS6YfCdX3hQ1k9ejAoM0eRTrGMozvSNmxVHULxzNGYrXdXzol8UJk2yVq4qu4Vctj9znfgGrjqACvZ5UNeB8FMzNqbr4tR8lKjCqX367ktWU4I1MADg3iezL/kSKWX8XjFhUWIIaq6NctzcX//h31dlguHegEIxvS4j+X31FlWnAIGib8FNgI6B0J3NiVhasTNZA0bt3FYpOg9m5UA64jn8LYC4P8INF9tPDFeOzRBZTJosh81hT8E0m6JeAqI8owy0duTSngf+0If9UOT66Wg2GQVq2MqNOwM5CIWs9SIYEXyjS/5pN03tekmdWKGnPFWA1mLc+a+xbg6F1ef1Wn/iuJ12eAgHEdjvXsMCAwEAAQ=="
        
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
