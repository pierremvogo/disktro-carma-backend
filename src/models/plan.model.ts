interface PlanProperties {
  id: string; // identifiant unique nanoid
  name: string; // nom du plan (ex: Basic, Pro, Premium)
  description?: string; // description optionnelle
  price: number; // prix en unité monétaire (ex: euros)
  billingCycle: "monthly" | "yearly" | string; // cycle de facturation
  createdAt: Date; // date de création
  updatedAt: Date;
}

export type Plan = PlanProperties | undefined | null;
