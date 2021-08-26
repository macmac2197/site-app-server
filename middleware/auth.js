import jwt, { decode } from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        // Get user token
        const token = req.headers.authorization.split(" ")[1];

        // Check if the user token is custom or form third party
        // if from google it's greater 500 chars
        const isCustomAuth = token.length < 500;

        let decodeData;
        
        if (token && isCustomAuth) {
            decodeData = jwt.verify(token, 'testsecret');

            req.userId = decodeData?.id;
        } else {
            decodeData = jwt.decode(token);
            
            // sub is from google, generates id's
            req.userId = decodeData?.sub;
        }

        next();
    } catch (error) {
        res.json(error);
    }
}

export default auth;