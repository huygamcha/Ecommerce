const { Product, Category, Supplier } = require("../../models");

module.exports = {
  getAllProduct: async (req, res, next) => {
    try {
      const result = await Product.find()
        .populate("category")
        .populate("supplier")
        .lean({ virtuals: true });
      return res.send(200, {
        message: "Lấy thông tin sản phẩm thành công",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
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
        .populate("supplier")
        .lean({ virtual: true });
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
      } = req.body;

      const errors = [];
      const exitName = Product.findOne({ name });
      const exitCategoryId = Category.findOne({ _id: categoryId });
      const exitSupplierId = Supplier.findOne({ _id: supplierId });
      const [checkName, checkCategoryId, checkSupplierId] = await Promise.all([
        exitName,
        exitCategoryId,
        exitSupplierId,
      ]);

      if (checkName) {
        errors.push({ name: "Sản phẩm này đã tồn tại" });
      }
      if (!checkCategoryId)
        errors.push({ categoryId: "Không có danh mục này" });
      else {
        if (checkCategoryId.isDeleted) {
          errors.push({ categoryId: "Danh mục này đã bị xoá" });
        }
      }
      console.log("««««« checkSupplierId »»»»»", checkSupplierId);
      if (!checkSupplierId)
        errors.push({ categoryId: "Không có nhà cung cấp này" });
      else {
        if (checkSupplierId.isDeleted)
          errors.push({ categoryId: "Nhà cung cấp này đã bị xoá" });
      }

      if (errors.length > 0) {
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

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Sản phẩm đã được xoá trước đó",
        });
      }

      await Product.findByIdAndDelete(id);

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
      } = req.body;

      const errors = [];
      const exitName = Product.findOne({ _id: { $ne: id }, name });
      const exitCategoryId = Category.findOne({ _id: { $ne: categoryId } });
      const exitSupplierId = Supplier.findOne({ _id: { $ne: supplierId } });
      const [checkName, checkCategoryId, checkSupplierId] = await Promise.all([
        exitName,
        exitCategoryId,
        exitSupplierId,
      ]);

      if (checkName) {
        errors.push({ name: "Tên sản phẩm đã tồn tại" });
      }
      if (!checkCategoryId)
        errors.push({ categoryId: "Không có danh mục này" });
      else {
        if (checkCategoryId.isDeleted) {
          errors.push({ categoryId: "Danh mục này đã bị xoá" });
        }
      }
      if (!checkSupplierId)
        errors.push({ supplierId: "Không có nhà cung cấp này" });
      else {
        if (checkSupplierId.isDeleted)
          errors.push({ supplierId: "Nhà cung cấp này đã bị xoá" });
      }

      if (errors.length > 0) {
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
        message: "Sửa sản phẩm không thành công",
        error: error,
      });
    }
  },
};
