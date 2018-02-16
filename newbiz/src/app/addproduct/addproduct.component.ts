import { Component, OnInit } from '@angular/core';

import { UtilsService, User, UserService, LocationService, Product, ProductService } from 'benowservices';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  user: User;
  dashboard: string = '/dashboard';
  isTypeSelected: boolean = false;
  selectedProdType: string;

  constructor(private locationService: LocationService, private userService: UserService, private utilsService: UtilsService,
              private productService: ProductService) { }

  ngOnInit() {
    this.locationService.setLocation('addproduct');

    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: User){
    this.user = res;
    console.log('User',this.user);

  }

  selectProdType(type: string){
    this.selectedProdType = type;
    this.isTypeSelected = true;
  }


}
