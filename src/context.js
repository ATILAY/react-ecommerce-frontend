import React, { Component } from 'react';
import {storeProducts, detailProduct} from './data';
//1.47

const ProductContext = React.createContext();
//Provider
//Consumer
//bireysel not:
//productcontext.provider icinde kullanmak icin yedek
//                products: this.state.products,
//                detailProduct: this.state.detailProduct
/*
one of point of views:
            <ProductContext.Provider value = {{
                    ...this.state,
                    handleDetail: this.handleDetail,
                    addToCart: this.addToCart,
            }}>
                {this.props.children}
            </ProductContext.Provider>
*/


class ProductProvider extends Component {
   state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
    //5.10
    //for working on cart page we need to not leave the cart array as empty.
    //cart: [],    so it is gonna be like below for temporarily.

   };
   componentDidMount(){
    this.setProducts();


   }
   setProducts = () => {
       let tempProducts = [];
       storeProducts.forEach(item => {
           const singleItem = {...item} ;
           tempProducts = [...tempProducts, singleItem];


       });
    this.setState(()=>{
        return {products: tempProducts}
    });
   }

   getItem = (id) =>{
       //3.17.35  item is symbolic and native 
       const product = this.state.products.find(item => item.id === id);
       return product;

   }

   handleDetail = (id) => { 
       //3.23... solution for typeError i which caused because of not giving id parameter to getItem() method.
       const product = this.getItem(id);
       this.setState(
           ()=>{
               return {detailProduct: product}
           }
       );
    }
   addToCart = (id) => {
       //Before everything, to check the method's way logically
       // console.log(`hello from add to cart id is ${id}`); 

    //I dont wanna to manupulate the state directly out of the setState method
       let tempProducts = [...this.state.products];
       const index = tempProducts.indexOf(this.getItem(id));
       const product = tempProducts[index];
       product.inCart = true;
       product.count = 1;
       const price = product.price;
       product.total = price;
       this.setState(() => {
           return {products: tempProducts, cart: [...this.state.cart, product] }
       },()=>{
           this.addTotals()

       });

    }
    openModal = id =>{
        const product = this.getItem(id);
        this.setState(()=>{
            return {
                modalProduct: product,
                modalOpen: true,

            }
        });
    }
    closeModal = () => {
        this.setState(()=>{
            return {modalOpen: false}
        });
    }
    increment = (id) => {
        //Always start basic to a component that  makes sure it  being displayed in the screen primarily. 
        //console.log('this is increment method');

        let tempCart = [...this.state.cart];
        const selectedProduct =  tempCart.find(item => item.id === id);
        const index= tempCart.indexOf(selectedProduct);
        const product = tempCart[index];

        product.count = product.count + 1;
        product.total = product.count * product.price;

        this.setState(()=>{
            return {cart: [...tempCart]}
            //5.34
        }, ()=>{
            this.addTotals();
        });
    }
    decrement = (id) => {
        //Always start basic to a component that  makes sure it  being displayed in the screen primarily. 
        //console.log('this is decrement method');

        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];

        product.count = product.count - 1;

        if(product.count === 0){
            this.removeItem(id)
        }else{
            product.total = product.count * product.price;

            this.setState(()=>{
                return {cart: [...tempCart]};
            },()=>{
                this.addTotals();
                //5.41
            }
            );
        }
    }
    removeItem = (id) => {
        //5.28 highly important piece below
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => item.id !== id);
        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;


        this.setState(()=>{
            return {
                cart: [...tempCart],
                products: [...tempProducts]
            }
        }, ()=>{
            this.addTotals();
        });
    }
    clearCart = () => {
        //console.log('cart was cleared');

        this.setState(()=>{
            //just like down it is really simple
            return {cart: []}
        },()=>{
            this.setProducts();
            this.addTotals();

        }
        );
    }
    addTotals =()=>{
        let subTotal = 0;
        this.state.cart.map(item => (subTotal += item.total));
        //5.12 item => (subTotal += itemTotal) or down syntax chose and care
        //5.12 item => {subTotal += itemTotal} 
        const tempTax = subTotal * 0.1;
        // tempTax = subTotal * TaxRate;
        const tax = parseFloat(tempTax.toFixed(2));
        //toFixed means how many decimals should be shown
        //The parseFloat() function parses a string and returns a floating point number.
        const total = subTotal + tax;
        this.setState(()=>{
            return ({
                cartSubTotal: subTotal,
                cartTax: tax,
                cartTotal: total,


            });
        });


    }


 /*TEST
 //To test 
tester= () => {
    console.log('Store products :', storeProducts[0].inCart);

    const tempProducts = [...this.state.products];
    tempProducts[0].inCart = true;
    this.setState(() => {
        return {product: tempProducts},
        () => {
            console.log('State products :', this.state.product[0].inCart);
            console.log('Store products :', storeProducts[0].inCart);
        }
        
    });


}
*/ 

    render() {
        return (
            <ProductContext.Provider value = {{
                    ...this.state,
                    handleDetail: this.handleDetail,
                    addToCart: this.addToCart,
                    openModal: this.openModal,
                    closeModal: this.closeModal,
                    increment: this.increment,
                    decrement: this.decrement,
                    removeItem: this.removeItem,
                    clearCart: this.clearCart

            }}>
            
          {/*}  <button onClick = {this.tester}> Test Me!
            {//2.40.00 da kaldı
            }
            </button>
        */}
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}
const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};
