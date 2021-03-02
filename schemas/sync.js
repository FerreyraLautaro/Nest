/**
 * @module Sync
 * @memberof Schemas
 * @description Synchronization schema functionalities
 * @requires lodash/replace
 * @requires lodash/lowerCase
 */

// Requiring dependencies
const { replace, lowerCase, toString, map, set } = require('lodash');
const moment = require('moment');
// const { FLX_IMAGES_HOSTNAME } = process.env
const { STOCK_TO_SYNC,
  PRICE_LIST_ID,
  TYPE,
  USER_ID,
  SALES_TAX_GROUP_ID,
  WAREHOUSE_ID,
  CURRENCY_ID
} = process.env;
/**
 * @class Sync
 * @description Class container with controllers and additional function for doing Sync module fully functionally
 */
class Sync {
  constructor() {}

  /**
   * @function categories
   * @description Map JSON input object to format as WooCommerce REST Service need
   * @param {JSON} params
   * @property {string} params.NOMBRE Needed to set *name* attribute of woocommerce category object
   * @property {string} params.ID_PADRE Needed to set *parent* attribute of woocommerce category object
   * @returns {JSON}
   * @example {"name": "Una Categoria", "slug": "una-categoria", "parent": 0}
   */
  static categories(params) {
    return {
      name: params.NOMBRE,
      slug: replace(lowerCase(params.NOMBRE), / /g, '-'),
      parent: params.ID_PADRE,
    };
  }

  // }

  /**
   * @function products
   * @description Map JSON input object to format as WooCommerce REST Service need
   * @param {JSON} params
   * @returns {JSON}
   * @example {
   *    "id": "",
   *    "name": "Producto",
   *    "slug": "producto",
   *    "type": "simle",
   *    "status": "publish",
   *    "description": "description larga",
   *    "short_description": "desc corta",
   *    "sku": "00022",
   *    "price": "22.16",
   *    "regular_price": "22.16",
   *    "sale_price": "22.16",
   *    "stock_quantity": "16",
   *    "stock_status": "instock",
   *    "categories": [{"id":214}],
   *    "images": []
   * }
   */
  static products(params) {
    const item = {
      name: toString(params.NOMBRE),
      slug: toString(replace(lowerCase(params.NOMBRE), / /g, '-')),
      type: toString('simple'),
      status: toString('publish'),
      description: toString(params.DESCRIPCIONLARGA),
      short_description: toString(params.DESCRIPCIONCORTA),
      sku: toString(params.CODIGO_PRODUCTO),
      price: params.PRECIOPROMOCION === 0 ? toString(params.PRECIOVENTA) : toString(params.PRECIOPROMOCION),
      regular_price: toString(params.PRECIOVENTA),
      sale_price: params.PRECIOPROMOCION === 0 ? toString(params.PRECIOVENTA) : toString(params.PRECIOPROMOCION),
      manage_stock: true,
      stock_quantity: toString(params[STOCK_TO_SYNC]),
      categories: [{ id: toString(params.CODIGO_CATEGORIA) }],
      // images: [src: `${FLX_IMAGES_HOSTNAME}/${params.FOTO}`]
    };

    if(params.PRECIOPROMOCION !== 0){
      set(item,'date_on_sale_from', params.FECHAPROMOCIONDESDE )
      set(item,'date_on_sale_from_gmt', params.FECHAPROMOCIONDESDE )
      set(item,'date_on_sale_to', params.FECHAPROMOCIONHASTA )
      set(item,'date_on_sale_to_gmt', params.FECHAPROMOCIONHASTA )
    }else{
      set(item,'date_on_sale_from', '')
      set(item,'date_on_sale_from_gmt', '')
      set(item,'date_on_sale_to', '')
      set(item,'date_on_sale_to_gmt', '')
    }

    return item;
  }

  /**
   * @function orders
   * @description Map JSON input object to format as WooCommerce REST Service need
   * @param {JSON} params
   * @returns {JSON}
   * @example {}
   */
  static orders(params) {
    return {
      cart: {
        notes: `${params.customer_note}`,
        price_list_id: PRICE_LIST_ID,
        operation_type_id: null,
        type: TYPE,
        warehouse_id: WAREHOUSE_ID,
        date: moment(params.date_created).format("YYYY-MM-DD hh:mm:ss"),
        user_id: USER_ID,
        currency_id: CURRENCY_ID,
        general_discount: params.discount_total,
        payment_method_id: `1`, // Requiere relacion con pre-definicion
        customer: {
          notes: `${params.customer_note}`,
          vat_number: null,
          id: '',
          name: `${params.billing.first_name} ${params.billing.last_name}`,
          address: `${params.billing.address_1} (${params.billing.address_2})`,
          state_id: `${params.billing.state}`,
          city: `${params.billing.city}`,
          neighborhood: 'S/N',
          // user_id: '',
          // price_list_id: '',
          phone: `${params.billing.phone}`,
          cell_phone: '',
          sales_tax_group_id: SALES_TAX_GROUP_ID,
          document_id: '',
          email: `${params.billing.email}`,
          zipcode: `${params.billing.postcode}`,
        },
        products: map(params.line_items, (item) => {
          return {
            product_id: `${item.product_id}`,
            size: '',
            discount: 0,
            netPrice: ((item.price * item.quantity) / 1.21),
            totalPrice: ((item.price * item.quantity) / 1.21),
            quantity: item.quantity,
          };
        }),
      },
    };
  }
}

/**
 * @exports schema from Sync class without instancing
 */
module.exports = {
  schema: Sync,
};
