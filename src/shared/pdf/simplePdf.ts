/**
 * Escritor mínimo de PDF: texto, líneas y rectángulos sobre páginas A4.
 *
 * Existe para no cargar una librería de cientos de KB solo para dibujar un
 * formulario en blanco. Usa las fuentes estándar Helvetica y Helvetica-Bold,
 * que todo visor de PDF trae incorporadas, así que no hace falta incrustar
 * ninguna fuente. A cambio, el texto se limita a WinAnsi (Latin-1): cubre las
 * tildes, la ñ y los signos ¿¡ del español; lo que quede fuera se degrada a la
 * letra base o a "?".
 *
 * Las coordenadas se expresan en puntos con el origen arriba a la izquierda,
 * como en pantalla; la conversión al origen abajo-izquierda del PDF se hace aquí.
 */

export type PdfFont = 'regular' | 'bold';
export type PdfColor = readonly [number, number, number];

export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;

const BLACK: PdfColor = [0, 0, 0];

const FONT_RESOURCE: Record<PdfFont, string> = { regular: 'F1', bold: 'F2' };

// Anchos AFM de Helvetica para los caracteres 32..126, en milésimas del cuerpo.
const HELVETICA_WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

const HELVETICA_BOLD_WIDTHS = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611,
  975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556,
  333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611,
  611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584,
];

/** Caracteres Unicode que en WinAnsi viven en el tramo 0x80-0x9F. */
const WIN_ANSI_EXTRAS: Record<string, number> = {
  '€': 0x80, '…': 0x85, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97,
};

function toWinAnsiCode(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 32 && code <= 126) return code;
  if (code >= 160 && code <= 255) return code;
  if (WIN_ANSI_EXTRAS[char] !== undefined) return WIN_ANSI_EXTRAS[char];
  if (code === 9 || code === 10 || code === 13) return 32;
  // Descompone la letra y se queda con la base, sin las marcas diacríticas
  // combinables (U+0300..U+036F).
  const base = Array.from(char.normalize('NFD'))
    .filter((part) => part.charCodeAt(0) < 0x300 || part.charCodeAt(0) > 0x36f)
    .join('');
  if (base && base !== char) return toWinAnsiCode(base.charAt(0));
  return 63; // "?"
}

/** Ancho de un código WinAnsi; las letras acentuadas miden lo mismo que su base. */
function glyphWidth(code: number, font: PdfFont): number {
  const table = font === 'bold' ? HELVETICA_BOLD_WIDTHS : HELVETICA_WIDTHS;
  if (code >= 32 && code <= 126) return table[code - 32];
  const base = String.fromCharCode(code).normalize('NFD').charCodeAt(0);
  if (base >= 32 && base <= 126) return table[base - 32];
  return 556;
}

function encodeText(text: string): number[] {
  return Array.from(text).map(toWinAnsiCode);
}

/** Cadena literal de PDF. Los bytes altos van en octal para que el flujo sea ASCII puro. */
function literalString(codes: number[]): string {
  const body = codes
    .map((code) => {
      if (code === 40 || code === 41 || code === 92) return `\\${String.fromCharCode(code)}`;
      if (code > 126) return `\\${code.toString(8).padStart(3, '0')}`;
      return String.fromCharCode(code);
    })
    .join('');
  return `(${body})`;
}

function num(value: number): string {
  return Number(value.toFixed(2)).toString();
}

function colorOperands(color: PdfColor): string {
  return color.map((channel) => num(Math.min(1, Math.max(0, channel)))).join(' ');
}

/** Cadena de texto para el diccionario Info: UTF-16BE con BOM, en hexadecimal. */
function hexUtf16(text: string): string {
  let hex = 'FEFF';
  for (let index = 0; index < text.length; index += 1) {
    hex += text.charCodeAt(index).toString(16).padStart(4, '0').toUpperCase();
  }
  return `<${hex}>`;
}

export interface PdfTextOptions {
  size: number;
  font?: PdfFont;
  color?: PdfColor;
}

export interface PdfStrokeOptions {
  width?: number;
  color?: PdfColor;
  /** Patrón de guiones en puntos, p. ej. `[1, 2]` para punteado. */
  dash?: number[];
}

export interface PdfRectOptions extends PdfStrokeOptions {
  fill?: PdfColor;
  /** `false` para rellenar sin trazar borde. */
  stroke?: boolean;
}

export class SimplePdfDocument {
  private readonly pages: string[][] = [];
  private current = -1;

