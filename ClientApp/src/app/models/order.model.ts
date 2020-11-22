import { Injectable } from "@angular/core";
import { Cart } from "./cart.model";
import { Repository } from "./repository";
import { Router, NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";

type OrderSession = {
  name: string,
  address: string,
  cardNumber: string|null,
  cardExpiry: string | null ,
  cardSecurityCode: string | null
}

@Injectable()
export class Order {
  orderId: number;
  name: string|null;
  address: string|null;
  payment: Payment|null = new Payment();

  submitted: boolean = false;
  shipped: boolean = false;
  orderConfirmation: OrderConfirmation;

  constructor(private repo: Repository, public cart: Cart, router: Router) {
    router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        if (router.url.startsWith("/checkout") && this.name != null && this.address != null) {
          repo.storeSessionData<OrderSession>("checkout", {
            name: this.name,
            address: this.address,
            cardNumber: this.payment?.cardNumber||null,
            cardExpiry: this.payment?.cardExpiry||null,
            cardSecurityCode: this.payment?.cardSecurityCode||null
          })
        }
      });

    repo.getSessionData<OrderSession>("checkout")
      .subscribe(data => {
        if (data != null) {
          this.name = data.name;
          this.address = data.address;
          if (this.payment != null) {
            this.payment.cardNumber = data.cardNumber;
            this.payment.cardExpiry = data.cardExpiry;
            this.payment.cardSecurityCode = data.cardSecurityCode;
          }
        }
      });
  }

  get products(): CartLine[] {
    return this.cart.selections
      .map((p) => {
        if (p.productId == null) { throw "Product id is null";}
        return new CartLine(p.productId, p.quantity)
      });
  }

  clear() {
    this.name = null;
    this.address = null;
    this.payment = null;
    this.cart.clear();
    this.submitted = false;
  }

  submit() {
    this.submitted = true;
    this.repo.createOrder(this);
  }
}

export class Payment {
  cardNumber: string|null;
  cardExpiry: string|null;
  cardSecurityCode: string | null;
  total: number = 0;
}

export class CartLine {
  constructor(private productId: number, private quantity: number) { }
}

export class OrderConfirmation {
  constructor(public orderId: number, public authCode: string, public amount: number) {}
}
