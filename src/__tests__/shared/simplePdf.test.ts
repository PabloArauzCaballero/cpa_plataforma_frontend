import { SimplePdfDocument } from '../../shared/pdf/simplePdf';

function asText(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
}

describe('SimplePdfDocument', () => {
  it('genera un PDF con cabecera, páginas y fin de archivo', () => {
    const pdf = new SimplePdfDocument(595.28, 841.89, 'Prueba');
    pdf.addPage();
    pdf.text(30, 40, 'Hola', { size: 10 });
    pdf.addPage();
    pdf.rect(30, 40, 100, 20);

    const text = asText(pdf.toBytes());
    expect(text.startsWith('%PDF-1.4')).toBe(true);
    expect(text).toContain('/Count 2');
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true);
  });

  it('apunta el xref al byte exacto de cada objeto', () => {
    const pdf = new SimplePdfDocument();
    pdf.text(30, 40, 'Año lectivo (2026) \\ ñandú', { size: 9, font: 'bold' });
    const text = asText(pdf.toBytes());

    const startxref = Number(text.match(/startxref\n(\d+)/)?.[1]);
    expect(text.slice(startxref, startxref + 4)).toBe('xref');

    const entries = text.slice(startxref).split('\n').slice(3).filter((line) => / n $/.test(line));
    entries.forEach((entry, index) => {
      const offset = Number(entry.slice(0, 10));
      expect(text.slice(offset, offset + `${index + 1} 0 obj`.length)).toBe(`${index + 1} 0 obj`);
    });
  });

  it('codifica tildes en WinAnsi y escapa los paréntesis', () => {
    const pdf = new SimplePdfDocument();
    pdf.text(30, 40, 'Año (ñ)', { size: 9 });
    const text = asText(pdf.toBytes());
    // "ñ" es 0xF1 en WinAnsi = \361 en octal.
    expect(text).toContain('(A\\361o \\(\\361\\))');
  });

  it('degrada a la letra base lo que WinAnsi no tiene', () => {
    const pdf = new SimplePdfDocument();
    pdf.text(30, 40, 'Dvořák Ł', { size: 9 });
    // La "ř" se queda en "r"; la "Ł" no se descompone y sale como "?".
    expect(asText(pdf.toBytes())).toContain('(Dvor\\341k ?)');
  });

  it('mide y parte el texto según el ancho de Helvetica', () => {
    const pdf = new SimplePdfDocument();
    // "M" mide 833/1000 del cuerpo en Helvetica.
    expect(pdf.measure('M', 10)).toBeCloseTo(8.33);
    expect(pdf.measure('á', 10)).toBeCloseTo(pdf.measure('a', 10));
    const lines = pdf.wrap('uno dos tres cuatro cinco seis', 40, 10);
    expect(lines.length).toBeGreaterThan(1);
    lines.forEach((line) => expect(pdf.measure(line, 10) <= 40 || !line.includes(' ')).toBe(true));
    expect(pdf.fit('Un texto demasiado largo para el recuadro', 50, 10).endsWith('…')).toBe(true);
  });
});
