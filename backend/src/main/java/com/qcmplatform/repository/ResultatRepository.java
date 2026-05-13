package com.qcmplatform.repository;

import com.qcmplatform.entity.Resultat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultatRepository extends JpaRepository<Resultat, Long> {
    List<Resultat> findByEtudiantId(Long etudiantId);
    List<Resultat> findByEvaluationId(Long evaluationId);
    List<Resultat> findByEtudiantIdOrderByDatePassageDesc(Long etudiantId);
    boolean existsByEtudiantIdAndEvaluationId(Long etudiantId, Long evaluationId);
}
