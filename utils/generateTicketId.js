function generateTicketId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz*+-?!';
    let ticketId = '';
    for (let i = 0; i < length; i++) {
      ticketId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ticketId;
}
  
module.exports = generateTicketId;