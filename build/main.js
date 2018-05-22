webpackJsonp([0],{

/***/ 185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreditPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_dialogs__ = __webpack_require__(441);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_toast__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_firestore__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__detail_credit_detail_credit__ = __webpack_require__(442);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__months_list_months_list__ = __webpack_require__(443);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__month_state_month_state__ = __webpack_require__(450);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// import {AngularFireDatabase,AngularFireList} from 'angularfire2/database'





let CreditPage = class CreditPage {
    constructor(navCtrl, navParams, dialogs, toast, afs) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dialogs = dialogs;
        this.toast = toast;
        this.afs = afs;
        this.activeExtraButtons = false;
        this.amount = '';
        this.aux = 0;
        this.month_param = [false, '']; //si viene por parametro, el valor
        this.year = __WEBPACK_IMPORTED_MODULE_5_moment__().year();
        this.month = __WEBPACK_IMPORTED_MODULE_5_moment__().format("MMM Do YY").split(' ')[0];
        this.client_id = navParams.get('client_id');
        let month = navParams.get('month');
        if (month) {
            console.log(`Mes vino por params: ${month}`);
            this.month_param[0] = true;
            this.month_param[1] = month;
            // this.client_list = afDB.list(`prices-${this.year}/${this.client_id}/${month}`)
            this.itemsCollection = afs.collection(`prices-${this.year}/${this.client_id}/${month}`, ref => {
                let q = ref.orderBy('createdAt', "desc");
                return q;
            });
        }
        else {
            // this.itemsCollection = afs.collection<Item>(`prices-${this.year}`).doc(this.client_id).collection(this.month);
            this.itemsCollection = afs.collection(`prices-${this.year}/${this.client_id}/${this.month}`, ref => {
                let q = ref.orderBy('createdAt', "desc");
                return q;
            });
        }
        // let aux = 0; 
        this.items = this.itemsCollection.snapshotChanges().map(actions => {
            this.aux = 0;
            this.list_aux = [];
            return actions.map(action => {
                if (action.payload.doc.data().through == false) {
                    this.aux += action.payload.doc.data().value;
                    // this.list_aux.push(action.payload.doc.data().value)
                }
                // this.pure_list = this.list_aux;
                this.total = this.aux;
                console.log(action.payload.doc.id);
                // this.renderChart()
                return Object.assign({ key: action.payload.doc.id }, action.payload.doc.data());
            });
        });
    } //({ key: action.key, ...action.payload.val() })
    addTodo() {
        if (this.amount.trim().toString() === "")
            return;
        const number = new Number(this.amount).valueOf();
        let dt = __WEBPACK_IMPORTED_MODULE_5_moment__().format();
        //for firestore
        const id = this.afs.createId();
        // const item: Item = { id, name };
        this.afs.doc(`prices-${this.year}/${this.client_id}`).snapshotChanges().subscribe(actions => {
            // if(actions.payload.data().ArrayOfMonth)
            let exist = false;
            let aux_moths = [];
            if (actions.payload.exists) {
                aux_moths = actions.payload.data().ArrayOfMonth;
                actions.payload.data().ArrayOfMonth.map((v) => {
                    if (v == this.month) {
                        //si ya esta el campo en la db
                        exist = true;
                        console.log(`El campo con la fecha ${this.month} existe`);
                    }
                });
            }
            else {
                //por primera vez, cuando se agrega el primer valor del mes
                console.log('primer valor agregado en la lista del mes');
                this.afs.doc(`prices-${this.year}/${this.client_id}`).set({ ArrayOfMonth: aux_moths });
                //se crea el state del mes, que inicialmente esta en false, y sin abono
                // pay: abonar, paid: pagado
                this.afs.doc(`prices-${this.year}/${this.client_id}/${this.month}/state`).set({
                    pay: [{
                            value: 0,
                            date: dt
                        }],
                    paid: false
                });
            }
            if (!exist) {
                aux_moths.push(this.month);
                this.afs.doc(`prices-${this.year}/${this.client_id}`).update({ ArrayOfMonth: aux_moths });
            }
            // debugger
        });
        this.itemsCollection.doc(id).set({
            value: number,
            createdAt: dt,
            through: false
        }).then(() => {
            this.amount = ''; // limpiamos el campo
            this.toast.show(`Agregado`, '2000', 'center').subscribe();
        });
        /*this.client_list.push({
          value:number,
          createdAt:dt,
          through:false
        }).then(()=>{
          this.amount = '' // limpiamos el campo
          this.toast.show(`Agregado`, '2000', 'center').subscribe();
        })*/
    }
    detailOfValue(key) {
        let one_credit;
        if (this.month_param[0]) {
            one_credit = this.afs.doc(`prices-${this.year}/${this.client_id}/${this.month_param[1]}/${key}`);
            // one_credit = this.afDB.object(`prices-${this.year}/${this.client_id}/${this.month_param[1]}/${key}`)
            //for firestore
            // one_credit = this.afs.collection(`prices-${this.year}`).doc(this.client_id).collection(this.month_param[1].toString()).doc(key)
        }
        else {
            one_credit = this.afs.doc(`prices-${this.year}/${this.client_id}/${this.month}/${key}`);
            // one_credit = this.afs.collection(`prices-${this.year}`).doc(this.client_id).collection(this.month).doc(key)
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__detail_credit_detail_credit__["a" /* DetailCreditPage */], { data: one_credit });
    }
    setThrough(key) {
        // this.afDB.object(`prices-${this.year}/${key}`).remove()
        this.dialogs.confirm("Seguro que quieres tachar este valor?", "Jefe", ['Confirmar', 'Cancelar']).then((index) => {
            if (index === 1) {
                if (this.month_param[0]) {
                    this.afs.collection(`prices-${this.year}`).doc(this.client_id).collection(this.month_param[1].toString()).doc(key).update({ through: true }).then(() => {
                        //se agrego a la base de datos
                        this.toast.show(`Se ha tachado`, '2000', 'center').subscribe();
                    }).catch(error => {
                        alert(error);
                    });
                }
                else {
                    this.afs.collection(`prices-${this.year}`).doc(this.client_id).collection(this.month).doc(key).update({ through: true }).then(() => {
                        //se agrego a la base de datos
                        this.toast.show(`Se ha tachado`, '2000', 'center').subscribe();
                    }).catch(error => {
                        alert(error);
                    });
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
    viewMonths() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__months_list_months_list__["a" /* MonthsListPage */], { id: this.client_id });
    }
    viewOrModifyState() {
        let data;
        let ref;
        if (this.month_param[0]) {
            ref = `prices-${this.year}/${this.client_id}/${this.month_param[1]}/state`;
        }
        else {
            ref = `prices-${this.year}/${this.client_id}/${this.month}/state`;
        }
        data = this.afs.doc(ref);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__month_state_month_state__["a" /* MonthStatePage */], { month: data, ref: ref, total: this.total });
    }
    addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + x2;
    }
    renderChart() {
        // console.log("ionViewDidLoad" ,this.pure_list);
        //     this.barChart = new Chart(this.barCanvas.nativeElement, {
        //         type: 'bar',
        //         data:{
        //         	labels:["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        //         	datasets:[{
        //         		label:'cantidad fiada',
        //         		data:[12, 19, 3, 5, 2, 3],
        //     		   	backgroundColor: [
        //              'rgba(255, 99, 132, 0.2)',
        //              'rgba(54, 162, 235, 0.2)',
        //              'rgba(255, 206, 86, 0.2)',
        //              'rgba(75, 192, 192, 0.2)',
        //              'rgba(153, 102, 255, 0.2)',
        //              'rgba(255, 159, 64, 0.2)'
        //          ],
        //         	}]
        //         },
        //         options: {
        //             scales: {
        //                 yAxes: [{
        //                     ticks: {
        //                         beginAtZero:true
        //                     }
        //                 }]
        //             }
        //         }
        //     });
    }
    activeExtra() {
        this.activeExtraButtons = !this.activeExtraButtons;
    }
};
CreditPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-credit',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\credit\credit.html"*/'<ion-header>\n\n<!--   <ion-navbar >\n    <ion-title>credit</ion-title>\n    <ion-buttons end>\n      <button ion-button icon-only (tap)="viewOrModifyState()">\n        <ion-icon name="eye"></ion-icon>\n      </button>\n      <button ion-button icon-start class="btn-txt" (click)="viewMonths()">\n        <ion-icon name="calendar"></ion-icon> \n        <ion-label color="white">Meses</ion-label>\n      </button>\n    </ion-buttons>\n  </ion-navbar> -->\n    <ion-toolbar>\n      <button ion-button menuToggle left  (click)="activeExtra()">\n        <ion-icon name="more"></ion-icon>\n      </button>\n    <ion-input large type="number" placeholder="valor.." [(ngModel)]="amount"></ion-input>\n    <ion-buttons end>\n      <button ion-button icon-right color="purple" (tap)="addTodo()">\n        Send\n        <ion-icon name="send"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-toolbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <div *ngIf="activeExtraButtons == true" class="activeExtra">\n    <ion-toolbar>\n      <ion-buttons end>\n        <button ion-button icon-only class="btn-txt-green" (tap)="viewOrModifyState()">\n          <ion-icon name="eye"></ion-icon>\n          <ion-label color="white">Abonar/Cancelar</ion-label>\n        </button>\n        <button ion-button icon-start class="btn-txt-danger" (click)="viewMonths()">\n          <ion-icon name="calendar"></ion-icon> \n          <ion-label color="white">Meses</ion-label>\n        </button>\n      </ion-buttons>\n    </ion-toolbar>\n  </div>\n<!--   <ion-input large type="number" placeholder="valor.." [(ngModel)]="amount"></ion-input>\n  <button ion-button full (tap)="addTodo()">Subir</button> -->\n	<p>TOTAL : {{total}}</p>\n\n<!--     <ion-card>\n      <ion-card-header>\n        Bar Chart\n      </ion-card-header>\n      <ion-card-content>\n        <canvas #barCanvas></canvas>\n      </ion-card-content>\n    </ion-card> -->\n \n<ion-list>\n    <ion-item class="text" *ngFor="let item of items | async" >\n      <ion-grid *ngIf="item.key != \'state\'">\n    		<ion-row>\n    			<ion-col col-3>\n    				<div *ngIf="item.through == true; else noDecoration">\n    					<p class="through">$ {{addCommas(item.value)}}</p>\n    				</div>\n    				<!-- <div *ngIf="item.through == false">\n	    				$ {{addCommas(item.value)}}\n    				</div> -->\n            <ng-template #noDecoration>\n              $ {{addCommas(item.value)}}\n            </ng-template>\n    			</ion-col>\n    			<ion-col  col-5>\n      			<button ion-button (tap)="detailOfValue(item.key)" outline color="secundary">Detalle</button>\n    			</ion-col>\n    			<ion-col  col-4 *ngIf="item.through == true; else okButtonThrough">\n    				<button ion-button [disabled]="true" (tap)="setThrough(item.key)" outline color="danger">tachar</button>\n    			</ion-col>\n          <ng-template #okButtonThrough>\n            <ion-col  col-4 >\n              <button ion-button (tap)="setThrough(item.key)" outline color="danger">tachar</button>\n            </ion-col>\n          </ng-template>\n  			</ion-row>	\n      </ion-grid>\n    </ion-item>\n  </ion-list>\n</ion-content>'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\credit\credit.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_dialogs__["a" /* Dialogs */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_toast__["a" /* Toast */],
        __WEBPACK_IMPORTED_MODULE_4_angularfire2_firestore__["a" /* AngularFirestore */]])
], CreditPage);

