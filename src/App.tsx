import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';

import { supabase } from './src/lib/supabase';

import { RootStackParamList } from './types';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import ReviewScreen from './screens/ReviewScreen';
import InventoryScreen from './screens/InventoryScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [session, setSession] = useState(null);

  // ✅ Backend integration: subscribe to Supabase auth state
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'MyStock AI' }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen} 
            options={{ title: 'Scan Invoice' }}
          />
          <Stack.Screen 
            name="Review" 
            component={ReviewScreen} 
            options={{ title: 'Review Invoice' }}
          />
          <Stack.Screen 
            name="Inventory" 
            component={InventoryScreen} 
            options={{ title: 'Inventory' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

useEffect(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    // set user state
  });
}, []);
export default App;

