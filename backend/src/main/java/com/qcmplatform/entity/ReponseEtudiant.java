package com.qcmplatform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reponses_etudiants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReponseEtudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reponse_choisie", length = 10)
    private String reponseChoisie;

    @Column(name = "est_correcte", nullable = false)
    private boolean estCorrecte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resultat_id", nullable = false)
    private Resultat resultat;
}
