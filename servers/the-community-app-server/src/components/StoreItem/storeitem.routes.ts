export { };
const router = require('express').Router();
const middlewares = require('../../middlewares');
const storeItemController = require('./storeitem.controllers');

router.get('/status', middlewares.isAuth(), storeItemController.getInitialItemStatus);
router.get('/categories', middlewares.isAuth(), storeItemController.getItemCategories);
router.get('/', middlewares.isAuth(), storeItemController.getHomePageItems);
router.post('/', middlewares.isAuth(), middlewares.validateBody(), storeItemController.createItem);

module.exports = router;