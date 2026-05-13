export type Role = 'ENSEIGNANT' | 'ETUDIANT'
export type StatutEvaluation = 'BROUILLON' | 'PUBLIEE' | 'ARCHIVEE'

export interface User {
  id: number
  email: string
  nom: string
  prenom: string
  role: Role
}

export interface OptionItem {
  id: number
  contenu: string
}

export interface Question {
  id: number
  contenu: string
  options: OptionItem[]
}

export interface Evaluation {
  id: number
  titre: string
  objectifs: string
  prompt: string
  statut: StatutEvaluation
  enseignantNom: string
  createdAt: string
  questions: Question[]
}

export interface Resultat {
  id: number
  score: number
  datePassage: string
  evaluationId: number
  evaluationTitre: string
  etudiantNom: string
}

export interface GroupeEtudiant {
  niveau: string
  etudiants: string[]
  scoreMoyenGroupe: number
}

export interface DifficulteQuestion {
  questionId: number
  tauxEchec: number
  classification: 'Facile' | 'Moyen' | 'Difficile'
}

export interface LacuneInfo {
  questionId: number
  tauxEchec: number
  description: string
}

export interface AnalyseResponse {
  evaluationId: number
  scoreMoyen: number
  nbEtudiants: number
  tauxEchecParQuestion: Record<string, number>
  groupes: GroupeEtudiant[]
  difficultes: DifficulteQuestion[]
  lacunes: LacuneInfo[]
}
