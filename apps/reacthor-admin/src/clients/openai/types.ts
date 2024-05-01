export interface OpenAIFinetuningJobs {
  object: string
  id: string
  model: string
  created_at: number
  finished_at: number
  fine_tuned_model: string
  organization_id: string
  result_files: string[]
  status: string
  validation_file: any
  training_file: string
  hyperparameters: Hyperparameters
  trained_tokens: number
  error: Error
  user_provided_suffix: any
  seed: number
  integrations: any[]
}

export interface Hyperparameters {
  n_epochs: number
  batch_size: number
  learning_rate_multiplier: number
}

export interface Error {
  error: any
}
