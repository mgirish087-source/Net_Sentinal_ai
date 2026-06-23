export default function Badge({ type }) {

  // ======================================================
  // NORMALIZE
  // ======================================================

  const value = String(
    type || "UNKNOWN"
  ).toUpperCase();

  // ======================================================
  // ATTACK COLORS
  // ======================================================

  const styles = {

    // ==================================================
    // SAFE
    // ==================================================

    BENIGN: `
      bg-emerald-500/10
      text-emerald-400
      border-emerald-500/20
    `,

    NORMAL: `
      bg-emerald-500/10
      text-emerald-400
      border-emerald-500/20
    `,

    SAFE: `
      bg-emerald-500/10
      text-emerald-400
      border-emerald-500/20
    `,

    // ==================================================
    // PORT SCAN
    // ==================================================

    PORTSCAN: `
      bg-red-500/15
      text-red-400
      border-red-500/30
      animate-pulse
    `,

    SCAN: `
      bg-red-500/15
      text-red-400
      border-red-500/30
      animate-pulse
    `,

    // ==================================================
    // DDOS / DOS
    // ==================================================

    DDOS: `
      bg-red-600/20
      text-red-300
      border-red-600/30
      animate-pulse
    `,

    DOS: `
      bg-red-600/20
      text-red-300
      border-red-600/30
      animate-pulse
    `,

    // ==================================================
    // BRUTE FORCE
    // ==================================================

    BRUTEFORCE: `
      bg-orange-500/20
      text-orange-400
      border-orange-500/30
    `,

    BRUTE_FORCE: `
      bg-orange-500/20
      text-orange-400
      border-orange-500/30
    `,

    // ==================================================
    // BOTNET
    // ==================================================

    BOTNET: `
      bg-fuchsia-500/20
      text-fuchsia-400
      border-fuchsia-500/30
    `,

    // ==================================================
    // MALWARE
    // ==================================================

    MALWARE: `
      bg-pink-500/20
      text-pink-400
      border-pink-500/30
    `,

    // ==================================================
    // PROBE
    // ==================================================

    PROBE: `
      bg-yellow-500/20
      text-yellow-400
      border-yellow-500/30
    `,

    // ==================================================
    // R2L
    // ==================================================

    R2L: `
      bg-purple-500/20
      text-purple-400
      border-purple-500/30
    `,

    // ==================================================
    // U2R
    // ==================================================

    U2R: `
      bg-indigo-500/20
      text-indigo-400
      border-indigo-500/30
    `,

    // ==================================================
    // UNKNOWN
    // ==================================================

    UNKNOWN: `
      bg-slate-500/10
      text-slate-300
      border-slate-500/20
    `
  };

  // ======================================================
  // SELECT STYLE
  // ======================================================

  const selectedStyle =
    styles[value] ||
    styles.UNKNOWN;

  // ======================================================
  // UI
  // ======================================================

  return (

    <span
      className={`
        inline-flex
        items-center
        gap-1
        px-3
        py-1
        rounded-full
        border
        text-xs
        font-semibold
        tracking-wide
        uppercase
        whitespace-nowrap
        ${selectedStyle}
      `}
    >

      {/* STATUS DOT */}

      <span className="
        w-2
        h-2
        rounded-full
        bg-current
        opacity-80
      " />

      {/* LABEL */}

      {type || "UNKNOWN"}

    </span>
  );
}