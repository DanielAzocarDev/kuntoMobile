import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { validateToken } from '../api/auth';

export function useGlobalTokenValidation() {
  const [isValidating, setIsValidating] = useState(true);
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  useEffect(() => {
    const validateGlobalToken = async () => {
      console.log("🔍 [useGlobalTokenValidation] Iniciando validación global del token");
      console.log("🔍 [useGlobalTokenValidation] Token:", token ? "Presente" : "Ausente");
      console.log("🔍 [useGlobalTokenValidation] Usuario:", user ? "Presente" : "Ausente");

      if (!token) {
        console.log("❌ [useGlobalTokenValidation] No hay token");
        setIsValidating(false);
        return;
      }

      if (!user) {
        console.log("❌ [useGlobalTokenValidation] No hay usuario");
        setIsValidating(false);
        return;
      }

      try {
        console.log("🔍 [useGlobalTokenValidation] Validando token con el servidor...");
        const isValid = await validateToken();
        console.log("🔍 [useGlobalTokenValidation] Resultado de validación:", isValid);
        
        if (!isValid) {
          console.log("❌ [useGlobalTokenValidation] Token inválido, haciendo logout");
          logout();
        } else {
          console.log("✅ [useGlobalTokenValidation] Token válido, continuando");
        }
      } catch (error) {
        console.log("❌ [useGlobalTokenValidation] Error al validar token:", error);
        // En caso de error, asumir que el token no es válido
        logout();
      } finally {
        console.log("🔍 [useGlobalTokenValidation] Finalizando validación global");
        setIsValidating(false);
      }
    };

    validateGlobalToken();
  }, [token, user, logout]);

  return { isValidating };
} 