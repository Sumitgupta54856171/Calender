import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../../components/ui/sidebar"
import { Link } from "react-router"
import { ArrowBigRight, CalendarDays, DollarSign, PlusCircle } from "lucide-react"

export function AppSidebar({ header }: { header?: string }) {
  return (
    <Sidebar className="bg-slate-950 text-slate-100">
      <SidebarHeader className="border-b border-white/10 px-4 py-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tutor Scheduler</p>
          <h2 className="text-lg font-semibold leading-tight">
            {header || "Dashboard"}
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="space-y-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="rounded-2xl">
                <Link
                  to="/"
                  className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
                >
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-300" />
                    Dashboard
                  </span>
                  <ArrowBigRight className="h-4 w-4 text-slate-400" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="rounded-2xl">
                <Link
                  to="/Adjustment"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
                >
                  <DollarSign className="h-4 w-4 text-slate-300" />
                  Adjustment
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="rounded-2xl">
                <Link
                  to="/Bills"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
                >
                  <DollarSign className="h-4 w-4 text-slate-300" />
                  Bills
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="mx-2" />

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="rounded-2xl bg-slate-900/95 text-slate-100 hover:bg-slate-800">
                <Link
                  to="/Session"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold"
                >
                  <PlusCircle className="h-4 w-4 text-slate-300" />
                  New Session
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-white/10 px-4 py-4 text-xs text-slate-500">
        <div className="space-y-1">
          <p>Quick links for your schedule.</p>
          <p className="text-slate-400">Open the sidebar from mobile to access navigation.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}