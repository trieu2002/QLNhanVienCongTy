class BaseException extends Error {
    constructor(errCode, message, errors) {
        super(message);
        this.errCode = errCode ?? null;
        this.errors = errors ?? null;
    }
}
export default BaseException;