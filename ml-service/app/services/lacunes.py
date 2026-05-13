from typing import List
from app.models.requests import ResultatData
from app.models.responses import LacuneInfo
from app.services.difficulty import analyser_difficulte

SEUIL_LACUNE = 50.0  # taux d'echec >= 50% = lacune identifiee


def detecter_lacunes(resultats: List[ResultatData]) -> List[LacuneInfo]:
    """
    Identifie les questions qui constituent des lacunes collectives.

    Logique :
    - Une lacune = question où > 50% des étudiants ont échoué
    - Triées du taux d'échec le plus élevé au plus bas
    - Chaque lacune produit un message descriptif exploitable par l'enseignant
    """
    difficultes = analyser_difficulte(resultats)
    lacunes = []

    for d in difficultes:
        if d.taux_echec >= SEUIL_LACUNE:
            nb_etudiants = len(resultats)
            nb_echecs = round(nb_etudiants * d.taux_echec / 100)

            description = (
                f"{nb_echecs} étudiant(s) sur {nb_etudiants} ont échoué à cette question "
                f"({d.taux_echec:.1f}% d'échec) — Difficulté : {d.classification}"
            )

            lacunes.append(LacuneInfo(
                question_id=d.question_id,
                taux_echec=d.taux_echec,
                description=description
            ))

    return lacunes
