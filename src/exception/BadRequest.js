import BaseException from "./BaseException";

class BadRequestException extends BaseException {
    constructor(errCode, message, errors) {

        super(errCode, message, errors)
    }
};
export default BadRequestException;