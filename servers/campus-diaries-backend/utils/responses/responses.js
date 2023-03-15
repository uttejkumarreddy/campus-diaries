sendSuccessMessage = (res, statusCode, successMsg) => {
    res.status(statusCode).json({
        success: {
            msg: successMsg
        }
    })
}

sendErrorMessage = (res, errorCode, errorMsg, error) => {
    //TODO: Log error and send email
    if(error) console.log(err);
    res.status(errorCode).json({
        error: {
            msg: errorMsg
        }
    });
}

module.exports = {
    sendSuccessMessage: sendSuccessMessage,
    sendErrorMessage: sendErrorMessage
}