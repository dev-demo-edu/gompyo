export enum CalculationType {
  STANDARD = "STANDARD",
  DNB = "DNB",
  NAMHAE = "NAMHAE",
}

export interface Importer {
  id: string;
  name: string;
  calculationType: CalculationType;
}
