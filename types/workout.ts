export interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface Workout {
  title: string;
  difficulty: string;
  duration: number;
  exercises: Exercise[];
} 