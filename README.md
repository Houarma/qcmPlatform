# QCM Platform

Plateforme intelligente de création et d'évaluation de QCM, développée dans le cadre d'un projet académique à l'ENSAO (2025–2026).

Un enseignant décrit un sujet, l'IA génère un QCM complet. Les étudiants passent le test en ligne. Le système analyse automatiquement les résultats et regroupe les étudiants par niveau de maîtrise.

---

## Architecture

```
Frontend (Next.js)  →  Backend (Spring Boot)  →  Base de données (PostgreSQL)
                    →  ML Service (FastAPI)    →  IA générative (Groq / Llama 3.3)
Firebase Auth       →  Authentification des utilisateurs
```

| Service | Technologie | Déployé sur |
|---|---|---|
| Frontend | Next.js 16, React 19, TailwindCSS | Vercel |
| Backend | Spring Boot 3, Java 21 | Railway |
| ML Service | FastAPI, Python, scikit-learn | Railway |
| Base de données | PostgreSQL (Neon) | Neon |
| Authentification | Firebase Auth | Firebase |

---

## Fonctionnalités

- **Génération IA** — l'enseignant saisit un objectif pédagogique, Groq / Llama 3.3 70B génère les questions et les options de réponse
- **Passage de test** — interface étudiant simple, score calculé immédiatement à la soumission
- **Analyse ML** — clustering K-Means des étudiants par niveau, détection des questions difficiles et des lacunes
- **Authentification** — connexion par email, Google ou GitHub via Firebase
- **Notifications email** — envoi via l'API REST Brevo (pas de SMTP)

---

## Structure du projet

```
qcm-platform/
├── frontend/        → Application Next.js (interface enseignant & étudiant)
├── backend/         → API REST Spring Boot (Java)
├── ml-service/      → Microservice FastAPI (génération IA + analyse ML)
├── presentation/    → Site de présentation interactif (Django, 17 slides)
├── nginx/           → Configuration reverse proxy (usage local)
├── postgres/        → Configuration base de données locale
└── docker-compose.yml
```

---

## Lancer le projet en local

### Prérequis

- Docker Desktop
- Java 21
- Node.js 20+
- Python 3.10+

### Avec Docker Compose

```bash
# Copier et remplir les variables d'environnement
cp .env.example .env

# Lancer tous les services
docker-compose up
```

### Sans Docker (service par service)

**Backend**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**ML Service**
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Variables d'environnement

Chaque service a besoin de ses propres variables. Contactez l'équipe pour obtenir les clés d'accès :

**ouarmahaphiz02@gmail.com**

| Variable | Service | Description |
|---|---|---|
| `FIREBASE_*` | Backend | Credentials Firebase Admin SDK |
| `DATABASE_URL` | Backend, ML, Présentation | URL PostgreSQL Neon |
| `GROQ_API_KEY` | ML Service, Présentation | Clé API Groq |
| `NEXT_PUBLIC_API_URL` | Frontend | URL du backend |
| `BREVO_API_KEY` | Backend | Clé API Brevo (emails) |

---

## Présentation

Le dossier `presentation/` contient un diaporama web interactif de 17 slides qui explique le projet, avec des statistiques en temps réel et une démonstration IA live.

```bash
cd presentation
pip install -r requirements.txt
python manage.py runserver
# Ouvrir http://localhost:8000
```

Voir [presentation/README.md](presentation/README.md) pour les détails.
