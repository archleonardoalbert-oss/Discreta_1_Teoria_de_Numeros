// p primo y p ∤ c: los divisores de p son 1 y p, así que mcd(c, p) = 1 y x ↦ cx es una permutación de 0…p−1.
import { escenaPorCapas, conPuentes, rotulo, nota } from '../comun.js';
import { biyeccion } from './cor-cancelacion-coprimos.js';
import { esPrimo } from '../../motor/primos.js';

const ALTO0 = () => 330;

export default escenaPorCapas({
  entradas: [{ id: 'p', etiqueta: 'p', valor: 7, min: 2, max: 13 }, { id: 'c', etiqueta: 'c', valor: 3, min: 1, max: 40 }],
  validar: ({ p, c }) => (!esPrimo(p) ? `${p} no es primo` : c % p === 0 ? `${p} | ${c}: el corolario pide p ∤ c` : null),
  alto: (c) => ALTO0(c) + 26,
  capas: conPuentes([
    ({ p, c }) => [
      ...biyeccion(p, c).nodos.filter((m) => !/^F:n\d+$/.test(m.k)),
      rotulo('arr', 24, 104, 'x', 'texto'), rotulo('abj', 24, 272, `${c}x`, 'texto'),
      nota('n0', 0, `D(${p}) = {1, ${p}} y ${p} ∤ ${c}:  mcd(${c}, ${p}) = 1`, 'texto'),
    ],
    ({ p, c }) => [
      ...biyeccion(p, c, 'verde').nodos,
      nota('n1', 1, `una sola flecha por casilla: se puede cancelar ${c} módulo ${p}`, 'verde'),
    ],
  ], {
    0: ({ p, c }) => [`divisores de ${p}: 1 y ${p}; como ${p} ∤ ${c}, el único común es 1`, 'texto'],
  }, (c) => ALTO0(c) + 8),
});
