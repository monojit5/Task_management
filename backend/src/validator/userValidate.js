import {email, string, z} from 'zod';

export const registerSchema = z.object({
    name:string().max(20).min(3),
    email:string().email(),
    password:string().max(10).min(6)
});

 export const loginSchema = z.object({
    email:string().email(),
    password:string().max(10).min(6)
});
