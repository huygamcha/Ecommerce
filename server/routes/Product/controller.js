const { Product, Category, Supplier, Tag, Brand } = require("../../models");
const { fuzzySearch, asyncForEach } = require("../../utils");
const unidecode = require("unidecode");

module.exports = {
  // v2/getAllProduct

  getAllProduct: async (req, res, next) => {
    try {
      // Get total count of products for pagination
      const total = await Product.countDocuments();

      const { page = 1, pageSize = 12, search = "" } = req.query;

      const limit = parseInt(pageSize);
      const skip = limit * (page - 1);

      // Aggregate to calculate fakeNumber + sold and sort
      const pipeline = [
        {
          $match: {
            slug: { $regex: search, $options: "i" }, // Perform a fuzzy search on the slug
          },
        },
        {
          $addFields: {
            // Ensure fakeNumber and sold are treated as numbers and replace undefined with 0
            fakeNumber: { $ifNull: [{ $toDouble: "$fakeNumber" }, 0] },
            sold: { $ifNull: [{ $toDouble: "$sold" }, 0] },
            totalSold: {
              $add: [
                { $ifNull: [{ $toDouble: "$fakeNumber" }, 0] },
                { $ifNull: [{ $toDouble: "$sold" }, 0] },
              ],
            }, // Calculate fakeNumber + sold
            total: {
              $multiply: [
                { $toDouble: "$price" },
                { $divide: [{ $subtract: [100, "$discount"] }, 100] },
              ],
            }, // Calculate total as price * ((100 - discount) / 100)
          },
        },
        {
          $sort: {
            totalSold: -1,
            createdAt: -1,
          },
        },
        // {
        //   $skip: skip,
        // },
        // {
        //   $limit: limit,
        // },
        {
          $lookup: {
            from: "categories", // Make sure this matches the actual collection name for categories
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        // {
        //   $lookup: {
        //     from: "suppliers", // Make sure this matches the actual collection name for suppliers
        //     localField: "supplier",
        //     foreignField: "_id",
        //     as: "supplier",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$category",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$supplier",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
      ];

      const result = await Product.aggregate(pipeline).exec();

      if (result.length > 0) {
        return res.status(200).send({
          message: "Lấy thông tin sản phẩm thành công",
          payload: result,
          total: total,
        });
      } else {
        return res.status(200).send({
          message: "Không có sản phẩm nào trùng khớp",
        });
      }
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.status(400).send({
        message: "Lấy thông tin sản phẩm không thành công",
      });
    }
  },

  // v1/getAllProduct
  // getAllProduct: async (req, res, next) => {
  //   try {
  //     const total = await Product.find();

  //     const { page, pageSize } = req.query;

  //     const limit = pageSize || 12;
  //     const skip = limit * (page - 1) || 0;

  //     // search theo tag
  //     let { search } = req.query;
  //     if (!search) {
  //       search = "";
  //     }
  //     const result = await Product.find({ slug: fuzzySearch(search) })
  //       // nếu sử dụng ui là tag nhãn thì populate thêm category
  //       // .populate("category")
  //       // .populate("supplier")
  //       .sort({ createdAt: -1 })
  //       .lean({ virtuals: true });
  //     if (result.length > 0) {
  //       return res.send(200, {
  //         message: "Lấy thông tin sản phẩm thành công",
  //         payload: result,
  //         total: total.length,
  //       });
  //     } else {
  //       return res.send(200, {
  //         message: "Không có sản phẩm nào trùng khớp",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("««««« error »»»»»", error);
  //     return res.send(400, {
  //       message: "Lấy thông tin sản phẩm không thành công",
  //     });
  //   }
  // },

  getAllProductSearch: async (req, res, next) => {
    try {
      const total = await Product.find();

      const { page, pageSize } = req.query;

      const limit = pageSize || 12;
      const skip = limit * (page - 1) || 0;

      // search theo tag

      let {
        searchTag,
        priceFrom,
        priceTo,
        ageFrom,
        ageTo,
        categoryId,
        brandId,
        search,
      } = req.query;

      priceFrom = parseInt(priceFrom);
      priceTo = parseInt(priceTo);
      ageFrom = parseInt(ageFrom);
      ageTo = parseInt(ageTo);

      if (!priceFrom) priceFrom = 0;
      if (!priceTo) priceTo = 1000000000;
      if (!ageFrom) ageFrom = 0;
      if (!ageTo) ageTo = 100;
      if (!search) {
        search = "";
      }

      let result;

      // tìm kiểm ở ở ô input
      if (search) {
        result = await Product.find({
          age: { $gte: ageFrom, $lte: ageTo },
          price: { $gte: priceFrom, $lte: priceTo },
          slug: fuzzySearch(search),
        })
          .populate("category")
          .populate("brand")
          .sort({ createdAt: -1 })
          .lean({ virtuals: true });
      } else if (search === "") {
        // khi lọc theo tag
        if (searchTag) {
          result = await Product.find({
            tagList: { $in: [searchTag] },
            price: { $gte: priceFrom, $lte: priceTo },
            age: { $gte: ageFrom, $lte: ageTo },
          })
            .populate("category")
            .populate("brand")
            // .limit(limit)
            // .skip(skip)
            .sort({ createdAt: -1 })
            .lean({ virtuals: true });
        } else if (categoryId && !brandId && !searchTag) {
          // khi lọc theo danh mục
          result = await Product.find({
            categoryId: categoryId,
            price: { $gte: priceFrom, $lte: priceTo },
            age: { $gte: ageFrom, $lte: ageTo },
          })
            .populate("category")
            .populate("brand")
            // .limit(limit)
            // .skip(skip)
            .sort({ createdAt: -1 })
            .lean({ virtuals: true });
        }
        // khi lọc theo danh mục và brand
        else if (categoryId && brandId && !searchTag) {
          result = await Product.find({
            categoryId: categoryId,
            brandId: brandId,
            price: { $gte: priceFrom, $lte: priceTo },
            age: { $gte: ageFrom, $lte: ageTo },
          })
            .populate("category")
            .populate("brand")
            // .limit(limit)
            // .skip(skip)
            .sort({ createdAt: -1 })
            .lean({ virtuals: true });
        }
      }

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

  getDetailProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Product.findById(id)
        .populate("category")
        .populate("tag")
        .populate("brand")
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

  getDetailProductSlug: async (req, res, next) => {
    try {
      const { slug } = req.params;
      // console.log("««««« slug »»»»»", slug);
      const payload = await Product.findOne({ slug: fuzzySearch(slug) })
        .populate("category")
        .populate("tag")
        .populate("brand")
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
        .populate("brand")
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
        brandId,
        pic,
        age,
        fromBrand,
        supplierHome,
        country,
        ingredient,
        detail,
        specifications,
        unit,
        album,
        fakeNumber,
      } = req.body;

      const errors = {};
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

      const exitName = Product.findOne({ name });
      const exitCategoryId = Category.findOne({ _id: categoryId });
      const exitBrandId = Brand.findOne({ _id: brandId });
      // const exitTagId = Tag.findOne({ _id: tagId });

      const [checkName, checkCategoryId, checkBrandId] = await Promise.all([
        exitName,
        exitCategoryId,
        exitBrandId,
        // exitTagId,
      ]);
      if (checkName) {
        errors.name = "Sản phẩm này đã tồn tại";
      }
      if (!checkCategoryId) errors.categoryId = "Không có danh mục này";
      if (!checkBrandId) errors.brandId = "Không có thương hiệu này";
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
        brandId,
        pic,
        age,
        fromBrand,
        supplierHome,
        country,
        ingredient,
        specifications,
        unit,
        detail,
        album,
        fakeNumber,
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
      // console.log("««««« oke »»»»»");

      const { id } = req.params;
      let {
        name,
        price,
        discount,
        stock,
        categoryId,
        supplierId,
        description,
        tagList,
        pic,
        brandId,
        age,
        fromBrand,
        supplierHome,
        country,
        ingredient,
        detail,
        specifications,
        unit,
        album,
        sold,
        autoQuantity,
        quantity,
        fakeNumber,
      } = req.body;

      // ĐẶT HÀNG
      if (!autoQuantity) {
        autoQuantity = 2;
      }

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
      // console.log("««««« oke »»»»»");
      // 2 == update bth, 3 === tang so luong(khong mua) , 1 === tru so luong stock(mua)
      // console.log("««««« autoQuantity check »»»»»", autoQuantity);
      // console.log(
      //   "««««« sold, stock , sold before »»»»»",
      //   stock,
      //   quantity,
      //   sold
      // );

      if (autoQuantity === 1) {
        stock = payload.stock - quantity;
        sold = payload.sold + quantity;
      }
      if (autoQuantity === 3) {
        stock = payload.stock + quantity;
        sold = payload.sold - quantity;
      }
      // console.log(
      //   "««««« sold, stock , sold after »»»»»",
      //   stock,
      //   quantity,
      //   sold
      // );
      // console.log("««««« sold, this.sold »»»»»", sold, this.sold);
      const result = await Product.findByIdAndUpdate(
        id,
        {
          name: name || this.name,
          price: price || this.price,
          stock: stock !== undefined ? stock : this.stock,
          // vì 0 rơi vào trường hợp là falsy, nó sẽ ngăn chặn việc gọi tới 0, nên sẽ lấy giá trị tồn tại sẵn trước đó
          sold: sold !== undefined ? sold : this.sold,
          description: description || this.description,
          categoryId: categoryId || this.categoryId,
          supplierId: supplierId || this.supplierId,
          pic: pic || this.pic,
          tagList: tagList || this.tagList,
          slug: this.slug,
          age: age || this.age,
          brandId: brandId || this.brandId,
          fromBrand: fromBrand || this.fromBrand,
          supplierHome: supplierHome || this.supplierHome,
          country: country || this.country,
          ingredient: ingredient || this.ingredient,
          detail: detail || this.detail,
          specifications: specifications || this.specifications,
          unit: unit || this.unit,
          album: album || this.album,
          discount: discount || this.discount,
          fakeNumber: fakeNumber || this.fakeNumber,
        },
        {
          new: true,
        }
      );

      // console.log("««««« result »»»»»", result);
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
