import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu
} from "../../components/ui/sidebar"
import { Link } from "react-router"
import { ArrowBigRight } from "lucide-react"


export function AppSidebar({header}) {
  return (
    <Sidebar>
      <SidebarHeader>{header}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="m-10">
         <SidebarMenu>
           <span className="flex flex-row">
            <Link to="/"><span>Dashboard</span> <ArrowBigRight></ArrowBigRight></Link>
           </span>
           <span>
            <Link to="/Adjustment">Adjustment</Link>
           </span>
           <span>
            <Link to="/Bill">Bill</Link>
           </span>
         </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup >
          <SidebarMenu>
            <Link to="/Session">New Session</Link>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}