package com.qcmplatform.service.impl;

import com.qcmplatform.entity.Evaluation;
import com.qcmplatform.entity.User;
import com.qcmplatform.service.interfaces.EmailServiceI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailServiceI {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String expediteur;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Async
    @Override
    public void notifierNouveauTest(List<User> etudiants, Evaluation evaluation, String enseignantNom) {
        for (User etudiant : etudiants) {
            try {
                envoyerEmail(etudiant, evaluation, enseignantNom);
            } catch (Exception e) {
                log.warn("Échec envoi email à {} : {}", etudiant.getEmail(), e.getMessage());
            }
        }
    }

    private void envoyerEmail(User etudiant, Evaluation evaluation, String enseignantNom) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(expediteur);
        helper.setTo(etudiant.getEmail());
        helper.setSubject("📝 Nouveau test disponible : " + evaluation.getTitre());
        helper.setText(construireCorps(etudiant, evaluation, enseignantNom), true);

        mailSender.send(message);
        log.info("Email envoyé à {}", etudiant.getEmail());
    }

    private String construireCorps(User etudiant, Evaluation evaluation, String enseignantNom) {
        String lienTest = frontendUrl + "/etudiant/tests/" + evaluation.getId();
        return """
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
                    .container { max-width: 560px; margin: 40px auto; background: white;
                                 border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
                    .header { background: #4f46e5; padding: 32px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 22px; }
                    .body { padding: 32px; color: #374151; }
                    .body h2 { color: #111827; margin-top: 0; }
                    .card { background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0; }
                    .card p { margin: 4px 0; font-size: 14px; }
                    .card strong { color: #4f46e5; }
                    .btn { display: inline-block; background: #4f46e5; color: white; padding: 12px 28px;
                           border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
                    .footer { text-align: center; padding: 16px; font-size: 12px; color: #9ca3af; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>📚 QCM Platform</h1>
                    </div>
                    <div class="body">
                      <h2>Bonjour %s,</h2>
                      <p>Un nouveau test vient d'être publié par votre enseignant <strong>%s</strong>.</p>
                      <div class="card">
                        <p><strong>Titre :</strong> %s</p>
                        <p><strong>Objectifs :</strong> %s</p>
                        <p><strong>Nombre de questions :</strong> %d</p>
                      </div>
                      <p>Connectez-vous à la plateforme pour y accéder :</p>
                      <a href="%s" class="btn">Accéder au test →</a>
                    </div>
                    <div class="footer">
                      QCM Platform · Vous recevez cet email car vous êtes inscrit sur la plateforme.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(
                etudiant.getPrenom(),
                enseignantNom,
                evaluation.getTitre(),
                evaluation.getObjectifs(),
                evaluation.getQuestions().size(),
                lienTest
        );
    }
}
