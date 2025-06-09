interface TransactionProperties {
  id: string; // identifiant unique (nanoid ou UUID)
  userId: string; // identifiant du user lié à la transaction
  subscriptionId?: string; // identifiant de l'abonnement si applicable
  amount: number; // montant de la transaction en unité monétaire (ex: euros)
  status: "pending" | "succeeded" | "failed"; // statut de la transaction
  createdAt: Date; // date de création de la transaction
  updatedAt: Date; // date de mise à jour
}
export type Transaction = TransactionProperties | undefined | null;
