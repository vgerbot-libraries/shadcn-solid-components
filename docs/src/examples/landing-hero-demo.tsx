import { Button } from "shadcn-solid-components/components/button"
import { LandingHero } from "shadcn-solid-components/components/landing-hero"

const LandingHeroDemo = () => {
  return (
    <div class="overflow-hidden rounded-lg border">
      <LandingHero
        brand={{ title: "Acme Cloud", href: "#" }}
        navItems={[
          { label: "Features", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "Docs", href: "#" },
        ]}
        primaryActions={<Button size="sm">Get Started</Button>}
        secondaryActions={<Button size="sm" variant="ghost">Sign In</Button>}
        closeOnSelect
      />
    </div>
  )
}

export default LandingHeroDemo
