import {z} from 'zod';export const contactSchema=z.object({email:z.string().email().max(320),message:z.string().min(10).max(3000)});
