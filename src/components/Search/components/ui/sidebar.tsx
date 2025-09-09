"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { PanelLeft } from "lucide-react"

import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/Search/components/ui/button"
import { Input } from "@/components/Search/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/Search/components/ui/sheet"

interface SidebarProps {
  className?: string
  children?: React.ReactNode
}

export function Sidebar({ className, children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <nav className={cn("flex h-full flex-col", className)}>{children}</nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="relative">
      <motion.nav
        animate={{
          width: isCollapsed ? "4rem" : "16rem",
          transition: { duration: 0.3 },
        }}
        className={cn(
          "relative flex h-full flex-col border-r",
          isCollapsed && "items-center",
          className
        )}
      >
        {children}
      </motion.nav>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-5 top-2 hidden md:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

interface SidebarItemProps {
  className?: string
  children?: React.ReactNode
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  title: string
}

export function SidebarItem({
  className,
  children,
  href,
  icon: Icon,
  title,
}: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <div className={cn("flex flex-col", className)}>
      <a
        href={href}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{title}</span>
      </a>
      {children}
    </div>
  )
}

interface SidebarGroupProps {
  className?: string
  children?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  title: string
}

export function SidebarGroup({
  className,
  children,
  icon: Icon,
  title,
}: SidebarGroupProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2 px-3 py-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

interface SidebarSearchProps {
  className?: string
  children?: React.ReactNode
}

export function SidebarSearch({ className, children }: SidebarSearchProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-4", className)}>
      <div className="flex items-center gap-2">
        <Input placeholder="Search..." className="h-8" />
      </div>
      {children}
    </div>
  )
}
