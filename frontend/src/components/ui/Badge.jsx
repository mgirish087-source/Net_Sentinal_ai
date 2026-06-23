export default function Badge({ type }) {
    const colors = {
      Normal: "bg-green-500",
      DoS: "bg-red-500",
      Probe: "bg-yellow-500",
      R2L: "bg-purple-500",
    };
  
    return (
      <span
        className={`px-2 py-1 text-xs rounded text-white ${
          colors[type] || "bg-gray-500"
        }`}
      >
        {type}
      </span>
    );
  }
