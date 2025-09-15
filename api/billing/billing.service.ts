import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { PrismaService } from '../common/prisma.service'

type Plan = 'BASIC'|'PRO'|'ENTERPRISE'

function priceIdFromEnv(plan: Plan){
  const map: Record<Plan, string|undefined> = {
    BASIC: process.env.STRIPE_PRICE_BASIC,
    PRO: process.env.STRIPE_PRICE_PRO,
    ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE,
  }
  const id = map[plan]
  if(!id) throw new Error(`Missing Stripe price for plan ${plan}`)
  return id
}

@Injectable()
export class BillingService {
  // Deixe o SDK v18 usar a API version "pinned" por ele mesmo (compatível com a política atual da Stripe).
  // https://docs.stripe.com/api/versioning
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  constructor(private prisma: PrismaService){}

  async createCheckout(orgId: string, plan: Plan, successUrl: string, cancelUrl: string){
    const org = await this.prisma.org.findUnique({ where: { id: orgId } })
    if(!org) throw new Error('Org not found')

    const priceId = priceIdFromEnv(plan)

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: org.stripeCustomerId || undefined,
      metadata: { orgId, plan },
      allow_promotion_codes: true,
    })
    return { url: session.url }
  }

  async createPortal(orgId: string, returnUrl: string){
    const org = await this.prisma.org.findUnique({ where: { id: orgId } })
    if(!org?.stripeCustomerId) throw new Error('No Stripe customer for this org')
    const portal = await this.stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: returnUrl,
    })
    return { url: portal.url }
  }

  async handleWebhook(sig: string|undefined, rawBody: Buffer){
    if(!sig) throw new Error('Missing Stripe signature')
    const secret = process.env.STRIPE_WEBHOOK_SECRET!
    const event = this.stripe.webhooks.constructEvent(rawBody, sig, secret)

    switch(event.type){
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session
        const orgId = (s.metadata?.orgId as string) || ''
        const plan = (s.metadata?.plan as any) || 'BASIC'
        const subscriptionId = s.subscription as string
        const customerId = s.customer as string
        if(!orgId) break

        await this.prisma.org.update({
          where: { id: orgId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            plan: plan,
            planStatus: 'active',
          }
        })
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        await this.prisma.org.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: sub.id,
            planStatus: sub.status,
            currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null
          }
        })
        break
      }
    }
    return { received: true }
  }
}
