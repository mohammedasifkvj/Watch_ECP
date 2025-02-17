const express = require("express");
const admin_route = express();
const auth = require('../middlewares/adminTokenAuth')
const logged = require('../middlewares/hasToken')
const uploadImage = require('../drivers/multer')
const methodOverride = require('method-override');

const adminController = require("../controllers/adminController");
const reportController = require("../controllers/reportController");
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const offerController = require('../controllers/offer&CouponController');

admin_route.use(methodOverride('_method'));

admin_route.set('views', './views/admin');
//---------Admin Login
admin_route.get('/', logged.isAdminLoggedIn, adminController.loadAdminSignIn)
admin_route.get('/login', logged.isAdminLoggedIn, adminController.loadAdminSignIn)
admin_route.post('/adminSignIn', logged.isAdminLoggedIn, adminController.adminSignIn);
admin_route.get('/logout', auth.authenticateToken, adminController.adminLogout)
admin_route.get('/dash', auth.authenticateToken, adminController.loadDash)
//-------Graphs
admin_route.post('/sellingChart', auth.authenticateToken, reportController.lineChartData)
admin_route.post('/topCategory', auth.authenticateToken, adminController.topCategory)
admin_route.post('/topProducts', auth.authenticateToken, adminController.topProducts)
admin_route.post('/topBrands', auth.authenticateToken, adminController.topBrands)
//-------Sales Report
admin_route.get('/generateSalesReport', auth.authenticateToken, reportController.generateSalesReport)
admin_route.get('/downloadExcelReport', auth.authenticateToken, reportController.generateExcelReport);
admin_route.get('/downloadPdfReport', auth.authenticateToken, reportController.generatePDFReport);

//---------Categry
admin_route.get('/ShowCategory', auth.authenticateToken, categoryController.category)
admin_route.get('/createCat', auth.authenticateToken, categoryController.createCategoryPage)
admin_route.post('/addCategory', auth.authenticateToken, categoryController.createCategory)
admin_route.get('/editCategory/:categoryId', auth.authenticateToken, categoryController.editCategoryPage)
admin_route.put('/updateCategory/:categoryId', auth.authenticateToken, categoryController.editCategory)
admin_route.patch('/categoryStatus', auth.authenticateToken, categoryController.listUnlistCategory)

//---------Product 
admin_route.get('/product', auth.authenticateToken, productController.product)
admin_route.get('/addProduct', auth.authenticateToken, productController.addProductPage)
admin_route.post('/addProduct', auth.authenticateToken, uploadImage.any(), productController.addProduct)
admin_route.get('/editProduct/:productId', auth.authenticateToken, uploadImage.any(), productController.editProductPage)
admin_route.put('/updateProduct/:productId', auth.authenticateToken, productController.editProduct)
admin_route.patch('/productStatus', auth.authenticateToken, productController.listUnlistProduct)
admin_route.get('/product/searchProduct', auth.authenticateToken, productController.searchProduct)
admin_route.get('/product/reviews', auth.authenticateToken, productController.reviews)

//--------customer 
admin_route.get('/userTable', auth.authenticateToken, adminController.customerTable)
admin_route.patch('/userStatus', auth.authenticateToken, adminController.blockAndUnblockUser);

//--------Order
admin_route.get('/orderTable', auth.authenticateToken, adminController.orderTable)
admin_route.get('/OrderDetails/:orderId', auth.authenticateToken, adminController.orderDetails)
admin_route.delete('/deleteOrder', auth.authenticateToken, adminController.deleteOrder)
admin_route.post('/updateOrderStatus', auth.authenticateToken, adminController.updateOrderStatus)
admin_route.post('/approveReturn', auth.authenticateToken, adminController.approveReturn);
admin_route.post('/denyReturn', auth.authenticateToken, adminController.denyReturn);

//--------Offer
admin_route.get('/offer', auth.authenticateToken, offerController.offers)
admin_route.get('/offer/addOfferPage', auth.authenticateToken, offerController.addOfferPage)
admin_route.post('/offer/addOffer', auth.authenticateToken, offerController.addOffer)
admin_route.get('/offer/offerDetails/:offerId', auth.authenticateToken, offerController.offerDatails)
admin_route.patch('/offer/offerStatusChange', auth.authenticateToken, offerController.offerStatusChange);
admin_route.delete('/offer/deleteOffer', auth.authenticateToken, offerController.deleteOffer)

//--------Coupon
admin_route.get('/coupon', auth.authenticateToken, offerController.coupon)
admin_route.get('/coupon/addCouponPage', auth.authenticateToken, offerController.addCouponPage)
admin_route.post('/coupon/addCoupon', auth.authenticateToken, offerController.addCoupon)
admin_route.patch('/coupon/couponStatusChange', auth.authenticateToken, offerController.couponStatusChange);
admin_route.delete('/deleteCoupon', auth.authenticateToken, offerController.deleteCoupon)

//404
admin_route.get('*', (req, res) => {
    return res.status(404).render('404Admin');
});

module.exports = admin_route;