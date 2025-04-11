import { Exercise, Workout } from '../types/workout';
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("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");

export async function generateWorkout(
  prompt: string,
  difficulty: string,
  duration: number
): Promise<Workout> {
  try {
    const systemPrompt = `<task>Generate a basketball workout plan</task>
<parameters>
- Goal: ${prompt}
- Difficulty: ${difficulty}
- Duration: ${duration} minutes
</parameters>
<output_format>
Return ONLY a JSON object with this structure, no other text:
{
  "title": "Workout title",
  "difficulty": "${difficulty}",
  "duration": ${duration},
  "exercises": [
    {
      "name": "Exercise name",
      "description": "Detailed description",
      "sets": 3,
      "reps": "10",
      "rest": "60 seconds"
    }
  ]
}
</output_format>`;

    console.log('Sending request to Hugging Face API...');
    
    const response = await client.textGeneration({
      model: "meta-llama/Llama-2-70b-chat-hf",
      inputs: systemPrompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false
      }
    });

    console.log('Raw API Response:', response.generated_text);

    if (!response || !response.generated_text) {
      throw new Error('Empty response from API');
    }

    let workoutData;
    try {
      // Clean and prepare the response text
      const cleanedText = response.generated_text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/\n/g, ' ')
        .replace(/.*?(\{.*\}).*/, '$1') // Extract only the JSON part
        .trim();
      
      console.log('Cleaned text:', cleanedText);
      workoutData = JSON.parse(cleanedText);
    } catch (error: any) {
      console.error('Parse error:', error);
      console.error('Response text:', response.generated_text);
      throw new Error(`Failed to parse workout data: ${error.message}`);
    }

    // Validate the workout data structure
    if (!workoutData.title) {
      throw new Error('Missing workout title');
    }
    if (!workoutData.exercises || !Array.isArray(workoutData.exercises)) {
      throw new Error('Missing or invalid exercises array');
    }
    if (workoutData.exercises.length === 0) {
      throw new Error('No exercises provided in the workout');
    }

    // Validate each exercise
    workoutData.exercises.forEach((exercise: Exercise, index: number) => {
      if (!exercise.name) {
        throw new Error(`Missing name for exercise ${index + 1}`);
      }
      if (!exercise.description) {
        throw new Error(`Missing description for exercise ${index + 1}`);
      }
    });

    return {
      title: workoutData.title,
      difficulty: workoutData.difficulty || difficulty,
      duration: workoutData.duration || duration,
      exercises: workoutData.exercises.map((exercise: Exercise) => ({
        name: exercise.name,
        description: exercise.description,
        sets: exercise.sets || 3,
        reps: exercise.reps || '10',
        rest: exercise.rest || '60 seconds',
      })),
    };
  } catch (error) {
    console.error('Error generating workout:', error);
    throw error;
  }
} 