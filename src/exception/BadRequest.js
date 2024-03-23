import BaseException from "./BaseException";

class BadRequestException extends BaseException {
    constructor(errCode, message, errors) {
        this.errCode = errCode ?? null;
        this.message = message ?? null;
        this.errors = errors ?? null;
    }
};
export default BadRequestException;