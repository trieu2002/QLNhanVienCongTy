import BaseException from "./BaseException";

class ServerInternalErrorException extends BaseException {
    constructor(errCode, message, errors) {

        super(errCode, message, errors)
    }
};
export default ServerInternalErrorException;