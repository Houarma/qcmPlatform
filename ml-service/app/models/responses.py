from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import List, Dict


class CamelModel(BaseModel):
    """Modele de base : serialise en camelCase pour compatibilite avec Spring Boot / Java."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )


# --- Generation QCM ---

class OptionGeneree(BaseModel):
    label: str
    contenu: str
    est_correcte: bool


class QuestionGeneree(BaseModel):
    contenu: str
    options: List[OptionGeneree]
    bonne_reponse: str


class GenerateResponse(BaseModel):
    questions: List[QuestionGeneree]


# --- Analyse ML ---

class GroupeEtudiant(CamelModel):
    niveau: str
    etudiants: List[str]
    score_moyen_groupe: float


class DifficulteQuestion(CamelModel):
    question_id: int
    taux_echec: float           # en pourcentage (ex: 72.5)
    classification: str          # Facile | Moyen | Difficile


class LacuneInfo(CamelModel):
    question_id: int
    taux_echec: float
    description: str


class AnalyseResponse(CamelModel):
    evaluation_id: int
    score_moyen: float
    nb_etudiants: int
    taux_echec_par_question: Dict[str, float]   # questionId -> taux echec %
    groupes: List[GroupeEtudiant]
    difficultes: List[DifficulteQuestion]
    lacunes: List[LacuneInfo]
