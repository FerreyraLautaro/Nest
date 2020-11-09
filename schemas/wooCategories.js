const yup = require('yup');
const {
    toString
} = require('lodash');

class CategorySchema {

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
                    parent: yup.number()
                        .typeError('TypeError on parent: Valid type is number')
                        .optional()
                        .integer('Parent has be integer'),
                    description: yup.string()
                        .typeError('TypeError on description: Valid type is string')
                        .optional(),
                    display: yup.string()
                        .typeError('TypeError on display: Valid type is string')
                        .optional(),
                    image: yup.string()
                        .typeError('TypeError on image: Valid type is string')
                        .nullable()
                        .optional(),
                    menu_order: yup.number()
                        .typeError('TypeError on menu_order: Valid type is number')
                        .optional(),
                    count: yup.mixed().strip(),
                    _links: yup.object()
                        .typeError('TypeError on _links: Valid type is object').shape({
                            self: yup.array()
                                .typeError('TypeError on _links.self: Valid type is array')
                                .of(yup.object()
                                    .typeError('TypeError on _links.self[]: Valid type is object')
                                    .shape({
                                        href: yup.string()
                                            .typeError('TypeError on _links.self[].href: Valid type is string')
                                            .url('FormatError: URL format required')
                                            .optional()
                                    })
                                )
                                .default([]),
                            collection: yup.array()
                                .typeError('TypeError on _links.collection: Valid type is array')
                                .of(yup.object()
                                    .typeError('TypeError on _links.collection[]: Valid type is object')
                                    .shape({
                                        href: yup.string()
                                            .typeError('TypeError on _links.collection[].href: Valid type is string')
                                            .url('FormatError: URL format required')
                                            .optional()
                                    })
                                )
                                .default([]),
                        })
                        .optional()
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

class CategoriesSchema extends CategorySchema {

    constructor(CategoryList) {
        CategoryList = yup.array()
            .typeError('TypeError: Valid type is array')
            .of(Category)
    }

    validate(param) {
        param.validate(CategoryList)
    }
}

module.exports = {
    CategorySchema,
    CategoriesSchema,
};