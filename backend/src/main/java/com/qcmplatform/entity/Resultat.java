package com.qcmplatform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resultats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resultat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double score;

    @Column(name = "date_passage", updatable = false)
    private LocalDateTime datePassage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private User etudiant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Evaluation evaluation;

    @OneToMany(mappedBy = "resultat", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReponseEtudiant> reponses = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        datePassage = LocalDateTime.now();
    }
}
