import React, { ComponentType } from 'react';
import { Session } from '@supabase/supabase-js';
import { SessionContext } from './SessionProvider';

export interface WithSessionProps {
  session: Session | null;
}

export function withSession<T extends WithSessionProps>(
  WrappedComponent: ComponentType<T>,
) {
  return function WithSessionComponent(props: Omit<T, keyof WithSessionProps>) {
    return (
      <SessionContext.Consumer>
        {(session) => <WrappedComponent {...(props as T)} session={session} />}
      </SessionContext.Consumer>
    );
  };
}
