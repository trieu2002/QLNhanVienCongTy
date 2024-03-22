import exprtess from 'express';
const router = exprtess.Router();

const initRoutes = (app) => {
    router.get("/", (req, res) => {
        res.send("Hello World")
    });
    return app.use('/', router);
};
export default initRoutes;