const SUFFIXES = ['', 'K', 'M', 'Md', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/** 1 234 → « 1,23 K », etc. Notation scientifique au-delà des suffixes. */
export function fmt(n: number, digits = 2): string {
  if (!isFinite(n)) return '∞';
  if (n < 0) return '-' + fmt(-n, digits);
  if (n < 1000) {
    if (n === 0) return '0';
    if (n < 10) return trim(n.toFixed(digits));
    if (n < 100) return trim(n.toFixed(Math.min(digits, 1)));
    return Math.floor(n).toString();
  }
  const e = Math.floor(Math.log10(n) / 3);
  if (e >= SUFFIXES.length) {
    return n.toExponential(digits).replace('e+', 'e').replace('.', ',');
  }
  const v = n / Math.pow(1000, e);
  const d = v >= 100 ? 0 : v >= 10 ? 1 : digits;
  return `${trim(v.toFixed(d))} ${SUFFIXES[e]}`;
}

function trim(s: string): string {
  if (s.includes('.')) s = s.replace(/\.?0+$/, '');
  return s.replace('.', ',');
}

export const money = (n: number) => `${fmt(n)} $`;
export const perSec = (n: number) => `${fmt(n)}/s`;

function unit(n: number, units: string[], base = 1000): string {
  let i = 0;
  let v = n;
  while (Math.abs(v) >= base && i < units.length - 1) {
    v /= base;
    i++;
  }
  if (i === units.length - 1 && Math.abs(v) >= base) return `${fmt(v)} ${units[i]}`;
  return `${trim(v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2))} ${units[i]}`;
}

export const watts = (w: number) => unit(w, ['W', 'kW', 'MW', 'GW', 'TW', 'PW', 'EW', 'ZW', 'YW']);
/** Masse en tonnes. */
export const mass = (t: number) => unit(t, ['t', 'kt', 'Mt', 'Gt', 'Tt', 'Pt']);
export const bandwidth = (mbps: number) => unit(mbps, ['Mb/s', 'Gb/s', 'Tb/s', 'Pb/s', 'Eb/s', 'Zb/s', 'Yb/s']);
export const storage = (to: number) => unit(to * 1000, ['Go', 'To', 'Po', 'Eo', 'Zo', 'Yo']);
export const ram = (go: number) => unit(go, ['Go', 'To', 'Po', 'Eo', 'Zo']);
export const pct = (x: number, d = 1) => `${trim((x * 100).toFixed(d))} %`;

export function duration(sec: number): string {
  sec = Math.max(0, Math.floor(sec));
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (d > 0) return `${d} j ${h} h`;
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} min`;
  if (m > 0) return `${m} min ${String(s).padStart(2, '0')} s`;
  return `${s} s`;
}

export const RES_LABEL: Record<string, string> = {
  cpu: 'CPU',
  ram: 'RAM',
  storage: 'Stockage',
  gpu: 'GPU',
  bw: 'Bande passante',
};

export function resValue(res: string, v: number): string {
  switch (res) {
    case 'cpu':
      return `${fmt(v)} vCPU`;
    case 'ram':
      return ram(v);
    case 'storage':
      return storage(v);
    case 'gpu':
      return `${fmt(v)} GPU`;
    case 'bw':
      return bandwidth(v);
    default:
      return fmt(v);
  }
}
