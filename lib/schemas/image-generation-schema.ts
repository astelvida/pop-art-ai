import { z } from 'zod'
import inputData from '@/lib/data/input.json'

type InputDataType = {
  [key: string]: {
    type: 'string' | 'integer' | 'number' | 'boolean'
    enum?: string[]
    minimum?: number
    maximum?: number
  }
}

const createSchemaFromInput = (input: InputDataType) => {
  const schemaObject: Record<string, z.ZodType> = {}

  for (const [key, value] of Object.entries(input)) {
    switch (value.type) {
      case 'string':
        schemaObject[key] = value.enum ? z.enum(value.enum as [string, ...string[]]) : z.string()
        break
      case 'integer':
        schemaObject[key] = z.number().int()
        if (value.minimum !== undefined) schemaObject[key] = schemaObject[key].min(value.minimum)
        if (value.maximum !== undefined) schemaObject[key] = schemaObject[key].max(value.maximum)
        break
      case 'number':
        schemaObject[key] = z.number()
        if (value.minimum !== undefined) schemaObject[key] = schemaObject[key].min(value.minimum)
        if (value.maximum !== undefined) schemaObject[key] = schemaObject[key].max(value.maximum)
        break
      case 'boolean':
        schemaObject[key] = z.boolean()
        break
      default:
        console.warn(`Unsupported type: ${value.type} for key: ${key}`)
        schemaObject[key] = z.any()
    }
  }

  return z.object(schemaObject)
}

export const imageGenerationSchema = createSchemaFromInput(inputData as InputDataType)
export type ImageGenerationSettings = z.infer<typeof imageGenerationSchema>

// Validate the schema creation
const validationResult = imageGenerationSchema.safeParse({})
if (!validationResult.success) {
  console.error('Schema validation failed:', validationResult.error)
}
