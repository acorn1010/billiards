/** Gravity in m/s**2. */
export const g = 9.8;
export const mu = 0.00985;
export const muS = 0.16;
export const muC = 0.8;
export const rho = 0.034;
export const m = 0.23;
export const R = 0.03275;
export const e = 0.86;
export const Mz = ((mu * m * g * 2) / 3) * rho;
export const Mxy = (7 / (5 * Math.sqrt(2))) * R * mu * m * g;
export const I = (2 / 5) * m * R * R;
