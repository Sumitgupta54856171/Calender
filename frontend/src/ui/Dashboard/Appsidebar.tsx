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
    <Sidebar className="bg-white text-gray-900 border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 px-4 py-5 bg-gray-50">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Tutor Scheduler</p>
          <h2 className="text-lg font-semibold leading-tight text-gray-900">
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
                  className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-600" />
                    Dashboard
                  </span>
                  <ArrowBigRight className="h-4 w-4 text-gray-500" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="rounded-2xl">
                <Link
                  to="/Adjustment"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                >
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  Adjustment
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="rounded-2xl">
                <Link
                  to="/Bills"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                >
                  <DollarSign className="h-4 w-4 text-gray-600" />
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
              <SidebarMenuButton asChild className="rounded-2xl bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200">
                <Link
                  to="/Session"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold"
                >
                  <PlusCircle className="h-4 w-4 text-blue-600" />
                  New Session
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-gray-200 px-4 py-4 text-xs text-gray-500 bg-gray-50">
        <div className="space-y-1">
          <p>Quick links for your schedule.</p>
          <p className="text-gray-400">Open the sidebar from mobile to access navigation.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}