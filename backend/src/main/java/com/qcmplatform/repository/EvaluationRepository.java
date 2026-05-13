package com.qcmplatform.repository;

import com.qcmplatform.entity.Evaluation;
import com.qcmplatform.entity.enums.StatutEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByEnseignantId(Long enseignantId);
    List<Evaluation> findByStatut(StatutEvaluation statut);
    List<Evaluation> findByEnseignantIdAndStatut(Long enseignantId, StatutEvaluation statut);
}
