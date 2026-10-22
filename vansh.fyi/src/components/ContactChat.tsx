'use client'

import { TRPCProvider } from '../services/trpc'
import LeadGenChat from './LeadGenChat'

export default function ContactChat() {
  return (
    <TRPCProvider>
      <LeadGenChat />
    </TRPCProvider>
  )
}
