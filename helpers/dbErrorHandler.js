exports.signupErrorHandler = error => {
    switch (error.code) {
        case 11000:
            if(error.keyPattern._id){
                return 'user already signed up'
            }
            break;
        default:
                return 'something went wrong'
    }
    return error;
};