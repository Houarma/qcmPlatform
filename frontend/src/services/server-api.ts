import { cookies } from 'next/headers'

const BASE =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost'

export async function serverFetch<T>(path: string): Promise<T | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('firebase_token')?.value
  if (!token) return null

  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`[serverFetch] ${path} → HTTP ${res.status}`)
      }
      return null
    }
    return res.json() as Promise<T>
  } catch (err) {
    console.error(`[serverFetch] ${path} → réseau inaccessible`, err)
    throw new Error(`Impossible de contacter le serveur (${path})`)
  }
}
