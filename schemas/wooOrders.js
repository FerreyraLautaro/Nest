// TODO: Docs
const yup = require('yup');
const {
    toString
} = require('lodash');

class OrderSchema {

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
                    cart: yup.object().shape({
                        notes: yup.string()
                            .typeError('TypeError on Notes: Valid type is string')
                            .required('Notes is required')
                        price_list_id: yup.string()
                            .typeError('TypeError on Price list ID: Valid type is string')
                            .required('Price list ID is required')
                        operation_type_id: yup.string()
                            .typeError('TypeError on Operation type ID: Valid type is string')
                            .required('Operation type ID is required')
                        type: yup.string()
                            .typeError('TypeError on type: Valid type is string')
                            .required('Type is required')
                        warehouse_id: yup.string()
                            .typeError('TypeError on Warehouse ID: Valid type is string')
                            .required('Warehouse ID is required')
                        date: yup.string()
                            .typeError('TypeError on date: Valid type is string')
                            .required('Date is required')
                        user_id: yup.string()
                            .typeError('TypeError on User ID: Valid type is string')
                            .required('User ID is required')
                        currency_id: yup.string()
                            .typeError('TypeError on Currency ID: Valid type is string')
                            .required('Currency ID is required')
                        general_discount: yup.string()
                            .typeError('TypeError on General discount: Valid type is string')
                            .required('General discount is required')
                        payment_method_id: yup.string()
                            .typeError('TypeError on Payment method ID: Valid type is string')
                            .required('Payment method ID is required')
                        customer: yup.object().shape({
                                notes: yup.string()
                                    .typeError('TypeError on Customer Notes: Valid type is string')
                                    .required('Customer Notes is required')
                            vat_number: yup.string()
                                    .typeError('TypeError on Customer VAT number: Valid type is string')
                                    .required('Customer VAT number is required')
                            id: yup.string()
                                    .typeError('TypeError on Customer ID: Valid type is string')
                                    .required('Customer ID is required')
                            name: yup.string()
                                    .typeError('TypeError on Customer name: Valid type is string')
                                    .required('Customer name is required')
                            address: yup.string()
                                    .typeError('TypeError on Customer address: Valid type is string')
                                    .required('Customer address is required')
                            state_id: yup.string()
                                    .typeError('TypeError on Customer state ID: Valid type is string')
                                    .required('Customer state ID is required')
                            city: yup.string()
                                    .typeError('TypeError on Customer city: Valid type is string')
                                    .required('Customer city is required')
                            neighborhood: yup.string()
                                    .typeError('TypeError on Customer neighborhood: Valid type is string')
                                    .required('Customer neighborhood is required')
                            user_id: yup.string()
                                    .typeError('TypeError on Customer user ID: Valid type is string')
                                    .required('Customer user ID is required')
                            price_list_id: yup.string()
                                    .typeError('TypeError on Customer price list ID: Valid type is string')
                                    .required('Customer price list ID is required')
                            phone: yup.string()
                                    .typeError('TypeError on Customer phone: Valid type is string')
                                    .required('Customer phone is required')
                            cell_phone: yup.string()
                                    .typeError('TypeError on Customer cell phone: Valid type is string')
                                    .required('Customer cell phone is required')
                            sales_tax_group_id: yup.string()
                                    .typeError('TypeError on Customer sales tax group ID: Valid type is string')
                                    .required('Customer sales tax group ID is required')
                            document_id: yup.string()
                                    .typeError('TypeError on Customer document ID: Valid type is string')
                                    .required('Customer document ID is required')
                            email: yup.string()
                                    .typeError('TypeError on Customer email: Valid type is string')
                                    .required('Customer email is required')
                            zipcode: yup.string()
                                    .typeError('TypeError on Customer zipcode: Valid type is string')
                                    .required('Customer zipcode is required')
                            })
                            .required('Customer is required'),
                        products: yup.array()
                            .typeError('TypeError on products: Valid type is array')
                            .of(yup.object()
                                .typeError('TypeError on images content: Valid type is object')
                                .shape({
                                    product_id: yup.string()
                                        .typeError('TypeError on Products product ID: Valid type is string')
                                        .required('Products product ID is required')
                                size: yup.string()
                                        .typeError('TypeError on Products size: Valid type is string')
                                        .required('Products size is required')
                                discount: yup.string()
                                        .typeError('TypeError on Products discount: Valid type is string')
                                        .required('Products discount is required')
                                netPrice: yup.string()
                                        .typeError('TypeError on Products netPrice: Valid type is string')
                                        .required('Products netPrice is required')
                                quantity: yup.string()
                                        .typeError('TypeError on Products quantity: Valid type is string')
                                        .required('Products quantity is required')
                                })
                            )
                    });
                })
                    .required('Cart object is required');
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

class OrdersSchema extends OrderSchema {

    constructor(OrderList) {
        OrderList = yup.array()
            .typeError('TypeError: Valid type is array')
            .of(Order)
    }

    validate(param) {
        param.validate(OrderList)
    }
}

module.exports = {
    OrderSchema,
    OrdersSchema,
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
//     src: endpoint_flexxus/orders/image/00002
// ]