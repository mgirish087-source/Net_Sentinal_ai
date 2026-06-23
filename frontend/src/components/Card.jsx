export default function Card({

  title,

  value,

  icon,

  trend,

  danger = false

}) {

  // ====================================================
  // TREND
  // ====================================================

  const isPositive = trend >= 0;

  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      relative
      overflow-hidden
      rounded-2xl
      border
      border-slate-800/70
      bg-slate-900/60
      backdrop-blur-xl
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-cyan-500/30
      hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]
    ">

      {/* ============================================= */}
      {/* BACKGROUND GLOW */}
      {/* ============================================= */}

      <div className={`
        absolute
        -top-10
        -right-10
        w-32
        h-32
        rounded-full
        blur-3xl
        opacity-20
        ${danger
          ? "bg-red-500"
          : "bg-cyan-500"}
      `} />

      {/* ============================================= */}
      {/* CONTENT */}
      {/* ============================================= */}

      <div className="
        relative
        z-10
      ">

        {/* ========================================= */}
        {/* TOP SECTION */}
        {/* ========================================= */}

        <div className="
          flex
          items-start
          justify-between
          gap-4
        ">

          {/* LEFT */}

          <div className="
            flex
            flex-col
          ">

            {/* TITLE */}

            <span className="
              text-sm
              font-medium
              text-slate-400
              tracking-wide
            ">

              {title}

            </span>

            {/* VALUE */}

            <h2 className={`
              mt-3
              text-4xl
              font-bold
              tracking-tight
              ${danger
                ? "text-red-400"
                : "text-white"}
            `}>

              {value}

            </h2>

          </div>

          {/* ===================================== */}
          {/* ICON */}
          {/* ===================================== */}

          {icon && (

            <div className={`
              flex
              items-center
              justify-center
              w-14
              h-14
              rounded-2xl
              border
              shadow-lg
              ${danger
                ? `
                  bg-red-500/10
                  border-red-500/20
                  text-red-400
                `
                : `
                  bg-cyan-500/10
                  border-cyan-500/20
                  text-cyan-400
                `
              }
            `}>

              {icon}

            </div>

          )}

        </div>

        {/* ========================================= */}
        {/* TREND */}
        {/* ========================================= */}

        {typeof trend === "number" && (

          <div className="
            mt-6
            flex
            items-center
            justify-between
          ">

            {/* TREND BADGE */}

            <div className={`
              inline-flex
              items-center
              gap-1
              px-3
              py-1.5
              rounded-full
              text-xs
              font-semibold
              border
              ${isPositive
                ? `
                  bg-emerald-500/10
                  text-emerald-400
                  border-emerald-500/20
                `
                : `
                  bg-red-500/10
                  text-red-400
                  border-red-500/20
                `
              }
            `}>

              <span>

                {isPositive ? "▲" : "▼"}

              </span>

              <span>

                {Math.abs(trend)}%

              </span>

            </div>

            {/* SUBTEXT */}

            <span className="
              text-xs
              text-slate-500
            ">

              vs previous hour

            </span>

          </div>

        )}

        {/* ========================================= */}
        {/* FOOTER LINE */}
        {/* ========================================= */}

        <div className="
          mt-6
          h-[1px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-slate-700
          to-transparent
        " />

      </div>

    </div>
  );
}