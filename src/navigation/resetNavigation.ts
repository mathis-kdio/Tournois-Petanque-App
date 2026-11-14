import {
  CommonActions,
  type NavigationState,
} from 'expo-router/react-navigation';

type ResetAction = ReturnType<typeof CommonActions.reset>;

type NavigationLike = {
  getState(): NavigationState | undefined;
  dispatch(action: ResetAction): void;
};

export function resetNavigationTo(
  navigation: NavigationLike,
  routeName: string,
): void {
  const state = navigation.getState();
  if (!state) return;

  navigation.dispatch(
    CommonActions.reset({
      ...state,
      index: 0,
      routes: [{ name: routeName }],
      stale: false,
    }),
  );
}
