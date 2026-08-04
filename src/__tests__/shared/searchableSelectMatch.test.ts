import { matches, normalizeForSearch } from '@/shared/components/FormField/SearchableSelect';

describe('busqueda del selector de listas largas', () => {
  it('ignora las tildes en ambos lados', () => {
    // Los nombres de colegios se escriben con y sin acento indistintamente.
    expect(matches('Colegio Núñez del Prado', 'nunez')).toBe(true);
    expect(matches('Colegio Nunez del Prado', 'núñez')).toBe(true);
    expect(normalizeForSearch('Únicö')).toBe('unico');
  });

  it('ignora mayusculas', () => {
    expect(matches('COLEGIO SAN CALIXTO', 'san calixto')).toBe(true);
  });

  it('acepta los terminos en cualquier orden', () => {
    expect(matches('Colegio San Calixto', 'calixto san')).toBe(true);
  });

  it('exige que aparezcan todos los terminos', () => {
    expect(matches('Colegio San Calixto', 'san aleman')).toBe(false);
  });

  it('encuentra por una parte del nombre, no solo por el principio', () => {
    // El <select> nativo solo salta por las primeras letras: este es el caso
    // que motivo el componente.
    expect(matches('Unidad Educativa Marista', 'marista')).toBe(true);
  });

  it('una busqueda en blanco o de solo espacios no descarta nada', () => {
    expect(matches('Cualquier colegio', '')).toBe(true);
    expect(matches('Cualquier colegio', '   ')).toBe(true);
  });

  it('no rompe con parentesis ni signos', () => {
    expect(matches('Colegio Alemán (Santa Cruz)', 'aleman santa')).toBe(true);
  });
});
