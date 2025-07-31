import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store';
import { validateToken } from '../api/auth';

export function useTokenValidation() {
  const [isValidating, setIsValidating] = useState(true);
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const checkTokenValidity = async () => {
      console.log("🔍 [useTokenValidation] Iniciando validación de token");
      console.log("🔍 [useTokenValidation] Token:", token ? "Presente" : "Ausente");
      console.log("🔍 [useTokenValidation] Usuario:", user ? "Presente" : "Ausente");

      if (!token) {
        console.log("❌ [useTokenValidation] No hay token, redirigiendo a welcome");
        router.replace("/welcome");
        return;
      }

      if (!user) {
        console.log("❌ [useTokenValidation] No hay usuario, redirigiendo a welcome");
        router.replace("/welcome");
        return;
      }

      try {
        console.log("🔍 [useTokenValidation] Validando token con el servidor...");
        const isValid = await validateToken();
        console.log("🔍 [useTokenValidation] Resultado de validación:", isValid);
        
        if (!isValid) {
          console.log("❌ [useTokenValidation] Token inválido, haciendo logout y redirigiendo");
          logout();
          router.replace("/welcome");
        } else {
          console.log("✅ [useTokenValidation] Token válido, continuando");
        }
      } catch (error) {
        console.log("❌ [useTokenValidation] Error al validar token:", error);
        // En caso de error, asumir que el token no es válido
        logout();
        router.replace("/welcome");
      } finally {
        console.log("🔍 [useTokenValidation] Finalizando validación");
        setIsValidating(false);
      }
    };

    checkTokenValidity();
  }, [token, user, logout, router]);

  return { isValidating };
} 