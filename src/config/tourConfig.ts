import { CSSProperties } from "react";

export const tourConfig = {
  styles: {
    popover: (base: CSSProperties) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      color: "white",
      borderRadius: "8px",
    }),
    close: (base: CSSProperties) => ({
      ...base,
      width: "16px",
      height: "16px",
      fontSize: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        color: "#FF2247",
      },
    }),
    arrow: (base: CSSProperties) => ({
      ...base,
      width: "32px",
      height: "32px",
      fontSize: "24px",
      "&:hover": {
        color: "#FF2247",
      },
    }),
    dot: (base: CSSProperties) => ({
      ...base,
      width: "12px",
      height: "12px",
    }),
  },
};
