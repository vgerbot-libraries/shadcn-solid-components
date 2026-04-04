import { type Component, createSignal } from 'solid-js'
import { Alert, AlertDescription, AlertTitle } from 'shadcn-solid-components/components/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'shadcn-solid-components/components/alert-dialog'
import { Button } from 'shadcn-solid-components/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'shadcn-solid-components/components/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from 'shadcn-solid-components/components/command'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from 'shadcn-solid-components/components/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'shadcn-solid-components/components/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from 'shadcn-solid-components/components/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shadcn-solid-components/components/dropdown-menu'
import {
  IconAlertTriangle,
  IconCreditCard,
  IconMail,
  IconSettings,
  IconUser,
} from 'shadcn-solid-components/components/icons'
import { Popover, PopoverContent, PopoverTrigger } from 'shadcn-solid-components/components/popover'
import { TextField, TextFieldInput } from 'shadcn-solid-components/components/text-field'
import { PageLayout } from '../components/PageLayout'

const OverlayPage: Component = () => {
  return (
    <PageLayout
      title="Overlay & Feedback"
      description="Overlay components: Alert, AlertDialog, Dialog, Drawer, Popover, ContextMenu, DropdownMenu, Command."
    >
      {/* Alert */}
      <Card>
        <CardHeader>
          <CardTitle>Alert</CardTitle>
          <CardDescription>Static notification banners.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <Alert>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <IconAlertTriangle class="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* AlertDialog */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Dialog</CardTitle>
            <CardDescription>Modal confirmation dialog.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger as={Button} variant="outline">
                Delete Account
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and
                    remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
            <CardDescription>Modal dialog with custom content.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger as={Button}>Edit Profile</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div class="flex flex-col gap-4 py-4">
                  <TextField>
                    <TextFieldInput placeholder="Name" value="John Doe" />
                  </TextField>
                  <TextField>
                    <TextFieldInput placeholder="Username" value="@johndoe" />
                  </TextField>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Drawer */}
        <Card>
          <CardHeader>
            <CardTitle>Drawer</CardTitle>
            <CardDescription>Slide-out panel from the edge.</CardDescription>
          </CardHeader>
          <CardContent>
            <Drawer>
              <DrawerTrigger as={Button} variant="outline">
                Open Drawer
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerLabel>Move Goal</DrawerLabel>
                  <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                </DrawerHeader>
                <div class="p-4">
                  <div class="flex items-center justify-center text-6xl font-bold py-8">350</div>
                  <p class="text-center text-muted-foreground text-sm">calories per day</p>
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </CardContent>
        </Card>

        {/* Popover */}
        <Card>
          <CardHeader>
            <CardTitle>Popover</CardTitle>
            <CardDescription>Floating content panel on trigger.</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger as={Button} variant="outline">
                Open Popover
              </PopoverTrigger>
              <PopoverContent class="w-80">
                <div class="flex flex-col gap-2">
                  <h4 class="font-medium leading-none">Dimensions</h4>
                  <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                </div>
                <div class="grid gap-2 mt-4">
                  <div class="grid grid-cols-3 items-center gap-4">
                    <label class="text-sm">Width</label>
                    <TextField class="col-span-2">
                      <TextFieldInput value="100%" />
                    </TextField>
                  </div>
                  <div class="grid grid-cols-3 items-center gap-4">
                    <label class="text-sm">Height</label>
                    <TextField class="col-span-2">
                      <TextFieldInput value="25px" />
                    </TextField>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* ContextMenu */}
        <Card>
          <CardHeader>
            <CardTitle>Context Menu</CardTitle>
            <CardDescription>Right-click menu with actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContextMenu>
              <ContextMenuTrigger class="flex h-[100px] w-full items-center justify-center rounded-md border border-dashed text-sm">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent class="w-64">
                <ContextMenuItem>
                  Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuSub>
                  <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
                  <ContextMenuSubContent class="w-48">
                    <ContextMenuItem>
                      Save Page As... <ContextMenuShortcut>⌘S</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  View Page Source <ContextMenuShortcut>⌘U</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>Inspect</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </CardContent>
        </Card>

        {/* DropdownMenu */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown Menu</CardTitle>
            <CardDescription>Click-triggered menu with actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger as={Button} variant="outline">
                Open Menu
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56">
                <DropdownMenuItem>
                  <IconUser class="mr-2 size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCreditCard class="mr-2 size-4" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconSettings class="mr-2 size-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconMail class="mr-2 size-4" /> Messages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>

      {/* Command */}
      <Card>
        <CardHeader>
          <CardTitle>Command</CardTitle>
          <CardDescription>Command palette / search interface (inline demo).</CardDescription>
        </CardHeader>
        <CardContent>
          <Command class="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <IconMail class="mr-2 size-4" /> Mail
                </CommandItem>
                <CommandItem>
                  <IconUser class="mr-2 size-4" /> Profile
                </CommandItem>
                <CommandItem>
                  <IconSettings class="mr-2 size-4" /> Settings
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <IconUser class="mr-2 size-4" /> Account
                </CommandItem>
                <CommandItem>
                  <IconCreditCard class="mr-2 size-4" /> Billing
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default OverlayPage
