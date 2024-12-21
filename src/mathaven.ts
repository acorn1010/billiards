import { ThrowPlot } from "./diagram/throwplot";

declare global {
  interface Window {
    Plotly: any;
  }
}

new ThrowPlot().plotCutAngle();
