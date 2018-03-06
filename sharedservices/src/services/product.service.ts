import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Size } from './../models/size.model';
import { Cart } from './../models/cart.model';
import { Product } from './../models/product.model';
import { CartItem } from './../models/cartitem.model';
import { NewProduct } from './../models/newproduct.model';
import { Variant } from './../models/variant.model';

import { UtilsService } from './utils.service';

@Injectable()
export class ProductService {
    private _selProducts: Array<Product>;
    private _campProducts: Array<Product>;
    private _transProducts: Array<Product>;
    private _campaignHasProducts: boolean = false;
    private _urls: any = {
        getProductURL: 'product/getProduct',        
        getProductsURL: 'product/getProducts',
        addProductURL: 'product/addProduct',
        getProductsByIdsURL: 'product/getProductsByIds',
        addProductHBURL: 'product/addProductHB',
        deleteProductURL: 'product/deleteProduct',
        editProductURL: 'product/editProduct',
        deleteCampaignProductURL: 'product/deleteCampaignProduct',
        getProductsForCampaignURL: 'product/getProductsForCampaign',
        getProductsForTransactionURL: 'product/getProductsForTransaction'
    };

    constructor(private http: Http, private utilsService: UtilsService) { }

    private fillItemsInCart(cart: Cart, res: any): Cart {
        console.log(res);
        return cart;
    }

    public fillCartItemsDetails(cart: Cart): Promise<Cart> {
        if(cart && cart.items && cart.items.length > 0) {
            let ids: Array<string> = new Array<string>();
            cart.items.forEach(function(i: CartItem) {
                ids.push(i.productId);
            })

            return this.http
                .post(this.utilsService.getBaseURL() + this._urls.getProductsByIdsURL, 
                    JSON.stringify({
                        "ids": ids,
                    }), 
                    { headers: this.utilsService.getHeaders() })
                .toPromise()
                .then(res => this.fillItemsInCart(cart, res.json()))
                .catch(res => this.utilsService.returnGenericError());    
            
        }
        else
            return Promise.resolve(cart);
    }

    fillStoreProduct(res: any): Product {
        let newp: Product = new Product(false, false, false, null, res.discountedPrice ? res.discountedPrice : res.prodPrice, 
            res.prodPrice, res.id, res.id, res.prodName, res.prodDescription, res.uom, 
            res.prodImgUrl ? this.utilsService.getUploadsURL() + res.prodImgUrl : this.utilsService.getNoProdImageURL(),
            res.color, null, null, null, res.merchantCode);   
        if(res.productImages && res.productImages.length > 0) {
            let me: any = this;
            newp.imageURLs = new Array<string>();
            res.productImages.forEach(function(pi: any) {
                if(newp.imageURLs && pi && pi.prodImgUrl)
                    newp.imageURLs.push(me.utilsService.getUploadsURL() + pi.prodImgUrl);
            });

            if(newp.imageURLs && newp.imageURLs.length > 0)
                newp.imageURL = newp.imageURLs[0];
        }
        else
            newp.imageURLs = [newp.imageURL];

        if(!(newp.imageURLs && newp.imageURLs.length > 0)) {
            newp.imageURL = this.utilsService.getNoProdImageURL();
            newp.imageURLs = [newp.imageURL];            
        }
            
        if(res.productSizes && res.productSizes.length > 0) {
            newp.sizes = new Array<Size>();
            res.productSizes.forEach(function(ps: any) {
                if(newp.sizes && ps && ps.prodSize)
                    newp.sizes.push(new Size(ps.id, ps.prodSize));
            });
        }

        if(res.benowProductVariants && res.benowProductVariants.length > 0) {
            newp.variants = new Array<Variant>();
            res.benowProductVariants.forEach(function(v: any) {
                if(newp.variants && v && v.id && v.isAvailable != false) {
                    let newv: Variant = new Variant(null, v.discountedPrice ? v.discountedPrice : v.price, v.price, v.id, v.color, v.isAvailable, null);
                    if(v.productSizes && v.productSizes.length > 0) {
                        newv.sizes = new Array<Size>();
                        v.productSizes.forEach(function(vps: any) {
                            if(newv.sizes && vps && vps.prodSize)
                                newv.sizes.push(new Size(vps.id, vps.prodSize));
                        });
                    }

                    newp.variants.push(newv);
                }
            });
        }

        return newp;
    }

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
                    prods.push(this.fillStoreProduct(res[i]));
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
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getProductURL, 
                JSON.stringify({
                    "id": id,
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillStoreProduct(res.json()))
            .catch(res => this.utilsService.returnGenericError());    
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
                    res[i].prodName, res[i].prodDescription, res[i].uom, res[i].prodImgUrl, '', null, null, null, res[i].merchantCode));
        }

        return this._campProducts;
    }

    private fillTransProducts(res: any): Array<Product> {
        if(res && res.length > 0) {
            this._transProducts = new Array<Product>();
            for(let i: number = 0; i < res.length; i++)
                this._transProducts.push(new Product(false, false, false, res[i].quantity, res[i].price, res[i].price, res[i].campaignProductId, null,
                    res[i].prodName, res[i].prodDescription, res[i].uom, res[i].prodImgUrl, '', null, null, null, res[i].merchantCode));
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
                        res[i].prodDescription, res[i].uom, res[i].prodImgUrl, '', null, null, null, res[i].merchantCode));
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
                res.prodImgUrl, '', null, null, null, res.merchantCode);
        else
            return null;
    }

    private addedProductHB(res: any): NewProduct|null {
        if(res && res.prodPrice > 0){
            if(res.benowProductVariants && res.benowProductVarints.length > 0){
                return new NewProduct(true, false, true, null, res.prodPrice, res.prodPrice, res.id, null, res.prodName, res.prodDescription, res.uom,
                    null, res.prodImgUrls, res.isAvailable, res.productType, true, res.benowProductVariants, res.venue, res.startDate, res.endDate, null);
            }

            return new NewProduct(true, false, true, null, res.prodPrice, res.prodPrice, res.id, null, res.prodName, res.prodDescription, res.uom,
                null, res.prodImgUrls, res.isAvailable, res.productType, false, null, res.venue, res.startDate, res.endDate, null);
        }
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

    addProductHB(merchantCode: string, product: NewProduct): Promise<Product> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.addProductHBURL,
                JSON.stringify({
                    "merchantCode": merchantCode,
                    "name": product.name,
                    "price": product.price,
                    "description": product.description,
                    "uom": product.uom,
                    "imageURLs": product.imageURLs,
                    "variants": product.variants,
                    "productType": product.productType,
                    "isAvailable": product.isAvailable,
                    "startDate": product.startDate,
                    "endDate": product.endDate,
                    "fileUrl": product.fileUrl,
                    "venue": product.venue,
                    "discount": product.discount
                }),
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.addedProductHB(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }
}
