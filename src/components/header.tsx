import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./search-bar"
import { ThemeToggle } from "./theme-toggle"
import { Cart } from "./cart"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">EShop</span>
        </Link>

        <div className="flex-1 mx-8">
          <SearchBar onSearch={(query) => console.log(query)} />
        </div>

        <nav className="flex items-center space-x-4">
          <Cart />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}