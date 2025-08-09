import type { User } from '../interfaces/auth.interfaces';

/**
 * Obtiene el símbolo de moneda basado en el usuario
 * @param user - Objeto usuario con información de país y moneda
 * @returns Símbolo de moneda (por defecto "$")
 */
export const getCurrencySymbol = (user: User | null): string => {
  if (!user) return "$";


  // Caso especial: Venezuela
  if (user.country === "Venezuela" || user.country === "VE") {
    return "Bs. ";
  }
  
  // Si el usuario tiene un currencySymbol configurado, usarlo
  if (user.currencySymbol) {
    return user.currencySymbol;
  }
  
  return "$";
};

/**
 * Verifica si el usuario es de Venezuela
 * @param user - Objeto usuario
 * @returns true si el usuario es de Venezuela
 */
export const isVenezuelanUser = (user: User | null): boolean => {
  if (!user) return false;
  return user.country === "Venezuela";
};

/**
 * Formatea un número como moneda con el símbolo correspondiente
 * @param amount - Cantidad a formatear
 * @param user - Objeto usuario con información de moneda
 * @param options - Opciones adicionales de formato
 * @returns String formateado con el símbolo de moneda
 */
export const formatCurrency = (
  amount: number,
  user: User | null,
  options?: {
    showDecimals?: boolean;
    decimalPlaces?: number;
  }
): string => {
  
  const currencySymbol = getCurrencySymbol(user);
  const { showDecimals = true, decimalPlaces = 2 } = options || {};
  
  if (showDecimals) {
    return `${currencySymbol}${amount.toFixed(decimalPlaces)}`;
  }
  
  
  return `${currencySymbol}${Math.round(amount)}`;
};

/**
 * Formatea un número como moneda con separadores de miles
 * @param amount - Cantidad a formatear
 * @param user - Objeto usuario con información de moneda
 * @param options - Opciones adicionales de formato
 * @returns String formateado con separadores de miles
 */
export const formatCurrencyWithSeparators = (
  amount: number,
  user: User | null,
  options?: {
    showDecimals?: boolean;
    decimalPlaces?: number;
  }
): string => {
  const currencySymbol = getCurrencySymbol(user);
  const { showDecimals = true, decimalPlaces = 2 } = options || {};
  
  // Para Venezuela, usar formato específico
  if (isVenezuelanUser(user)) {
    const formatter = new Intl.NumberFormat('es-VE', {
      style: 'decimal',
      minimumFractionDigits: showDecimals ? decimalPlaces : 0,
      maximumFractionDigits: showDecimals ? decimalPlaces : 0,
    });
    return `${currencySymbol}${formatter.format(amount)}`;
  }
  
  // Para otros países, usar formato español
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: showDecimals ? decimalPlaces : 0,
    maximumFractionDigits: showDecimals ? decimalPlaces : 0,
  });
  
  return `${currencySymbol}${formatter.format(amount)}`;
};

/**
 * Hook personalizado para usar el formateador de moneda
 * @param user - Objeto usuario del store
 * @returns Objeto con funciones de formateo
 */
export const useCurrencyFormatter = (user: User | null) => {
  return {
    formatCurrency: (amount: number, options?: { showDecimals?: boolean; decimalPlaces?: number }) =>
      formatCurrency(amount, user, options),
    formatCurrencyWithSeparators: (amount: number, options?: { showDecimals?: boolean; decimalPlaces?: number }) =>
      formatCurrencyWithSeparators(amount, user, options),
    getCurrencySymbol: () => getCurrencySymbol(user),
    isVenezuelanUser: () => isVenezuelanUser(user),
  };
}; 