import type { TypeOf } from 'zod'
import type { InscriptionSchema } from './validators'

export type Inscription = TypeOf<typeof InscriptionSchema>
