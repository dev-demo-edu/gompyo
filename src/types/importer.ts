export enum CalculationType {
  STANDARD = "STANDARD",
  DNB = "DNB",
  NAMHAE = "NAMHAE",
}

export interface Importer {
  id: string;
  importerName: string;
  importerCode: string | null;
  calculationType: CalculationType;
}
