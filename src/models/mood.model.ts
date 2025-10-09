interface MoodProperties {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Mood = MoodProperties | undefined | null;
