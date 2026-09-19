import { test, expect } from '@playwright/test';

/**
 * Smoke tests de la page d'accueil (version web Expo / react-native-web).
 *
 * Ces tests vérifient que l'application se charge et que les éléments
 * principaux de l'écran d'accueil sont bien rendus. Ils servent de garde-fou
 * pour détecter une régression bloquante sur le démarrage de l'app web.
 *
 * Les textes proviennent des traductions i18n (fr-FR par défaut).
 */
test.describe('Page d\'accueil', () => {
  test('charge l\'application et affiche les éléments principaux', async ({ page }) => {
    await page.goto('/');

    // Le titre de l'onglet doit contenir le nom de l'app.
    await expect(page).toHaveTitle(/Tournois.*Pétanque/i);

    // Le logo de l'application doit être présent.
    await expect(page.getByAltText(/Logo de l'application/i)).toBeVisible();

    // Bouton d'authentification (utilisateur non connecté).
    await expect(page.getByRole('button', { name: 'Authentification' })).toBeVisible();

    // Bouton de création d'un nouveau tournoi.
    await expect(page.getByRole('button', { name: 'Nouveau Tournoi' })).toBeVisible();

    // Accès aux anciens tournois et aux listes de joueurs.
    await expect(page.getByRole('button', { name: 'Mes anciens tournois' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mes listes de joueurs' })).toBeVisible();

    // Indication qu'aucun tournoi n'est en cours (état initial).
    await expect(page.getByText('Pas de tournoi en cours')).toBeVisible();

    // Mention du développeur en pied de page.
    await expect(page.getByText(/Développé par.*Mathis Cadio/i)).toBeVisible();
  });

  test('navigue vers l\'écran d\'authentification', async ({ page }) => {
    await page.goto('/');

    const boutonAuth = page.getByRole('button', { name: 'Authentification' });
    await boutonAuth.click();

    // On s'attend à atterrir sur la route /connexion.
    await expect(page).toHaveURL(/\/connexion/);
  });
});
