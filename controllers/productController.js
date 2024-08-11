const Product= require("../models/product")
const Category=require("../models/category")
const Reviews=require("../models/review")

const sharp =require('sharp')
       
//Admin Product Page Load
const product = async(req,res)=>{
    const {message, success} = req.query
    try {
        const page = parseInt(req.query.page) || 1;
        const limit =10; // Number of product per page
        const skip = (page - 1) * limit;

         const totalProduct = await Product.countDocuments();
        const product= await Product.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalProduct / limit);
       const category=await Category.find()
        return res.render('5_product',{
        product,
        category, 
        currentPage: page,
        totalPages,  
        message,
        success
    });
    } catch (e) {
        console.log(e);
    }  
}

// add product page
const addProductPage =async (req,res)=>{
    const {message, success} = req.query
    try {
        const category=await Category.find()
        return res.render('6_addProduct',{ 
        category,   
        message,
        success
    });
    } catch (e) {
        console.log(e);
    }  
}

// Create new Product
const addProduct = async (req,res) =>{
    const {productName,category,brand,description,dialColour,strapColour,stock,price,discountPrice} = req.body;
    //console.log("01",req.files);
    const files=req.files ||{}
    //console.log(files)
    try{

        if(!productName){
            const message='Name is required'
            return res.status(400).json({message: message})
            //return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Name is required')}`);
        }if(!brand){
            const message='Brand is required'
            return res.status(400).json({message: message})
            //return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Brand is required')}`);
        }if(!category){
            const message='category is required'
            return res.status(400).json({message: message})
           // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('category is required')}`);
        }if(! description){
            const message='Description is required'
            return res.status(400).json({message: message})
            //return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Description is required')}`);
        }
        // if(!dialColour){
        //     const message='Dial Colour is required'
        //     return res.status(400).json({message: message})
        //    // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('dialColour is required')}`);
        // }if(!strapColour){
        //     const message='strap Colour is required'
        //     return res.status(400).json({message: message})
        //    // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Strap Colour is required')}`);
        // }
        if(!price){
            const message='Price is required'
            return res.status(400).json({message: message})
           // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Price is required')}`);
        }if(!discountPrice){
            const message='Discount Price is required'
            return res.status(400).json({message: message})
           // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Discount Price is required')}`);
        }if(!stock){
            const message='Stock is required'
            return res.status(400).json({message: message})
            //return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Stock is required')}`);
        //  }if(!productImage){
        //     const meassage='4 images must be added'
        //     return res.status(400).json({message: message})
        //  // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('images are required')}`);
        }
  
        const isExist = await Product.findOne({ productName: { $regex: new RegExp(`^${productName}$`, 'i') } });
        if(isExist){
        const message=productName+' product is already exists'
           return res.status(403).json({message: message})
        //    .redirect(`/admin/addProduct?message=${encodeURIComponent(productName+' product is already exists')}`);
        } 

        const newProductExpires = Date.now() + 20*24*60*60*1000;  //20 days
        
        const productImagePaths = [];

        for (let i = 0; i < req.files.length; i++) {
            const imagePaths = `/productImages/${req.files[i].originalname.toLowerCase().replace(/\s+/g, '-')}_thumbnail${i}_${Date.now()}.png`;
            productImagePaths.push(imagePaths);
            await sharp(req.files[i].buffer)
                .png({ quality: 90 })
                .toFile(`public/${imagePaths}`);
        }

         await Product.create({productName,category,brand,description,dialColour,strapColour,stock,price,discountPrice,productImage:productImagePaths,newProductExpires})
        const message='New product  '+productName+ ' created successfully'
         return res.status(200).json({success:true,message:message})
       // return res.redirect(`/admin/product?success=${encodeURIComponent('New product  '+productName+' created successfully')}`); 
        }catch(e){
        console.log(e);
    }
  }
  //  Edit Product page Load
  const editProductPage =async (req,res)=>{

    const {  productId } = req.params;
    const {message, success} = req.query
    try {
        let product= await Product.findById(productId);
        const category=await Category.find()
        return res.render('8_editProdectPage',{ 
        product,
        category,   
        message,
        success
    });
    } catch (e) {
        console.log(e.message);
    }  
}

