import { useAppStore } from "@/store";
import { shallow } from "zustand/shallow";

export const useCurrency = () => {
  // const { user, currencyMode, dollarRate } = useAppStore(
  //   (state) => ({
  //     user: state.user,
  //     currencyMode: state.currencyMode,
  //     dollarRate: state.dollarRate,
  //   }),
  //   shallow
  // );

  const user = useAppStore((state) => state.user);
  const currencyMode = useAppStore((state) => state.currencyMode);
  const dollarRate = useAppStore((state) => state.dollarRate);

  
  const formatCurrency = (amount: number, forceMode?: "USD" | "LOCAL") => {
    if (typeof amount !== "number") {
      return "";
    }

    const mode = forceMode || currencyMode;

    if (mode === "LOCAL" && dollarRate) {
      const localAmount = amount * dollarRate;
      const formatter = new Intl.NumberFormat("es-VE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `Bs. ${formatter.format(localAmount)}`;
    }

    // Default to USD
    const currencyCode = user?.currency || "USD";
    const currencySymbol = user?.currencySymbol || "$";

    if (!currencyCode || currencyCode.length !== 3) {
      return `${currencySymbol}${amount.toFixed(2)}`;
    }

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "symbol",
      })
        .format(amount)
        .replace(currencyCode, currencySymbol);
    } catch (error) {
      return `${currencySymbol}${amount.toFixed(2)}`;
    }
  };

  return { formatCurrency, currencyMode, dollarRate };
};

