import type { ImperativeRouter } from 'expo-router';

type Href = Parameters<ImperativeRouter['replace']>[0];

export function resetNavigationTo(router: ImperativeRouter, href: Href): void {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace(href);
}
