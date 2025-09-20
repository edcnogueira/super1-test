export class ProductNotFoundError extends Error {
  readonly code = "product_not_found" as const;
  constructor(public readonly productId: string) {
    super(`Product not found: ${productId}`);
    this.name = "ProductNotFoundError";
  }
}

export class ProductConflictError extends Error {
  readonly code = "product_conflict" as const;
  constructor(message = "Product conflict") {
    super(message);
    this.name = "ProductConflictError";
  }
}
