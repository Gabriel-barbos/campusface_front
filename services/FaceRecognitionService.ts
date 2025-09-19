import axios from "axios";
import { useAuth } from "../AuthContext";

const API_URL = "https://949fbca4150a.ngrok-free.app/validate/face";

export const useFaceRecognitionService = () => {
  const { user, token } = useAuth();

  const validateFace = async (imageUri: string) => {
    if (!user?.id) {
      throw new Error("Usuário não encontrado");
    }

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg", // ajuste conforme o tipo real da imagem (jpeg/png)
        name: "face.jpg",
      } as any);

      const response = await axios.post(
        `${API_URL}/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      return response.data; // { message, success, data }
    } catch (error: any) {
      console.error("Erro ao validar rosto:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao validar rosto");
    }
  };

  return { validateFace };
};
