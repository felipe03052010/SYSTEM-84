import { build } from 'vite'
process.env.VITE_ACCESS_MODE='paid'
await build()
