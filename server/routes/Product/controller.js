const { Product, Category, Supplier } = require("../../models");
const { fuzzySearch } = require("../../utils");

module.exports = {
  getAllProduct: async (req, res, next) => {
    try {
      const total = await Product.find();

      const { page, pageSize } = req.query;

      const limit = pageSize || 12;
      const skip = limit * (page - 1) || 0;

      let { search } = req.query;
      if (!search) {
        search = "";
      }
      const result = await Product.find({ name: fuzzySearch(search) })
        .populate("category")
        .populate("supplier")
        .populate("tag")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean({ virtuals: true });
      if (result.length > 0) {
        return res.send(200, {
          message: "Lấy thông tin sản phẩm thành công",
          payload: result,
          total: total.length,
        });
      } else {
        return res.send(200, {
          message: "Không có sản phẩm nào trùng khớp",
        });
      }
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },

  getDetailProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Product.findById(id)
        .populate("category")
        .populate("tag")
        .populate("supplier")
        .lean({ virtuals: true });
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }

      return res.send(200, {
        message: "Tìm sản phẩm thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },

  getProductByCategories: async (req, res, next) => {
    try {
      const { id } = req.query;

      const payload = await Product.find({ categoryId: id })
        .populate("category")
        .populate("tag")
        .populate("supplier")
        .lean({ virtual: true });

      if (payload.length > 0) {
        return res.send(200, {
          message: "Tìm sản phẩm thành công",
          payload: payload,
        });
      } else {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }
      // future: còn phải xử lí khi category bị xoá đi trước khi tìm
      // if (payload.isDeleted) {
      //   return res.send(404, {
      //     message: "Danh mục đã được xoá trước đó",
      //   });
      // }
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },
  getProductBySuppliers: async (req, res, next) => {
    try {
      const { id } = req.query;
      const payload = await Product.find({ supplierId: id })

        .populate("category")
        .populate("tag")
        .populate("supplier")
        .lean({ virtual: true });
      if (payload.length > 0) {
        return res.send(200, {
          message: "Tìm sản phẩm thành công",
          payload: payload,
        });
      } else {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }

      // if (payload.isDeleted) {
      //   return res.send(404, {
      //     message: "Danh mục đã được xoá trước đó",
      //   });
      // }
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const {
        name,
        price,
        discount,
        stock,
        description,
        categoryId,
        supplierId,
        tagId,
        pic,
      } = req.body;

      const errors = {};
      const exitName = Product.findOne({ name });
      const exitCategoryId = Category.findOne({ _id: categoryId });
      const exitSupplierId = Supplier.findOne({ _id: supplierId });
      const [checkName, checkCategoryId, checkSupplierId] = await Promise.all([
        exitName,
        exitCategoryId,
        exitSupplierId,
      ]);
      if (checkName) {
        errors.name = "Sản phẩm này đã tồn tại";
      }
      if (!checkCategoryId) errors.categoryId = "Không có danh mục này";

      console.log("««««« checkSupplierId »»»»»", checkSupplierId);
      if (!checkSupplierId) errors.categoryId = "Không có nhà cung cấp này";

      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Tạo sản phẩm không thành công",
          errors: errors,
        });
      }

      const newProduct = new Product({
        name,
        price,
        discount,
        stock,
        description,
        categoryId,
        supplierId,
        pic,
      });

      const payload = await newProduct.save();
      return res.send(200, {
        message: "Tạo sản phẩm thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Tạo sản phẩm không thành công",
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Product.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }

      await Product.findByIdAndDelete(id, { new: true });

      return res.send(200, {
        message: "Xoá sản phẩm thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá sản phẩm không thành công",
      });
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        price,
        discount,
        stock,
        categoryId,
        supplierId,
        description,
        pic,
      } = req.body;

      const errors = [];
      const exitName = Product.findOne({ _id: { $ne: id }, name });
      const exitCategoryId = Category.findOne({ _id: categoryId });
      const exitSupplierId = Supplier.findOne({ _id: supplierId });
      const [checkName, checkCategoryId, checkSupplierId] = await Promise.all([
        exitName,
        exitCategoryId,
        exitSupplierId,
      ]);
      console.log("««««« checkName »»»»»", checkCategoryId);

      if (checkName) {
        errors.name = "Tên sản phẩm đã tồn tại";
      }
      if (!checkCategoryId) errors.categoryId = "Không có danh mục này";

      if (!checkSupplierId) errors.supplierId = "Không có nhà cung cấp này";

      if (Object.keys(errors).length > 0) {
        return res.send(400, {
          message: "Cập nhật sản phẩm không thành công",
          errors: errors,
        });
      }

      const payload = await Product.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy sản phẩm",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      const result = await Product.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
          price: price || this.price,
          stock: stock || this.stock,
          discount: discount || this.discount,
          description: description || this.description,
          categoryId: categoryId || this.categoryId,
          supplierId: supplierId || this.supplierId,
          pic: pic || this.pic,
        },
        {
          new: true,
        }
      );

      return res.send(200, {
        message: "Cập nhật sản phẩm thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Cập nhật sản phẩm không thành công",
        errors: error,
      });
    }
  },
};
