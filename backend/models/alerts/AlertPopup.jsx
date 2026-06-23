function AlertPopup({ message }) {
    if (!message) return null;
  
    return (
      <div style={alertStyle}>
        ⚠️ {message}
      </div>
    );
  }
  
  const alertStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "red",
    color: "#fff",
    padding: "15px",
    borderRadius: "8px"
  };
  
  export default AlertPopup;