//https://www.djamware.com/post/598953f880aca768e4d2b12b/creating-beautiful-charts-easily-using-ionic-3-and-angular-4
//# sourceMappingURL=credit.js.map

/***/ }),

/***/ 202:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 202;

/***/ }),

/***/ 245:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 245;

/***/ }),

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__move_move__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clients_clients__ = __webpack_require__(437);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(440);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let TabsPage = class TabsPage {
    constructor() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_1__move_move__["a" /* MovePage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_2__clients_clients__["a" /* ClientPage */];
    }
};
TabsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\tabs\tabs.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" tabTitle="Credito" tabIcon="cash"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="Move" tabIcon="share-alt"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="Clientes" tabIcon="contacts"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\tabs\tabs.html"*/
    }),
    __metadata("design:paramtypes", [])
], TabsPage);

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MovePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__order_order__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bit_move_bit_move__ = __webpack_require__(436);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let MovePage = class MovePage {
    constructor(navCtrl) {
        this.navCtrl = navCtrl;
    }
    gotoOrder() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__order_order__["a" /* OrderPage */]);
    }
    gotBitMove() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__bit_move_bit_move__["a" /* BitMovePage */]);
    }
};
MovePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-move',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\move\move.html"*/'<!-- <ion-header>\n  <ion-navbar>\n    <ion-title>\n      Move\n    </ion-title>\n  </ion-navbar>\n</ion-header> -->\n\n<ion-content padding>\n	<ion-list>\n		<ion-item>\n			<button ion-button full large color="primary" (tap)="gotoOrder()">Registrar pedido</button>\n		</ion-item>\n		<ion-item>\n			<button ion-button full large color="secondary" (tap)="gotBitMove()"> Movimiento Pequeño</button>\n		</ion-item>\n	</ion-list>\n</ion-content>\n\n <!-- \n <ion-header>\n  <ion-toolbar>\n    <ion-buttons start>\n      <button ion-button icon-only color="royal">\n        <ion-icon name="search"></ion-icon>\n      </button>\n    </ion-buttons>\n    <ion-title>Send To...</ion-title>\n    <ion-buttons end>\n      <button ion-button icon-only color="royal">\n        <ion-icon name="person-add"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content></ion-content>\n\n<ion-footer>\n  <ion-toolbar>\n    <p>Ash, Misty, Brock</p>\n    <ion-buttons end>\n      <button ion-button icon-right color="royal">\n        Send\n        <ion-icon name="send"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-footer> -->'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\move\move.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */]])
], MovePage);

