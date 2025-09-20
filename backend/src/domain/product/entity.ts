// Domain types for Product aggregate
export type Money = {
  amountCents: number;
  currency: string; // ISO 4217 code as uppercase string
};

export type Product = {
  id: string;
  name: string;
  price: Money;
  createdAt: Date;
  updatedAt: Date;
};

export function assertProductInvariants(p: Product): void {
  if (!p.name || p.name.trim().length === 0) throw new Error("Product name is required");
  if (!Number.isInteger(p.price.amountCents) || p.price.amountCents < 0)
    throw new Error("Product price must be a non-negative integer in cents");
  if (!/^[A-Z]{3}$/.test(p.price.currency)) throw new Error("Currency must be a 3-letter code");
}
