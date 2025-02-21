"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { register } from '@/lib/actions/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    adresse: "",
    telephone: "",
    role: "user", // Default role
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await register(formData)
      if (response.success) {
        toast.success("Registration successful!")
        router.push("/login")
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="motDePasse">Mot de Passe</Label>
          <Input type="password" id="motDePasse" name="motDePasse" value={formData.motDePasse} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="adresse">Adresse</Label>
          <Input type="text" id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  )
}
