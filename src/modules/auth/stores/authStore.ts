import type { Auth, AuthAccount, AuthState, User } from '@/modules/auth/contracts/Auth.ts'
import { defineStore } from 'pinia'

const ACCOUNTS_STORAGE_KEY = 'auth_accounts'
const ACTIVE_ACCOUNT_STORAGE_KEY = 'auth_active_account_id'
const LEGACY_TOKEN_STORAGE_KEY = 'token'
const LEGACY_USER_STORAGE_KEY = 'user'

export const useAuthStore = defineStore('user',
  {
    state: (): AuthState => ({
      user: null,
      token: null,
      accounts: [],
      activeAccountId: null,
    }),
    getters: {
      isAuthenticated: state => !!state.token,
      getUser: state => state.user,
      getToken: state => state.token,
      getAccounts: state => state.accounts,
    },
    actions: {
      persistAuth () {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(this.accounts))
        localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, this.activeAccountId ? String(this.activeAccountId) : '')
        localStorage.setItem(LEGACY_TOKEN_STORAGE_KEY, this.token || '')
        localStorage.setItem(LEGACY_USER_STORAGE_KEY, this.user ? JSON.stringify(this.user) : '')
      },

      syncActiveAccount () {
        const active = this.accounts.find(account => account.user.id === this.activeAccountId)
        this.user = active?.user || null
        this.token = active?.token || null
      },

      setAuth (auth: Auth) {
        if (!auth.user || !auth.token) {
          return
        }

        const account: AuthAccount = {
          user: auth.user,
          token: auth.token,
        }
        const index = this.accounts.findIndex(item => item.user.id === account.user.id)
        if (index === -1) {
          this.accounts.push(account)
        } else {
          this.accounts[index] = account
        }

        this.activeAccountId = account.user.id
        this.user = auth.user
        this.token = auth.token
        this.persistAuth()
      },
      setUser (user: User) {
        this.user = user
        const index = this.accounts.findIndex(account => account.user.id === user.id)
        if (index !== -1) {
          const account = this.accounts[index]
          if (account) {
            account.user = user
          }
        }
        this.persistAuth()
      },

      restoreAuth () {
        const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY)
        const rawActiveAccountId = localStorage.getItem(ACTIVE_ACCOUNT_STORAGE_KEY)

        if (rawAccounts) {
          try {
            this.accounts = JSON.parse(rawAccounts) as AuthAccount[]
          } catch {
            this.accounts = []
          }
        }

        if (this.accounts.length === 0) {
          const token = localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY)
          const user = localStorage.getItem(LEGACY_USER_STORAGE_KEY)
          if (token && user) {
            try {
              const parsedUser = JSON.parse(user) as User
              this.accounts = [{ user: parsedUser, token }]
              this.activeAccountId = parsedUser.id
            } catch {
              this.accounts = []
            }
          }
        } else if (rawActiveAccountId) {
          const parsedId = Number.parseInt(rawActiveAccountId, 10)
          this.activeAccountId = Number.isNaN(parsedId) ? null : parsedId
        }

        if (!this.activeAccountId && this.accounts.length > 0) {
          const firstAccount = this.accounts[0]
          if (firstAccount) {
            this.activeAccountId = firstAccount.user.id
          }
        }

        this.syncActiveAccount()
        this.persistAuth()
      },
      switchAccount (accountId: number): boolean {
        const account = this.accounts.find(item => item.user.id === accountId)
        if (!account) {
          return false
        }

        this.activeAccountId = accountId
        this.syncActiveAccount()
        this.persistAuth()
        return true
      },
      logout () {
        if (!this.activeAccountId) {
          this.clearAllAccounts()
          return
        }

        this.accounts = this.accounts.filter(account => account.user.id !== this.activeAccountId)
        this.activeAccountId = this.accounts[0]?.user.id || null
        this.syncActiveAccount()
        this.persistAuth()
      },
      clearAllAccounts () {
        this.$reset()
        localStorage.removeItem(ACCOUNTS_STORAGE_KEY)
        localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY)
        localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY)
        localStorage.removeItem(LEGACY_USER_STORAGE_KEY)
      },
      logoutAll () {
        this.clearAllAccounts()
      },
      can (permission: string): boolean {
        return this.user?.role.name === 'super_admin' || (this.user?.role.permissions || []).includes(permission)
      },
      canAny (permissions: string[]): boolean {
        if (this.user?.role.name === 'super_admin') {
          return true
        } else {
          let hasAccess = false
          const userPermissions: string[] = this.user?.role.permissions || []
          for (const permission of permissions) {
            if (userPermissions.includes(permission)) {
              hasAccess = true
              break
            }
          }
          return hasAccess
        }
      },
      hasPermission (permission?: string[] | string): boolean {
        if (typeof permission === 'string') {
          return this.can(permission)
        } else if (Array.isArray(permission)) {
          return this.canAny(permission)
        }
        return false
      },
      hasAnyRoles (roles: string[]): boolean {
        let hasAccess = false
        for (const role of roles) {
          if (this.user?.role.name === role) {
            hasAccess = true
            break
          }
        }
        return hasAccess
      },
      hasRole (role?: string[] | string): boolean {
        if (typeof role === 'string') {
          return this.user?.role.name === role
        } else if (Array.isArray(role)) {
          return this.hasAnyRoles(role)
        }
        return false
      },
    },
  })
