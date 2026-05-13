import numpy as np
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.requests import AnalyseRequest
from app.models.responses import AnalyseResponse
from app.services.clustering import cluster_etudiants
from app.services.difficulty import analyser_difficulte, calculer_taux_echec_par_question
from app.services.lacunes import detecter_lacunes

router = APIRouter(prefix="/analyse", tags=["Analyse ML"])


@router.post("", response_model=AnalyseResponse)
async def analyser_resultats(request: AnalyseRequest):
    """
    Pipeline d'analyse ML complet pour une évaluation :
    1. Clustering K-Means des étudiants par niveau
    2. Analyse de difficulté par question (IRT-inspired)
    3. Détection des lacunes collectives (taux d'échec > 50%)
    """
    if not request.resultats:
        raise HTTPException(status_code=400, detail="Aucun résultat à analyser")

    try:
        scores = [r.score for r in request.resultats]
        score_moyen = round(float(np.mean(scores)), 2)

        groupes       = cluster_etudiants(request.resultats)
        difficultes   = analyser_difficulte(request.resultats)
        lacunes       = detecter_lacunes(request.resultats)
        taux_par_qst  = calculer_taux_echec_par_question(request.resultats)

        result = AnalyseResponse(
            evaluation_id=request.evaluation_id,
            score_moyen=score_moyen,
            nb_etudiants=len(request.resultats),
            taux_echec_par_question=taux_par_qst,
            groupes=groupes,
            difficultes=difficultes,
            lacunes=lacunes
        )

        # Serialisation en camelCase pour compatibilite Spring Boot
        return JSONResponse(content=result.model_dump(by_alias=True))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur analyse ML : {str(e)}")
