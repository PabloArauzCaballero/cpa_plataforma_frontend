import {
  isUsableTarget,
  queryTarget,
  revealTarget,
  waitForTarget,
} from '@/features/tutorials/engine/targetResolver';

beforeEach(() => {
  document.body.innerHTML = '';
});

function mount(html: string): void {
  document.body.innerHTML = html;
}

describe('queryTarget / isUsableTarget', () => {
  it('encuentra un elemento por su ancla', () => {
    mount('<button data-tutorial-id="resource-create"></button>');
    expect(queryTarget('[data-tutorial-id="resource-create"]')).not.toBeNull();
  });

  it('descarta elementos ocultos', () => {
    mount('<button data-tutorial-id="a" hidden></button><div data-tutorial-id="b" aria-hidden="true"></div>');
    expect(queryTarget('[data-tutorial-id="a"]')).toBeNull();
    expect(queryTarget('[data-tutorial-id="b"]')).toBeNull();
  });

  it('descarta elementos desconectados del documento', () => {
    const orphan = document.createElement('div');
    expect(isUsableTarget(orphan)).toBe(false);
    expect(isUsableTarget(null)).toBe(false);
  });

  it('un selector mal escrito no rompe la aplicación: se trata como no encontrado', () => {
    expect(() => queryTarget('[[[selector-invalido')).not.toThrow();
    expect(queryTarget('[[[selector-invalido')).toBeNull();
  });
});

describe('waitForTarget', () => {
  it('resuelve de inmediato si el elemento ya existe', async () => {
    mount('<div data-tutorial-id="resource-table"></div>');
    await expect(waitForTarget('[data-tutorial-id="resource-table"]')).resolves.not.toBeNull();
  });

  it('espera a un elemento insertado después (respuesta del backend)', async () => {
    const pending = waitForTarget('[data-tutorial-id="resource-table"]', { timeoutMs: 5000 });

    const element = document.createElement('div');
    element.setAttribute('data-tutorial-id', 'resource-table');
    document.body.append(element);

    await expect(pending).resolves.toBe(element);
  });

  it('detecta un elemento que deja de estar oculto', async () => {
    mount('<div data-tutorial-id="resource-table" hidden></div>');
    const target = document.querySelector<HTMLElement>('[data-tutorial-id="resource-table"]')!;

    const pending = waitForTarget('[data-tutorial-id="resource-table"]', { timeoutMs: 5000 });
    target.hidden = false;

    await expect(pending).resolves.toBe(target);
  });

  it('devuelve null al agotarse la espera', async () => {
    jest.useFakeTimers();
    try {
      const pending = waitForTarget('[data-tutorial-id="jamas"]', { timeoutMs: 1000 });
      await jest.advanceTimersByTimeAsync(1100);
      await expect(pending).resolves.toBeNull();
    } finally {
      jest.useRealTimers();
    }
  });

  it('se cancela sin esperar al tiempo máximo cuando el paso cambia', async () => {
    const controller = new AbortController();
    const pending = waitForTarget('[data-tutorial-id="jamas"]', { timeoutMs: 60_000, signal: controller.signal });

    controller.abort();

    await expect(pending).resolves.toBeNull();
  });

  it('devuelve null de inmediato si la señal ya venía cancelada', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      waitForTarget('[data-tutorial-id="jamas"]', { signal: controller.signal }),
    ).resolves.toBeNull();
  });
});

describe('revealTarget', () => {
  it('abre todos los <details> que envuelven al objetivo', () => {
    mount(`
      <details id="externo">
        <details id="interno">
          <a data-tutorial-id="nav-module-board"></a>
        </details>
      </details>
    `);

    revealTarget(document.querySelector('[data-tutorial-id="nav-module-board"]')!);

    expect(document.querySelector<HTMLDetailsElement>('#externo')!.open).toBe(true);
    expect(document.querySelector<HTMLDetailsElement>('#interno')!.open).toBe(true);
  });

  it('no altera un <details> ya abierto por el usuario', () => {
    mount('<details open><a data-tutorial-id="nav-module-board"></a></details>');
    const details = document.querySelector<HTMLDetailsElement>('details')!;

    revealTarget(document.querySelector('[data-tutorial-id="nav-module-board"]')!);

    expect(details.open).toBe(true);
  });
});
