// here we define catAsync function to catch error outside the handler functions
const catchAsync = (callack) => {
    return (req, res, next) => {
        callack(req, res, next).catch(next)
    }
};

module.exports = catchAsync;