import { Button } from "shadcn-solid-components/components/button"
import { LandingHero } from "shadcn-solid-components/components/landing-hero"

const LandingHeroMenuDemo = () => {
  return (
    <div class="overflow-hidden rounded-lg border">
      <LandingHero
        brand={{ title: "Nova Studio", href: "#" }}
        navItems={[
          {
            label: "Products",
            children: [
              { label: "Analytics", href: "#" },
              { label: "Automation", href: "#" },
              { label: "Integrations", href: "#" },
            ],
          },
          { label: "Templates", href: "#" },
          {
            label: "Company",
            children: [
              { label: "About", href: "#" },
              { label: "Careers", href: "#" },
            ],
          },
        ]}
        primaryActions={<Button size="sm">Start Free</Button>}
        secondaryActions={<Button size="sm" variant="outline">Book Demo</Button>}
        mobileBreakpoint="xl"
      />
    </div>
  )
}

export default LandingHeroMenuDemo
