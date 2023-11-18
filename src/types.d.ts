export type Meta = {
  tags?: Array<string>;
  title?: string;
  date?: string;
};

export type ConversionResponse = {
  html: string;
  meta?: Meta;
};

export type ProcessResponse = {
  html: string;
  meta?: Meta;
  filePath: string;
};