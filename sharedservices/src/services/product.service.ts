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
import { NewVariant } from './../models/newvariant.model'; 

import { UtilsService } from './utils.service';

@Injectable()
export class ProductService {
    prodstartdate:string;
    prodenddate:string;
    private _selProducts: Array<Product>;
    private _campProducts: Array<Product>;
    private _transProducts: Array<Product>;
    private _campaignHasProducts: boolean = false;
    private _urls: any = {
        getProductURL: 'product/getProduct',        
        getProductForEditURL: 'product/getProductForEdit',
        getProductsURL: 'product/getProducts',
        addProductURL: 'product/addProduct',
        getProductsByIdsURL: 'product/getProductsByIds',
        addProductHBURL: 'product/addProductHB',
        editProductHBURL: 'product/editProductHB',
        deleteProductURL: 'product/deleteProduct',
        editProductURL: 'product/editProduct',
        deleteCampaignProductURL: 'product/deleteCampaignProduct',
        getProductsForCampaignURL: 'product/getProductsForCampaign',
        getProductsForTransactionURL: 'product/getProductsForTransaction'
    };

    constructor(private http: Http, private utilsService: UtilsService) { }

    private fillItemsInCart(cart: Cart, res: any): Cart {
        if(cart && cart.items && cart.items.length > 0 && res && res.length > 0) {
            for(let i: number = 0; i < res.length; i++) {
                if(res[i].isAvailable != false) {
                    let ci: Array<CartItem> = cart.items.filter(it => it.productId == res[i].id);
                    if(ci && ci.length > 0) {
                        ci[0].description = res[i].prodDescription;
                        ci[0].imageURL = this.utilsService.getUploadsURL() + res[i].prodImgUrl;
                        if(res.productImages && res.productImages.length > 0)
                            ci[0].imageURL = this.utilsService.getUploadsURL() + res.productImages[0].prodImgUrl;
                        
                        if(!ci[0].imageURL)
                            ci[0].imageURL = this.utilsService.getNoProdImageURL();

                        if(ci[0].variantId != '-1') {
                            if(res[i].benowProductVariants && res[i].benowProductVariants.length > 0) {
                                for(let j: number = 0; j < res[i].benowProductVariants.length; j++) {
                                    if(res[i].benowProductVariants[j].id == ci[0].variantId 
                                        && res[i].benowProductVariants[j].isAvailable != false) {
                                        ci[0].color = res[i].benowProductVariants[j].color;
                                        ci[0].offerPrice = res[i].benowProductVariants[j].discountedPrice ? res[i].benowProductVariants[j].discountedPrice : res[i].benowProductVariants[j].price;
                                        ci[0].origPrice = res[i].benowProductVariants[j].price ? res[i].benowProductVariants[j].price : ci[0].offerPrice;
                                        if(ci[0].sizeId) {
                                            if(res[i].benowProductVariants[j].productSizes 
                                                && res[i].benowProductVariants[j].productSizes.length > 0) {
                                                for(let k: number = 0; k < res[i].benowProductVariants[j].productSizes.length; k++) {
                                                    if(ci[0].sizeId == res[i].benowProductVariants[j].productSizes[k].id) {
                                                        ci[0].name = res[i].prodName;
                                                        ci[0].size = res[i].benowProductVariants[j].productSizes[k].prodSize;
                                                    }
                                                }
                                            }
                                        }
                                        else
                                            ci[0].name = res[i].prodName;
                                    }
                                }
                            }
                        }
                        else {
                            ci[0].color = res[i].color;
                            ci[0].offerPrice = res[i].discountedPrice ? res[i].discountedPrice : res[i].prodPrice;
                            ci[0].origPrice = res[i].prodPrice ? res[i].prodPrice : ci[0].offerPrice;
                            if(ci[0].sizeId) {
                                if(res[i].productSizes && res[i].productSizes.length > 0) {
                                    for(let l: number = 0; l < res[i].productSizes.length; l++) {
                                        if(ci[0].sizeId == res[i].productSizes[l].id) {
                                            ci[0].name = res[i].prodName;
                                            ci[0].size = res[i].productSizes[l].prodSize;                   
                                        }
                                    }
                                }
                            }
                            else
                                ci[0].name = res[i].prodName;
                        }
                    }    
                }
            }

            cart.items = cart.items.filter(citem => citem.name && citem.name.trim().length > 0);
        }

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

        let me: any = this;
        let newp: Product = new Product(false, false, false, null, res.discountedPrice ? res.discountedPrice : res.prodPrice, 
            res.prodPrice, res.id, res.id, res.prodName, res.prodDescription, res.uom, 
            res.prodImgUrl ? this.utilsService.getUploadsURL() + res.prodImgUrl : this.utilsService.getNoProdImageURL(),           

            res.color, res.size, res.productType, null, null, null, res.merchantCode, null, res.shippingCharge,  res.durationHours,  res.durationMinutes);   
        if(res.productImages && res.productImages.length > 0) {
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

        if(newp.type != 'FoodAndBeverages' && res.benowProductVariants && res.benowProductVariants.length > 0) {
            newp.variants = new Array<Variant>();
            res.benowProductVariants.forEach(function(v: any) {
                if(newp.variants && v && v.id && v.isAvailable != false) {
                    newp.variants.push(me.getCAVariant(v));
                }
            });
        }
        else if (newp.type == 'FoodAndBeverages' && res.benowProductVariants && res.benowProductVariants.length > 0) {

        }

        return newp;
    }

    getCAVariant(v: any): Variant {
                    let newv: Variant = new Variant(null, v.discountedPrice ? v.discountedPrice : v.price, v.price, v.id, v.color, v.isAvailable, null);        if(v.productSizes && v.productSizes.length > 0) {
            newv.sizes = new Array<Size>();
            v.productSizes.forEach(function(vps: any) {
                if(newv.sizes && vps && vps.prodSize)
                    newv.sizes.push(new Size(vps.id, vps.prodSize));
            });
        }

        return newv;
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

    getProductForEdit(id: string): Promise<NewProduct> {
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.getProductForEditURL,
                JSON.stringify({
                    "productId": id,
                }), 
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.fillProduct(res.json()))
            .catch(res => this.utilsService.returnGenericError());    
    }

    fillProduct(res: any): NewProduct {
        let product: NewProduct = new NewProduct(false, false, false, 0,
            0, '', '', null, null, null, null, null, false,

            '', false, null, null, null, null, null, null,null,null);
        let hasVariants: boolean = false;
        let variants = new Array<NewVariant>();
        if(res){
            if(res.benowProductVariants && res.benowProductVariants.length > 0){
                hasVariants = true;
                for(let i:number = 0; i < res.benowProductVariants.length; i++){
                    variants.push(new NewVariant(res.benowProductVariants[i].price, res.benowProductVariants[i].discountedPrice,
                        res.benowProductVariants[i].id, res.benowProductVariants[i].color, res.benowProductVariants[i].isAvailable,
                        res.benowProductVariants[i].variantCode, res.benowProductVariants[i].variantDesc, res.benowProductVariants[i].listProductSizes))
                }
            }

            product = new NewProduct(false, true, false, res.prodPrice, res.discountedPrice,
                res.id, res.prodName, res.prodDescription, res.uom, res.color, res.productSizes, res.productImages, res.isAvailable,

                res.productType, hasVariants, variants, res.venue, res.startDate, res.endDate, res.fileUrl ,res.shippingCharge, res.durationHours, res.durationMinutes);
        }

        return product;
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

                    res[i].prodName, res[i].prodDescription, res[i].uom, res[i].prodImgUrl, res[i].color, res[i].size, res[i].productType, null, null, 

                    null, res[i].merchantCode, null, res[i].shippingCharge,res[i].durationHours,
                    res[i].durationMinutes));
        }

        return this._campProducts;
    }

    private fillTransProducts(res: any): Array<Product> {
       
        if(res && res.length > 0) {
            this._transProducts = new Array<Product>();
            
            for(let i: number = 0; i < res.length; i++) {
               
                this._transProducts.push(new Product(false, false, false, res[i].quantity, res[i].price, res[i].price, res[i].campaignProductId, null,                   
                    res[i].prodName, res[i].prodDescription, res[i].uom, res[i].prodImgUrl, res[i].color, res[i].size, res[i].productType, null, null, 

                    null, res[i].merchantCode, null, res[i].shippingCharge, res[i].durationHours,
                    res[i].durationMinutes));
          }
        }
   
        return this._transProducts;
    }

    private fillProducts(res2: any): any {
        console.log(res2, 'fillproduct');
        if(!(res2 && res2.benowProductList))
            return { "success": false };
        
        let prods: Array<NewProduct> = new Array<NewProduct>();
        let numP: number = 0;
        if(res2 && res2.benowProductList && res2.benowProductList.length > 0) {
            numP = res2.totalNoOfPages;
            let res: any = res2.benowProductList;
            /*let prods: NewProduct = new NewProduct(false, false, false, 0,
                0, '', '', null, null, null, null, null, false,
                '', false, null, null, null, null, null);*/
            let hasVariants: boolean = false;
            let variants = new Array<NewVariant>();
            if(res) {
                for(let i: number = 0; i < res.length; i++){
                    if(res[i].benowProductVariants && res[i].benowProductVariants.length > 0){
                        hasVariants = true;
                        for(let j:number = 0; j < res[i].benowProductVariants.length; j++){
                            variants.push(new NewVariant(res[i].benowProductVariants[j].price, res[i].benowProductVariants[j].discountedPrice,
                                res[i].benowProductVariants[j].id, res[i].benowProductVariants[j].color, res[i].benowProductVariants[j].isAvailable,
                                res[i].benowProductVariants[j].variantCode, res[i].benowProductVariants[j].variantDesc, res[i].benowProductVariants[j].listProductSizes))
                        }
                    }
                    prods.push(new NewProduct(false, true, false, res[i].prodPrice, res[i].discountedPrice,
                        res[i].id, res[i].prodName, res[i].prodDescription, res[i].uom, res[i].color, res[i].productSizes, res[i].productImages, res[i].isAvailable,

                        res[i].productType, hasVariants, variants, res[i].venue, res[i].startDate, res[i].endDate, res[i].fileUrl, res[i].shippingCharge, res[i].durationHours, res[i].durationMinutes));
                }
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

                res.prodImgUrl, res.color, res.size, res.productType, null, null, null, res.merchantCode, null, null,res.durationHours,
                res.durationMinutes);
        else
            return null;
    }

    private addedProductHB(res: any): NewProduct|null {
        if(res && res.prodPrice > 0){
            if(res.benowProductVariants && res.benowProductVariants.length > 0){
                let variants = new Array<NewVariant>();
                for(let i:number = 0; i < res.benowProductVariants.length; i++){
                    variants.push(new NewVariant(res.benowProductVariants[i].price, res.benowProductVariants[i].discountedPrice,
                        res.benowProductVariants[i].id, res.benowProductVariants[i].color, res.benowProductVariants[i].isAvailable,
                        res.benowProductVariants[i].variantCode, res.benowProductVariants[i].variantDesc, res.benowProductVariants[i].listProductSizes))
                }
                return new NewProduct(true, false, true, res.prodPrice, res.discountedPrice, res.id, res.prodName, res.prodDescription, res.uom,

                    res.color, res.prodSizes, res.prodImgUrls, res.isAvailable, res.productType, true, variants, res.venue, res.startDate, res.endDate, null, res.shippingCharge, res.durationHours, res.durationMinutes);
            }

            return new NewProduct(true, false, true, res.prodPrice, res.discountedPrice, res.id, res.prodName, res.prodDescription, res.uom,

                res.color, res.prodSizes, res.prodImgUrls, res.isAvailable, res.productType, false, null, res.venue, res.startDate, res.endDate, null, res.shippingCharge, res.durationHours, res.durationMinutes);
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

    addProductHB(merchantCode: string, product: NewProduct): Promise<NewProduct> {
        if(!product.discountedPrice){
            product.discountedPrice = product.price;
        }

        if(product.startDate) {
           this.prodstartdate = product.startDate + ' ' + '00:00:00';
        }
        if(product.endDate) {
            this.prodenddate = product.endDate + ' ' + '00:00:00';
        }
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.addProductHBURL,
                JSON.stringify({
                    "merchantCode": merchantCode,
                    "name": product.name,
                    "price": product.price,
                    "description": product.description,
                    "uom": product.uom,
                    "prodImgUrls": product.prodImgUrls,
                    "benowProductVariants": product.variants,
                    "productType": product.productType,
                    "isAvailable": product.isAvailable,
                    "startDate": this.prodstartdate,
                    "endDate": this.prodenddate,
                    "fileUrl": product.fileUrl,
                    "venue": product.venue,
                    "discountedPrice": product.discountedPrice,
                    "color": product.color,
                    "prodSizes": product.prodSizes,

                    "shippingCharge":product.shippingcharge,
                    "durationHours":product.durationHours,
                    "durationMinutes":product.durationMinutes
                }),
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.addedProductHB(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }

    editProductHB(merchantCode: string, product: NewProduct): Promise<Product> {
        if(!product.discountedPrice){
            product.discountedPrice = product.price;
        }
        return this.http
            .post(this.utilsService.getBaseURL() + this._urls.editProductHBURL,
                JSON.stringify({
                    "id": product.id,
                    "merchantCode": merchantCode,
                    "name": product.name,
                    "price": product.price,
                    "description": product.description,
                    "uom": product.uom,
                    "prodImgUrls": product.prodImgUrls,
                    "benowProductVariants": product.variants,
                    "productType": product.productType,
                    "isAvailable": product.isAvailable,
                    "startDate": product.startDate,
                    "endDate": product.endDate,
                    "fileUrl": product.fileUrl,
                    "venue": product.venue,
                    "discountedPrice": product.discountedPrice,
                    "color": product.color,
                    "prodSizes": product.prodSizes,

                    "shippingCharge":product.shippingcharge,
                    "durationHours": product.durationHours,
                    "durationMinutes": product.durationMinutes
                }),
                { headers: this.utilsService.getHeaders() })
            .toPromise()
            .then(res => this.addedProductHB(res.json()))
            .catch(res => this.utilsService.returnGenericError());
    }
}
