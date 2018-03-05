import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Product } from './../models/product.model';

import { UtilsService } from './utils.service';

@Injectable()
export class ProductService {
    private _selProducts: Array<Product>;
    private _campProducts: Array<Product>;
    private _transProducts: Array<Product>;
    private _campaignHasProducts: boolean = false;
    private _urls: any = {
        getProductsURL: 'product/getProducts',
        addProductURL: 'product/addProduct',
        deleteProductURL: 'product/deleteProduct',
        editProductURL: 'product/editProduct',
        deleteCampaignProductURL: 'product/deleteCampaignProduct',
        getProductsForCampaignURL: 'product/getProductsForCampaign',
        getProductsForTransactionURL: 'product/getProductsForTransaction'
    }

    constructor(private http: Http, private utilsService: UtilsService) { }

    fillStoreProducts(res2: any): any {
        if(!(res2 && res2.benowProductList && res2.benowProductList.length > 0))
            return { "success": false };
        
        let prods: Array<Product> = new Array<Product>();
        let numP: number = 0;
        if(res2 && res2.benowProductList && res2.benowProductList.length > 0) {
            numP = res2.totalNoOfPages;
            let res: any = res2.benowProductList;
            if(res && res.length > 0) {
                for(let i: number = 0; i < res.length; i++)
                    prods.push(new Product(false, false, false, null, res[i].discountedPrice ? res[i].discountedPrice : res[i].prodPrice, 
                        res[i].prodPrice, res[i].id, res[i].id, res[i].prodName, res[i].prodDescription, res[i].uom, 
                        res[i].prodImgUrl ? this.utilsService.getUploadsURL() + res[i].prodImgUrl : this.utilsService.getNoProdImageURL()));
            }
        }

        return { "products": prods, "numPages": numP };         
    }

    getProductsForStore(merchantCode: string, page: number): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getProductsURL, 
                JSON.stringify({
                    "merchantCode": merchantCode,
                    "pageNumber": page,
                    "isAvailable": true
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillStoreProducts(res.json()))
            .catch(res => this.utilsService.returnGenericError());    

    }

    getProduct(id: string): Promise<Product> {
        return Promise.resolve(new Product(false, false, false, null, 120, 140, id, null, 'hardcoded', 'hardcoded', '', ''));
    }

    setSelectedProducts(ps: Array<Product>) {
        this._selProducts = ps;
    }

    getSelectedProducts(): Array<Product> {
        return this._selProducts;
    }

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
                this._campProducts.push(new Product(false, false, false, null, res[i].prodPrice, res[i].prodPrice, res[i].id, res[i].prodId, 
                    res[i].prodName, res[i].prodDescription, res[i].uom, res[i].prodImgUrl));
        }

        return this._campProducts;
    }

    private fillTransProducts(res: any): Array<Product> {
        if(res && res.length > 0) {
            this._transProducts = new Array<Product>();
            for(let i: number = 0; i < res.length; i++)
                this._transProducts.push(new Product(false, false, false, res[i].quantity, res[i].price, res[i].price, res[i].campaignProductId, null,
                    res[i].prodName, res[i].prodDescription, res[i].uom, res[i].prodImgUrl));
        }

        return this._transProducts;
    }

    private fillProducts(res2: any): any {
        if(!(res2 && res2.benowProductList))
            return { "success": false };
        
        let prods: Array<Product> = new Array<Product>();
        let numP: number = 0;
        if(res2 && res2.benowProductList && res2.benowProductList.length > 0) {
            numP = res2.totalNoOfPages;
            let res: any = res2.benowProductList;
            if(res && res.length > 0) {
                for(let i: number = 0; i < res.length; i++)
                    prods.push(new Product(false, false, false, null, res[i].prodPrice, res[i].prodPrice, res[i].id, null, res[i].prodName, 
                        res[i].prodDescription, res[i].uom, res[i].prodImgUrl));
            }
        }

        return { "products": prods, "numPages": numP };
    }

    getProducts(merchantCode: string, pg: number): Promise<any> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getProductsURL, 
                JSON.stringify({
                    "merchantCode": merchantCode,
                    "pageNumber": pg
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillProducts(res.json()))
            .catch(res => this.utilsService.returnGenericError());    
    }

    private addedProduct(res: any): Product|null {
        if(res && res.prodPrice > 0)
            return new Product(true, false, true, null, res.prodPrice, res.prodPrice, res.id, null, res.prodName, res.prodDescription, res.uom, 
                res.prodImgUrl);
        else
            return null;
    }

    private editedProduct(res: any): boolean {
        if(res && res.responseFromAPI == true)
            return true;

        return false;
    }

    private deletedCampaignProduct(res: any): boolean {
        if(res && res.responseFromAPI == true)
            return true;

        return false;        
    }

    private deletedProduct(res: any): boolean {
        if(res && res.responseFromAPI == true)
            return true;

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
        if(!product || !product.id)
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
            .then(res => this.editedProduct(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    } 

    deleteCampaignProduct(id: string): Promise<boolean> {
        if(!id)
            return Promise.resolve(false);

        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.deleteCampaignProductURL,
            JSON.stringify({
                "id": id
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.deletedCampaignProduct(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    } 

    deleteProduct(id: string): Promise<boolean> {
        if(!id)
            return Promise.resolve(false);

        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.deleteProductURL,
            JSON.stringify({
                "id": id
            }),
            { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.deletedProduct(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    } 
}
