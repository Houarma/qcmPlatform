package com.qcmplatform.service.interfaces;

import com.qcmplatform.entity.Evaluation;
import com.qcmplatform.entity.User;

import java.util.List;

public interface EmailServiceI {
    void notifierNouveauTest(List<User> etudiants, Evaluation evaluation, String enseignantNom);
}
