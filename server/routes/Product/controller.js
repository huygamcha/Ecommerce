const { Product, Category, Supplier, Tag } = require("../../models");
const { fuzzySearch, asyncForEach } = require("../../utils");
const unidecode = require("unidecode");

module.exports = {
  getAllProduct: async (req, res, next) => {
    try {
      const total = await Product.find();

      const { page, pageSize } = req.query;

      const limit = pageSize || 12;
      const skip = limit * (page - 1) || 0;

      // search theo tag
      let { search } = req.query;
      if (!search) {
        search = "";
      }
      const result = await Product.find({ slug: fuzzySearch(search) })
        .populate("category")
        .populate("supplier")
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
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },

  getAllProductSearch: async (req, res, next) => {
    try {
      const total = await Product.find();

      const { page, pageSize } = req.query;

      const limit = pageSize || 12;
      const skip = limit * (page - 1) || 0;

      // search theo tag
      const { searchTag } = req.query;

      if (searchTag !== "") {
        console.log("««««« searchTag »»»»»", searchTag);
        const result = await Product.find({ tagList: { $in: [searchTag] } })
          .populate("category")
          .populate("supplier")
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
      }
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
        tagList,
        pic,
      } = req.body;

      const errors = {};
      const errorsTagList = {};
      console.log("««««« tagList »»»»»", tagList);
      if (tagList)
        await asyncForEach(tagList, async (item, index) => {
          const error = await Tag.findOne({ _id: item });
          if (!error) {
            errorsTagList[`tag ${index + 1}`] = `Không tìm thấy tag thứ ${
              index + 1
            }`;
          }
        });

      if (Object.keys(errorsTagList).length > 0) {
        errors.errorsTagList = errorsTagList;
      }

      const exitName = Product.findOne({ name });
      const exitCategoryId = Category.findOne({ _id: categoryId });
      const exitSupplierId = Supplier.findOne({ _id: supplierId });
      // const exitTagId = Tag.findOne({ _id: tagId });

      const [checkName, checkCategoryId, checkSupplierId] = await Promise.all([
        exitName,
        exitCategoryId,
        exitSupplierId,
        // exitTagId,
      ]);
      if (checkName) {
        errors.name = "Sản phẩm này đã tồn tại";
      }
      if (!checkCategoryId) errors.categoryId = "Không có danh mục này";
      if (!checkSupplierId) errors.supplierId = "Không có nhà cung cấp này";
      // if (!checkSupplierId) errors.tagId = "Không có tag cấp này";

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
        tagList,
        pic,
      });

      const payload = await newProduct.save();
      return res.send(200, {
        message: "Tạo sản phẩm thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
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
        tagList,
        pic,
      } = req.body;

      const errors = {};
      const exitName = Product.findOne({ _id: { $ne: id }, name });
      const exitCategoryId = Category.findOne({ _id: categoryId });
      const exitSupplierId = Supplier.findOne({ _id: supplierId });

      const errorsTagList = {};

      if (tagList)
        await asyncForEach(tagList, async (item, index) => {
          const error = await Tag.findOne({ _id: item });
          if (!error) {
            errorsTagList[`tag ${index + 1}`] = `Không tìm thấy tag thứ ${
              index + 1
            }`;
          }
        });

      if (Object.keys(errorsTagList).length > 0) {
        errors.errorsTagList = errorsTagList;
      }
      // const exitTagId = Tag.findOne({ _id: tagId });
      const [checkName, checkCategoryId, checkSupplierId] = await Promise.all([
        exitName,
        exitCategoryId,
        exitSupplierId,
        // exitTagId,
      ]);

      if (checkName) {
        errors.name = "Tên sản phẩm đã tồn tại";
      }
      if (!checkCategoryId && categoryId)
        errors.categoryId = "Không có danh mục này";
      if (!checkSupplierId && supplierId)
        errors.supplierId = "Không có nhà cung cấp này";
      // if (!exitTagId) errors.exitTagId = "Không có tag này";

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
          tagList: tagList || this.tagList,
          slug: this.slug,
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
      console.log("««««« error »»»»»", error);
      return res.send(404, {
        message: "Cập nhật sản phẩm không thành công",
        errors: error,
      });
    }
  },
};
