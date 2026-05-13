import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from typing import List
from app.models.requests import ResultatData
from app.models.responses import GroupeEtudiant

NIVEAUX_LABELS = ["En difficulté", "Intermédiaire", "Avancé"]


def cluster_etudiants(resultats: List[ResultatData]) -> List[GroupeEtudiant]:
    """
    Regroupe les étudiants par niveau via K-Means.
    Utilise : score moyen + taux de bonnes réponses par étudiant.
    Fallback sur seuils simples si moins de 3 étudiants.
    """
    if not resultats:
        return []

    if len(resultats) < 3:
        return _grouper_par_seuils(resultats)

    scores = np.array([[r.score] for r in resultats], dtype=float)
    scaler = StandardScaler()
    scores_normalises = scaler.fit_transform(scores)

    n_clusters = min(3, len(resultats))
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(scores_normalises)

    # Associer chaque cluster a son score moyen reel
    cluster_scores: dict[int, list] = {i: [] for i in range(n_clusters)}
    for idx, r in enumerate(resultats):
        cluster_scores[labels[idx]].append(r)

    # Trier les clusters du plus faible au plus fort score moyen
    clusters_tries = sorted(
        cluster_scores.items(),
        key=lambda item: np.mean([r.score for r in item[1]])
    )

    groupes = []
    for rang, (_, membres) in enumerate(clusters_tries):
        niveau = NIVEAUX_LABELS[rang] if rang < len(NIVEAUX_LABELS) else f"Groupe {rang + 1}"
        groupes.append(GroupeEtudiant(
            niveau=niveau,
            etudiants=[r.etudiant_nom for r in membres],
            score_moyen_groupe=round(float(np.mean([r.score for r in membres])), 2)
        ))

    return groupes


def _grouper_par_seuils(resultats: List[ResultatData]) -> List[GroupeEtudiant]:
    """Fallback : groupement simple par seuils de score."""
    groupes_map: dict[str, list] = {
        "Avancé": [],
        "Intermédiaire": [],
        "En difficulté": []
    }

    for r in resultats:
        if r.score >= 75:
            groupes_map["Avancé"].append(r)
        elif r.score >= 50:
            groupes_map["Intermédiaire"].append(r)
        else:
            groupes_map["En difficulté"].append(r)

    return [
        GroupeEtudiant(
            niveau=niveau,
            etudiants=[r.etudiant_nom for r in membres],
            score_moyen_groupe=round(float(np.mean([r.score for r in membres])), 2) if membres else 0.0
        )
        for niveau, membres in groupes_map.items()
        if membres
    ]
