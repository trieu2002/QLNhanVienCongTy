import i18n from 'i18n'; // Import i18n

export const localize = (req, res, next) => {
    const lang = req.query.lang || req.headers['accept-language'] || 'vi';
    console.log('<<<<<<< lang >>>>>>>', lang);
    switch (lang) {
        case 'en':
            i18n.setLocale('en'); // Đặt ngôn ngữ cho i18n
            break;
        default:
            i18n.setLocale('vi');
            break;
    };
    return next();
}
