// api/types/passport-jwt.d.ts
declare module 'passport-jwt' {
  export const ExtractJwt: any
  export class Strategy {
    constructor(options: any, verify: (payload: any, done: (err: any, user?: any) => void) => void)
    name: string
    authenticate: (req: any, options?: any) => void
  }
}
