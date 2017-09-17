import { Component, ViewChild  } from '@angular/core';
import { Platform, NavController, Slides  } from 'ionic-angular';
import {Http} from '@angular/http';
import { Events } from 'ionic-angular';
import { CrackerItem } from '../product/product';
import { ListingPage } from '../listing/listing';
import { AppService } from "../../app/app.service";

@Component({
  	selector: 'page-home',
  	templateUrl: 'home.html'
})
export class HomePage {
	public categoriesList;
	public bannerImagesList;
	public brandsList;
	public newArrivalsList;
	public discountList;
	public noOfItemsInCart;
	public pageLoading;
	public loadingRef;
	public homeSlider;
	public showHomeSlider;
		
	@ViewChild(CrackerItem) crackerItem: CrackerItem;

	//@ViewChild(Slides) slides: Slides;		

	constructor(public navCtrl: NavController, private http: Http, platform: Platform, public events : Events, public appService : AppService) {
		this.loadingRef = this.appService.getLoadingRef();		
		platform.ready().then(() => {
	        events.subscribe('logIn', (status, userId) => {
	            this.initHomePage();
	        });
	    });
	}

	ionViewWillEnter(){
		this.initHomePage();
		this.showHomeSlider = true;
	}

	ionViewWillLeave(){
		this.showHomeSlider = false;
	}
	
	initHomePage(){
		this.fetchData();
	}	
	
	initCarouselSlide(){
		document.getElementById('home-page-slider').style.marginTop = document.getElementById('header-handle').offsetHeight + "px";			
		this.homeSlider = new Swiper ('.swiper-container', {
			direction: 'horizontal',
			loop: true,		
			pagination: '.swiper-pagination',		
			// nextButton: '.swiper-button-next',
			// prevButton: '.swiper-button-prev',
			autoplay : 2000,
			speed : 750,			
			effect : 'cube',
			initialSlide : 0,
			//autoHeight : true,
			//paginationClickable : true
		  });   
	}

	onSlideChanged(){

	}

  	fetchData(){
  		this.loadingRef.present();
  		var request = {
  			"uid" : Number(this.appService.getUserId())
  		};
		var serviceUrl = this.appService.getBaseUrl()+"/store/getDashboardItems";
		this.http
			.post(serviceUrl,request)
			.map(res => res.json())
			.subscribe(res => {
				console.info("response",res);
				this.processInitData(res.data);
				let timeoutId = setTimeout(() => {
				  	this.loadingRef.dismiss();
				}, 1000);
				/*if(res.response===200){
					this.events.publish('logIn', true);
				}else{
					this.events.publish('logIn', true);//false);
				}		  				  		  		*/
				//this.pageLoading = false;
			});
  	}

  	processInitData(data){  		
		this.categoriesList = data.categories;
		this.noOfItemsInCart = data.noOfItemsInCart;
		this.brandsList = data.brands;
		this.newArrivalsList = data.newArrivals;
		this.discountList = data.discounted;
		this.bannerImagesList = data.bannerImages;		
		setTimeout(() =>  {
			this.initCarouselSlide();
		}, 300);
  	}


  	redirectToCategory(category){
  		var filterEntity = {
  			field : 'category',
  			itemList : []
   		};
  		if(category){
  			var filteredList = this.categoriesList.map(function(item){
  				if(category.id == item.id){
					item.checked = true;
  				}else{
  					item.checked = false;
  				}
  				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}else{
  			var filteredList = this.categoriesList.map(function(item){
				item.checked = true;
				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}
  		this.navCtrl.push(ListingPage,[filterEntity]);
  	}

  	redirectToBrand(brand){
  		var filterEntity = {
  			field : 'brand',
  			itemList : []
   		};
  		if(brand){
  			var filteredList = this.brandsList.map(function(item){
  				if(brand.id == item.id){
					item.checked = true;
  				}else{
  					item.checked = false;
  				}
  				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}else{
  			var filteredList = this.brandsList.map(function(item){
				item.checked = true;
				return item;
  			});
  			filterEntity.itemList = filteredList;
  		}
  		this.navCtrl.push(ListingPage,[filterEntity]);
  	}

  	redirectWithSort(sortId){
  		var filterEntity = {
  			field : 'sort',
  			sortId : sortId
   		};
  		this.navCtrl.push(ListingPage,[filterEntity]);
  	}

}
