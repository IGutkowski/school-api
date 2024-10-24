export const authorize = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    if (token !== '123') {
        return res.status(403).send('Access denied. Invalid token.');
    }

    next();
};
