import Stripe from 'stripe'
import fs from 'fs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Faltou STRIPE_SECRET_KEY')
  process.exit(1)
}

async function upsertProduct(name: string, metadata: Record<string,string>){
  const products = await stripe.products.list({ active: true, limit: 100 })
  const found = products.data.find(p => p.name === name)
  if (found) return found
  return await stripe.products.create({ name, metadata })
}

async function upsertMonthlyPriceBRL(productId: string, lookup_key: string, unit_amount: number){
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 100 })
  const found = prices.data.find(p => p.lookup_key === lookup_key && p.recurring?.interval === 'month' && p.currency === 'brl')
  if (found) return found
  return await stripe.prices.create({
    currency: 'brl',
    unit_amount,
    product: productId,
    recurring: { interval: 'month' },
    lookup_key
  })
}

async function main(){
  const basic = await upsertProduct('DevOps Pipeline Auditor — Basic', { plan: 'BASIC' })
  const pro   = await upsertProduct('DevOps Pipeline Auditor — Pro',   { plan: 'PRO' })
  const ent   = await upsertProduct('DevOps Pipeline Auditor — Enterprise', { plan: 'ENTERPRISE' })

  const pBasic = await upsertMonthlyPriceBRL(basic.id, 'dpa_basic_monthly_brl', 4900)
  const pPro   = await upsertMonthlyPriceBRL(pro.id,   'dpa_pro_monthly_brl',   19900)
  const pEnt   = await upsertMonthlyPriceBRL(ent.id,   'dpa_enterprise_monthly_brl', 99900)

  const envBlock = [
    `STRIPE_PRICE_BASIC=${pBasic.id}`,
    `STRIPE_PRICE_PRO=${pPro.id}`,
    `STRIPE_PRICE_ENTERPRISE=${pEnt.id}`
  ].join('\n')

  console.log('\nCole no api/.env:')
  console.log(envBlock)

  if (process.env.WRITE_ENV === '1'){
    try{
      fs.appendFileSync('./.env', `\n# --- stripe seed ---\n${envBlock}\n`)
      console.log('\n(gravado em api/.env)')
    }catch(e){ console.warn('não consegui gravar em .env automaticamente:', e) }
  }
}

main().catch(e=>{ console.error(e); process.exit(1) })
