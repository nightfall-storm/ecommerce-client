"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import api from "@/lib/axios"

export async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")
}

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
    console.log(error)
    return { success: false, error: "Invalid credentials" }
  }
}

export async function logout() {
  // Delete the token cookie
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
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

export interface RegisterCredentials {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
}

export async function register(credentials: RegisterCredentials) {
  try {
    const response = await api.post("/api/Auth/register", credentials);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Registration failed" };
  }
}