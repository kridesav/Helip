export default formatDateAndTime = (timestamp) => {

  if (!timestamp) return;

    const date = timestamp.toDate();

    const formattedDate = new Intl.DateTimeFormat('fi-FI', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(date);
  
    const formattedTime = new Intl.DateTimeFormat('fi-FI', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  
    return `${formattedDate} at ${formattedTime}`;
  };
  