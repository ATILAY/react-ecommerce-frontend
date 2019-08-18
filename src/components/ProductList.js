import React, {Component} from 'react';
import Product from "./Product";
import Title from "./Title";
// DONT NEEED     import {storeProducts} from '../data';
import {ProductConsumer} from '../context';
import {detailProduct} from '../data';
/*
BENIM COZUMUM:
                            <ProductConsumer>
                                {

                                    ({}) => {
                                        return (<h1> {}</h1>);
                                    }
                                }
                            </ProductConsumer>
*/


export default class ProductList extends Component{

  /*        DONT NEEED state of this class BECAUSE OF the code>
   value.products.map( product => { return <Product key={product.id} product={product}/>;} )

    state={
        products: storeProducts,

  };
  */

    render(){
        return (
            <React.Fragment>
                <div className="py-5">
                    <div className="container">
                        
                            <Title name="our" title=" products"/>

                           
                            <div className="row"> 
                            <ProductConsumer>
                                {

                                    value => {
                                        return (
                                            value.products.map( product => { return <Product key={product.id} product={product}/>;} )
                                            );
                                    }
                                }
                            </ProductConsumer>
                            </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}