//# sourceMappingURL=move.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let OrderPage = class OrderPage {
    constructor(navCtrl, navParams, afs) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afs = afs;
        // order_list:string[]=[]
        this.name_product = '';
        this.month = __WEBPACK_IMPORTED_MODULE_3_moment__().format("MMM Do YY").split(' ')[0];
        this.order_list = afs.collection('order');
    }
    // pushProductNameToList(){
    // 	if(this.name_product.trim() == '') return;
    // 	this.order_list.push(this.name_product)
    // 	this.name_product = ''
    // }
    resize() {
        let element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
        let scrollHeight = element.scrollHeight;
        element.style.height = scrollHeight + 'px';
        this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
    }
    addOrder() {
        if (this.name_product.trim() == '' || this.amount == null || this.quantity == null)
            return;
        let id = this.afs.createId();
        let dt = new Date();
        this.order_list.add({
            // order_list:this.order_list,
            amount: new Number(this.amount).valueOf(),
            date: dt,
            name_product: this.name_product,
            quantity: new Number(this.quantity).valueOf(),
        }).then(() => {
            alert(`order con id: ${id} agregada`);
            this.amount = null;
            this.name_product = '';
            this.quantity = null;
        }).catch(error => {
            alert(error);
        });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderPage');
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('myInput'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
], OrderPage.prototype, "myInput", void 0);
OrderPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-order',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\move\order\order.html"*/'<!--\n  Generated template for the OrderPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>Pedido</ion-title>\n    	<ion-buttons end>\n	      <button ion-button icon-only >\n	        <ion-icon name="eye"></ion-icon>\n	        <p color="">Ver pedidos</p>\n	      </button>\n<!-- 	      <button ion-button icon-start class="btn-txt" (click)="viewMonths()">\n	        <ion-icon name="calendar"></ion-icon> \n	      </button>\n -->	    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n	<ion-list>\n\n	  <ion-item>\n	    <!-- <ion-label fixed>Nombre Prod.</ion-label> -->\n	    <!-- <ion-textarea type="text" placeholder="nombre productos y/o descripcion" [(ngModel)]="name_product"></ion-textarea> -->\n	    <ion-textarea #myInput id="myInput" rows="1" maxLength="500" (keyup)="resize()" [(ngModel)]="name_product" placeholder="nombre productos y/o descripcion" ></ion-textarea>\n	  </ion-item>\n\n	  <ion-item>\n	    <ion-label fixed>Valor</ion-label>\n	    <ion-input type="number" [(ngModel)]="amount"></ion-input>\n	  </ion-item>\n\n	  <ion-item>\n	    <ion-label fixed>Cantidad</ion-label>\n	    <ion-input type="number" [(ngModel)]="quantity"></ion-input>\n	  </ion-item>\n\n	</ion-list>\n	<div padding>\n	  <button ion-button block full (tap)="addOrder()">Registrar Pedido</button>\n	</div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\move\order\order.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__["a" /* AngularFirestore */]])
], OrderPage);

