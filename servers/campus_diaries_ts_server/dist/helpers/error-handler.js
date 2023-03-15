"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.format({
        html: () => {
            if (err.name === 'CustomError') {
                return res.status(400).render('400', { msg: err.message });
            }
            if (err.name === 'UnauthorizedError') {
                return res.status(401).render('401', { msg: err.message });
            }
            if (err.name === 'PageNotFoundError') {
                return res.status(404).render('404', { msg: err.message });
            }
            return res.status(500).render('500', { msg: err.message });
        },
        json: () => {
            if (err.name === 'CustomError') {
                return res.status(400).json({ msg: err.message });
            }
            if (err.name === 'UnauthorizedError') {
                return res.status(401).json({ msg: err.message });
            }
            if (err.name === 'PageNotFoundError') {
                return res.status(404).json({ msg: err.message });
            }
            return res.status(500).json({ msg: err.message });
        },
        default: () => {
            if (err.name === 'CustomError') {
                return res.type('txt').send('Error: Bad request.');
            }
            if (err.name === 'UnauthorizedError') {
                return res.type('txt').send('Error: Forbidden method.');
            }
            if (err.name === 'PageNotFoundError') {
                return res.type('txt').send('Error: Page not found.');
            }
            return res.type('txt').send('Error: Internal server error.');
        }
    });
};
exports.errorHandler = errorHandler;
