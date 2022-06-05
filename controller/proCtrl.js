// model
const Product = require("../models/productModel");

//fs
const fs = require("fs");

const proCtrl = {

  // single file hendel ====================================== 👇
  createSingleProduct: async (req, res) => {
    try {
      const file = req.file;

      if (!file) return res.status(400).send("No image in the request");
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/upload/`;

      const product = await Product.create({
        title: req.body.title,
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
  },

  updateSingleProduct: async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);

      const file = req.file;

      if (!file) return res.status(400).send("No image in the request");
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/upload/`;

      if (fileName !== undefined) {
        fs.unlink(`upload/${product.image}`, function (err) {
          if (err) throw err;
          console.log(err);
        });
      }

      product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          image: `${fileName}`,
          img: `${basePath}${fileName}`,
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
        message: " Product are updated.",
        product,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteSingleProduct: async (req, res) => {
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


  // multuipel file handel ===================================== 👇
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



  // Get and delete all product ============================
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
};

module.exports = proCtrl;
