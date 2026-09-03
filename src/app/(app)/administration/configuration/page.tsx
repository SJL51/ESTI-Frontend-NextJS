import { ModuleLandingPage } from "@/components/sms/ModuleLandingPage"

export default function ConfigurationPage() {
  return (
    <ModuleLandingPage
      title="Configuration"
      subtitle="System preferences, integration settings, and administrative controls."
      badgeLabel="Setting"
      screens={[]}
      emptyMessage="No configuration screens yet — check back as this module is built out."
    />
  )
}
