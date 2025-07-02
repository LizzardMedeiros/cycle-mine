const fiveMinutes = 5 * 60 * 1000;

module.exports = {
  data: {},
  create (key, value, timeout) {
    if (timeout === -1) {
      this.data[key] = { value };
      return value;
    }
    const timer = setTimeout(() => {
      delete this.data[key];
      clearTimeout(timer);
    }, timeout || fiveMinutes);

    this.data[key] = { timer, value };
    return value;
  },
  update (key, value, timeout) {
    if (this.data[key]) clearTimeout(this.data[key].timer);
    return this.create(key, value, timeout);
  },
  get (key) {
    return this.data[key] ? this.data[key].value : null;
  },
  delete (key) {
    delete this.data[key];
  }
};
