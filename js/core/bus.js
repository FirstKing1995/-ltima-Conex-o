// Barramento de eventos simples.
const handlers = new Map();
export const bus = {
  on(evt, fn) { if (!handlers.has(evt)) handlers.set(evt, new Set()); handlers.get(evt).add(fn); return () => handlers.get(evt)?.delete(fn); },
  once(evt, fn) { const off = bus.on(evt, (d) => { off(); fn(d); }); return off; },
  emit(evt, data) { for (const fn of [...(handlers.get(evt) || [])]) { try { fn(data); } catch (e) { console.error('[bus]', evt, e); } } for (const fn of [...(handlers.get('*') || [])]) { try { fn(evt, data); } catch (e) { console.error(e); } } },
};
