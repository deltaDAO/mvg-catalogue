import React, {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState,
  useEffect
} from 'react'

interface UserPreferencesValue {
  locale: string
}

const UserPreferencesContext = createContext(null)

function UserPreferencesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [locale, setLocale] = useState<string>()

  // Get locale always from user's browser
  useEffect(() => {
    if (!window) return
    setLocale(window.navigator.language)
  }, [])

  return (
    <UserPreferencesContext.Provider
      value={
        {
          locale
        } as UserPreferencesValue
      }
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

// Helper hook to access the provider values
const useUserPreferences = (): UserPreferencesValue =>
  useContext(UserPreferencesContext)

export { UserPreferencesProvider, useUserPreferences, UserPreferencesValue }
