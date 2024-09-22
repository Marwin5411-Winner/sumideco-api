const db = require("../models");

exports.getCategoriesByShopId = async (req, res) => {
    const shopId = req.params.shopid;

    if (shopId == 'undefined' || shopId == null || shopId == '') {
        return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ': Shop ID is required'
        })
    }

    try {
        const categories = await db.Category.findAll({
            where: {
                shop_id: shopId,
                deleted: 0
            },
            offset: req.query.offset ? parseInt(req.query.offset) : 0,
            limit: req.query.limit ? parseInt(req.query.limit) : config.Query.max_limit
        });

        if (!categories) {
            return res.status(404).json({
                success: 0,
                error: global.HTTP_CODE.NOT_FOUND + ': Categories not found'
            });
        }

        return res.status(200).json({
            success: 1,
            error: null,
            data: categories
        
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
}

exports.getCategoryById = async (req, res) => {
    const shopId = req.params.shopid;
    const categoryId = req.params.id;

    try {
        const category = await db.Category.findOne({
            include: [db.Product],
            where: {
                id: categoryId,
                shop_id: shopId,
                deleted: 0
            }
        });

        if (!category) {
            return res.status(404).json({
                success: 0,
                error: global.HTTP_CODE.NOT_FOUND + ': Category not found'
            });
        }

        return res.status(200).json({
            success: 1,
            error: null,
            data: category
        
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
}

exports.createCategory = async (req, res) => {
    const shopId = req.params.shopid;
    const { name, description, parentCategoryId } = req.body;

    if (req.shop.id != shopId) {
        return res.status(403).json({
            success: 0,
            error: global.HTTP_CODE.FORBIDDEN + ': You are not allowed to create category for this shop'
        })
    }


    if (shopId == 'undefined' || shopId == null || shopId == '') {
        return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ': Shop ID is required'
        
        })
    }

    if (name == 'undefined' || name == null || name == '') {
        return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ': Category name is required'
        })
    }

    try {
        const category = await db.Category.create({
            name,
            description,
            parentCategoryId,
            shop_id: shopId
        });

        return res.status(201).json({
            success: 1,
            error: null,
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
}

exports.updateCategory = async (req, res) => {
    const shopId = req.params.shopid;
    const categoryId = req.params.id;
    const { name, description, parentCategoryId } = req.body;

    if (req.shop.id != shopId) {
        return res.status(403).json({
            success: 0,
            error: global.HTTP_CODE.FORBIDDEN + ': You are not allowed to update category for this shop'
        })
    }

    if (shopId == 'undefined' || shopId == null || shopId == '') {
        return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ': Shop ID is required'
        })
    }

    if (categoryId == 'undefined' || categoryId == null || categoryId == '') {
        return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ': Category ID is required'
        })
    }

    try {
        const category = await db.Category.update({
            name,
            description,
            parentCategoryId,
        },
            {
                where: {
                    id: categoryId,
                    shop_id: shopId,
                    deleted: 0
                }
            });

        return res.status(200).json({
            success: 1,
            error: null,
            data: category
        
        });
    }
    catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
}

exports.deleteCategory = async (req, res) => {
    const shopId = req.params.shopid;
    const categoryId = req.params.id;

    if (req.shop.id != shopId) {
        return res.status(403).json({
            success: 0,
            error: global.HTTP_CODE.FORBIDDEN + ': You are not allowed to delete category for this shop'
        })
    }

    if (shopId == 'undefined' || shopId == null || shopId == '') {
        return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ': Shop ID is required'
        
        })
    }

    if (categoryId == 'undefined' || categoryId == null || categoryId == '') {
        return res.status(400).json({
            success: 0,
            error: global.HTTP_CODE.BAD_REQUEST + ': Category ID is required'
        })
    }

    try {
        const category = await db.Category.update({
            deleted: 1
        },
            {
                where: {
                    id: categoryId,
                    shop_id: shopId,
                    deleted: 0
                }
            });

        return res.status(200).json({
            success: 1,
            error: null,
            data: 'Category deleted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: 0,
            error: error.message
        });
    }
}