export type ConversionDirection = 'html-to-md' | 'md-to-html';

export interface ConverterOptions {
  gfm: boolean;
  breaks: boolean;
  headingStyle: 'setext' | 'atx';
  hr: string;
  bulletListMarker: '-' | '+' | '*';
  codeBlockStyle: 'indented' | 'fenced';
  emDelimiter: '_' | '*';
  strongDelimiter: '__' | '**';
}

export type WorkerAPI = {
  convert(
    input: string,
    direction: ConversionDirection,
    options: ConverterOptions,
  ): Promise<string>;
};
