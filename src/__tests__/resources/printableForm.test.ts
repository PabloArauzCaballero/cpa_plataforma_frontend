import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { CrudResourceDefinition } from '../../features/resources/domain/CrudResource';
import { buildPrintableFormPlan, MAX_PRINTABLE_CHOICES } from '../../features/resources/domain/printableForm';
import { resourceDefinitions } from '../../features/resources/domain/resourceDefinitions';
import { buildPrintableFormPdf } from '../../features/resources/utils/printableFormPdf';

function asText(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
}

function findResource(key: string): CrudResourceDefinition {
  const resource = resourceDefinitions.find((item) => item.key === key);
  if (!resource) throw new Error(`No existe el recurso ${key}`);
  return resource;
}

describe('buildPrintableFormPlan', () => {
  it('agrupa los campos condicionados del estudiante en bloques propios', () => {
    const plan = buildPrintableFormPlan({ resource: findResource('estudiante') });

    expect(plan.title).toBe('Estudiante');
    const [main, ...conditional] = plan.sections;
    expect(main.title).toBeUndefined();
    expect(main.fields.map((field) => field.name)).toEqual(
      expect.arrayContaining(['nombres', 'apellidos', 'tipo']),
    );
    expect(main.fields.some((field) => field.name === 'carrera')).toBe(false);

    const titles = conditional.map((section) => section.title);
    expect(titles).toEqual(expect.arrayContaining([
      'Completar solo si Tipo Estudiante es COLEGIAL',
      'Completar solo si Tipo Estudiante es UNIVERSITARIO',
    ]));
  });

  it('ofrece casillas para listas cortas y espacio para escribir en las largas', () => {
    const resource = findResource('estudiante');
    const plan = buildPrintableFormPlan({ resource });
    const tipo = plan.sections[0].fields.find((field) => field.name === 'tipo');
    expect(tipo?.kind).toBe('choice');
    expect(tipo?.options).toEqual(['UNIVERSITARIO', 'COLEGIAL']);

    const colegios = Array.from({ length: MAX_PRINTABLE_CHOICES + 1 }, (_, index) => ({ value: index, label: `Colegio ${index}` }));
    const withCatalog = buildPrintableFormPlan({
      resource,
      resolveOptions: (field) => (field.name === 'id_unidad_educativa' ? colegios : undefined),
    });
    const unidad = withCatalog.sections[0].fields.find((field) => field.name === 'id_unidad_educativa');
    expect(unidad?.kind).toBe('text');
  });

  it('no pide en papel contraseñas ni campos que calcula el sistema', () => {
    const resource: CrudResourceDefinition = {
      ...findResource('estudiante'),
      fields: [
        { name: 'codigo', label: 'Código', type: 'text', readOnly: true },
        { name: 'clave', label: 'Contraseña', type: 'password' },
        { name: 'activo', label: 'Activo', type: 'checkbox' },
        { name: 'foto', label: 'Foto', type: 'url' },
      ],
    };
    const plan = buildPrintableFormPlan({ resource, attachmentLabel: (field) => (field.name === 'foto' ? 'Foto carnet' : undefined) });
    const fields = plan.sections.flatMap((section) => section.fields);
    expect(fields.map((field) => field.name)).toEqual(['activo', 'foto']);
    expect(fields[0]).toMatchObject({ kind: 'yesNo', options: ['Sí', 'No'] });
    expect(fields[1]).toMatchObject({ kind: 'attachment', label: 'Foto carnet' });
  });
});

describe('buildPrintableFormPdf', () => {
  it('genera el PDF de todos los formularios sin romperse', () => {
    for (const resource of resourceDefinitions.filter((item) => item.fields.length > 0)) {
      const text = asText(buildPrintableFormPdf({ resource }, new Date(2026, 8, 14)));
      expect(text.startsWith('%PDF-1.4')).toBe(true);
      expect(text).toContain('Generado el 14/09/2026');
    }
  });

  it('pagina los formularios que no entran en una hoja', () => {
    const base = findResource('estudiante');
    const resource: CrudResourceDefinition = {
      ...base,
      fields: Array.from({ length: 60 }, (_, index) => ({ name: `nota_${index}`, label: `Nota ${index}`, type: 'textarea' as const })),
    };
    const text = asText(buildPrintableFormPdf({ resource }));
    expect(Number(text.match(/\/Count (\d+)/)?.[1])).toBeGreaterThan(1);
    expect(text).toContain('\\(continuaci\\363n\\)');
  });

  // Para revisar el diseño a ojo: PRINTABLE_FORM_OUT=<carpeta> yarn test printableForm
  const outDir = process.env.PRINTABLE_FORM_OUT;
  (outDir ? it : it.skip)('escribe muestras en disco', () => {
    mkdirSync(outDir as string, { recursive: true });
    for (const resource of resourceDefinitions.filter((item) => item.fields.length > 0)) {
      writeFileSync(join(outDir as string, `${resource.key}.pdf`), buildPrintableFormPdf({ resource }));
    }
  });
});
