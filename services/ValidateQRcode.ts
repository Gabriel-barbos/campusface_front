import axios from "axios";
import { useAuth } from "../AuthContext"; 

const API_URL = "https://949fbca4150a.ngrok-free.app/validate/qr-code";

export const useValidateQrCodeService = () => {
  const { user, token } = useAuth();

  const validateQrCode = async (code: string) => {
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    try {
      const response = await axios.post(
        API_URL,
        { code },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      return response.data; // { success, message, data }
    } catch (error: any) {
      console.error("Erro ao validar QR Code:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao validar QR Code");
    }
  };

  return { validateQrCode };
};