export class Filter {
  category?: string|null;
  search?: string|null;
  related: boolean = false;

  reset() {
    this.category = this.search = null;
    this.related = false;
  }
}
