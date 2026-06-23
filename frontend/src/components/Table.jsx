export default function Table({

  columns = [],

  data = [],

  renderRow,

  emptyMessage = "No data available"

}) {

  const hasData =
    Array.isArray(data) &&
    data.length > 0;

  return (

    <div className="
      w-full
      overflow-hidden
      rounded-2xl
      border
      border-slate-800/80
      bg-slate-900/40
      backdrop-blur-xl
    ">

      {/* ============================================= */}
      {/* TABLE WRAPPER */}
      {/* ============================================= */}

      <div className="
        overflow-x-auto
        overflow-y-auto
        max-h-[650px]
      ">

        <table className="
          w-full
          border-collapse
          text-sm
          text-left
          text-slate-300
        ">

          {/* ========================================= */}
          {/* TABLE HEADER */}
          {/* ========================================= */}

          <thead className="
            sticky
            top-0
            z-20
            bg-slate-900/95
            backdrop-blur-md
            border-b
            border-slate-800
          ">

            <tr>

              {columns.map((column, index) => (

                <th

                  key={index}

                  className="
                    px-5
                    py-4
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                    whitespace-nowrap
                  "
                >

                  <div className="
                    flex
                    items-center
                    gap-2
                  ">

                    {/* HEADER DOT */}

                    <span className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-cyan-400
                    " />

                    {column}

                  </div>

                </th>

              ))}

            </tr>

          </thead>

          {/* ========================================= */}
          {/* TABLE BODY */}
          {/* ========================================= */}

          <tbody className="
            divide-y
            divide-slate-800/60
          ">

            {hasData ? (

              data.map((item, index) => (

                renderRow ? (

                  renderRow(item, index)

                ) : (

                  <tr

                    key={index}

                    className="
                      hover:bg-slate-800/40
                      transition-all
                      duration-200
                    "
                  >

                    {Object.values(item).map((value, valueIndex) => (

                      <td

                        key={valueIndex}

                        className="
                          px-5
                          py-4
                          text-slate-300
                          whitespace-nowrap
                        "
                      >

                        {String(value)}

                      </td>

                    ))}

                  </tr>

                )

              ))

            ) : (

              <tr>

                <td

                  colSpan={columns.length || 1}

                  className="
                    py-16
                    text-center
                  "
                >

                  <div className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                  ">

                    {/* EMPTY ICON */}

                    <div className="
                      w-14
                      h-14
                      rounded-2xl
                      border
                      border-slate-700
                      bg-slate-800/60
                      flex
                      items-center
                      justify-center
                    ">

                      <svg
                        className="w-7 h-7 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 17v-2m3 2v-4m3 4V7m4 10V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z"
                        />
                      </svg>

                    </div>

                    {/* EMPTY TEXT */}

                    <div className="
                      flex
                      flex-col
                      items-center
                    ">

                      <span className="
                        text-sm
                        font-medium
                        text-slate-400
                      ">

                        {emptyMessage}

                      </span>

                      <span className="
                        text-xs
                        text-slate-600
                        mt-1
                      ">

                        Waiting for incoming monitoring data

                      </span>

                    </div>

                  </div>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}