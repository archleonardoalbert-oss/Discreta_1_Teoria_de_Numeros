// Campos editables de una escena: enteros con mínimo y máximo, y listas de longitud variable (lista.min…lista.max).

const ENTERO = /^-?\d+$/;

function leer(texto, ent) {
  const s = texto.trim();
  if (!ENTERO.test(s)) return { error: `${ent.etiqueta}: escribe un número entero` };
  const v = Number(s);
  if (v < ent.min || v > ent.max) return { error: `${ent.etiqueta}: debe estar entre ${ent.min} y ${ent.max}` };
  return { v };
}

/**
 * Pinta los campos en `contenedor`. `alCambiar({valores, error})` se llama en cada edición:
 * `error` es null si todo es válido (y `valores` trae los números) o el mensaje a mostrar.
 */
export function crearEntradas(contenedor, entradas, alCambiar) {
  const recoger = () => {
    const valores = {};
    let error = null;
    for (const ent of entradas) {
      const campos = [...contenedor.querySelectorAll(`input[data-id="${ent.id}"]`)];
      const leidos = campos.map((c) => leer(c.value, ent));
      campos.forEach((c, i) => c.classList.toggle('mal', !!leidos[i].error));
      error ||= leidos.find((l) => l.error)?.error ?? null;
      valores[ent.id] = ent.lista ? leidos.map((l) => l.v) : leidos[0].v;
    }
    return error ? { valores: null, error } : { valores, error: null };
  };

  const campo = (ent, valor, i) => {
    const c = document.createElement('input');
    Object.assign(c, { type: 'text', inputMode: 'numeric', value: String(valor), spellcheck: false });
    c.dataset.id = ent.id;
    c.setAttribute('aria-label', ent.lista ? `${ent.etiqueta} ${i + 1}` : ent.etiqueta);
    c.addEventListener('input', () => alCambiar(recoger()));
    return c;
  };

  const grupo = (ent, vals) => {
    const g = document.createElement('div');
    g.className = 'entrada';
    const nombre = document.createElement('span');
    nombre.textContent = ent.etiqueta;
    g.append(nombre, ...vals.map((v, i) => campo(ent, v, i)));
    if (ent.lista) {
      for (const [txt, d] of [['−', -1], ['+', 1]]) {
        const b = document.createElement('button');
        Object.assign(b, { type: 'button', textContent: txt, className: 'mas-menos' });
        b.setAttribute('aria-label', d > 0 ? `añadir un número a ${ent.etiqueta}` : `quitar un número de ${ent.etiqueta}`);
        b.disabled = vals.length + d < ent.lista.min || vals.length + d > ent.lista.max;
        b.addEventListener('click', () => {
          const ahora = [...g.querySelectorAll('input')].map((c) => c.value);
          if (d > 0) ahora.push(ahora.at(-1) ?? '1'); else ahora.pop();
          g.replaceWith(grupo(ent, ahora));
          alCambiar(recoger());
        });
        g.append(b);
      }
    }
    return g;
  };

  contenedor.replaceChildren(...entradas.map((ent) => grupo(ent, ent.lista ? ent.valor : [ent.valor])));
  return { recoger };
}
