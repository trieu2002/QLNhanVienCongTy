import BaseException from "./BaseException";

class NotFoundException extends BaseException {
    constructor(errCode, message, errors) {
        super(errCode, message, errors)
    }
};
export default NotFoundException;