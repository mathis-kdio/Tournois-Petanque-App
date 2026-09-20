import { expect, test } from '@playwright/test';

/**
 * Smoke tests de la page d'accueil (version web Expo / react-native-web).
 *
 * Ces tests vérifient que l'application se charge et que les éléments
 * principaux de l'écran d'accueil sont bien rendus. Ils servent de garde-fou
 * pour détecter une régression bloquante sur le démarrage de l'app web.
 *
 * Les textes proviennent des traductions i18n (fr-FR par défaut).
 */
test.describe("Page d'accueil", () => {
  test("charge l'application et affiche les éléments principaux", async ({
    page,
  }) => {
    await page.goto('/');

    // Le titre de l'onglet doit contenir le nom de l'app.
    await expect(page).toHaveTitle(/Tournois.*Pétanque/i);

    // Le logo de l'application doit être présent.
    await expect(page.getByAltText(/Logo de l'application/i)).toBeVisible();

    // Bouton d'authentification (utilisateur non connecté).
    // Utilise le composant Button Gluestack → <button> natif, le rôle est fiable.
    await expect(
      page.getByRole('button', { name: 'Authentification' }),
    ).toBeVisible();

    // Les boutons ci-dessous utilisent CardButton → Pressable → <div role="button">.
    // Sur web, le nom accessible calculé inclut le glyphe de l'icône FontAwesome,
    // ce qui rend getByRole('button', { name: ... }) peu fiable.
    // On cible donc directement le texte rendu par le composant <Text>.
    await expect(page.getByText('Nouveau Tournoi')).toBeVisible();
    await expect(page.getByText('Mes anciens tournois')).toBeVisible();
    await expect(page.getByText('Mes listes de joueurs')).toBeVisible();

    // Indication qu'aucun tournoi n'est en cours (état initial).
    await expect(page.getByText('Pas de tournoi en cours')).toBeVisible();

    // Mention du développeur en pied de page.
    await expect(page.getByText(/Développé par.*Mathis Cadio/i)).toBeVisible();
  });

  test("navigue vers l'écran d'authentification", async ({ page }) => {
    await page.goto('/');

    const boutonAuth = page.getByRole('button', { name: 'Authentification' });
    await boutonAuth.click();

    // On s'attend à atterrir sur la route /connexion.
    await expect(page).toHaveURL(/\/connexion/);
  });
});
