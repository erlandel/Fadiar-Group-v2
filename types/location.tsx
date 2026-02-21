export type MunicipalityData = {
  id: string;
  municipio: string;
}

export type ProvinceData = {
  id: string;
  provincia: string;
  code: string;
  municipios: MunicipalityData[];
}
