const mongoose = require('mongoose')
const { Schema, model } = mongoose
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')
const slugify = require('slugify')

const productSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'Tên sản phẩm không được bỏ trống'],
      unique: [true, 'Tên sản phẩm không được trùng']
    },

    price: {
      type: Number,
      default: 0,
      min: [0, 'Giá sản phẩm không được âm']
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Phần trăm giảm giá sản phẩm không được âm'],
      max: [75, 'Phần trăm giảm giá sản phẩm không được nhỏ hơn 75%']
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, 'Số lượng sản phẩm không được âm']
    },

    age: {
      type: Number,
      default: 0,
      min: [0, 'Độ tuổi sản phẩm không được âm']
    },

    description: {
      type: String
    },
    specifications: {
      type: String
    },
    unit: {
      type: String
    },
    fromBrand: {
      type: String
    },
    supplierHome: {
      type: String
    },
    country: {
      type: String
    },
    ingredient: {
      type: String
    },

    detail: {
      type: String
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true
    },

    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'brand',
      required: true
    },

    album: [
      {
        type: String
      }
    ],

    tagList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tag'
      }
    ],

    slug: {
      type: String
    },

    pic: {
      type: String,
      default: ''
    },

    sold: {
      type: Number,
      default: 0
    },

    autoQuantity: {
      type: Number
    },

    quantity: {
      type: Number
    },

    fakeNumber: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

productSchema.virtual('category', {
  ref: 'category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
})

productSchema.virtual('supplier', {
  ref: 'supplier',
  localField: 'supplierId',
  foreignField: '_id',
  justOne: true
})

productSchema.virtual('tag', {
  ref: 'tag',
  localField: 'tagTd',
  foreignField: '_id',
  justOne: true
})

productSchema.virtual('brand', {
  ref: 'brand',
  localField: 'brandId',
  foreignField: '_id',
  justOne: true
})

productSchema.virtual('total').get(function () {
  return this.price * ((100 - this.discount) / 100)
})

productSchema.virtual('totalSold').get(function () {
  return this.fakeNumber + this.sold
})

// khi lưu tạo slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, locate: 'vi' })
  }
  next()
})

// khi update
productSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.name) {
    const update = this.getUpdate()
    update.slug = slugify(update.name, { lower: true, locate: 'vi' })
  }
  next()
})

// trường ảo không thể sử dụng được trong câu lệnh query
// productSchema.virtual("fakeAndRealSold").get(function () {
//   const fakeNumber = this.fakeNumber ?? 0; // Use 0 if fakeNumber is undefined or null
//   const sold = this.sold ?? 0; // Use 0 if sold is undefined or null
//   console.log("««««« fakeNumber + sold »»»»»", fakeNumber + sold);
//   return fakeNumber + sold;
// });

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })
//
productSchema.plugin(mongooseLeanVirtuals)

const Product = model('product', productSchema)
module.exports = Product