//# sourceMappingURL=order.js.map

/***/ }),

/***/ 436:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BitMovePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the BitMovePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let BitMovePage = class BitMovePage {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad BitMovePage');
    }
};
BitMovePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-bit-move',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\move\bit-move\bit-move.html"*/'<!--\n  Generated template for the BitMovePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>bit-move</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\move\bit-move\bit-move.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */]])
], BitMovePage);

//# sourceMappingURL=bit-move.js.map

/***/ }),

/***/ 437:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClientPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_toast__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__detail_client_detail_client__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_firestore__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let ClientPage = class ClientPage {
    constructor(navCtrl, afs, toast) {
        this.navCtrl = navCtrl;
        this.afs = afs;
        this.toast = toast;
        this.name = '';
        this.phone = '';
        this.address = '';
        this.client_list = afs.collection('clients');
        this.clients = this.client_list.snapshotChanges().map(actions => {
            return actions.map(action => (Object.assign({ key: action.payload.doc.id }, action.payload.doc.data())));
        });
    }
    addClient() {
        if (this.name.trim() === "" || this.phone.trim() === "" || this.address.trim() === "")
            return;
        const id = this.afs.createId();
        this.client_list.doc(id).set({
            name: this.name,
            phone: this.phone,
            address: this.address
        }).then(() => {
            this.name = "";
            this.phone = "";
            this.address = "";
            this.toast.show(`Cliente Agregado`, '2000', 'center').subscribe();
        });
        // this.client_list.push({
        // name : this.name,
        // phone : this.phone,
        // address : this.address
        // })
    }
    gotoClient(key) {
        let snap_client = this.afs.doc(`clients/${key}`);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__detail_client_detail_client__["a" /* DetailClientPage */], { client: snap_client });
    }
};
ClientPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-clients',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\clients\clients.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Clients\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n   <ion-list>\n    <ion-item>\n      <ion-input [(ngModel)]="name" placeholder="nombre"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-input [(ngModel)]="phone" placeholder="numero" type="number"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-input [(ngModel)]="address" placeholder="direccion"></ion-input>\n    </ion-item>\n </ion-list>\n  \n  <button ion-button full (tap)="addClient()">Crear Cliente</button>\n  <ion-list>\n    <button ion-item *ngFor="let client of clients | async" (tap)="gotoClient(client.key)">{{ client.name}} <ion-icon name="arrow-round-forward" item-end></ion-icon></button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\clients\clients.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_4_angularfire2_firestore__["a" /* AngularFirestore */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_toast__["a" /* Toast */]])
], ClientPage);

//# sourceMappingURL=clients.js.map

/***/ }),

/***/ 438:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DetailClientPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_call_number__ = __webpack_require__(439);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let DetailClientPage = class DetailClientPage {
    constructor(navCtrl, navParams, callNumber) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.callNumber = callNumber;
        this.client_obj = {
            name: '',
            phone: '',
            address: ''
        };
        let snap_client = navParams.get('client');
        snap_client.snapshotChanges().subscribe(action => {
            this.client_obj = {
                name: action.payload.data().name,
                phone: action.payload.data().phone,
                address: action.payload.data().address,
            };
        });
    }
    makeCall() {
        this.callNumber.callNumber(this.client_obj.phone, false)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
    }
    ionViewDidLoad() {
        // console.log('ionViewDidLoad DetailClientPage');
    }
};
DetailClientPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-detail-client',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\detail-client\detail-client.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>detail-client</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n	<ion-card>\n  <ion-card-header>\n    {{ client_obj.name }}\n  </ion-card-header>\n\n  <ion-list>\n    <button ion-item (tap)="makeCall()">\n      <ion-icon name="call" item-start></ion-icon>\n      Numero : {{ client_obj.phone }}\n    </button>\n\n    <button ion-item>\n      <ion-icon name="locate" item-start></ion-icon>\n      Dir: {{ client_obj.address }}\n    </button>\n\n  </ion-list>\n</ion-card>\n</ion-content>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\detail-client\detail-client.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_call_number__["a" /* CallNumber */]])
], DetailClientPage);

