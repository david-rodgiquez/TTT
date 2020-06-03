import React, { useEffect, useCallback, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { navTheme } from '../StyleSheet';
import { container } from '../store/reducers/User';
import { authService } from '../Firebase';
import LoggedOutStack from './LoggedOutStack';
import LoggedInDrawer from './LoggedInDrawer';

function Navigation({ user, storeLogin }): JSX.Element {
  const getCurrentUserCallback = useCallback(
    () =>
      authService.getCurrentUser(
        (receivedUser: { uid: string; email: string }) => {
          if (receivedUser) {
            storeLogin(receivedUser);
          }
        }
      ),
    [storeLogin]
  );

  const unsubscribe = useMemo(async () => await getCurrentUserCallback(), [
    getCurrentUserCallback,
  ]);

  useEffect(() => {
    getCurrentUserCallback();
    return async () => (await unsubscribe)();
  }, [getCurrentUserCallback, unsubscribe]);

  return (
    <NavigationContainer theme={navTheme}>
      {user.uid ? <LoggedInDrawer /> : <LoggedOutStack />}
    </NavigationContainer>
  );
}

Navigation.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  storeLogin: PropTypes.func.isRequired,
};

export default container(Navigation);
