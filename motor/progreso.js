// Progreso de una parte de un ejercicio: cuántas pistas abrió, si vio la solución y hasta qué paso.
// Vive en localStorage; si el navegador no deja guardar, se queda en memoria y la página funciona igual.
const VACIO = { pistas: 0, solucion: false, paso: 0 };
const respaldo = new Map();

export function progreso(clave) {
  const k = `tn:practica:${clave}`;
  return {
    leer() {
      let crudo = null;
      try { crudo = localStorage.getItem(k); } catch { crudo = respaldo.get(k) ?? null; }
      try {
        const v = JSON.parse(crudo);
        if (v && Number.isInteger(v.pistas) && typeof v.solucion === 'boolean' && Number.isInteger(v.paso)) return { pistas: v.pistas, solucion: v.solucion, paso: v.paso };
      } catch { /* datos corruptos: se empieza de cero */ }
      return { ...VACIO };
    },
    guardar(estado) {
      const txt = JSON.stringify({ ...VACIO, ...estado });
      respaldo.set(k, txt);
      try { localStorage.setItem(k, txt); } catch { /* sin almacenamiento: queda en memoria */ }
    },
    borrar() {
      respaldo.delete(k);
      try { localStorage.removeItem(k); } catch { /* nada que borrar */ }
    },
  };
}
