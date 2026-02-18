import { createSignal, type Component } from 'solid-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import {
  Breadcrumbs,
  BreadcrumbList,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsSeparator,
} from '@/components/breadcrumbs'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarCheckboxItem,
  MenubarGroup,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarGroupLabel,
} from '@/components/menubar'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationItemLabel,
  NavigationItemDescription,
  NavigationMenuPortal,
} from '@/components/navigation-menu'
import { NavMenu } from '@/hoc/navigation-menu'
import {
  Pagination,
  PaginationItems,
  PaginationItem,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from '@/components/pagination'
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemInput,
  SegmentedControlItemLabel,
  SegmentedControlIndicator,
  SegmentedControlList,
  SegmentedControlItems,
} from '@/components/segmented-control'
import { PageLayout } from '../components/PageLayout'

const NavigationPage: Component = () => {
  const [showBookmarks, setShowBookmarks] = createSignal(true)
  const [showUrls, setShowUrls] = createSignal(false)

  return (
    <PageLayout
      title="Navigation"
      description="Navigation components: Breadcrumbs, Menubar, NavigationMenu, Pagination, SegmentedControl."
    >
      {/* Breadcrumbs */}
      <Card>
        <CardHeader>
          <CardTitle>Breadcrumbs</CardTitle>
          <CardDescription>Hierarchical path navigation.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <Breadcrumbs>
            <BreadcrumbList>
              <BreadcrumbsItem>
                <BreadcrumbsLink href="#">Home</BreadcrumbsLink>
              </BreadcrumbsItem>
              <BreadcrumbsSeparator />
              <BreadcrumbsItem>
                <BreadcrumbsLink href="#">Components</BreadcrumbsLink>
              </BreadcrumbsItem>
              <BreadcrumbsSeparator />
              <BreadcrumbsItem>
                <BreadcrumbsLink current>Breadcrumbs</BreadcrumbsLink>
              </BreadcrumbsItem>
            </BreadcrumbList>
          </Breadcrumbs>
        </CardContent>
      </Card>

      {/* Menubar */}
      <Card>
        <CardHeader>
          <CardTitle>Menubar</CardTitle>
          <CardDescription>
            Application menu bar with menus, submenus, checkboxes, and radios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  New Window <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Print <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Find</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Search the web</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Find...</MenubarItem>
                    <MenubarItem>Find Next</MenubarItem>
                    <MenubarItem>Find Previous</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>Cut</MenubarItem>
                <MenubarItem>Copy</MenubarItem>
                <MenubarItem>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem checked={showBookmarks()} onChange={setShowBookmarks}>
                  Show Bookmarks <MenubarShortcut>⌘B</MenubarShortcut>
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked={showUrls()} onChange={setShowUrls}>
                  Show Full URLs
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarGroupLabel>Zoom</MenubarGroupLabel>
                  <MenubarRadioGroup>
                    <MenubarRadioItem value="100">100%</MenubarRadioItem>
                    <MenubarRadioItem value="125">125%</MenubarRadioItem>
                    <MenubarRadioItem value="150">150%</MenubarRadioItem>
                  </MenubarRadioGroup>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </CardContent>
      </Card>

      {/* NavigationMenu */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu</CardTitle>
          <CardDescription>Top-level navigation with dropdown panels.</CardDescription>
        </CardHeader>
        <CardContent>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuPortal>
                <NavigationMenuContent class="grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-2">
                  <NavigationMenuItem>
                    <NavigationItemLabel>Introduction</NavigationItemLabel>
                    <NavigationItemDescription>
                      Re-usable components built using Kobalte and Tailwind CSS.
                    </NavigationItemDescription>
                  </NavigationMenuItem>
                </NavigationMenuContent>
              </NavigationMenuPortal>
            </NavigationMenuList>
            <NavigationMenuList>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuPortal>
                <NavigationMenuContent class="grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-2">
                  <a
                    href="#"
                    class="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <NavigationMenuItem>
                      <NavigationItemLabel>Alert Dialog</NavigationItemLabel>
                      <NavigationItemDescription>
                        A modal dialog that interrupts the user.
                      </NavigationItemDescription>
                    </NavigationMenuItem>
                  </a>
                  <a
                    href="#"
                    class="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <NavigationMenuItem>
                      <NavigationItemLabel>Hover Card</NavigationItemLabel>
                      <NavigationItemDescription>
                        For sighted users to preview content behind a link.
                      </NavigationItemDescription>
                    </NavigationMenuItem>
                  </a>
                </NavigationMenuContent>
              </NavigationMenuPortal>
            </NavigationMenuList>
          </NavigationMenu>
        </CardContent>
      </Card>

      {/* NavigationMenu HOC (Config-driven) */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu (Config-driven)</CardTitle>
          <CardDescription>
            Same result via a simple config object using the NavMenu HOC.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-6">
          <NavMenu
            menus={[
              {
                trigger: 'Getting Started',
                featured: {
                  label: 'shadcn-solid',
                  description:
                    'Beautifully designed components built with Kobalte and Tailwind CSS.',
                  href: '#',
                },
                items: [
                  {
                    label: 'Introduction',
                    description: 'Re-usable components built using Kobalte and Tailwind CSS.',
                    href: '#',
                  },
                  {
                    label: 'Installation',
                    description: 'How to install dependencies and structure your app.',
                    href: '#',
                  },
                  {
                    label: 'Typography',
                    description: 'Styles for headings, paragraphs, lists...etc.',
                    href: '#',
                  },
                ],
              },
              {
                trigger: 'Components',
                items: [
                  {
                    label: 'Alert Dialog',
                    description: 'A modal dialog that interrupts the user.',
                    href: '#',
                  },
                  {
                    label: 'Hover Card',
                    description: 'For sighted users to preview content behind a link.',
                    href: '#',
                  },
                  {
                    label: 'Progress',
                    description: 'Displays an indicator showing the completion progress of a task.',
                    href: '#',
                  },
                  {
                    label: 'Tooltip',
                    description: 'A popup that displays information related to an element.',
                    href: '#',
                  },
                ],
              },
              { trigger: 'GitHub', href: 'https://github.com' },
            ]}
          />

          <NavMenu
            orientation="vertical"
            menus={[
              {
                trigger: 'Getting Started',
                items: [
                  {
                    label: 'Introduction',
                    description: 'Re-usable components built using Kobalte and Tailwind CSS.',
                    href: '#',
                  },
                ],
              },
              {
                trigger: 'Components',
                items: [
                  {
                    label: 'Alert Dialog',
                    description: 'A modal dialog that interrupts the user.',
                    href: '#',
                  },
                  {
                    label: 'Hover Card',
                    description: 'For sighted users to preview content behind a link.',
                    href: '#',
                  },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Pagination */}
        <Card>
          <CardHeader>
            <CardTitle>Pagination</CardTitle>
            <CardDescription>Page number navigation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Pagination
              count={20}
              fixedItems
              itemComponent={props => (
                <PaginationItem page={props.page}>{props.page}</PaginationItem>
              )}
              ellipsisComponent={() => <PaginationEllipsis />}
            >
              <PaginationPrevious />
              <PaginationItems />
              <PaginationNext />
            </Pagination>
          </CardContent>
        </Card>

        {/* SegmentedControl */}
        <Card>
          <CardHeader>
            <CardTitle>Segmented Control</CardTitle>
            <CardDescription>Option group toggle selector.</CardDescription>
          </CardHeader>
          <CardContent>
            <SegmentedControl defaultValue="week">
              <SegmentedControlList>
                <SegmentedControlIndicator />
                <SegmentedControlItems>
                  <SegmentedControlItem value="day">
                    <SegmentedControlItemInput />
                    <SegmentedControlItemLabel>Day</SegmentedControlItemLabel>
                  </SegmentedControlItem>
                  <SegmentedControlItem value="week">
                    <SegmentedControlItemInput />
                    <SegmentedControlItemLabel>Week</SegmentedControlItemLabel>
                  </SegmentedControlItem>
                  <SegmentedControlItem value="month">
                    <SegmentedControlItemInput />
                    <SegmentedControlItemLabel>Month</SegmentedControlItemLabel>
                  </SegmentedControlItem>
                  <SegmentedControlItem value="year">
                    <SegmentedControlItemInput />
                    <SegmentedControlItemLabel>Year</SegmentedControlItemLabel>
                  </SegmentedControlItem>
                </SegmentedControlItems>
              </SegmentedControlList>
            </SegmentedControl>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default NavigationPage
