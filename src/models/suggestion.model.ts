interface SuggestionProperties {
  id: string;
  email: string;
  song: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Suggestion = SuggestionProperties | undefined | null;