//# sourceMappingURL=detail-client.js.map

/***/ }),

/***/ 440:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__credit_credit__ = __webpack_require__(185);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let HomePage = class HomePage {
    constructor(navCtrl, afs) {
        this.navCtrl = navCtrl;
        this.afs = afs;
        this.client_list = afs.collection('clients');
        this.clients = this.client_list.snapshotChanges().map(actions => {
            return actions.map(action => (Object.assign({ key: action.payload.doc.id }, action.payload.doc.data())));
        });
    }
    gotoCredit(key) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__credit_credit__["a" /* CreditPage */], { client_id: key });
    }
};
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\home\home.html"*/'<ion-content padding>\n  <ion-list>\n      <button ion-item *ngFor="let client of clients | async" (tap)="gotoCredit(client.key)"><span class="value_text">{{ client.name}} </span><ion-icon name="arrow-round-forward" item-end></ion-icon></button>\n  </ion-list>\n</ion-content>'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__["a" /* AngularFirestore */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 442:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DetailCreditPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
let DetailCreditPage = class DetailCreditPage {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.one_value = {
            value: 0,
            createdAt: new Date(),
            through: false
        };
        let value = navParams.get('data');
        value.snapshotChanges().subscribe(action => {
            // console.log(action.type);
            // console.log(action.key)
            // console.log(action.payload.doc.data())
            this.one_value = {
                value: action.payload.data().value,
                createdAt: action.payload.data().createdAt,
                through: action.payload.data().through
            };
        });
        // this.one_value  = value;
        // debugger;
    }
    addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + x2;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailCreditPage');
    }
};
DetailCreditPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-detail-credit',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\detail-credit\detail-credit.html"*/'<!--\n  Generated template for the DetailCreditPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>detail-credit</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-item-group>\n    <ion-item-divider color="light"> $ {{addCommas(one_value.value)}}</ion-item-divider>\n    <ion-item>{{one_value.createdAt | date }} a las {{one_value.createdAt | date : \'mediumTime\' }}</ion-item>\n    <ion-item>{{ (one_value.through==true) ? "Tachado" : "Sin tachar" }}</ion-item>\n  </ion-item-group>\n</ion-content>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\detail-credit\detail-credit.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */]])
], DetailCreditPage);

//# sourceMappingURL=detail-credit.js.map

/***/ }),

/***/ 443:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MonthsListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_chart_js__ = __webpack_require__(620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_chart_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__credit_credit__ = __webpack_require__(185);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import {AngularFireDatabase,AngularFireList} from 'angularfire2/database'




let MonthsListPage = class MonthsListPage {
    constructor(navCtrl, navParams, afs) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afs = afs;
        this.items = []; //:Observable<any[]>;
        this.list_aux = [];
        this.year = __WEBPACK_IMPORTED_MODULE_3_moment__().year();
        this.client_id = navParams.get('id');
        this.months_list = afs.doc(`prices-${this.year}/${this.client_id}`);
        this.months_list.snapshotChanges().subscribe(actions => {
            this.list_aux = [];
            if (actions.payload.exists) {
                actions.payload.data().ArrayOfMonth.map((value) => {
                    this.list_aux.push(value);
                    this.items = this.list_aux;
                    this.drawChart();
                });
            }
        });
    }
    gotoCredit(key) {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__credit_credit__["a" /* CreditPage */], {
            client_id: this.client_id,
            month: key
        });
    }
    drawChart() {
        let list_totals = [];
        this.items.forEach((v) => {
            console.log(`prices-${this.year}/${this.client_id}/${v}`);
            let afs = this.afs;
            // debugger
            this.afs.collection(`prices-${this.year}/${this.client_id}/${v}`).auditTrail().map(actions => {
                let aux = 0;
                this.list_aux = [];
                return actions.map(action => {
                    if (action.payload.doc.data().through == false) {
                        aux += action.payload.doc.data().value;
                        // this.list_aux.push(action.payload.doc.data().value)
                    }
                    // this.pure_list = this.list_aux;
                    this.total = aux;
                    console.log(action.payload.doc.id);
                    // this.renderChart()
                });
            });
        });
        console.log(list_totals);
        this.barChart = new __WEBPACK_IMPORTED_MODULE_4_chart_js__["Chart"](this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.items,
                datasets: [{
                        label: 'cantidad fiada',
                        data: [1200, 1900]
                    }]
            },
            options: {
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('barCanvas'),
    __metadata("design:type", Object)
], MonthsListPage.prototype, "barCanvas", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('doughnutCanvas'),
    __metadata("design:type", Object)
], MonthsListPage.prototype, "doughnutCanvas", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('lineCanvas'),
    __metadata("design:type", Object)
], MonthsListPage.prototype, "lineCanvas", void 0);
MonthsListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-months-list',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\months-list\months-list.html"*/'<!--\n  Generated template for the MonthsListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>months-list</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-list>\n      <button ion-item *ngFor="let month of items" (tap)="gotoCredit(month)"><span class="value_text">{{month}} </span><ion-icon name="arrow-round-forward" item-end></ion-icon></button>\n  </ion-list>\n      <ion-card>\n      <ion-card-header>\n        Bar Chart\n      </ion-card-header>\n      <ion-card-content>\n        <canvas #barCanvas></canvas>\n      </ion-card-content>\n    </ion-card>\n</ion-content>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\months-list\months-list.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__["a" /* AngularFirestore */]])
], MonthsListPage);

