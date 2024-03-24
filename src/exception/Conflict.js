import BaseException from "./BaseException";

class ConflictException extends BaseException {
    constructor(errCode, message, errors) {
        super(errCode, message, errors)
    }
};
export default ConflictException;