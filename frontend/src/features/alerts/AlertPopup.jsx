function AlertPopup({ message }) {
    if (!message) return null;
  
    return (
      <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow">
        {message}
      </div>
    );
  }
  
  export default AlertPopup;