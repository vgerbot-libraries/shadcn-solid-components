import { SettingsLayout } from "shadcn-solid-components/hoc/settings-layout"

const sections = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
]

const SettingsLayoutDemo = () => {
  return (
    <div class="border rounded-lg overflow-hidden h-[360px] relative">
      <SettingsLayout
        sections={sections}
        defaultActiveSection="profile"
        hideSidebar={false}
      >
        {{
          profile: (
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">Profile</h3>
              <p class="text-sm text-muted-foreground">Manage your public profile information.</p>
            </div>
          ),
          security: (
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">Security</h3>
              <p class="text-sm text-muted-foreground">Update your password and two-factor settings.</p>
            </div>
          ),
          notifications: (
            <div class="space-y-2">
              <h3 class="text-lg font-semibold">Notifications</h3>
              <p class="text-sm text-muted-foreground">Configure email and push notification preferences.</p>
            </div>
          ),
        }}
      </SettingsLayout>
    </div>
  )
}

export default SettingsLayoutDemo
