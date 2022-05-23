// model
const Product = require("../models/productModel");

//fs
const fs = require("fs");

// const imgPath = {
//   imglocalDisk: [],
//   imgHostUrl: [],
// };

const proCtrl = {
  createProduct: async (req, res) => {
    try {
      const file = req.file;

      if (!file) return res.status(400).send("No image in the request");
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/upload/`;

      const product = await Product.create({
        title: req.body.title,
        // img: `${basePath}${fileName}`,
        image: `${fileName}`,
        img: `${basePath}${fileName}`,
      });

      console.log(file);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }

    // const { filename }= req.file;
    //     const {
    //         title,
    //         // image
    //     } = req.body;

    //     try {

    //         let product = new Product();

    //         product.title = title;
    //         product.image = filename;

    //         await product.save();

    //         res.json({
    //             msg : `Product ${title} was created`,
    //             product
    //         })

    //     } catch (err) {
    //         return res.status(500).json({msg: err.message})
    //     }
  },
  // updateProduct: async(req, res) => {
  //     try {
  //         const files = req.files;
  //         const imgPath = []

  //         const basePath = `${req.protocol}://${req.get('host')}/upload/`;
  //         if(files){
  //             files.map( files => {
  //                 imgPath.push(`${basePath}${files.filename}`)
  //             })
  //         }

  //         const product = await Product.findByIdAndUpdate( req.params.id,
  //             {
  //                 images: imgPath
  //             },
  //             {new: true}
  //         )

  //         res.status(201).json({
  //             success: true,
  //             product
  //         })

  //     } catch (err) {
  //         return res.status(500).json({msg: err.message})
  //     }
  // },
  deleteProduct: async (req, res) => {
    try {
      let product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      fs.unlink(`upload/${product.image}`, (err) => {
        if (err) throw err;
        console.log(err);
      });

      res.status(200).json({
        success: true,
        message: "Single img product is deleted.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      let product = await Product.find();
      let countProduct = product.length;

      if (product) {
        return res.status(400).json({
          countProduct,
          success: true,
          product,

          // message : product,
        });
      }

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },

  uploadMultiProduct: async (req, res) => {
    try {
      const imgPath = {
        imglocalDisk: [],
        imgHostUrl: [],
      };

      const file = req.files;
      if (!file) return res.status(400).send("No image in the request");
      const basePath = `${req.protocol}://${req.get("host")}/upload/`;

      if (file) {
        file.map((fileUpload) => {
          imgPath.imglocalDisk.push(`${fileUpload.filename}`);

          imgPath.imgHostUrl.push(`${basePath}${fileUpload.filename}`);
        });
      }

      const product = await Product.create({
        title: req.body.title,
        images: imgPath.imglocalDisk,
        img: imgPath.imgHostUrl,
      });

      res.status(201).json({
        success: true,
        product,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // updateMultiProduct: async (req, res) => {
  //   try {
  //     const imgPath = {
  //       imglocalDisk: [],
  //       imgHostUrl: [],
  //     };

  //     const file = req.files;
  //     if (!file) return res.status(400).send("No image in the request");
  //     const basePath = `${req.protocol}://${req.get("host")}/upload/`;

  //     if (file) {
  //       file.map((fileUpload) => {
  //         imgPath.imglocalDisk.push(`${fileUpload.filename}`);

  //         imgPath.imgHostUrl.push(`${basePath}${fileUpload.filename}`);
  //       });
  //     }

  //     let oldProduct = await Product.findByIdAndUpdate(
  //       req.params.id,

  //       {
  //         title: req.body.title,
  //         images: imgPath.imglocalDisk,
  //         img: imgPath.imgHostUrl,
  //       },
  //       {
  //         new: true,
  //         runValidators: true,
  //         useFindAndModify: false,
  //       }
  //     );

  //     if (oldProduct === null) {
  //       for (let i = 0; i < oldProduct.images.length; i++) {
  //         fs.unlink(`upload/${oldProduct.images[i]}`, function (err) {
  //           if (err) throw err;
  //           console.log(err);
  //         });
  //       }
  //     }

  //     if (!oldProduct) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Product not found",
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "Multi Product are updated.",
  //       oldProduct,
  //     });
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },

  updateMultiProduct: async (req, res) => {
    try {


      let product = await Product.findById(req.params.id);

      const imgPath = {
        imglocalDisk: [],
        imgHostUrl: [],
      };


      const file = req.files;
      if (!file) return res.status(400).send("No image in the request");
      const basePath = `${req.protocol}://${req.get("host")}/upload/`;

      if (file) {
        file.map((fileUpload) => {
          imgPath.imglocalDisk.push(`${fileUpload.filename}`);

          imgPath.imgHostUrl.push(`${basePath}${fileUpload.filename}`);
        });
      }

      if (imgPath !== undefined) {
        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
          fs.unlink(`upload/${product.images[i]}`, function (err) {
            if (err) throw err;
            console.log(err);
          });
        }

    }

      product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          images: imgPath.imglocalDisk,
          img: imgPath.imgHostUrl,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Multi Product are updated.",
        product,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  delMultiProduct: async (req, res) => {
    try {
      let product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      for (let i = 0; i < product.images.length; i++) {
        fs.unlink(`upload/${product.images[i]}`, (err) => {
          if (err) throw err;
          console.log(err);
        });
      }

      // console.log(product.images)

      res.status(200).json({
        success: true,
        message: "Multi Product are deleted.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  delAllProduct: async (req, res) => {
    try {
      await Product.deleteMany();
      console.log("All Products are deleted");

      res.status(200).json({
        success: true,
        message: "all Product are deleted.",
      });

      // await Product.insertMany(products)
      // await Slider.insertMany(slider)
      // console.log('All Products and slider are added.')

      // process.exit();
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = proCtrl;
