from pydantic import BaseModel, Field
from typing import List


class GenerateRequest(BaseModel):
    objectifs: str
    prompt: str = ""
    nb_questions: int = Field(default=5, ge=1, le=20)


class ReponseData(BaseModel):
    question_id: int
    est_correcte: bool


class ResultatData(BaseModel):
    etudiant_id: int
    etudiant_nom: str
    score: float
    reponses: List[ReponseData]


class AnalyseRequest(BaseModel):
    evaluation_id: int
    resultats: List[ResultatData]
