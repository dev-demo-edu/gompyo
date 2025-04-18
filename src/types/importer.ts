export enum CalculationType {
  STANDARD = "STANDARD",
  SPECIAL_A = "SPECIAL_A",
  SPECIAL_B = "SPECIAL_B",
}

export interface Importer {
  id: string;
  name: string;
  calculationType: CalculationType;
}
