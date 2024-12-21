/**
 * Acceleration due to gravity in meters per second squared (m/s^2).
 * Used for calculating forces that act on the ball.
 */
export const g = 9.8;

/**
 * Coefficient of friction (dynamic or rolling) between the ball and the table.
 * This affects how quickly the ball slows down as it rolls.
 */
export const mu = 0.00985;

/**
 * Coefficient of static friction.
 * This influences the threshold at which the ball starts to slip.
 */
export const muS = 0.16;

/**
 * Coefficient of friction with the cushion (bumpers).
 * Used to determine energy loss and friction effects when the ball bounces off the rails.
 */
export const muC = 0.8;

/**
 * A scaling factor or density-related parameter (exact purpose depends on the physics model).
 * Used in torque or friction calculations.
 */
export const rho = 0.034;

/**
 * Mass of the ball in kilograms (kg).
 */
export const m = 0.23;

/**
 * Radius of the ball in meters (m).
 */
export const R = 0.03275;

/**
 * Coefficient of restitution, defining the elasticity of collisions.
 * Higher values mean a more elastic collision with less energy lost on impact.
 */
export const e = 0.86;

/**
 * Torque around the vertical axis (Z-axis) influenced by friction.
 * Calculated using mu, mass, gravity, and the scaling factor rho.
 */
export const Mz = ((mu * m * g * 2) / 3) * rho;

/**
 * Torque in the horizontal plane (X-Y plane),
 * factoring the ball's radius, friction (mu), mass, and gravity.
 */
export const Mxy = (7 / (5 * Math.sqrt(2))) * R * mu * m * g;

/**
 * Moment of inertia for a solid sphere (2/5 * m * R^2).
 * This defines how resistant the ball is to changes in its rotation.
 */
export const I = (2 / 5) * m * R * R;
