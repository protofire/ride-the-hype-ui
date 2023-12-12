import type { TypeOf } from 'zod'
import type { Insc20Schema } from './validators'

export type Insc20 = TypeOf<typeof Insc20Schema>
