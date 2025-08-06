// Utility function to make authenticated API requests
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const user = localStorage.getItem('user')
  if (!user) {
    throw new Error('User not authenticated')
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': user,
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
