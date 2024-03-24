import BaseException from "./BaseException";

class ForbiddenException extends BaseException {
    constructor(errCode, message, errors) {
        super(errCode, message, errors)
    }
};
export default ForbiddenException;