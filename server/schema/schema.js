const graphql = require('graphql');
const Product = require('../models/product');
const Category = require('../models/category');
const Image = require('../models/image');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt
} = graphql;

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        category:{
            type: CategoryType,
            resolve(parent, args){
                return Category.findById(parent.categoryId);
            }
        },
        price: {type: GraphQLFloat},
        images:{
            type: new GraphQLList(ImageType),
            resolve(parent, args){
                return Image.find({productId: parent.id})
            }
        }
    })
});

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString}, 
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
                return Product.find({categoryId: parent.id });
            }
        } 
    })
});

const ImageType = new GraphQLObjectType({
    name: 'Image',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        product:{
            type: ProductType,
            resolve(parent, args){
                return Product.findById(parent.productId);
            }
        },
        height: {type: GraphQLInt},
        width: {type: GraphQLInt}   
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        product: {
            type: ProductType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args){
                return Product.findById(args.id);
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(){
                return Product.find({});
            }
        },
        category: {
            type: CategoryType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args){
                return Category.findById(args.id);
            }
        },
        categories: {
            type: new GraphQLList(ProductType),
            resolve(){
                return Category.find({});
            }
        },
        image: {
            type: ImageType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args){
                return Image.findById(args.id);
            }
        },
        images: {
            type: new GraphQLList(ImageType),
            resolve(){
                return Image.find({});
            }
        },
        imagesByProductId: {
            type: new GraphQLList(ImageType),
            args: {productId: {type:GraphQLID}},
            resolve(parent, args){
                return Image.find({productId: args.productId});
            }
        }

    }

});

const RootMutationType = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                price: {type: new GraphQLNonNull(GraphQLFloat)},
                categoryId: {type: new GraphQLNonNull(GraphQLID)}  
            },
            resolve(parent, args){
                let product = new Product({
                    name: args.name,
                    price: args.price
                })
                return product.save();
            }
        },
        addCategory: {
            type: CategoryType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}  
            },
            resolve(parent, args){
                let category = new Category({
                    name: args.name
                });
                return category.save();
            }
        },
        addImage: {
            type: ImageType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                productId: {type: new GraphQLNonNull(GraphQLID)},
                height: {type: new GraphQLNonNull(GraphQLInt)},
                width: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let image = new Image({
                    name: args.name,
                    productId: args.productId,
                    height: args.height,
                    width: args.width
                });
                return image.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query:RootQueryType,
    mutation:RootMutationType
});