  constructor(
    readonly width = A4_WIDTH,
    readonly height = A4_HEIGHT,
    private readonly title = '',
  ) {}

  get pageCount(): number {
    return this.pages.length;
  }

  addPage(): number {
    this.pages.push([]);
    this.current = this.pages.length - 1;
    return this.current;
  }

  /** Vuelve a una página ya creada, útil para numerar al final. */
  goToPage(index: number): void {
    if (index < 0 || index >= this.pages.length) throw new Error(`La página ${index} no existe.`);
    this.current = index;
  }

  measure(text: string, size: number, font: PdfFont = 'regular'): number {
    return encodeText(text).reduce((total, code) => total + glyphWidth(code, font), 0) * size / 1000;
  }

  /**
   * Parte un texto en líneas que no superen `maxWidth`. Una palabra más larga que
   * la línea se deja entera: cortarla a media palabra se lee peor en papel.
   */
  wrap(text: string, maxWidth: number, size: number, font: PdfFont = 'regular'): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && this.measure(candidate, size, font) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  /** Recorta con "…" para que el texto quepa en `maxWidth`. */
  fit(text: string, maxWidth: number, size: number, font: PdfFont = 'regular'): string {
    if (this.measure(text, size, font) <= maxWidth) return text;
    let cut = text;
    while (cut.length > 1 && this.measure(`${cut}…`, size, font) > maxWidth) cut = cut.slice(0, -1);
    return `${cut.trimEnd()}…`;
  }

  /** Escribe texto con la línea base en `y`. */
  text(x: number, y: number, text: string, { size, font = 'regular', color = BLACK }: PdfTextOptions): void {
    this.push(
      `BT /${FONT_RESOURCE[font]} ${num(size)} Tf ${colorOperands(color)} rg ${num(x)} ${num(this.height - y)} Td ${literalString(encodeText(text))} Tj ET`,
    );
  }

  line(x1: number, y1: number, x2: number, y2: number, options: PdfStrokeOptions = {}): void {
    this.push(`q ${this.strokeState(options)} ${num(x1)} ${num(this.height - y1)} m ${num(x2)} ${num(this.height - y2)} l S Q`);
  }

  rect(x: number, y: number, width: number, height: number, options: PdfRectOptions = {}): void {
    const stroke = options.stroke !== false;
    const fill = options.fill ? `${colorOperands(options.fill)} rg ` : '';
    const paint = options.fill ? (stroke ? 'B' : 'f') : 'S';
    this.push(
      `q ${this.strokeState(options)} ${fill}${num(x)} ${num(this.height - y - height)} ${num(width)} ${num(height)} re ${paint} Q`,
    );
  }

  toBytes(): Uint8Array {
    if (this.pages.length === 0) this.addPage();

    const objects: string[] = [];
    const pageCount = this.pages.length;
    const firstPageObject = 5;
    const infoObject = firstPageObject + pageCount * 2;
    const kids = this.pages.map((_, index) => `${firstPageObject + index * 2} 0 R`).join(' ');

    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`);
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

    this.pages.forEach((operations, index) => {
      const contentObject = firstPageObject + index * 2 + 1;
      const content = operations.join('\n');
      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(this.width)} ${num(this.height)}] ` +
          `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`,
      );
      objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    });

    objects.push(`<< /Title ${hexUtf16(this.title)} /Producer ${hexUtf16('CPA Plataforma')} >>`);

    // Todo el documento es ASCII (los bytes altos del texto van en octal), así
    // que la longitud de la cadena coincide con los bytes y sirve para el xref.
    let output = '%PDF-1.4\n';
    const offsets: number[] = [];
    objects.forEach((body, index) => {
      offsets.push(output.length);
      output += `${index + 1} 0 obj\n${body}\nendobj\n`;
    });

    const xrefOffset = output.length;
    output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    output += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
    output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${infoObject} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    const bytes = new Uint8Array(output.length);
    for (let index = 0; index < output.length; index += 1) bytes[index] = output.charCodeAt(index);
    return bytes;
  }

  private strokeState({ width = 0.6, color = BLACK, dash }: PdfStrokeOptions): string {
    const dashPattern = dash?.length ? `[${dash.map(num).join(' ')}] 0 d ` : '';
    return `${num(width)} w ${colorOperands(color)} RG ${dashPattern}`.trimEnd();
  }

  private push(operation: string): void {
    if (this.current < 0) this.addPage();
    this.pages[this.current].push(operation);
  }
}
