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
}
