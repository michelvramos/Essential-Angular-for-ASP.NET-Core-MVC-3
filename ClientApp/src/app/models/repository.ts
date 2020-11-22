import { Product } from "./product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Filter, Pagination } from "./configClasses.repository";
import { Supplier } from "./supplier.model";
import { Observable } from 'rxjs';
import { Order, OrderConfirmation } from "./order.model";

const productsUrl = "/api/products";
const supplierUrl = "/api/suppliers";
const sessionUrl = "/api/session";
const ordersUrl = "/api/orders";

type productsMetadata = {
  data: Product[],
  categories: string[]
}

@Injectable()
export class Repository {

  product: Product;
  products: Product[];
  suppliers: Supplier[] = [];
  filter: Filter = new Filter();
  categories: string[] = [];
  paginationObject = new Pagination();
  orders: Order[] = [];

  constructor(private http: HttpClient) {
    this.filter.related = true;
    //this.getProducts();
  }

  getProduct(id: number) {
    this.http.get<Product>(`${productsUrl}/${id}`)
      .subscribe(p => this.product = p);
  }

  getProducts() {
    let url = `${productsUrl}?related=${this.filter.related}`;

    if (this.filter.category) {
      url += `&category=${this.filter.category}`;
    }

    if (this.filter.search) {
      url += `&search=${this.filter.search}`;
    }

    url += "&metadata=true";

    this.http.get<productsMetadata>(url).subscribe(md => {
      this.products = md.data;
      this.categories = md.categories;
        });
  }

  getSuppliers() {
    this.http.get<Supplier[]>(supplierUrl)
      .subscribe(s => this.suppliers = s);
  }

  CreateProduct(prod: Product) {
    let data = {
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      supplier: prod.supplier ? prod.supplier.supplierId : 0
    };

    this.http.post<number>(productsUrl, data)
      .subscribe(id => {
        prod.productId = id;
        this.products.push(prod);
      });
  }

  createProductAndSupplier(prod: Product, supp: Supplier) {
    let data = {
      name: supp.name,
      city: supp.city,
      state: supp.state
    };

    this.http.post<number>(supplierUrl, data)
      .subscribe(id => {
        supp.supplierId = id;
        prod.supplier = supp;
        this.suppliers.push(supp);

        if (prod != null) {
          this.CreateProduct(prod);
        }
      });
  }

  replaceProduct(prod: Product) {
    let data = {
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      supplier: prod.supplier ? prod.supplier.supplierId : 0
    };

    this.http.put(`${productsUrl}/${prod.productId}`, data)
      .subscribe(() => this.getProducts());
  }

  replaceSupplier(supp: Supplier) {
    let data = {
      name: supp.name,
      city: supp.city,
      state: supp.state
    };

    this.http.put(`${supplierUrl}/${supp.supplierId}`, data)
      .subscribe(() => this.getProducts());
  }

  updateProduct(id: number, changes: Map<string, any>) {
    let patch: any = [];
    changes.forEach((value, key) => patch.push({ op: "replace", path: key, value: value }));

    this.http.patch(`${productsUrl}/${id}`, patch)
      .subscribe(() => this.getProducts());
  }

  deleteProduct(id: number) {
    this.http.delete(`${productsUrl}/${id}`)
      .subscribe(() => this.getProducts());
  }

  deleteSupplier(id: number) {
    this.http.delete(`${supplierUrl}/${id}`)
      .subscribe(() => {
        this.getProducts();
        this.getSuppliers();
      })
  }

  storeSessionData<T>(dataType: string, data: T) {
    return this.http.post(`${sessionUrl}/${dataType}`,data)
      .subscribe(response => { });
  }

  getSessionData<T>(dataType: string): Observable<T> {
    return this.http.get<T>(`${sessionUrl}/${dataType}`);
  }

  getOrders() {
    this.http.get<Order[]>(ordersUrl)
      .subscribe(data => this.orders = data);
  }

  createOrder(order: Order) {
    this.http.post<OrderConfirmation>(ordersUrl, {
      name: order.name,
      address: order.address,
      payment: order.payment,
      products: order.products
    })
      .subscribe(data => {
        order.orderConfirmation = data;
        order.cart.clear();
        order.clear();
      });
  }

  shipOrder(order: Order) {
    this.http.post(`${ordersUrl}/${order.orderId}`, {})
      .subscribe(()=> this.getOrders());
  }
}
