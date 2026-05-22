# Présentation interactive — Plateforme QCM

Ce dossier contient le site de présentation du projet académique **QCM Platform**, développé dans le cadre d'un projet de fin d'études à l'ENSAO.

La présentation est une application web (Django) qui s'ouvre dans le navigateur comme un diaporama interactif. Elle explique le projet de A à Z : le problème résolu, comment le système fonctionne, les technologies utilisées, et une démonstration en direct de l'IA.

---

## Ce que c'est

Un diaporama de **17 slides** navigable au clavier ou à la souris, avec :

- des données **en temps réel** tirées de la base de données (nombre d'étudiants, d'évaluations, scores moyens)
- un **diagramme d'architecture** généré automatiquement
- une **démonstration live** : entrez un sujet, l'IA génère un QCM complet en quelques secondes

---

## Le projet présenté

La **QCM Platform** est une plateforme qui permet à des enseignants de créer des QCM grâce à l'intelligence artificielle et d'analyser automatiquement les résultats de leurs étudiants.

| Qui l'utilise | Ce qu'il fait |
|---|---|
| Enseignant | Saisit un sujet → l'IA génère le QCM → il le publie |
| Étudiant | Passe le test en ligne → reçoit son score immédiatement |
| Système ML | Analyse les résultats → détecte les lacunes → groupe les étudiants par niveau |

---

## Technologies utilisées dans la présentation

| Technologie | Rôle |
|---|---|
| Django | Serveur web qui alimente les slides |
| matplotlib | Génère les graphiques et le diagramme d'architecture |
| Groq / Llama 3.3 70B | LLM qui génère les questions de la démo live |
| PostgreSQL (Neon) | Base de données de production (lecture seule pour les stats) |
| HTML / CSS / JS vanilla | Interface du diaporama |

---

## Lancer la présentation en local

### Prérequis

- Python 3.10 ou plus
- Un terminal

### Installation

```bash
cd presentation
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Configuration

Créez un fichier `.env` à la racine du dossier `presentation/` :

```
DATABASE_URL=votre_url_neon_postgresql
GROQ_API_KEY=votre_cle_groq
```

> Sans ces clés, la démo live et les statistiques temps réel ne fonctionneront pas, mais les slides s'afficheront quand même.

### Démarrer

```bash
python manage.py runserver
```

Ouvrez ensuite [http://localhost:8000](http://localhost:8000) dans votre navigateur.

---

## Navigation dans le diaporama

| Action | Résultat |
|---|---|
| Flèche droite / Espace | Slide suivante |
| Flèche gauche | Slide précédente |
| Boutons à l'écran | Même chose |

---

## Structure du dossier

```
presentation/
├── core/               → Configuration Django
├── slides/             → Logique de l'application
│   ├── views.py        → API : stats, graphiques, génération IA
│   ├── urls.py         → Routes
│   └── templates/      → Le diaporama HTML (index.html)
├── static/             → Images (QR code, captures Postman)
├── requirements.txt    → Dépendances Python
└── manage.py           → Point d'entrée Django
```

---

## Slides incluses

1. Page de couverture
2. Présentation du projet
3. Architecture globale
4. Technologies et dépendances
5. Structure du code backend
6. Tableau des endpoints API
7. Flux applicatifs (création QCM, soumission test, analyse ML)
8. Stack technique
9. Microservice FastAPI (ML)
10. Tests Postman
11. Parcours utilisateur (enseignant / étudiant)
12. Déploiement cloud
13. Bilan (points forts / points faibles)
14. Améliorations futures
15. Conclusion
16. Démonstration IA en direct
17. QR code vers la plateforme en ligne
