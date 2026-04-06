import { ColorModeProvider } from "@kobalte/core"

import { UserMenu } from "shadcn-solid-components/hoc/user-menu"

const UserMenuDemo = () => {
  return (
    <ColorModeProvider>
      <div class="flex justify-end">
        <UserMenu
          name="Jane Doe"
          email="jane@example.com"
          groups={[
            {
              items: [
                { label: "Profile", onSelect: () => {} },
                { label: "Delete account", variant: "destructive", onSelect: () => {} },
              ],
            },
          ]}
          onSignOut={() => {}}
        />
      </div>
    </ColorModeProvider>
  )
}

export default UserMenuDemo
