// Generic sample data shared by every shot: a toy shop, amounts in cents, example.com hosts.
export const SHOP = {
  id: "7d0c1a52-3b8e-4f7a-9a64-2f1e5c8b9d01",
  companyName: "Toy Corner",
  email: "owner@toycorner.example.com",
  createdAt: "2026-09-14T09:12:00Z",
};

export const MERCHANT_SESSION = { "GET /api/v1/session": { admin: false, merchantRole: "ADMIN" } };
export const ADMIN_SESSION = { "GET /api/v1/session": { admin: true } };
