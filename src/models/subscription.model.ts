interface SubscriptionProperties {
  id: string; // identifiant unique nanoid
  userId: string; // identifiant de l'utilisateur qui souscrit
  planId: string; // identifiant du plan souscrit
  status: "active" | "paused" | "cancelled" | "expired"; // statut de la souscription
  startDate: Date; // date de début de la souscription
  endDate?: Date; // date de fin (optionnelle si active)
  cancelDate?: Date; // date d'annulation si cancel
  createdAt?: Date; // date de création en base
  updatedAt?: Date; // date de mise à jour en base
}

export type Subscription = SubscriptionProperties | undefined | null;
