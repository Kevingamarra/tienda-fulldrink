import "./WhatsAppFloat.css";

function WhatsAppFloat() {
  const whatsappUrl = "https://wa.me/message/IUSFIUWOQFHCI1";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Abrir WhatsApp de Full Drinks"
    >
      <i className="bi bi-whatsapp"></i>
    </a>
  );
}

export default WhatsAppFloat;
