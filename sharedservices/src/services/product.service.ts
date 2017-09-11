import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Product } from './../models/product.model';

import { UtilsService } from './utils.service';

@Injectable()
export class ProductService {
    private _products: Array<Product>;
    private _urls: any = {
        getProductsURL: 'product/getProducts',
        addProductURL: 'product/addProduct'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    fillProducts(res: any): Array<Product> {
        if(res && res.length > 0) {
            this._products = new Array<Product>();
            for(let i: number = 0; i < res.length; i++)
                this._products.push(new Product(false, false, res[i].prodPrice, res[i].prodPrice, res[i].id, res[i].prodName, 
                    res[i].prodDescription, res[i].uom, res[i].prodImgUrl));
        }

        return this._products;
    }

    getProducts(merchantCode: string): Promise<Array<Product>> {
        if(this._products && this._products.length > 0)
            return Promise.resolve(this._products);
        else
            return this.http
                .post(this.utilsService.getBaseURL() + this._urls.getProductsURL, 
                    JSON.stringify({
                        "merchantCode": merchantCode
                    }), 
                    { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => this.fillProducts(res.json()))
                .catch(res => this.utilsService.returnGenericError());    
    }

    addedProduct(res: any): Product|null {
        if(res && res.prodPrice > 0) {
            if(!this._products)
                this._products = new Array<Product>();

            let p: Product = new Product(true, true, res.prodPrice, res.prodPrice, res.id, res.prodName, res.prodDescription, res.uom, res.prodImgUrl);
            this._products.push(p);
            return p;
        }
        else
            return null;
    }

    addProduct(merchantCode: string, product: Product): Promise<Product> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.addProductURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "name": product.name,
                "price": product.price,
                "description": product.description,
                "uom": product.uom,
                "imageURL": product.imageURL
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.addedProduct(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    } 
}
