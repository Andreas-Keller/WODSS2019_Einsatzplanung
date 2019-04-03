class Await_response {
    //FIELDS
    //httpStatus
    //msg
    //payload

    constructor(httpStatus, msg="", payload=null) {
        this.payload = payload;
        this.httpStatus = httpStatus;
        this.msg = msg;
    }

    sPayload(payload) {
        this.payload = payload;
        return this;
    }

    sHttpStatus(httpStatus) {
        this.httpStatus = httpStatus;
        return this;
    }

    sMsg(msg) {
        this.msg = msg;
        return this;
    }
}

module.exports = Await_response;
