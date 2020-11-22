import { Component } from "@angular/core";
import { NavigationService } from '../models/navigation.service';

@Component({
  selector: "store-pagination",
  templateUrl: "pagination.component.html"
})
export class PaginationComponent {
  constructor(public navigation: NavigationService) { }

  get pages(): number[] {
    if (this.navigation.productsCount > 0) {
      return Array(Math.ceil(this.navigation.productsCount / this.navigation.productsPerPage))
        .fill(0).map((x, i) => i + 1);
    } else {
      return [];
    }
  }

}
