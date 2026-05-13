from typing import List, Dict
from app.models.requests import ResultatData
from app.models.responses import DifficulteQuestion


def analyser_difficulte(resultats: List[ResultatData]) -> List[DifficulteQuestion]:
    """
    Calcule un indice de difficulté par question basé sur le taux d'échec.

    Inspiré de l'Item Response Theory (IRT) :
    - p  = proportion de bonnes réponses (facilité)
    - difficulté = 1 - p  (taux d'échec)

    Classification :
    - Facile    : taux d'échec < 30%
    - Moyen     : 30% <= taux d'échec < 60%
    - Difficile : taux d'échec >= 60%
    """
    stats: Dict[int, Dict[str, int]] = {}

    for r in resultats:
        for rep in r.reponses:
            qid = rep.question_id
            if qid not in stats:
                stats[qid] = {"total": 0, "echecs": 0}
            stats[qid]["total"] += 1
            if not rep.est_correcte:
                stats[qid]["echecs"] += 1

    difficultes = []
    for qid, s in stats.items():
        taux_echec = (s["echecs"] / s["total"] * 100) if s["total"] > 0 else 0.0

        if taux_echec < 30:
            classification = "Facile"
        elif taux_echec < 60:
            classification = "Moyen"
        else:
            classification = "Difficile"

        difficultes.append(DifficulteQuestion(
            question_id=qid,
            taux_echec=round(taux_echec, 2),
            classification=classification
        ))

    return sorted(difficultes, key=lambda x: x.taux_echec, reverse=True)


def calculer_taux_echec_par_question(resultats: List[ResultatData]) -> Dict[str, float]:
    """Retourne un dict {question_id_str -> taux_echec_%} pour le dashboard."""
    difficultes = analyser_difficulte(resultats)
    return {str(d.question_id): d.taux_echec for d in difficultes}
