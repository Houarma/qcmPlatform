import os
import json
from groq import Groq
from typing import List
from app.models.responses import QuestionGeneree, OptionGeneree

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

SYSTEM_PROMPT = """Tu es un expert pédagogique spécialisé dans la création de QCM universitaires.
Tu génères des questions précises, sans ambiguïté, avec une seule bonne réponse par question.
Tu réponds UNIQUEMENT avec un objet JSON valide respectant exactement cette structure :
{
  "questions": [
    {
      "contenu": "Texte complet de la question ?",
      "options": [
        {"label": "A", "contenu": "Texte option A", "est_correcte": false},
        {"label": "B", "contenu": "Texte option B", "est_correcte": true},
        {"label": "C", "contenu": "Texte option C", "est_correcte": false},
        {"label": "D", "contenu": "Texte option D", "est_correcte": false}
      ],
      "bonne_reponse": "B"
    }
  ]
}
Règles strictes :
- Exactement 4 options par question (A, B, C, D)
- Une seule option avec est_correcte = true
- bonne_reponse = le label de l'option correcte
- Aucun texte en dehors du JSON"""


def generer_qcm(objectifs: str, prompt: str, nb_questions: int) -> List[QuestionGeneree]:
    instructions_supplementaires = f"\nInstructions supplémentaires : {prompt}" if prompt.strip() else ""

    user_content = f"""Génère exactement {nb_questions} questions QCM sur le sujet suivant.
Objectifs pédagogiques : {objectifs}{instructions_supplementaires}
Niveau : universitaire. Langue : français."""

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content}
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        temperature=0.7,
        max_tokens=4096
    )

    raw_content = response.choices[0].message.content
    data = json.loads(raw_content)
    raw_questions = data.get("questions", [])

    return _parse_questions(raw_questions)


def _parse_questions(raw: list) -> List[QuestionGeneree]:
    questions = []
    for q in raw:
        options = [
            OptionGeneree(
                label=o["label"],
                contenu=o["contenu"],
                est_correcte=bool(o.get("est_correcte", False))
            )
            for o in q.get("options", [])
        ]
        questions.append(QuestionGeneree(
            contenu=q["contenu"],
            options=options,
            bonne_reponse=q["bonne_reponse"]
        ))
    return questions
