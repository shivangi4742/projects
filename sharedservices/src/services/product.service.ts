import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Product } from './../models/product.model';

import { UtilsService } from './utils.service';

@Injectable()
export class ProductService {
    private _products: Array<Product>;
    private _campProducts: Array<Product>;
    private _transProducts: Array<Product>;
    private _campaignHasProducts: boolean = false;
    private _urls: any = {
        getProductsURL: 'product/getProducts',
        addProductURL: 'product/addProduct',
        deleteProductURL: 'product/deleteProduct',
        editProductURL: 'product/editProduct',
        getProductsForCampaignURL: 'product/getProductsForCampaign',
        getProductsForTransactionURL: 'product/getProductsForTransaction'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    getProductsForTransaction(campaignId: string, txnId: string): Promise<Array<Product>> {
        if(this._transProducts && this._transProducts.length > 0)
            return Promise.resolve(this._transProducts);
        else
            return this.http
                .post(this.utilsService.getBaseURL() + this._urls.getProductsForTransactionURL, 
                    JSON.stringify({
                        "transactionId": txnId,
                        "campaignId": campaignId
                    }), 
                    { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => this.fillTransProducts(res.json()))
                .catch(res => this.utilsService.returnGenericError());    
    }

    getProductsForCampaign(merchantCode: string, campaignId: string): Promise<Array<Product>> {
        if(this._campProducts && this._campProducts.length > 0)
            return Promise.resolve(this._campProducts);
        else
            return this.http
                .post(this.utilsService.getBaseURL() + this._urls.getProductsForCampaignURL, 
                    JSON.stringify({
                        "merchantCode": merchantCode,
                        "campaignId": campaignId
                    }), 
                    { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => this.fillCampProducts(res.json()))
                .catch(res => this.utilsService.returnGenericError());    
    }

    private fillCampProducts(res: any): Array<Product> {
        if(res && res.length > 0) {
            this._campProducts = new Array<Product>();
            for(let i: number = 0; i < res.length; i++)
                this._campProducts.push(new Product(false, false, null, res[i].prodPrice, res[i].prodPrice, res[i].id, res[i].prodName, 
                    res[i].prodDescription, res[i].uom, res[i].prodImgUrl));
        }

        return this._campProducts;
    }

    private fillTransProducts(res: any): Array<Product> {
        if(res && res.length > 0) {
            this._transProducts = new Array<Product>();
            for(let i: number = 0; i < res.length; i++)
                this._transProducts.push(new Product(false, false, res[i].quantity, res[i].price, res[i].price, res[i].product, res[i].prodName, 
                    res[i].prodDescription, res[i].uom, res[i].prodImgUrl));
        }

        return this._transProducts;
    }

    private fillProducts(res: any): Array<Product> {
        if(res && res.length > 0) {
            this._products = new Array<Product>();
            for(let i: number = 0; i < res.length; i++)
                this._products.push(new Product(false, false, null, res[i].prodPrice, res[i].prodPrice, res[i].id, res[i].prodName, 
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

    private addedProduct(res: any): Product|null {
        if(res && res.prodPrice > 0) {
            if(!this._products)
                this._products = new Array<Product>();

            let p: Product = new Product(true, true, null, res.prodPrice, res.prodPrice, res.id, res.prodName, res.prodDescription, res.uom, 
                res.prodImgUrl);
            this._products.push(p);
            return p;
        }
        else
            return null;
    }

    private editedProduct(res: any, prod: Product): Boolean {
        if(!prod || !prod.id || !this._products || this._products.length <= 0)
            return false;

        if(res && res.responseFromAPI == true) {
            let i: number = 0;
            let found: boolean = false;
            for(i = 0; i < this._products.length; i++) {
                if(this._products[i].id == prod.id) {
                    found = true;
                    break;
                }
            }

            if(found) {
                this._products[i] = prod;
                return true;
            }
        }

        return false;
    }

    private deletedProduct(res: any, id: string): Boolean {
        if(!id || !this._products || this._products.length <= 0)
            return false;

        if(res && res.responseFromAPI == true) {
            let i: number = 0;
            let found: boolean = false;
            for(i = 0; i < this._products.length; i++) {
                if(this._products[i].id == id) {
                    found = true;
                    break;
                }
            }

            if(found) {
                this._products.splice(i, 1);
                return true;
            }
        }

        return false;        
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

    editProduct(merchantCode: string, product: Product): Promise<boolean> {
        if(!product || !product.id || !this._products || this._products.length <= 0)
            return Promise.resolve(false);

        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.editProductURL,
            JSON.stringify({
                "merchantCode": merchantCode,
                "name": product.name,
                "price": product.price,
                "description": product.description,
                "uom": product.uom,
                "imageURL": product.imageURL,
                "id": product.id
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.editedProduct(res.json(), product))
            .catch(res => this.utilsService.returnGenericError());
    } 

    deleteProduct(id: string): Promise<Boolean> {
        if(!id || !this._products || this._products.length <= 0)
            return Promise.resolve(false);

        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.deleteProductURL,
            JSON.stringify({
                "id": id
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.deletedProduct(res.json(), id))
            .catch(res => this.utilsService.returnGenericError());
    } 
}
