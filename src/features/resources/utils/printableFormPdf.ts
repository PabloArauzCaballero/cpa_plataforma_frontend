import { A4_HEIGHT, A4_WIDTH, SimplePdfDocument, type PdfColor } from '@/shared/pdf/simplePdf';
import {
  buildPrintableFormPlan,
  type PrintableField,
  type PrintableFormInput,
  type PrintableFormPlan,
} from '../domain/printableForm';
import { downloadBlob, safeFilename } from './exportRecords';

/**
 * Dibuja el plan de `printableForm` como una hoja A4 para llenar a mano.
 *
 * Es compacta a propósito: recuadros con la etiqueta arriba y el espacio para
 * escribir debajo, varios campos por fila y casillas en vez de listas. Un alta
 * de estudiante entra en media hoja, con la firma y el bloque de uso interno.
 */

const MARGIN = 30;
const CONTENT_WIDTH = A4_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = A4_HEIGHT - 34;
/** La fila se reparte en cuartos: los recuadros de filas distintas quedan alineados. */
const ROW_UNITS = 4;
const UNIT_WIDTH = CONTENT_WIDTH / ROW_UNITS;

const INK: PdfColor = [0.1, 0.12, 0.16];
const MUTED: PdfColor = [0.36, 0.39, 0.43];
const FAINT: PdfColor = [0.66, 0.69, 0.72];
const BORDER: PdfColor = [0.5, 0.53, 0.57];
const BRAND: PdfColor = [1 / 255, 43 / 255, 101 / 255];
const BAND: PdfColor = [0.9, 0.93, 0.97];

const LABEL_SIZE = 6.6;
const OPTION_SIZE = 7.4;
const HINT_SIZE = 6;
const LABEL_AREA = 11;
const LINE_CELL_HEIGHT = 30;
const OPTION_LINE_HEIGHT = 11;
const BOX_SIZE = 7;
const LONG_TEXT_LINES = 3;
const LONG_TEXT_LINE_HEIGHT = 13;
const SECTION_BAND_HEIGHT = 13;
const SECTION_GAP = 8;

const FIELD_UNITS: Record<PrintableField['kind'], number> = {
  text: 2,
  longText: 4,
  number: 1,
  date: 1,
  time: 1,
  datetime: 2,
  yesNo: 1,
  choice: 1,
  attachment: 2,
};

interface LaidOutCell {
  field: PrintableField;
  width: number;
  height: number;
}

function formatDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function labelText(field: PrintableField): string {
  return `${field.label.toUpperCase()}${field.required ? ' *' : ''}`;
}

function optionWidth(pdf: SimplePdfDocument, option: string): number {
  return BOX_SIZE + 3 + pdf.measure(option, OPTION_SIZE) + 10;
}

/** Reparte las opciones en líneas que quepan en el ancho interior del recuadro. */
function layoutOptions(pdf: SimplePdfDocument, options: string[], innerWidth: number): string[][] {
  const lines: string[][] = [];
  let line: string[] = [];
  let used = 0;
  for (const option of options) {
    const width = optionWidth(pdf, option);
    if (line.length && used + width > innerWidth) {
      lines.push(line);
      line = [];
      used = 0;
    }
    line.push(option);
    used += width;
  }
  if (line.length) lines.push(line);
  return lines;
}

/** Cuartos de fila que ocupa el campo: lo que pide su tipo, o más si la etiqueta o las casillas no caben. */
function fieldUnits(pdf: SimplePdfDocument, field: PrintableField): number {
  const optionsWidth = field.kind === 'choice'
    ? (field.options ?? []).reduce((total, option) => total + optionWidth(pdf, option), 0)
    : 0;
  const needed = Math.max(optionsWidth, pdf.measure(labelText(field), LABEL_SIZE, 'bold')) + 8;
  return Math.min(ROW_UNITS, Math.max(FIELD_UNITS[field.kind], Math.ceil(needed / UNIT_WIDTH)));
}

function cellHeight(pdf: SimplePdfDocument, field: PrintableField, width: number): number {
  if (field.kind === 'longText') return LABEL_AREA + LONG_TEXT_LINES * LONG_TEXT_LINE_HEIGHT + 4;
  if (field.kind === 'choice' || field.kind === 'yesNo' || field.kind === 'attachment') {
    const lines = layoutOptions(pdf, field.options ?? [], width - 8).length;
    return Math.max(LINE_CELL_HEIGHT, LABEL_AREA + lines * OPTION_LINE_HEIGHT + 6);
  }
  return LINE_CELL_HEIGHT;
}

/**
 * Agrupa los campos en filas de cuatro cuartos respetando el orden del
 * formulario en pantalla. El espacio que sobra en una fila se reparte en
 * proporción, para que ningún recuadro quede huérfano a media hoja.
 */