//# sourceMappingURL=months-list.js.map

/***/ }),

/***/ 450:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MonthStatePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_toast__ = __webpack_require__(106);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let MonthStatePage = class MonthStatePage {
    constructor(navCtrl, navParams, afs, toast, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.afs = afs;
        this.toast = toast;
        this.alertCtrl = alertCtrl;
        this.month_obj = {
            pay: [{
                    value: 0,
                    date: new Date()
                }],
            paid: false
        };
        let snap_month = navParams.get('month');
        this.ref = navParams.get('ref');
        this.total = navParams.get('total');
        snap_month.snapshotChanges().subscribe(action => {
            if (action.payload.exists) {
                // this.month_obj   action.payload.data()
                // action.payload.data().pay.map((v)=>console.log(v))
                this.month_obj.pay = action.payload.data().pay;
                this.month_obj.paid = action.payload.data().paid;
                // debugger
            }
        });
    }
    payMonth() {
        this.afs.doc(this.ref).update({
            paid: true
        }).then(() => {
            this.toast.show(`Se ha cambiado el estado a pagado`, '3000', 'center').subscribe();
        }).catch(error => {
            alert(error);
        });
    }
    addAmount() {
        if (this.pay == null)
            return;
        this.month_obj.pay.push({
            value: this.pay,
            date: new Date()
        });
        this.afs.doc(this.ref).update(this.month_obj);
        this.pay = null;
    }
    showPrompt() {
        if (this.month_obj.paid == true)
            return;
        let prompt = this.alertCtrl.create({
            title: 'Cancelar Mes',
            message: "Para establecer como cancelado el mes, escribi 'Si' debajo, sin las comillas",
            inputs: [
                {
                    name: 'valueText',
                    placeholder: 'Si'
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: data => {
                        console.log('Saved clicked');
                        if (data.valueText === "Si") {
                            this.payMonth();
                        }
                        else {
                            this.toast.show(`Debes escribir "Si" para cancelar el mes`, '3000', 'center').subscribe();
                        }
                    }
                }
            ]
        });
        prompt.present();
    }
    ionViewDidLoad() {
    }
};
MonthStatePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
        selector: 'page-month-state',template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\month-state\month-state.html"*/'<!--\n  Generated template for the MonthStatePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>month-state</ion-title>\n    <ion-buttons end>\n<!--       <button ion-button icon-only (tap)="viewOrModifyState()">\n        <ion-icon name="eye"></ion-icon>\n      </button> -->\n      <button ion-button icon-start class="back-red" (click)="showPrompt()">\n        <ion-icon name="done-all"></ion-icon> \n        <ion-label color="white">Librar mes</ion-label>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n	<ion-list>\n    <ion-list-header>\n      TOTAL MES: ${{total}}\n    </ion-list-header>\n\n    <ion-item>\n      <ion-label>Abonar</ion-label>\n      <ion-toggle [(ngModel)]="toggle_pay" checked="true"></ion-toggle>\n    </ion-item>\n<!-- \n    <ion-item>\n      <ion-label>Sam</ion-label>\n      <ion-toggle color="energized"></ion-toggle>\n    </ion-item> -->\n  </ion-list>\n\n	<ion-list>\n		<ion-card padding *ngIf="toggle_pay">\n		  <!-- <ion-item> -->\n		    <ion-label color="#000">Monto</ion-label>\n		    <ion-input type="number" placeholder="valor.." [(ngModel)]="pay"></ion-input>\n		    <button ion-button color="secondary" full (tap)="addAmount()">Agregar</button>\n	  	<!-- </ion-item> -->\n	  </ion-card>\n		<ion-card *ngFor="let pay of month_obj.pay">\n			<ion-item *ngIf="pay.value !=0">\n				<h2> Abono :{{ pay.value }}</h2>\n				<p> Fecha :{{ pay.date | date}} a las {{ pay.date | date : \'mediumTime\' }}</p>\n			</ion-item>\n		</ion-card>\n		<div *ngIf="month_obj.paid;else nopaid">\n			<ion-card padding class="back-green">\n				<h2 class="white">Pagado</h2>\n			</ion-card>\n		</div>\n		<ng-template #nopaid>\n			<ion-card padding class="back-red">\n				<span class="white">Sin pagar</span>\n			</ion-card>\n		</ng-template>\n		\n	</ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\pages\month-state\month-state.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__["a" /* AngularFirestore */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_toast__["a" /* Toast */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
], MonthStatePage);

//# sourceMappingURL=month-state.js.map

/***/ }),

