import BaseException from "./BaseException";

class AnauthorizedException extends BaseException {
    constructor(errCode, message, errors) {
        super(errCode, message, errors)
    }
};
export default AnauthorizedException;