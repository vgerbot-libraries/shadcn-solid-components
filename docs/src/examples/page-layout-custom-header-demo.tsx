import { PageLayout, PageLayoutHeader } from "shadcn-solid-components/components/page-layout"

const PageLayoutCustomHeaderDemo = () => {
  return (
    <div class="h-[320px] overflow-hidden rounded-lg border">
      <PageLayout
        header={
          <PageLayoutHeader fixed={false}>
            <div class="flex w-full items-center justify-between gap-3">
              <div>
                <p class="text-xs text-muted-foreground">Project</p>
                <p class="text-sm font-semibold">Mobile Redesign</p>
              </div>
              <span class="rounded-md border px-2 py-1 text-xs">In Progress</span>
            </div>
          </PageLayoutHeader>
        }
      >
        <div class="space-y-3 text-sm text-muted-foreground">
          <p>Use the children escape hatch to fully control header markup.</p>
          <p>Set fixed=false when header should scroll with content.</p>
          <p>
            This keeps layout behavior predictable while allowing custom branded
            header structures.
          </p>
        </div>
      </PageLayout>
    </div>
  )
}

export default PageLayoutCustomHeaderDemo
