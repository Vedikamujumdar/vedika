"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { loginCustomer, getCustomer, createCustomer } from "@/lib/shopify"

interface Customer {
    id: string
    firstName: string
    lastName: string
    email: string
    orders: {
        edges: {
            node: {
                id: string
                orderNumber: number
                fulfillmentStatus: string
                lineItems: {
                    edges: {
                        node: {
                            title: string
                            variant: { id: string }
                        }
                    }[]
                }
            }
        }[]
    }
}

interface AuthContextType {
    customer: Customer | null
    token: string | null
    loading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
    logout: () => void
    refreshCustomer: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load token from local storage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("shopify_customer_token")
        if (storedToken) {
            setToken(storedToken)
            fetchCustomer(storedToken)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchCustomer = async (accessToken: string) => {
        try {
            setLoading(true)
            const customerData = await getCustomer(accessToken)
            if (customerData) {
                setCustomer(customerData)
            } else {
                // Token might be expired
                logout()
            }
        } catch (err) {
            console.error("Failed to fetch customer", err)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        try {
            setError(null)
            setLoading(true)
            const accessToken = await loginCustomer(email, password)

            if (accessToken?.accessToken) {
                setToken(accessToken.accessToken)
                localStorage.setItem("shopify_customer_token", accessToken.accessToken)
                // Fetch profile
                await fetchCustomer(accessToken.accessToken)
            } else {
                throw new Error("Invalid credentials")
            }
        } catch (err: any) {
            setError(err.message || "Failed to login")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        try {
            setError(null)
            setLoading(true)
            await createCustomer(email, password, firstName, lastName)
            // Automatically login after register? Or ask to login?
            // For now, let's just log them in
            await login(email, password)
        } catch (err: any) {
            setError(err.message || "Failed to register")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setToken(null)
        setCustomer(null)
        localStorage.removeItem("shopify_customer_token")
    }

    const refreshCustomer = async () => {
        if (token) {
            await fetchCustomer(token)
        }
    }

    return (
        <AuthContext.Provider value={{ customer, token, loading, error, login, register, logout, refreshCustomer }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
