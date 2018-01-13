
class SocketStorage {
  constructor() {
    this.clients = [];
  }

  add(token, socket) {
    this.clients.push({
      token,
      socket,
    });
  }

  remove(token) {
    const index = this.clients.findIndex(client => client.token === token);
    const client = this.clients[index];

    if (index !== -1) {
      this.clients.splice(index, 1);
    }

    return this.getSocketOrNull(client);
  }

  get(token) {
    const client = this.clients.find(client => client.token === token);

    return this.getSocketOrNull(client);
  }

  includes(token) {
    return this.get(token) && true || false;
  }

  getSocketOrNull(client) {
    return client && client.socket || null;
  }
}


module.exports = new SocketStorage();