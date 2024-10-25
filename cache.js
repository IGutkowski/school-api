let etag = Date.now().toString(); // ETag - identyfikator zasobu

export const cache = (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=86400'); // 1 dzień
    res.set('ETag', etag); // ETag - identyfikator zasobu

    if (req.headers['if-none-match'] === etag) {
        return res.status(304).end(); // 304 - Not Modified
    }

    next();
};
