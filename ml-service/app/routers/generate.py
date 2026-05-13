from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.models.requests import GenerateRequest
from app.models.responses import GenerateResponse
from app.services import qcm_generator

router = APIRouter(prefix="/generate", tags=["Generation QCM"])


@router.post("", response_model=GenerateResponse)
async def generer_qcm(request: GenerateRequest):
    """
    Génère un QCM via le LLM Groq (Llama 3.3 70B).
    Retourne une liste de questions avec options et bonne réponse.
    """
    try:
        questions = qcm_generator.generer_qcm(
            objectifs=request.objectifs,
            prompt=request.prompt,
            nb_questions=request.nb_questions
        )
        return GenerateResponse(questions=questions)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur génération QCM : {str(e)}")