/***/ 485:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(486);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(501);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 501:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(542);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_move_move__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_clients_clients__ = __webpack_require__(437);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(440);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_credit_credit__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_detail_credit_detail_credit__ = __webpack_require__(442);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_detail_client_detail_client__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_months_list_months_list__ = __webpack_require__(443);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_month_state_month_state__ = __webpack_require__(450);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_move_order_order__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_move_bit_move_bit_move__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_status_bar__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_splash_screen__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angularfire2__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angularfire2_database__ = __webpack_require__(665);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_dialogs__ = __webpack_require__(441);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_toast__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_call_number__ = __webpack_require__(439);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_angularfire2_firestore__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















// native plugins




const config = {
    apiKey: "AIzaSyBdTfPhNExNeNCOrcoJs2plOPqsZQ_OLrc",
    authDomain: "hoodstore-b978d.firebaseapp.com",
    databaseURL: "https://hoodstore-b978d.firebaseio.com",
    projectId: "hoodstore-b978d",
    storageBucket: "",
    messagingSenderId: "725103906741"
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_4__pages_move_move__["a" /* MovePage */],
            __WEBPACK_IMPORTED_MODULE_5__pages_clients_clients__["a" /* ClientPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_credit_credit__["a" /* CreditPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_detail_credit_detail_credit__["a" /* DetailCreditPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_detail_client_detail_client__["a" /* DetailClientPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_months_list_months_list__["a" /* MonthsListPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_month_state_month_state__["a" /* MonthStatePage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_move_order_order__["a" /* OrderPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_move_bit_move_bit_move__["a" /* BitMovePage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_17_angularfire2__["a" /* AngularFireModule */].initializeApp(config),
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                links: []
            }),
            __WEBPACK_IMPORTED_MODULE_22_angularfire2_firestore__["b" /* AngularFirestoreModule */].enablePersistence()
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_4__pages_move_move__["a" /* MovePage */],
            __WEBPACK_IMPORTED_MODULE_5__pages_clients_clients__["a" /* ClientPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_credit_credit__["a" /* CreditPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_detail_credit_detail_credit__["a" /* DetailCreditPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_detail_client_detail_client__["a" /* DetailClientPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_months_list_months_list__["a" /* MonthsListPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_month_state_month_state__["a" /* MonthStatePage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_move_order_order__["a" /* OrderPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_move_bit_move_bit_move__["a" /* BitMovePage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_15__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_16__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_18_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_18_angularfire2_database__["b" /* AngularFireDatabaseModule */],
            __WEBPACK_IMPORTED_MODULE_22_angularfire2_firestore__["b" /* AngularFirestoreModule */],
            __WEBPACK_IMPORTED_MODULE_19__ionic_native_dialogs__["a" /* Dialogs */],
            __WEBPACK_IMPORTED_MODULE_20__ionic_native_toast__["a" /* Toast */],
            __WEBPACK_IMPORTED_MODULE_21__ionic_native_call_number__["a" /* CallNumber */],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 542:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__ = __webpack_require__(288);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let MyApp = class MyApp {
    constructor(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__["a" /* TabsPage */];
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.overlaysWebView(false);
            statusBar.backgroundColorByHexString('#C20013');
            splashScreen.hide();
        });
    }
};
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\SergioEric\apps-ionic\scotch\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\Users\SergioEric\apps-ionic\scotch\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 619:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 313,
	"./af.js": 313,
	"./ar": 314,
	"./ar-dz": 315,
	"./ar-dz.js": 315,
	"./ar-kw": 316,
	"./ar-kw.js": 316,
	"./ar-ly": 317,
	"./ar-ly.js": 317,
	"./ar-ma": 318,
	"./ar-ma.js": 318,
	"./ar-sa": 319,
	"./ar-sa.js": 319,
	"./ar-tn": 320,
	"./ar-tn.js": 320,
	"./ar.js": 314,
	"./az": 321,
	"./az.js": 321,
	"./be": 322,
	"./be.js": 322,
	"./bg": 323,
	"./bg.js": 323,
	"./bm": 324,
	"./bm.js": 324,
	"./bn": 325,
	"./bn.js": 325,
	"./bo": 326,
	"./bo.js": 326,
	"./br": 327,
	"./br.js": 327,
	"./bs": 328,
	"./bs.js": 328,
	"./ca": 329,
	"./ca.js": 329,
	"./cs": 330,
	"./cs.js": 330,
	"./cv": 331,
	"./cv.js": 331,
	"./cy": 332,
	"./cy.js": 332,
	"./da": 333,
	"./da.js": 333,
	"./de": 334,
	"./de-at": 335,
	"./de-at.js": 335,
	"./de-ch": 336,
	"./de-ch.js": 336,
	"./de.js": 334,
	"./dv": 337,
	"./dv.js": 337,
	"./el": 338,
	"./el.js": 338,
	"./en-au": 339,
	"./en-au.js": 339,
	"./en-ca": 340,
	"./en-ca.js": 340,
	"./en-gb": 341,
	"./en-gb.js": 341,
	"./en-ie": 342,
	"./en-ie.js": 342,
	"./en-il": 343,
	"./en-il.js": 343,
	"./en-nz": 344,
	"./en-nz.js": 344,
	"./eo": 345,
	"./eo.js": 345,
	"./es": 346,
	"./es-do": 347,
	"./es-do.js": 347,
	"./es-us": 348,
	"./es-us.js": 348,
	"./es.js": 346,
	"./et": 349,
	"./et.js": 349,
	"./eu": 350,
	"./eu.js": 350,
	"./fa": 351,
	"./fa.js": 351,
	"./fi": 352,
	"./fi.js": 352,
	"./fo": 353,
	"./fo.js": 353,
	"./fr": 354,
	"./fr-ca": 355,
	"./fr-ca.js": 355,
	"./fr-ch": 356,
	"./fr-ch.js": 356,
	"./fr.js": 354,
	"./fy": 357,
	"./fy.js": 357,
	"./gd": 358,
	"./gd.js": 358,
	"./gl": 359,
	"./gl.js": 359,
	"./gom-latn": 360,
	"./gom-latn.js": 360,
	"./gu": 361,
	"./gu.js": 361,
	"./he": 362,
	"./he.js": 362,
	"./hi": 363,
	"./hi.js": 363,
	"./hr": 364,
	"./hr.js": 364,
	"./hu": 365,
	"./hu.js": 365,
	"./hy-am": 366,
	"./hy-am.js": 366,
	"./id": 367,
	"./id.js": 367,
	"./is": 368,
	"./is.js": 368,
	"./it": 369,
	"./it.js": 369,
	"./ja": 370,
	"./ja.js": 370,
	"./jv": 371,
	"./jv.js": 371,
	"./ka": 372,
	"./ka.js": 372,
	"./kk": 373,
	"./kk.js": 373,
	"./km": 374,
	"./km.js": 374,
	"./kn": 375,
	"./kn.js": 375,
	"./ko": 376,
	"./ko.js": 376,
	"./ky": 377,
	"./ky.js": 377,
	"./lb": 378,
	"./lb.js": 378,
	"./lo": 379,
	"./lo.js": 379,
	"./lt": 380,
	"./lt.js": 380,
	"./lv": 381,
	"./lv.js": 381,
	"./me": 382,
	"./me.js": 382,
	"./mi": 383,
	"./mi.js": 383,
	"./mk": 384,
	"./mk.js": 384,
	"./ml": 385,
	"./ml.js": 385,
	"./mn": 386,
	"./mn.js": 386,
	"./mr": 387,
	"./mr.js": 387,
	"./ms": 388,
	"./ms-my": 389,
	"./ms-my.js": 389,
	"./ms.js": 388,
	"./mt": 390,
	"./mt.js": 390,
	"./my": 391,
	"./my.js": 391,
	"./nb": 392,
	"./nb.js": 392,
	"./ne": 393,
	"./ne.js": 393,
	"./nl": 394,
	"./nl-be": 395,
	"./nl-be.js": 395,
	"./nl.js": 394,
	"./nn": 396,
	"./nn.js": 396,
	"./pa-in": 397,
	"./pa-in.js": 397,
	"./pl": 398,
	"./pl.js": 398,
	"./pt": 399,
	"./pt-br": 400,
	"./pt-br.js": 400,
	"./pt.js": 399,
	"./ro": 401,
	"./ro.js": 401,
	"./ru": 402,
	"./ru.js": 402,
	"./sd": 403,
	"./sd.js": 403,
	"./se": 404,
	"./se.js": 404,
	"./si": 405,
	"./si.js": 405,
	"./sk": 406,
	"./sk.js": 406,
	"./sl": 407,
	"./sl.js": 407,
	"./sq": 408,
	"./sq.js": 408,
	"./sr": 409,
	"./sr-cyrl": 410,
	"./sr-cyrl.js": 410,
	"./sr.js": 409,
	"./ss": 411,
	"./ss.js": 411,
	"./sv": 412,
	"./sv.js": 412,
	"./sw": 413,
	"./sw.js": 413,
	"./ta": 414,
	"./ta.js": 414,
	"./te": 415,
	"./te.js": 415,
	"./tet": 416,
	"./tet.js": 416,
	"./tg": 417,
	"./tg.js": 417,
	"./th": 418,
	"./th.js": 418,
	"./tl-ph": 419,
	"./tl-ph.js": 419,
	"./tlh": 420,
	"./tlh.js": 420,
	"./tr": 421,
	"./tr.js": 421,
	"./tzl": 422,
	"./tzl.js": 422,
	"./tzm": 423,
	"./tzm-latn": 424,
	"./tzm-latn.js": 424,
	"./tzm.js": 423,
	"./ug-cn": 425,
	"./ug-cn.js": 425,
	"./uk": 426,
	"./uk.js": 426,
	"./ur": 427,
	"./ur.js": 427,
	"./uz": 428,
	"./uz-latn": 429,
	"./uz-latn.js": 429,
	"./uz.js": 428,
	"./vi": 430,
	"./vi.js": 430,
	"./x-pseudo": 431,
	"./x-pseudo.js": 431,
	"./yo": 432,
	"./yo.js": 432,
	"./zh-cn": 433,
	"./zh-cn.js": 433,
	"./zh-hk": 434,
	"./zh-hk.js": 434,
	"./zh-tw": 435,
	"./zh-tw.js": 435
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 619;

/***/ })

},[485]);
//# sourceMappingURL=main.js.map