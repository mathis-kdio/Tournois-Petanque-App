import 'react-native-url-polyfill/auto';
import React, { Component, ReactNode } from 'react';
import { supabase } from '@utils/supabase';
import { Session } from '@supabase/supabase-js';

// Créer le contexte de session
export const SessionContext = React.createContext<Session | null>(null);

interface SessionProviderState {
  session: Session | null;
}

interface SessionProviderProps {
  children: ReactNode;
}

// Composant SessionProvider
class SessionProvider extends Component<SessionProviderProps, SessionProviderState> {
  private authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;

  constructor(props: SessionProviderProps) {
    super(props);
    this.state = {
      session: null
    };
  }

  componentDidMount() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.setState({ session });
    });

    this.authListener = supabase.auth.onAuthStateChange((_event, session) => {
      this.setState({ session });
    });
  }

  componentWillUnmount() {
    if (this.authListener) {
      this.authListener.data.subscription.unsubscribe();
    }
  }

  render() {
    const { session } = this.state;
    return (
      <SessionContext.Provider value={session}>
        {this.props.children}
      </SessionContext.Provider>
    );
  }
}

export default SessionProvider;