function layoutRows(pdf: SimplePdfDocument, fields: PrintableField[]): LaidOutCell[][] {
  const rows: Array<Array<{ field: PrintableField; units: number }>> = [];
  let row: Array<{ field: PrintableField; units: number }> = [];
  let used = 0;

  for (const field of fields) {
    const units = fieldUnits(pdf, field);
    if (row.length && used + units > ROW_UNITS) {
      rows.push(row);
      row = [];
      used = 0;
    }
    row.push({ field, units });
    used += units;
  }
  if (row.length) rows.push(row);

  return rows.map((items) => {
    const totalUnits = items.reduce((total, item) => total + item.units, 0);
    const cells = items.map((item) => ({ field: item.field, width: (item.units / totalUnits) * CONTENT_WIDTH, height: 0 }));
    const height = Math.max(...cells.map((cell) => cellHeight(pdf, cell.field, cell.width)));
    return cells.map((cell) => ({ ...cell, height }));
  });
}

function drawCell(pdf: SimplePdfDocument, cell: LaidOutCell, x: number, y: number): void {
  const { field, width, height } = cell;
  pdf.rect(x, y, width, height, { color: BORDER, width: 0.6 });
  pdf.text(x + 4, y + 8.2, pdf.fit(labelText(field), width - 8, LABEL_SIZE, 'bold'), { size: LABEL_SIZE, font: 'bold', color: MUTED });

  if (field.kind === 'longText') {
    for (let index = 1; index <= LONG_TEXT_LINES; index += 1) {
      const lineY = y + LABEL_AREA + index * LONG_TEXT_LINE_HEIGHT;
      pdf.line(x + 4, lineY, x + width - 4, lineY, { color: FAINT, width: 0.4, dash: [1, 1.6] });
    }
  }

  if (field.options && (field.kind === 'choice' || field.kind === 'yesNo' || field.kind === 'attachment')) {
    layoutOptions(pdf, field.options, width - 8).forEach((line, lineIndex) => {
      let optionX = x + 5;
      const boxY = y + LABEL_AREA + 3 + lineIndex * OPTION_LINE_HEIGHT;
      for (const option of line) {
        pdf.rect(optionX, boxY, BOX_SIZE, BOX_SIZE, { color: INK, width: 0.6 });
        pdf.text(optionX + BOX_SIZE + 3, boxY + BOX_SIZE - 0.8, option, { size: OPTION_SIZE, color: INK });
        optionX += optionWidth(pdf, option);
      }
    });
  }

  if (field.hint) {
    const hint = pdf.fit(field.hint, width - 8, HINT_SIZE);
    pdf.text(x + width - 4 - pdf.measure(hint, HINT_SIZE), y + height - 4, hint, { size: HINT_SIZE, color: FAINT });
  }
}

class FormWriter {
  private y = 0;

  constructor(
    private readonly pdf: SimplePdfDocument,
    private readonly plan: PrintableFormPlan,
  ) {}

  firstPage(): void {
    const { pdf, plan } = this;
    pdf.addPage();

    pdf.text(MARGIN, 38, 'CPA · Centro de Preparación Académica', { size: 8.5, font: 'bold', color: BRAND });
    const moduleText = `Módulo: ${plan.moduleLabel}`;
    pdf.text(A4_WIDTH - MARGIN - pdf.measure(moduleText, 7.5), 38, moduleText, { size: 7.5, color: MUTED });
    pdf.line(MARGIN, 44, A4_WIDTH - MARGIN, 44, { color: BRAND, width: 1.2 });

    const boxWidth = 100;
    const boxesX = A4_WIDTH - MARGIN - boxWidth * 2;
    const title = pdf.fit(`Formulario de registro · ${plan.title}`, boxesX - MARGIN - 10, 15, 'bold');
    pdf.text(MARGIN, 68, title, { size: 15, font: 'bold', color: INK });
    drawCell(pdf, { field: { name: 'fecha', label: 'Fecha', required: false, kind: 'date', hint: 'DD / MM / AAAA' }, width: boxWidth, height: 26 }, boxesX, 50);
    drawCell(pdf, { field: { name: 'folio', label: 'N° de folio', required: false, kind: 'text' }, width: boxWidth, height: 26 }, boxesX + boxWidth, 50);

    const instructions =
      'Escriba con letra de imprenta clara y bolígrafo. Los campos con * son obligatorios. ' +
      'Donde haya casillas, marque una sola con X. Entregue la hoja en recepción para que se registre en el sistema.';
    let lineY = 88;
    for (const line of pdf.wrap(instructions, CONTENT_WIDTH, 7.3)) {
      pdf.text(MARGIN, lineY, line, { size: 7.3, color: MUTED });
      lineY += 9.5;
    }
    this.y = lineY + 2;
  }

