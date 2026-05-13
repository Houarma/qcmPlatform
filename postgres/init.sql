-- Initialisation de la base de données QCM Platform

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ENSEIGNANT', 'ETUDIANT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluations (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    objectifs TEXT NOT NULL,
    prompt TEXT,
    statut VARCHAR(20) NOT NULL DEFAULT 'BROUILLON' CHECK (statut IN ('BROUILLON', 'PUBLIEE', 'ARCHIVEE')),
    enseignant_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    contenu TEXT NOT NULL,
    bonne_reponse VARCHAR(10) NOT NULL,
    evaluation_id BIGINT NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE
);

CREATE TABLE options (
    id BIGSERIAL PRIMARY KEY,
    contenu TEXT NOT NULL,
    est_correcte BOOLEAN DEFAULT FALSE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE resultats (
    id BIGSERIAL PRIMARY KEY,
    score DOUBLE PRECISION NOT NULL,
    date_passage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    etudiant_id BIGINT NOT NULL REFERENCES users(id),
    evaluation_id BIGINT NOT NULL REFERENCES evaluations(id)
);

CREATE TABLE reponses_etudiants (
    id BIGSERIAL PRIMARY KEY,
    reponse_choisie VARCHAR(10),
    est_correcte BOOLEAN NOT NULL,
    question_id BIGINT NOT NULL REFERENCES questions(id),
    resultat_id BIGINT NOT NULL REFERENCES resultats(id) ON DELETE CASCADE
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_evaluations_enseignant ON evaluations(enseignant_id);
CREATE INDEX idx_resultats_etudiant ON resultats(etudiant_id);
CREATE INDEX idx_resultats_evaluation ON resultats(evaluation_id);
CREATE INDEX idx_questions_evaluation ON questions(evaluation_id);
