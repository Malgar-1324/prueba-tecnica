import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import TareasListScreen from './src/screens/TareasListScreen';
import CrearTareaScreen from './src/screens/CrearTareaScreen';
import DetalleTareaScreen from './src/screens/DetalleTareaScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="TareasList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="TareasList"
          component={TareasListScreen}
          options={{ title: '📝 Mis Tareas' }}
        />
        <Stack.Screen
          name="CrearTarea"
          component={CrearTareaScreen}
          options={{ title: 'Nueva Tarea' }}
        />
        <Stack.Screen
          name="DetalleTarea"
          component={DetalleTareaScreen}
          options={{ title: 'Detalle de Tarea' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
