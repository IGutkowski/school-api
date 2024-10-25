export const security = (req, res, next) => {
    res.set('X-Powered-By', 'Express'); // ukrycie informacji o serwerze
    res.set('X-Content-Type-Options', 'nosniff'); // zapobiega zmianie typu zawartości
    next();
}