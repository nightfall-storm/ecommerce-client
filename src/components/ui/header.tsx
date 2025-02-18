import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "./button"
import { SearchBar } from "./search-bar"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">EShop</span>
        </Link>

        <div className="flex-1 mx-8">
          <SearchBar onSearch={(query) => console.log(query)} />
        </div>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  )
}