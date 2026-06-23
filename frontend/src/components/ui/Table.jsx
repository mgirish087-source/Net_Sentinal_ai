export default function Table({ columns, data, renderRow }) {
    return (
      <table className="w-full text-sm">
        <thead className="text-left border-b border-slate-700">
          <tr>
            {columns.map((col) => (
              <th key={col} className="py-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => renderRow(row, i))}
        </tbody>
      </table>
    );
  }