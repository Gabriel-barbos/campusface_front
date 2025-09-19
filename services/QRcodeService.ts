import axios from "axios";
import { useAuth } from "../AuthContext"; 

const API_URL = "https://949fbca4150a.ngrok-free.app/validate/qr-code";

export const useQrCodeService = () => {
  const { user, token } = useAuth();

  const generateQrCode = async () => {
    if (!user?.id) {
      throw new Error("Usuário não encontrado");
    }

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    try {
      const response = await axios.post(
        `${API_URL}/generate`,
        { userId: user.id },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      return response.data; // { success, data: { code, expirationTime } }
    } catch (error: any) {
      console.error("Erro ao gerar QR Code:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao gerar QR Code");
    }
  };

  return { generateQrCode };
};