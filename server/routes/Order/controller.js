const {
  Order,
  Category,
  Supplier,
  Customer,
  Employee,
} = require("../../models");

module.exports = {
  getAllOrder: async (req, res, next) => {
    try {
      const result = await Order.find()
        .populate("customer")
        .populate("employee")
        .lean({ virtuals: true });
      return res.send(200, {
        message: "Lấy thông tin đơn hàng thành công",
        payload: result,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Lấy thông tin đơn hàng không thành công",
      });
    }
  },

  getDetailOrder: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = await Order.findById(id)
        .populate("customer")
        .populate("employee")
        .lean({ virtual: true });

      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy đơn hàng",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      return res.send(200, {
        message: "Tìm đơn hàng thành công",
        payload: payload,
      });
    } catch (error) {
      return res.send(400, {
        message: "Lấy thông tin đơn hàng không thành công",
      });
    }
  },

  createOrder: async (req, res, next) => {
    try {
      const {
        status,
        createdDate,
        shippedDate,
        description,
        paymentType,
        customerId,
        employeeId,
        orderDetails,
      } = req.body;
      console.log("««««« req.body »»»»»", req.body);

      const errors = [];
      const exitCustomerId = Customer.findOne({ _id: customerId });
      const exitEmployeeId = Employee.findOne({ _id: employeeId });
      const [checkCustomerId, checkEmployeeId] = await Promise.all([
        exitCustomerId,
        exitEmployeeId,
      ]);

      if (!checkEmployeeId)
        errors.push({ employeeId: "Không có nhân viên này" });
      else {
        if (checkEmployeeId.isDeleted) {
          errors.push({ employeeId: "Nhân viên này đã bị xoá" });
        }
      }
      if (!checkCustomerId)
        errors.push({ customerId: "Không có khách hàng này" });
      else {
        if (checkCustomerId.isDeleted)
          errors.push({ customerId: "Khách hàng này đã bị xoá" });
      }

      if (errors.length > 0) {
        return res.send(400, {
          message: "Tạo đơn hàng không thành công",
          errors: errors,
        });
      }

      const newOrder = new Order({
        createdDate,
        shippedDate,
        description,
        paymentType,
        customerId,
        employeeId,
        orderDetails,
        status,
      });

      const payload = await newOrder.save();
      return res.send(200, {
        message: "Tạo đơn hàng thành công",
        payload: payload,
      });
    } catch (error) {
      console.log("««««« error »»»»»", error);
      return res.send(400, {
        message: "Tạo đơn hàng không thành công",
      });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const payload = await Order.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy đơn hàng",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Sản phẩm đã được xoá trước đó",
        });
      }

      await Order.findByIdAndUpdate(id, { isDeleted: true });

      return res.send(200, {
        message: "Xoá đơn hàng thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Xoá đơn hàng không thành công",
      });
    }
  },

  updateOrder: async (req, res, next) => {
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
      const exitCategoryId = Category.findOne({ _id: categoryId });
      const exitSupplierId = Supplier.findOne({ _id: supplierId });
      const [checkCategoryId, checkSupplierId] = await Promise.all([
        exitCategoryId,
        exitSupplierId,
      ]);

      if (!checkCategoryId)
        errors.push({ categoryId: "Không có khách hàng này" });
      else {
        if (checkCategoryId.isDeleted) {
          errors.push({ categoryId: "Khách hàng này đã bị xoá" });
        }
      }
      if (!checkSupplierId)
        errors.push({ categoryId: "Không có nhà cung cấp này" });
      else {
        if (checkSupplierId.isDeleted)
          errors.push({ categoryId: "Nhà cung cấp này đã bị xoá" });
      }

      if (errors.length > 0) {
        return res.send(400, {
          message: "Cập nhật đơn hàng không thành công",
          errors: errors,
        });
      }

      const payload = await Order.findById(id);
      if (!payload) {
        return res.send(404, {
          message: "Không tìm thấy đơn hàng",
        });
      }

      if (payload.isDeleted) {
        return res.send(404, {
          message: "Danh mục đã được xoá trước đó",
        });
      }

      const result = await Order.findByIdAndUpdate(
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

      return res.send(404, {
        message: "Cập nhật đơn hàng thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Sửa đơn hàng không thành công",
        error: error,
      });
    }
  },
};
