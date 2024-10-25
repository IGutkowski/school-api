export const contentType = (req, res, next) => {
    const ct = req.get('Content-Type');
    if(ct !== 'application/json') {
        return res.status(415).send('Server accepts only application/json data'); // 415 - Unsupported Media Type
    }
    next();
}

