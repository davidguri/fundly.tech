import dotenv from "dotenv"
import CryptoJS from "crypto-js"

dotenv.config()

export class Crypto {
  static secretKey: string = process.env.CRYPTO_SECRET_KEY

  static encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString()
  }

  static decrypt(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
}