  section(title: string, fields: PrintableField[]): void {
    const rows = layoutRows(this.pdf, fields);
    // La cabecera no se queda sola al pie de una hoja: viaja con su primera fila.
    this.ensureSpace(SECTION_BAND_HEIGHT + (rows[0]?.[0]?.height ?? 0));
    this.band(title);
    for (const row of rows) {
      this.ensureSpace(row[0].height);
      let x = MARGIN;
      for (const cell of row) {
        drawCell(this.pdf, cell, x, this.y);
        x += cell.width;
      }
      this.y += row[0].height;
    }
    this.y += SECTION_GAP;
  }

  /** Firma y bloque de uso interno. Van juntos para no partirlos entre hojas. */
  officeBlock(): void {
    const signature: PrintableField[] = [
      { name: 'firma', label: 'Firma del solicitante', required: false, kind: 'text' },
      { name: 'recibido_por', label: 'Recibido por', required: false, kind: 'text' },
      { name: 'fecha_recepcion', label: 'Fecha de recepción', required: false, kind: 'date', hint: 'DD / MM / AAAA' },
    ];
    const internal: PrintableField[] = [
      { name: 'cargado_por', label: 'Cargado al sistema por', required: false, kind: 'text' },
      { name: 'fecha_carga', label: 'Fecha de carga', required: false, kind: 'date', hint: 'DD / MM / AAAA' },
      { name: 'numero_registro', label: 'N° de registro en el sistema', required: false, kind: 'text' },
    ];
    const signatureHeight = 40;
    this.ensureSpace(SECTION_BAND_HEIGHT * 2 + signatureHeight + LINE_CELL_HEIGHT + SECTION_GAP);

    this.band('Firma y recepción');
    this.row(signature, [2, 1, 1], signatureHeight);
    this.y += SECTION_GAP;
    this.band('Uso interno · carga al sistema');
    this.row(internal, [2, 1, 1], LINE_CELL_HEIGHT);
  }

  pageFooters(generatedAt: Date): void {
    const { pdf, plan } = this;
    const total = pdf.pageCount;
    for (let index = 0; index < total; index += 1) {
      pdf.goToPage(index);
      const left = `CPA Plataforma · Formulario de ${plan.title} (${plan.resourceKey}) · Generado el ${formatDate(generatedAt)}`;
      const right = `Página ${index + 1} de ${total}`;
      const footerY = A4_HEIGHT - 18;
      pdf.text(MARGIN, footerY, pdf.fit(left, CONTENT_WIDTH - 70, 6.3), { size: 6.3, color: MUTED });
      pdf.text(A4_WIDTH - MARGIN - pdf.measure(right, 6.3), footerY, right, { size: 6.3, color: MUTED });
    }
  }

  private row(fields: PrintableField[], units: number[], height: number): void {
    const totalUnits = units.reduce((total, value) => total + value, 0);
    let x = MARGIN;
    fields.forEach((field, index) => {
      const width = (units[index] / totalUnits) * CONTENT_WIDTH;
      drawCell(this.pdf, { field, width, height }, x, this.y);
      x += width;
    });
    this.y += height;
  }

  private band(title: string): void {
    this.pdf.rect(MARGIN, this.y, CONTENT_WIDTH, SECTION_BAND_HEIGHT, { fill: BAND, stroke: false });
    const text = this.pdf.fit(title.toUpperCase(), CONTENT_WIDTH - 10, 7, 'bold');
    this.pdf.text(MARGIN + 5, this.y + 9.2, text, { size: 7, font: 'bold', color: BRAND });
    this.y += SECTION_BAND_HEIGHT;
  }

  private ensureSpace(height: number): void {
    if (this.y + height <= BOTTOM_LIMIT) return;
    const { pdf, plan } = this;
    pdf.addPage();
    pdf.text(MARGIN, 38, pdf.fit(`Formulario de registro · ${plan.title} (continuación)`, CONTENT_WIDTH, 10, 'bold'), {
      size: 10,
      font: 'bold',
      color: INK,
    });
    pdf.line(MARGIN, 44, A4_WIDTH - MARGIN, 44, { color: BRAND, width: 1.2 });
    this.y = 54;
  }
}

export function buildPrintableFormPdf(input: PrintableFormInput, generatedAt = new Date()): Uint8Array {
  const plan = buildPrintableFormPlan(input);
  const pdf = new SimplePdfDocument(A4_WIDTH, A4_HEIGHT, `Formulario de registro - ${plan.title}`);
  const writer = new FormWriter(pdf, plan);

  writer.firstPage();
  plan.sections.forEach((section) => writer.section(section.title ?? 'Datos del registro', section.fields));
  writer.officeBlock();
  writer.pageFooters(generatedAt);

  return pdf.toBytes();
}

/** Descarga la hoja en blanco como `formulario-<recurso>.pdf`. */
export function downloadPrintableForm(input: PrintableFormInput): void {
  const bytes = buildPrintableFormPdf(input);
  const title = input.resource.label || input.resource.key;
  downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }), `formulario-${safeFilename(title)}.pdf`);
}
