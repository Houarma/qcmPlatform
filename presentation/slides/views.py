import os
import io
import json
import base64
import psycopg2
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch
from wordcloud import WordCloud
from groq import Groq
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings


def index(request):
    return render(request, 'slides/index.html')


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_db():
    url = settings.DB_URL
    return psycopg2.connect(url)


def _fig_to_b64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight',
                facecolor=fig.get_facecolor(), dpi=150)
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode()
    plt.close(fig)
    return img_b64


# ── API : stats temps réel ─────────────────────────────────────────────────────

def api_stats(request):
    try:
        conn = _get_db()
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) FROM utilisateurs WHERE role = 'ENSEIGNANT'")
        nb_enseignants = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM utilisateurs WHERE role = 'ETUDIANT'")
        nb_etudiants = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM evaluations")
        nb_evaluations = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM evaluations WHERE statut = 'PUBLIEE'")
        nb_publiees = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM resultats")
        nb_resultats = cur.fetchone()[0]

        cur.execute("SELECT AVG(score) FROM resultats")
        avg_score = cur.fetchone()[0]

        cur.close()
        conn.close()

        return JsonResponse({
            'enseignants': nb_enseignants,
            'etudiants': nb_etudiants,
            'evaluations': nb_evaluations,
            'publiees': nb_publiees,
            'resultats': nb_resultats,
            'score_moyen': round(float(avg_score), 1) if avg_score else 0,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ── API : graphique scores ─────────────────────────────────────────────────────

def api_chart(request):
    try:
        conn = _get_db()
        cur = conn.cursor()
        cur.execute("""
            SELECT e.titre, AVG(r.score)
            FROM resultats r
            JOIN evaluations e ON r.evaluation_id = e.id
            GROUP BY e.titre
            ORDER BY AVG(r.score) DESC
            LIMIT 6
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            rows = [('Exemple A', 78), ('Exemple B', 65), ('Exemple C', 82)]

        titres = [r[0][:20] + '…' if len(r[0]) > 20 else r[0] for r in rows]
        scores = [float(r[1]) for r in rows]

        fig, ax = plt.subplots(figsize=(9, 4))
        fig.patch.set_facecolor('#1e1b4b')
        ax.set_facecolor('#1e1b4b')

        bars = ax.barh(titres, scores, color='#6366f1', height=0.6)
        for bar, score in zip(bars, scores):
            ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height() / 2,
                    f'{score:.1f}%', va='center', color='white', fontsize=10)

        ax.set_xlabel('Score moyen (%)', color='white')
        ax.tick_params(colors='white')
        ax.spines[:].set_color('#4f46e5')
        ax.set_xlim(0, 110)
        ax.set_title('Scores moyens par évaluation', color='white', pad=12)

        return JsonResponse({'image': _fig_to_b64(fig)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ── API : nuage de mots ────────────────────────────────────────────────────────

def api_wordcloud(request):
    try:
        conn = _get_db()
        cur = conn.cursor()
        cur.execute("SELECT objectifs FROM evaluations")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        text = ' '.join(r[0] for r in rows if r[0])
    except Exception:
        text = ('algorithmes structures données programmation Python '
                'bases données réseaux systèmes intelligence artificielle '
                'apprentissage machine évaluation performance analyse')

    wc = WordCloud(
        width=900, height=400,
        background_color='#1e1b4b',
        colormap='cool',
        max_words=60,
        prefer_horizontal=0.8,
    ).generate(text)

    fig, ax = plt.subplots(figsize=(9, 4))
    fig.patch.set_facecolor('#1e1b4b')
    ax.imshow(wc, interpolation='bilinear')
    ax.axis('off')

    return JsonResponse({'image': _fig_to_b64(fig)})


# ── API : génération IA live ───────────────────────────────────────────────────

def api_generate(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST requis'}, status=405)
    try:
        body = json.loads(request.body)
        sujet = body.get('sujet', 'Algorithmique')

        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            messages=[
                {'role': 'system', 'content': (
                    'Tu es un expert pédagogique. Génère exactement 3 questions QCM universitaires '
                    'en JSON strict : {"questions":[{"question":"...","options":["A)...","B)...","C)...","D)..."],"reponse":"A"}]}'
                )},
                {'role': 'user', 'content': f'Sujet : {sujet}. Langue : français.'},
            ],
            model='llama-3.3-70b-versatile',
            response_format={'type': 'json_object'},
            temperature=0.7,
            max_tokens=1024,
        )
        data = json.loads(response.choices[0].message.content)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ── API : diagramme architecture ──────────────────────────────────────────────

def api_architecture(request):
    fig, ax = plt.subplots(figsize=(12, 6))
    fig.patch.set_facecolor('#0f0e2a')
    ax.set_facecolor('#0f0e2a')
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6)
    ax.axis('off')

    def box(x, y, w, h, label, sublabel='', color='#4f46e5'):
        rect = mpatches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle='round,pad=0.1',
            facecolor=color, edgecolor='white', linewidth=1.5, alpha=0.9
        )
        ax.add_patch(rect)
        ax.text(x + w / 2, y + h / 2 + (0.15 if sublabel else 0),
                label, ha='center', va='center',
                color='white', fontsize=9, fontweight='bold')
        if sublabel:
            ax.text(x + w / 2, y + h / 2 - 0.2,
                    sublabel, ha='center', va='center',
                    color='#c7d2fe', fontsize=7)

    def arrow(x1, y1, x2, y2):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle='->', color='#818cf8', lw=1.8))

    # Clients
    box(0.2, 4.2, 1.6, 0.9, '👨‍🏫 Enseignant', 'Navigateur', '#7c3aed')
    box(0.2, 2.8, 1.6, 0.9, '👨‍🎓 Étudiant', 'Navigateur', '#7c3aed')

    # Frontend
    box(2.3, 3.2, 2.0, 1.4, 'Next.js 15', 'Vercel', '#2563eb')

    # Backend
    box(5.1, 3.2, 2.0, 1.4, 'Spring Boot', 'Railway', '#059669')

    # ML Service
    box(5.1, 1.2, 2.0, 1.4, 'FastAPI', 'Railway · Python', '#d97706')

    # Firebase
    box(8.0, 4.2, 1.8, 0.9, '🔥 Firebase', 'Auth', '#ea580c')

    # Neon DB
    box(8.0, 3.0, 1.8, 0.9, '🐘 Neon', 'PostgreSQL', '#0891b2')

    # Groq
    box(8.0, 1.2, 1.8, 0.9, '⚡ Groq', 'Llama 3.3 70B', '#7c3aed')

    # Arrows
    arrow(1.8, 4.65, 2.3, 3.9)
    arrow(1.8, 3.25, 2.3, 3.5)
    arrow(4.3, 3.9, 5.1, 3.9)
    arrow(7.1, 3.9, 8.0, 3.9) # backend → neon
    arrow(7.1, 4.2, 8.0, 4.65) # backend → firebase
    arrow(7.1, 2.0, 8.0, 1.65) # ml → groq
    arrow(6.1, 3.2, 6.1, 2.6)  # backend → ml

    ax.set_title('Architecture — QCM Platform', color='white',
                 fontsize=13, fontweight='bold', pad=10)

    return JsonResponse({'image': _fig_to_b64(fig)})
