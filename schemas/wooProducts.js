// TODO: Docs
const yup = require('yup');
const {
    toString
} = require('lodash');

class ProductSchema {

    constructor() {}

    schema(param = false) {
        switch (param) {
            case true:
                return yup.object().shape({
                    force: yup.boolean()
                        .typeError('TypeError on force: Valid type is boolean')
                })
                break;
            default:
                return yup.object().shape({
                    id: yup.mixed().strip(),
                    name: yup.string()
                        .typeError('TypeError on name: Valid type is string')
                        .required('Name is required'),
                    slug: yup.string()
                        .typeError('TypeError on slug: Valid type is string')
                        .required('Slug is required'),
                    sku: yup.string()
                        .typeError('TypeError on slug: Valid type is string')
                        .required('Slug is required'),
                    status: yup.string()
                        .typeError('TypeError on slug: Valid type is string (publish|pending)')
                        .required('Slug is required (publish|pending)'),
                    type: yup.string()
                        .typeError('TypeError on description: Valid type is string')
                        .optional(),
                    // price
                    // regular_price
                    // sale_price
                    price: yup.string()
                        .typeError('TypeError on description: Valid type is string')
                        .required('Price is required'),
                    stock_quantity: yup.string()
                        .typeError('TypeError on description: Valid type is string')
                        .required('Stock quantity is required.'),
                    stock_status: yup.string()
                        .typeError('TypeError on description: Valid type is string (instock|outofstock)')
                        .required('Stock status is required (instock|outofstock)'),
                    description: yup.string()
                        .typeError('TypeError on description: Valid type is string')
                        .optional(),
                    short_description: yup.string()
                        .typeError('TypeError on description: Valid type is string')
                        .optional(),
                    categories: yup.array()
                                .typeError('TypeError on categories: Valid type is array')
                                .of(yup.object()
                                    .typeError('TypeError on categories[]: Valid type is object')
                                    .shape({
                                        id: yup.number()
                                            .typeError('TypeError on categories[].href: Valid type is number')
                                            .optional()
                                    })
                                .optional()
                               ).optional(),
                    images: yup.array()
                                .typeError('TypeError on images: Valid type is array')
                                .of(yup.object()
                                    .typeError('TypeError on images[]: Valid type is object')
                                    .shape({
                                        src: yup.string()
                                            .typeError('TypeError on images[].href: Valid type is number')
                                            .url('FormatError: URL format required')
                                            .optional()
                                    })
                                .optional()
                                ).optional()
                });
                break;
        }
    }

    validate(param, isDelete = false) {
        try {
            if (isDelete) {
                return this.schema(true).validateSync(param);    
            }
            return this.schema().validateSync(param);
        } catch (error) {
            return toString(error);
        }
    }

    isValid(param, isDelete = false) {
        if (isDelete) {
            return this.schema(true).isValidSync(param);    
        }
        return this.schema().isValidSync(param);
    }
}

class ProductsSchema extends ProductSchema {

    constructor(ProductList) {
        ProductList = yup.array()
            .typeError('TypeError: Valid type is array')
            .of(Product)
    }

    validate(param) {
        param.validate(ProductList)
    }
}

module.exports = {
    ProductSchema,
    ProductsSchema,
};


// id: ID_ARTICULO
// name: NOMBRE
// slug: replace(NOMBRE)
// type: "simple"
// status: publish|pending,
// description:DESCRIPCIONLARGA
// short_description:DESCRIPCIONCORTA
// sku: CODIGO_PRODUCTO
// price: PRECIOVENTA
// regular_price
// sale_price
// stock_quantity: STOCKTOTAL
// stock_status: instock|outofstock,
// categories:[R00001]
// images:[
//     src: endpoint_flexxus/products/image/00002
// ]