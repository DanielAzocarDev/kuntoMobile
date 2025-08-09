import { useAppStore } from "@/store";
import { useCurrencyFormatter } from "@/utils/formatCurrency";

/**
 * Hook personalizado que combina el store de usuario con el formateador de moneda
 * y el sistema de toggle para usuarios de Venezuela
 * @returns Objeto con funciones de formateo y el símbolo de moneda actual
 */
export const useCurrency = () => {
  const user = useAppStore((state) => state.user);
  const currencyMode = useAppStore((state) => state.currencyMode);
  const dollarRate = useAppStore((state) => state.dollarRate);
  const formatter = useCurrencyFormatter(user);
  
  // Función de formateo que considera el toggle de moneda para Venezuela
  const formatCurrency = (amount: number, options?: { showDecimals?: boolean; decimalPlaces?: number; compact?: boolean }) => {
    // Si el usuario es de Venezuela y hay tasa del dólar disponible, usar el sistema de toggle
    if (user?.country === "Venezuela" && dollarRate) {
      // Aplicar conversión automática según el modo actual
      let convertedAmount = amount;
      
      if (currencyMode === 'USD') {
        // Si estamos en modo USD, el valor ya está en dólares (no convertir)
        convertedAmount = amount;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
          maximumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
        }).format(convertedAmount);
      } else {
        // Si estamos en modo VES, convertir de dólares a bolívares
        convertedAmount = amount * dollarRate;
        // Usar formato personalizado para evitar el "S" automático
        const formatter = new Intl.NumberFormat('es-VE', {
          style: 'decimal',
          minimumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
          maximumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
        });
        return `Bs. ${formatter.format(convertedAmount)}`;
      }
    }
    
    // Para otros países o cuando no hay tasa del dólar, usar el formateador original
    return formatter.formatCurrency(amount, options);
  };

  // Función para convertir montos según el modo de moneda actual
  const convertAmount = (amount: number) => {
    if (user?.country === "Venezuela" && dollarRate) {
      if (currencyMode === 'USD') {
        // Si estamos en modo USD, el valor ya está en dólares
        return amount;
      } else {
        // Si estamos en modo VES, convertir de dólares a bolívares
        return amount * dollarRate;
      }
    }
    return amount;
  };

  // Función para obtener el valor original (sin conversión)
  const getOriginalAmount = (amount: number) => {
    if (user?.country === "Venezuela" && dollarRate) {
      if (currencyMode === 'USD') {
        // Si estamos en modo USD, el valor ya está en dólares
        return amount;
      } else {
        // Si estamos en modo VES, convertir de bolívares a dólares
        return amount / dollarRate;
      }
    }
    return amount;
  };
  
  // Función para formatear con separadores que también aplica conversión
  const formatCurrencyWithSeparators = (amount: number, options?: { showDecimals?: boolean; decimalPlaces?: number }) => {
    // Si el usuario es de Venezuela y hay tasa del dólar disponible, usar el sistema de toggle
    if (user?.country === "Venezuela" && dollarRate) {
      // Aplicar conversión automática según el modo actual
      let convertedAmount = amount;
      
      if (currencyMode === 'USD') {
        // Si estamos en modo USD, el valor ya está en dólares (no convertir)
        convertedAmount = amount;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
          maximumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
        }).format(convertedAmount);
      } else {
        // Si estamos en modo VES, convertir de dólares a bolívares
        convertedAmount = amount * dollarRate;
        // Usar formato personalizado para evitar el "S" automático
        const formatter = new Intl.NumberFormat('es-VE', {
          style: 'decimal',
          minimumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
          maximumFractionDigits: options?.showDecimals !== false ? (options?.decimalPlaces || 2) : 0,
        });
        return `Bs. ${formatter.format(convertedAmount)}`;
      }
    }
    
    // Para otros países o cuando no hay tasa del dólar, usar el formateador original
    return formatter.formatCurrencyWithSeparators(amount, options);
  };

  return {
    formatCurrency,
    convertAmount,
    getOriginalAmount,
    formatCurrencyWithSeparators,
    getCurrencySymbol: () => {
      if (user?.country === "Venezuela" && dollarRate) {
        return currencyMode === 'USD' ? '$' : 'Bs. ';
      }
      return formatter.getCurrencySymbol();
    },
    user,
    currencyMode,
    dollarRate,
    // Función de conveniencia para verificar si el usuario tiene moneda configurada
    hasCurrencyConfigured: () => {
      return !!(user?.currencySymbol || user?.country);
    },
    // Función específica para verificar si el usuario es de Venezuela
    isVenezuelanUser: () => {
      return formatter.isVenezuelanUser();
    },
    // Función para verificar si el sistema de toggle está activo
    isToggleActive: () => {
      return user?.country === "Venezuela" && !!dollarRate;
    },
  };
}; 