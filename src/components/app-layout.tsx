
'use client';

import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  Bot,
  LayoutDashboard,
  LogOut,
  Settings,
  Monitor,
  Sun,
  Moon,
  Star,
  FileText,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useFavorites } from "@/hooks/use-favorites";
import { scripts, departments } from "@/lib/data";
import { cn } from "@/lib/utils";

const PwoLogo = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
        <rect width="24" height="24" rx="4" fill="hsl(var(--primary))"/>
        <path d="M8 8V16H10V12H12C14.2091 12 16 10.2091 16 8H8Z" fill="white"/>
    </svg>
  );

const ThemeAwareLogo = () => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        // Render a placeholder or nothing on the server to avoid hydration mismatch
        return <div className="h-[31px] w-[150px]" />; 
    }
    
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    const logoSrc = currentTheme === 'dark' ? '/pwo-logo-orange.png' : '/pwo-logo-schwarz.png';

    return (
        <Image
            src={logoSrc}
            alt="PWO Logo"
            width={150}
            height={31}
            className="group-data-[collapsible=icon]:hidden"
        />
    );
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { favoriteScriptIds, favoriteDepartmentIds, removeFavoriteScript, removeFavoriteDepartment } = useFavorites();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];
  
  const favoriteScripts = scripts.filter(s => favoriteScriptIds.includes(s.id));
  const favoriteDepartments = departments.filter(d => favoriteDepartmentIds.includes(d.id));

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <PwoLogo />
            <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">PWO Automation</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === '/dashboard' : true)} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          {(favoriteScripts.length > 0 || favoriteDepartments.length > 0) && (
            <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <Star /> <span>Favorites</span>
                </SidebarGroupLabel>
                <SidebarMenu>
                  {favoriteScripts.map(item => (
                      <SidebarMenuItem key={item.id}>
                           <SidebarMenuButton asChild variant="ghost" size="sm" tooltip={item.name} className="group/fav">
                               <Link href={`/departments/${item.departmentId}/scripts/${item.id}`}>
                                   <FileText />
                                   <span>{item.name}</span>
                                    <button 
                                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavoriteScript(item.id); }} 
                                     className="ml-auto h-5 w-5 opacity-0 group-hover/fav:opacity-100"
                                   >
                                     <X className="h-4 w-4"/>
                                   </button>
                               </Link>
                           </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))}
                  {favoriteDepartments.map(item => (
                      <SidebarMenuItem key={item.id}>
                           <SidebarMenuButton asChild variant="ghost" size="sm" tooltip={item.name} className="group/fav">
                               <Link href={`/departments/${item.id}`}>
                                   <LayoutDashboard />
                                   <span>{item.name}</span>
                                   <button 
                                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavoriteDepartment(item.id); }} 
                                     className="ml-auto h-5 w-5 opacity-0 group-hover/fav:opacity-100"
                                   >
                                     <X className="h-4 w-4"/>
                                   </button>
                               </Link>
                           </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))}
                </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter className="p-4">
             <a href="https://pwogroup.sharepoint.com/sites/CzechRepublic/SitePages/cs/DepartmentHome.aspx" target="_blank" rel="noopener noreferrer">
                <ThemeAwareLogo />
             </a>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end sm:px-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 md:hidden">
                <SidebarTrigger />
            </div>
            <UserMenu />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

function UserMenu() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 bg-primary">
                    <AvatarFallback className="bg-transparent text-primary-foreground text-lg font-semibold">V</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
                <p>Vojtěch Vybíral</p>
                <p className="text-xs font-normal text-muted-foreground">Admin</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Monitor className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AppLayout;
