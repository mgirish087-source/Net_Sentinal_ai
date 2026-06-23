export default function Alert({ message }) {
    return (
      <div className="bg-red-600 text-white px-4 py-2 rounded animate-pulse shadow-lg">
        🚨 {message}
      </div>
    );
  }
