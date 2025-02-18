"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import api from "@/lib/axios"

export interface LoginCredentials {
  email: string
  motDePasse: string
}

export async function login(credentials: LoginCredentials) {
  try {
    const response = await api.post("/api/Auth/login", credentials)
    const { token } = response.data

    // Set the token in an HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: "Invalid credentials" }
  }
}

export async function logout() {
  // Delete the token cookie
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  redirect("/")
}

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")

  if (!token) {
    return null
  }

  try {
    const response = await api.get("/api/Auth/me", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    return response.data
  } catch (error) {
    cookieStore.delete("accessToken")
    return null
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")
  return !!token
}

export async function checkAdmin() {
  const user = await getUser()
  return user?.role === "admin"
}