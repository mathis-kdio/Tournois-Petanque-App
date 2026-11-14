import type { ImperativeRouter } from 'expo-router';

type Href = Parameters<ImperativeRouter['replace']>[0];

export function resetNavigationTo(router: ImperativeRouter, href: Href): void {
  // POP_TO_TOP n'est pas géré quand la stack n'a qu'une seule route :
  // on ne le tente que s'il y a quelque chose à dismiss.
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace(href);
}
