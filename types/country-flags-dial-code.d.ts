declare module 'country-flags-dial-code' {
  export interface CountryData {
    code: string;
    country: string;
    dialCode: string;
    flag: string;
  }

  export function getCountryListMap(): Record<string, CountryData>;
}
