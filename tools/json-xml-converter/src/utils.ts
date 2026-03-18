export type ConversionDirection = 'json-to-xml' | 'xml-to-json';

export interface ConverterOptions {
  spaces: number;
  compact: boolean;
  ignoreDeclaration: boolean;
  ignoreAttributes: boolean;
}

export type WorkerAPI = {
  convert(
    input: string,
    direction: ConversionDirection,
    options: ConverterOptions,
  ): Promise<string>;
};
