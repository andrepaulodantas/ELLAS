import { jsPDF } from "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: {
      head: string[][];
      body: string[][];
      startY?: number;
      margin?: { top?: number; right?: number; bottom?: number; left?: number };
      styles?: {
        fontSize?: number;
        cellPadding?: number;
        overflow?: "linebreak" | "ellipsis" | "visible" | "hidden";
        halign?: "left" | "center" | "right";
        valign?: "top" | "middle" | "bottom";
        fontStyle?: "normal" | "bold" | "italic" | "bolditalic";
        fillColor?: number | number[] | string;
        textColor?: number | number[] | string;
        cellWidth?: "auto" | "wrap" | number;
        minCellHeight?: number;
      };
    }) => jsPDF;
  }
}
