// Fixed angle of cushion contact point above ball center
const sinθ = 2 / 5;
// Fixed angle of cushion contact point above ball center
const cosθ = Math.sqrt(21) / 5;

export class Mathaven {
  // work done
  private P: number = 0;
  private WzI: number = 0;

  // centroid velocity
  vx: number;
  vy: number;

  // angular velocity
  ωx: number;
  ωy: number;
  ωz: number;

  // angles at I and C
  // Slip speed was unused?
  private φ: number;
  private φʹ: number;

  private i: number = 0;
  private N = 100;

  // physical constants
  private readonly M: number;
  private readonly R: number;
  private readonly μs: number;
  private readonly μw: number;
  private readonly ee: number;

  constructor(M: number, R: number, ee: number, μs: number, μw: number) {
    this.M = M;
    this.R = R;
    this.ee = ee;
    this.μs = μs;
    this.μw = μw;
  }

  public solve(
    vx: number,
    vy: number,
    ωx: number,
    ωy: number,
    ωz: number,
  ): void {
    this.vx = vx;
    this.vy = vy;
    this.ωx = ωx;
    this.ωy = ωy;
    this.ωz = ωz;
    this.WzI = 0;
    this.P = 0;
    this.i = 0;

    this.compressionPhase();
    const targetWorkRebound = this.ee * this.ee * this.WzI;
    this.restitutionPhase(targetWorkRebound);
  }

  private updateSlipSpeedsAndAngles(): void {
    const R = this.R;

    // Calculate velocities at the cushion (I)
    const v_xI = this.vx + this.ωy * R * sinθ - this.ωz * R * cosθ;
    const v_yI = -this.vy * sinθ + this.ωx * R;

    // Calculate velocities at the table (C)
    const v_xC = this.vx - this.ωy * R;
    const v_yC = this.vy + this.ωx * R;

    // Update slip speeds and angles at the cushion (I)
    this.φ = Math.atan2(v_yI, v_xI);
    if (this.φ < 0) {
      this.φ += 2 * Math.PI;
    }
    // Update slip speeds and angles at the table (C)
    this.φʹ = Math.atan2(v_yC, v_xC);
    if (this.φʹ < 0) {
      this.φʹ += 2 * Math.PI;
    }
  }

  private compressionPhase(): void {
    const ΔP = Math.max((this.M * this.vy) / this.N, 0.001);
    while (this.vy > 0) {
      this.updateSingleStep(ΔP);
    }
  }

  private restitutionPhase(targetWorkRebound: number): void {
    const ΔP = Math.max(targetWorkRebound / this.N, 0.001);
    this.WzI = 0;
    while (this.WzI < targetWorkRebound) {
      this.updateSingleStep(ΔP);
    }
  }

  updateSingleStep(ΔP: number): void {
    this.updateSlipSpeedsAndAngles();
    this.updateVelocity(ΔP);
    this.updateAngularVelocity(ΔP);
    this.updateWorkDone(ΔP);
    if (this.i++ > 10 * this.N) {
      throw "Solution not found";
    }
  }

  private updateVelocity(ΔP: number): void {
    const μs = this.μs;
    const μw = this.μw;
    const M = this.M;

    // Update centroid velocity components
    this.vx -=
      (1 / M) *
      (μw * Math.cos(this.φ) +
        μs * Math.cos(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) *
      ΔP;
    this.vy -=
      (1 / M) *
      (cosθ -
        μw * sinθ * Math.sin(this.φ) +
        μs * Math.sin(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) *
      ΔP;
  }

  private updateAngularVelocity(ΔP: number): void {
    const μs = this.μs;
    const μw = this.μw;
    const M = this.M;
    const R = this.R;

    this.ωx +=
      -(5 / (2 * M * R)) *
      (μw * Math.sin(this.φ) +
        μs * Math.sin(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) *
      ΔP;
    this.ωy +=
      -(5 / (2 * M * R)) *
      (μw * Math.cos(this.φ) * sinθ -
        μs * Math.cos(this.φʹ) * (sinθ + μw * Math.sin(this.φ) * cosθ)) *
      ΔP;
    this.ωz += (5 / (2 * M * R)) * (μw * Math.cos(this.φ) * cosθ) * ΔP;
  }

  private updateWorkDone(ΔP: number): void {
    const ΔWzI = ΔP * Math.abs(this.vy);
    this.WzI += ΔWzI;
    this.P += ΔP;
  }
}
