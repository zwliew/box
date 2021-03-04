export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default {
  NotFoundError,
};
