import { Badge } from "shadcn-solid-components/components/badge"
import { Button } from "shadcn-solid-components/components/button"
import { ProfileHeader } from "shadcn-solid-components/hoc/profile-header"

const ProfileHeaderDemo = () => {
  return (
    <ProfileHeader
      avatar="https://i.pravatar.cc/150?u=jane"
      initials="JD"
      name="Jane Doe"
      subtitle="Senior Product Designer"
      bio="Passionate designer with 8+ years of experience building user-centred products."
      badge={<Badge variant="secondary">Pro</Badge>}
      stats={[
        { label: "Followers", value: "1.2k" },
        { label: "Projects", value: 42 },
        { label: "Likes", value: "8.6k" },
      ]}
      actions={<Button size="sm">Edit Profile</Button>}
      tabs={[
        { id: "posts", label: "Posts", body: <div class="py-6 text-sm text-muted-foreground">Posts content goes here.</div> },
        { id: "about", label: "About", body: <div class="py-6 text-sm text-muted-foreground">About content goes here.</div> },
      ]}
    />
  )
}

export default ProfileHeaderDemo
