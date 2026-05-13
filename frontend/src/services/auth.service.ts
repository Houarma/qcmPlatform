import {
  auth,
  googleProvider,
  githubProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
} from './firebase'
import { Role } from '@/types'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function registerInBackend(firebaseUid: string, email: string, nom: string, prenom: string, role: Role) {
  await axios.post(`${API_URL}/api/auth/register`, { firebaseUid, email, nom, prenom, role })
}

export async function registerWithEmail(
  email: string,
  password: string,
  nom: string,
  prenom: string,
  role: Role
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(credential.user)
  await registerInBackend(credential.user.uid, email, nom, prenom, role)
  return credential.user
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  if (!credential.user.emailVerified) {
    await signOut(auth)
    throw new Error('email-not-verified')
  }
  return credential.user
}

export async function loginWithGoogle(role: Role) {
  const credential = await signInWithPopup(auth, googleProvider)
  const user = credential.user
  try {
    await registerInBackend(
      user.uid,
      user.email!,
      user.displayName?.split(' ')[0] ?? 'Utilisateur',
      user.displayName?.split(' ')[1] ?? '',
      role
    )
  } catch {
    // Utilisateur déjà enregistré — c'est normal pour les reconnexions
  }
  return user
}

export async function loginWithGithub(role: Role) {
  const credential = await signInWithPopup(auth, githubProvider)
  const user = credential.user
  try {
    await registerInBackend(
      user.uid,
      user.email!,
      user.displayName?.split(' ')[0] ?? 'Utilisateur',
      user.displayName?.split(' ')[1] ?? '',
      role
    )
  } catch {
    // Utilisateur déjà enregistré
  }
  return user
}

export async function logout() {
  await signOut(auth)
}
