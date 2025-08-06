"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock, Loader2 } from 'lucide-react'

interface AdminLoginModalProps {
  isOpen: boolean
  onLogin: (success: boolean) => void
  onClose: () => void
}

export function AdminLoginModal({ isOpen, onLogin, onClose }: AdminLoginModalProps) {
  const [loginKey, setLoginKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginKey }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('admin_auth', JSON.stringify({ 
          authenticated: true, 
          timestamp: Date.now() 
        }))
        onLogin(true)
      } else {
        setError(data.error || 'Invalid login key')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Admin Access Required
          </DialogTitle>
          <p className="text-slate-400 text-sm">
            Enter the admin login key to access the management dashboard
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="loginKey" className="text-slate-300">Admin Login Key</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="loginKey"
                type="password"
                placeholder="Enter admin login key"
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-red-500"
                autoFocus
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3"
            disabled={isLoading || !loginKey}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Access Admin Dashboard'
            )}
          </Button>

          <div className="text-center text-xs text-slate-500">
            This is a secure admin area. Unauthorized access is prohibited.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
