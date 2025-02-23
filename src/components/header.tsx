"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {  User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./search-bar"
import { ThemeToggle } from "./theme-toggle"
import { Cart } from "@/components/cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { isAuthenticated, logout, getUser } from "@/lib/actions/auth"
import { Skeleton } from "@/components/ui/skeleton"
import SearchResults from './search-results'
import { Product } from '@/services/products'
import { getPublicProducts } from '@/services/products'

export function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuth, setIsAuth] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated()
        setIsAuth(auth)
        if (auth) {
          const userData = await getUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsAuth(false)
    setUser(null)
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    })
    router.refresh()
  }

  const handleSearch = async (query: string) => {
    // If we're not on the home page, navigate to it
    if (window.location.pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(query)}`)
    }
    // Emit a custom event that the home page can listen to
    const searchEvent = new CustomEvent('product-search', { detail: query })
    window.dispatchEvent(searchEvent)

    // Fetch search results from the backend
    if (query) {
      const response = await getPublicProducts(1, 8, undefined, query)
      setSearchResults(response.items)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">EShop</span>
        </Link>

        <div className="flex-1 mx-8">
          <SearchBar onSearch={handleSearch} />
          {showResults && <SearchResults results={searchResults} onClose={() => setShowResults(false)} />}
        </div>

        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-10" />
            </div>
          ) : (
            <>
              <Cart />
              {isAuth ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user ? `${user.prenom} ${user.nom}` : 'My Account'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/manage-orders">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => router.push("/register")}>
                    Sign up
                  </Button>
                </>
              )}
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  )
}