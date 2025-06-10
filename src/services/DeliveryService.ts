import ftp from "basic-ftp"; // si tu veux gérer FTP
import axios from "axios";

class DeliveryService {
  static async sendViaFTP(
    releaseFolder: string,
    ftpDetails: any
  ): Promise<void> {
    const client = new ftp.Client();
    try {
      await client.access({
        host: ftpDetails.host,
        user: ftpDetails.user,
        password: ftpDetails.password,
        secure: false,
      });

      await client.uploadFromDir(releaseFolder);
    } finally {
      client.close();
    }
  }

  static async sendViaAPI(releaseData: any, apiEndpoint: string): Promise<any> {
    const response = await axios.post(apiEndpoint, releaseData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
}

export default DeliveryService;
