const ImagesController = require('./images-controller');

class UserStorage {
  constructor(token) {
    this.token = token;
    this.socket = null;
    this.imageController = new ImagesController;
  }
}



class UsersStorage {
  constructor() {
    this.users = [];
  }

  add(token) {
    const user = new UserStorage(token);
    this.users.push(user);
    return user;
  }

  get(token) {
    const user = this.users.find(user => user.token === token);

    return user || null;
  }

  includes(token) {
    return this.get(user) && true || false;
  }

  remove(token) {
    const index = this.users.findIndex(user => user.token === token);
    const user = this.users[index];

    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    else {
      return false;
    }
  }
}


module.exports = new UsersStorage();