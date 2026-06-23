<button
  onClick={exportCSV}
  className="mb-4 bg-cyan-500 px-4 py-2 rounded"
>
  Export CSV
</button>


Cards.jsx

export default function Card({ title, value, color }) {
    return (
        <div className="bg-slate-800 p-5 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-gray-400">{title}</p>
        <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
      </div>
    );
  }
