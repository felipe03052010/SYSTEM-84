/**
 * Glifos únicos das 40 fitas do Analog Horror.
 *
 * Cada fita do acervo tem uma marca própria em 1px de arame, no mesmo
 * sistem de 112×112 dos demais ícones do dossiê. O Chassis resolve a
 * marca por record.glyph (fitas novas) ou por record.id (fitas antigas).
 */

const base = (children) => children

export const TAPE_GLYPHS = {
  /* ── Fit 01–06 (acervo original) ─────────────────────────────── */
  'fita-01': base(
    <>
      <rect x="26" y="30" width="60" height="52" />
      <path d="M26 44h60M26 62h60" />
      <path d="M40 52l8-8 8 8M56 52l8-8 8 8" />
      <path d="M34 78h44" stroke="var(--fig-ember)" strokeWidth="3" />
      <circle cx="90" cy="22" r="6" />
    </>
  ),
  'fita-02': base(
    <>
      <rect x="20" y="34" width="72" height="48" />
      <rect x="30" y="44" width="44" height="30" />
      <path d="M40 44v-8M56 44v-8M72 44v-8" />
      <path d="M46 62h20M50 70h12" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M14 58h6M92 58h6" />
    </>
  ),
  'fita-03': base(
    <>
      <path d="M18 40c18-14 30-14 38 0s20 14 38 0" />
      <path d="M18 58c18-14 30-14 38 0s20 14 38 0" />
      <path d="M18 76c18-14 30-14 38 0s20 14 38 0" />
      <circle cx="86" cy="26" r="8" />
      <path d="M78 26h16M86 18v16" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-04': base(
    <>
      <rect x="22" y="26" width="68" height="60" />
      <circle cx="44" cy="56" r="14" />
      <circle cx="68" cy="56" r="14" />
      <path d="M22 74h68" />
      <path d="M34 36h44M34 42h28" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M78 84v10M88 84v10" />
    </>
  ),
  'fita-05': base(
    <>
      <circle cx="56" cy="56" r="34" />
      <path d="M56 36v20l14 9" />
      <path d="M30 30l6 6M82 30l-6 6M30 82l6-6M82 82l-6-6" />
      <path d="M20 56h10M86 56h10" stroke="var(--fig-ember)" strokeWidth="3" />
      <circle cx="56" cy="56" r="5" fill="var(--fig-paper)" stroke="none" />
    </>
  ),
  'fita-06': base(
    <>
      <rect x="18" y="36" width="76" height="44" />
      <path d="M28 48h20M28 60h14M62 48h22M62 60h22" />
      <path d="M28 74h56" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M18 36l-8-10M94 36l8-10" />
      <circle cx="10" cy="26" r="4" /><circle cx="102" cy="26" r="4" />
    </>
  ),

  /* ── Fit 07–40 ───────────────────────────────────────────────── */
  'fita-telefone': base(
    <>
      <rect x="34" y="20" width="44" height="72" rx="6" />
      <path d="M42 32h28M42 44h28" />
      <circle cx="56" cy="64" r="8" />
      <path d="M48 78h16" />
      <path d="M20 44c-8 4-12 10-12 18M92 44c8 4 12 10 12 18" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-locadora': base(
    <>
      <rect x="22" y="24" width="68" height="64" />
      <path d="M22 38h68M22 52h68M22 66h68" />
      <path d="M34 30v44M44 30v44M54 30v44M64 30v44M74 30v44M84 30v44" stroke="var(--fig-ember)" strokeWidth="2.5" />
      <path d="M14 24h-8M106 24h-8" />
    </>
  ),
  'fita-camera': base(
    <>
      <rect x="18" y="36" width="76" height="44" />
      <circle cx="42" cy="58" r="12" />
      <circle cx="42" cy="58" r="5" />
      <path d="M62 44h16l8 8v26H62Z" />
      <path d="M56 40l6-10h14" />
      <path d="M24 80h64" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-interfone': base(
    <>
      <rect x="36" y="18" width="40" height="76" />
      <rect x="44" y="28" width="24" height="20" />
      <path d="M50 38h12M50 44h8" />
      <circle cx="56" cy="62" r="6" />
      <path d="M48 74h16" />
      <path d="M20 40v-12M92 40v-12" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M14 20h12M98 20h-12" />
    </>
  ),
  'fita-radio': base(
    <>
      <rect x="24" y="40" width="64" height="36" />
      <circle cx="44" cy="58" r="10" />
      <circle cx="44" cy="58" r="4" fill="var(--fig-paper)" stroke="none" />
      <path d="M62 50h18M62 58h22M62 66h14" />
      <path d="M30 32l8-10M82 32l-8-10" />
      <circle cx="56" cy="24" r="4" />
      <path d="M56 28v-4" />
    </>
  ),
  'fita-fotografia': base(
    <>
      <rect x="20" y="30" width="72" height="52" />
      <rect x="30" y="40" width="32" height="26" />
      <circle cx="46" cy="50" r="6" />
      <path d="M30 66l10-10 8 8 10-12 12 14" />
      <circle cx="76" cy="66" r="8" />
      <path d="M76 60v12M70 66h12" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M14 24h84" />
    </>
  ),
  'fita-lava': base(
    <>
      <path d="M20 70h72" />
      <path d="M30 70V50h52v20" />
      <path d="M36 50V38h40v12" />
      <circle cx="46" cy="62" r="6" />
      <circle cx="66" cy="62" r="6" />
      <path d="M46 32v-8M56 32v-8M66 32v-8" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M20 82h72" />
    </>
  ),
  'fita-hospital': base(
    <>
      <rect x="20" y="26" width="72" height="60" />
      <path d="M56 38v28M42 52h28" stroke="var(--fig-ember)" strokeWidth="4" />
      <path d="M30 30h12M70 30h12" />
      <path d="M20 86h72" />
      <path d="M14 92h84" stroke="var(--fig-ember)" strokeWidth="2.5" />
    </>
  ),
  'fita-escola': base(
    <>
      <path d="M16 84V40l40-16 40 16v44" />
      <path d="M16 84h80" />
      <path d="M56 24v60" />
      <rect x="34" y="52" width="14" height="14" />
      <rect x="64" y="52" width="14" height="14" />
      <path d="M34 66h14M64 66h14" />
      <circle cx="56" cy="30" r="5" fill="var(--fig-paper)" stroke="none" />
    </>
  ),
  'fita-posto': base(
    <>
      <path d="M56 18c14 0 24 10 24 22 0 10-5 16-5 26v10H37V66c0-10-5-16-5-26 0-12 10-22 24-22Z" />
      <path d="M37 78h38" />
      <path d="M30 42h-8M82 42h8" />
      <path d="M44 48l-6 8h10l-6 8" stroke="var(--fig-ember)" strokeWidth="3" />
      <circle cx="70" cy="48" r="4" />
    </>
  ),
  'fita-igreja': base(
    <>
      <path d="M56 18v14" />
      <path d="M28 32h56l-8 14H36Z" />
      <path d="M36 46v38h40V46" />
      <path d="M56 46v38M36 56h40M36 66h40" />
      <path d="M48 84v-10a8 8 0 0 1 16 0v10" />
      <path d="M20 90h72" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-teleferico': base(
    <>
      <path d="M18 30c24 10 52 10 76 0" />
      <circle cx="56" cy="22" r="8" />
      <path d="M56 30v18" />
      <rect x="42" y="48" width="28" height="22" />
      <path d="M56 70v16" />
      <path d="M34 94h44" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M20 96l12-8M92 96l-12-8" />
    </>
  ),
  'fita-aquario': base(
    <>
      <rect x="20" y="28" width="72" height="56" />
      <path d="M28 44c8-8 16-8 24 0s16 8 24 0 16-8 24 0" />
      <path d="M28 60c8-8 16-8 24 0s16 8 24 0 16-8 24 0" />
      <path d="M32 78c6-6 12-6 18 0s12 6 18 0" />
      <path d="M78 36l8-6-2 10" />
      <path d="M14 84h84" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-observatorio': base(
    <>
      <path d="M56 18a38 38 0 0 1 38 38H18a38 38 0 0 1 38-38Z" />
      <path d="M56 18v76" />
      <path d="M30 94h52" />
      <circle cx="70" cy="40" r="6" />
      <path d="M70 46v10" />
      <path d="M26 30l8 4M86 30l-8 4" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-drivein': base(
    <>
      <rect x="16" y="56" width="80" height="24" rx="10" />
      <path d="M30 56v-6a8 8 0 0 1 16 0v6M58 56v-6a8 8 0 0 1 16 0v6" />
      <path d="M56 30l18 26H38Z" />
      <path d="M56 30v-8M40 44l-10-8M72 44l10-8" />
      <path d="M20 90h72" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-conserto': base(
    <>
      <rect x="20" y="30" width="72" height="48" />
      <rect x="28" y="40" width="40" height="28" />
      <path d="M38 54h20M38 62h14" />
      <path d="M76 40l12-10M88 30h8v8" />
      <circle cx="84" cy="62" r="6" />
      <path d="M84 56v-4M78 62h12" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M14 24h84" />
    </>
  ),
  'fita-baby': base(
    <>
      <rect x="30" y="30" width="52" height="40" rx="8" />
      <circle cx="56" cy="50" r="12" />
      <path d="M48 50h16M56 42v16" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M30 22c-8 6-12 14-12 22M82 22c8 6 12 14 12 22" />
      <path d="M20 78h72" />
      <path d="M40 70v14M72 70v14" />
    </>
  ),
  'fita-fax': base(
    <>
      <rect x="18" y="34" width="76" height="44" />
      <rect x="28" y="20" width="56" height="18" />
      <path d="M40 58h32M40 66h24M40 74h28" />
      <circle cx="76" cy="80" r="6" />
      <path d="M76 76v-4M70 80h12" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M22 92h68" />
    </>
  ),
  'fita-jornal': base(
    <>
      <rect x="20" y="22" width="72" height="68" />
      <path d="M20 34h72" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M28 42h56M28 52h44M28 62h50M28 72h36" />
      <circle cx="80" cy="80" r="8" />
      <path d="M76 80l3 3 5-6" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-parque': base(
    <>
      <path d="M16 88c10-30 20-30 30-60s20 30 30 0 20-30 20-28" />
      <path d="M16 88h80" />
      <rect x="42" y="40" width="28" height="20" />
      <path d="M56 60v12" />
      <circle cx="56" cy="34" r="6" fill="var(--fig-paper)" stroke="none" />
      <path d="M30 96v-8M82 96v-8" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-cemiterio': base(
    <>
      <rect x="18" y="26" width="76" height="60" />
      <path d="M56 26v60M18 56h76" stroke="var(--fig-ember)" strokeWidth="2.5" />
      <path d="M30 36v16M30 42h10" />
      <path d="M66 64v14M66 70h10" />
      <circle cx="80" cy="34" r="5" />
      <path d="M30 78h52" />
    </>
  ),
  'fita-pousada': base(
    <>
      <path d="M18 90V48l38-26 38 26v42" />
      <path d="M18 90h76" />
      <rect x="44" y="58" width="24" height="32" />
      <path d="M56 58v32M44 74h24" stroke="var(--fig-ember)" strokeWidth="3" />
      <circle cx="34" cy="60" r="6" />
      <circle cx="78" cy="60" r="6" />
      <path d="M84 20l10 8-10 8" />
    </>
  ),
  'fita-microfilme': base(
    <>
      <circle cx="56" cy="56" r="34" />
      <circle cx="56" cy="56" r="22" />
      <circle cx="56" cy="56" r="10" />
      <path d="M56 22v10M56 80v10M22 56h10M80 56h10" />
      <path d="M34 34l8 8M78 34l-8 8M34 78l8-8M78 78l-8-8" stroke="var(--fig-ember)" strokeWidth="3" />
      <circle cx="56" cy="56" r="4" fill="var(--fig-paper)" stroke="none" />
    </>
  ),
  'fita-ouvintes': base(
    <>
      <rect x="22" y="30" width="68" height="46" />
      <circle cx="42" cy="53" r="10" />
      <path d="M32 70c2-8 6-12 10-12s8 4 10 12" />
      <path d="M66 44h16M66 53h20M66 62h12" />
      <path d="M14 26c-6 4-10 10-10 18M98 26c6 4 10 10 10 18" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M20 84h72" />
    </>
  ),
  'fita-elevador': base(
    <>
      <rect x="30" y="18" width="52" height="76" />
      <path d="M38 18v-8M74 18v-8" />
      <rect x="40" y="32" width="32" height="30" />
      <path d="M56 32v30M40 47h32" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M40 72h32M40 80h32" />
      <path d="M48 94h16" />
    </>
  ),
  'fita-farol': base(
    <>
      <path d="M56 18l20 30H36Z" />
      <path d="M36 48h40l-6 30H42Z" />
      <path d="M48 78v14h16V78" />
      <path d="M56 18v-8" />
      <path d="M28 104c14-8 42-8 56 0" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M20 30l10 6M92 30l-10 6" />
    </>
  ),
  'fita-maquina': base(
    <>
      <rect x="22" y="30" width="68" height="40" />
      <path d="M22 44h68" />
      <circle cx="34" cy="62" r="5" />
      <circle cx="50" cy="62" r="5" />
      <circle cx="66" cy="62" r="5" />
      <path d="M78 30l8-12h10" />
      <path d="M30 82h52M30 88h40" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M86 82h10" />
    </>
  ),
  'fita-video': base(
    <>
      <rect x="20" y="26" width="72" height="48" />
      <circle cx="56" cy="50" r="12" />
      <path d="M44 74h24" />
      <path d="M56 26V14M40 20l-8-10M72 20l8-10" />
      <path d="M30 34l14 10-14 10" fill="var(--fig-paper)" stroke="none" />
      <path d="M14 88h84" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-termometro': base(
    <>
      <rect x="24" y="18" width="64" height="76" />
      <rect x="34" y="28" width="44" height="20" />
      <path d="M44 54v18M56 54v24M68 54v14" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M34 78h44M34 86h44" />
      <circle cx="56" cy="62" r="6" fill="var(--fig-paper)" stroke="none" />
    </>
  ),
  'fita-relogio': base(
    <>
      <circle cx="56" cy="56" r="36" />
      <path d="M56 32v24l16 10" />
      <path d="M24 30l8 6M88 30l-8 6M24 82l8-6M88 82l-8-6" stroke="var(--fig-ember)" strokeWidth="3" />
      <circle cx="56" cy="56" r="5" fill="var(--fig-paper)" stroke="none" />
      <path d="M56 14v8M56 90v8" />
    </>
  ),
  'fita-seguranca': base(
    <>
      <rect x="24" y="30" width="64" height="52" />
      <circle cx="56" cy="56" r="12" />
      <circle cx="56" cy="56" r="5" />
      <path d="M24 30l-10-10M88 30l10-10" />
      <path d="M56 44v-8" />
      <path d="M40 78v10M72 78v10" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M14 92h84" />
    </>
  ),
  'fita-loteria': base(
    <>
      <circle cx="56" cy="56" r="34" />
      <circle cx="56" cy="56" r="24" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M56 38v36M38 56h36" stroke="var(--fig-ember)" strokeWidth="2.5" />
      <circle cx="56" cy="56" r="8" fill="var(--fig-paper)" stroke="none" />
      <path d="M20 20l8 8M92 20l-8 8" />
    </>
  ),
  'fita-fitoteca': base(
    <>
      <path d="M20 30h72v52H20Z" />
      <path d="M20 44h72" />
      <circle cx="36" cy="37" r="4" fill="var(--fig-paper)" stroke="none" />
      <circle cx="48" cy="37" r="4" fill="var(--fig-paper)" stroke="none" />
      <circle cx="60" cy="37" r="4" fill="var(--fig-paper)" stroke="none" />
      <path d="M32 58h20M32 68h28M64 58h16M64 68h16" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M14 24h84" />
    </>
  ),
  'fita-ultima': base(
    <>
      <rect x="18" y="34" width="76" height="48" />
      <circle cx="56" cy="58" r="14" />
      <path d="M56 44v14l10 6" />
      <path d="M30 44h16M30 52h10" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M66 44h16M72 44v16" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M18 34l-8-12M94 34l8-12" />
      <path d="M20 90h72" />
    </>
  ),
  /* ── Catálogo de criadores: glifos 41–46 ─────────────────────── */
  'fita-olho': base(
    <>
      <path d="M12 56c14-22 28-30 44-30s30 8 44 30c-14 22-28 30-44 30S26 78 12 56Z" />
      <circle cx="56" cy="56" r="14" />
      <circle cx="56" cy="56" r="5" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M56 12v8M20 22l6 6M92 22l-6 6" />
    </>
  ),
  'fita-mapa': base(
    <>
      <path d="M16 28l26-10 28 10 26-10v66l-26 10-28-10-26 10Z" />
      <path d="M42 18v66M70 28v66" />
      <path d="M50 50l12 12M62 50 50 62" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-antena': base(
    <>
      <path d="M42 94 56 40l14 54" />
      <path d="M36 94h40M46 76h20" />
      <path d="M40 28c8-8 24-8 32 0M30 18c14-14 38-14 52 0" />
      <circle cx="56" cy="34" r="4" stroke="var(--fig-ember)" strokeWidth="3" />
    </>
  ),
  'fita-sinal': base(
    <>
      <path d="M12 66h16l8-28 12 48 12-60 10 40h30" />
      <path d="M12 98h88" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M12 18h16M12 18v14" />
    </>
  ),
  'fita-casa': base(
    <>
      <path d="M18 56 56 22l38 34" />
      <path d="M26 50v42h60V50" />
      <rect x="48" y="64" width="16" height="28" />
      <path d="M32 62h10M72 62h10" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M76 26v14" />
    </>
  ),
  'fita-cogumelo': base(
    <>
      <path d="M16 54c0-22 18-36 40-36s40 14 40 36Z" />
      <path d="M44 54v22c0 10 6 16 12 16s12-6 12-16V54" />
      <circle cx="38" cy="40" r="5" />
      <circle cx="72" cy="36" r="4" stroke="var(--fig-ember)" strokeWidth="3" />
      <path d="M20 98h72" />
    </>
  ),
}

/** Glifo da fita pelo id numérico do registro (fitas 01–06). */
export const TAPE_GLYPH_BY_ID = {
  901: 'fita-01',
  902: 'fita-02',
  903: 'fita-03',
  904: 'fita-04',
  905: 'fita-05',
  906: 'fita-06',
}
