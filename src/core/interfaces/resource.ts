export interface Resource {
  RID: number;
  CFID: number;
  Name: string;
  Type: string;
  Description?: string;
  ParsedYAML: object;
  CreatedAt: string;
}