// Edit product
const editProduct = async (req, res) => {
    try {
        const {productName,category,brand,description,dialColour,strapColour,stock,price,discountPrice} = req.body;
        console.log(req.body,'this is body')
        console.log(req.files,'thsi si files')
       // const files=req.files ||{}
       
         const {productId} = req.params;
        console.log(productId,'this is productId')
       //const productData = await Product.findById(productId);
       //console.log(productData);

        if(!productName){
            const message='Name is required'
            return res.status(400).json({message: message})
            //return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Name is required')}`);
        }if(!brand){
            const message='Brand is required'
            return res.status(400).json({message: message})
            //return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Brand is required')}`);
        }if(!category){
            const message='category is required'
            return res.status(400).json({message: message})
           // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('category is required')}`);
        }if(! description){
            const message='Description is required'
            return res.status(400).json({message: message})
            //return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Description is required')}`);
        }
        // if(!dialColour){
        //     const message='Dial Colour is required'
        //     return res.status(400).json({message: message})
        //    // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('dialColour is required')}`);
        // }if(!strapColour){
        //     const message='strap Colour is required'
        //     return res.status(400).json({message: message})
        //    // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Strap Colour is required')}`);
        // }
        if(!price){
            const message='Price is required'
            return res.status(400).json({message: message})
           // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Price is required')}`);
        }
        if(!discountPrice){
            const message='Discount Price is required'
            return res.status(400).json({message: message})
           // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Discount Price is required')}`);
        }
        if(!stock){
            const message='Stock is required'
            return res.status(400).json({message: message})
            return res.redirect(`/admin/addproduct?message=${encodeURIComponent('Stock is required')}`);
         }
    // if(!productImage){
    //         const meassage='4 images must be added'
    //         return res.status(400).json({message: message})
    //      // return res.redirect(`/admin/addproduct?message=${encodeURIComponent('images are required')}`);
    //    }
      
        const newProductExpires = Date.now() + 10*24*60*60*1000; 

        // const productImagePaths = [];
        // console.log('11')
        // for (let i = 0; i < 4 ; i++) {
        //     console.log("Edit image")
        //     const imagePaths = `/productImages/${req.files[i].originalname.toLowerCase().replace(/\s+/g, '-')}_thumbnail${i}_${Date.now()}.png`;
        //     console.log('22')
        //     productImagePaths.push(imagePaths);
        //     await sharp(req.files[i].buffer)
        //         .png({ quality: 90 })
        //         .toFile(`public/${imagePaths}`);  
        // }
       console.log("Edit work")

       //Perform case-insensitive search for existing category
    const isExist =await Product.findOne({ _id:{ $ne: productId },productName:{$regex:new RegExp(`^${productName}$`,'i')}});

    if (isExist) {
        return res.status(402).json({success:false,message:productName+' is already exists'})
        //return res.redirect(`/admin/product?message=${encodeURIComponent(productName+' is already exists')}`);
      }

         await Product.updateOne({_id:productId},{$set:{
            productName:productName,
            category:category,
            brand:brand,
            description:description,
            // dialColour:dialColour,
            // strapColour:strapColour,
            stock:stock,
            price:price,
            discountPrice:discountPrice,
            //productImage:productImagePaths,
            newProductExpires:newProductExpires
        }})
        console.log("Edit comple")
        const message=productName+ ' Updated successfully'
         return res.status(200).json({success:true,message:message})
        
        //return res.redirect(`/admin/product?success=${encodeURIComponent(productName+' updated successfully')}`); 

        }catch(e){
        console.log(e.message);
       }
  }

//List and Unlist Product
const listUnlistProduct = async (req, res) => {
    //console.log("work")
    try {
        const { productId } = req.body;
        console.log(productId, 'this is productId');
        const productData = await Product.findById(productId);
         
        if (!productData) {
          return res.json({ success: false, message: 'Product not found' });
        }
  
       if (productData.isDeleted) {
        await Product.findByIdAndUpdate(productId, { $set: { isDeleted: false } }, { new: true });
        return res.json({ success: true, message: 'Product Listed successfully' });
       } else {
        await Product.findByIdAndUpdate(productId, { $set: { isDeleted: true } }, { new: true });
        return res.json({ success: true, message: 'Product Hided successfully' });
       }
    } catch (e) {
        console.log(e.message);
        res.json({ success: false, message: 'An message occurred' });
    }
  };

  //Review Page Load
const reviews = async(req,res)=>{
    const {message, success} = req.query
    try {
        const page = parseInt(req.query.page) || 1;
        const limit =10; // Number of offers per page
        const skip = (page - 1) * limit;

        const reviews= await Reviews.find().skip(skip).limit(limit);
        const totalReviews = await Reviews.countDocuments();
        const totalPages = Math.ceil(totalReviews / limit);
       // console.log()
        const product=await Product.find()
        return res.render('10_reviews',{
        product,
        reviews,
        currentPage: page,
        totalPages,
        message,
        success
    });
    } catch (e) {
        console.log(e);
    }  
}

//Exporting modules
module.exports={
    product,
    addProductPage,
    addProduct,
    editProductPage,
    editProduct,
    listUnlistProduct,
    reviews
}