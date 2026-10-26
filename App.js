// App.js — appens indgangspunkt.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UdgiftProvider } from './context/UdgiftContext';
import OversigtScreen from './screens/OversigtScreen';
import UdgifterScreen from './screens/UdgifterScreen';
import TilfoejScreen from './screens/TilfoejScreen';
import IndsigtScreen from './screens/IndsigtScreen';
import BudgetScreen from './screens/BudgetScreen'; // NYT I V2
import { colors } from './styles/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UdgiftProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Oversigt"
          screenOptions={{
            headerStyle: { backgroundColor: colors.baggrund },
            headerShadowVisible: false,
            headerTintColor: colors.tekst,
            contentStyle: { backgroundColor: colors.baggrund },
          }}
        >
          <Stack.Screen
            name="Oversigt"
            component={OversigtScreen}
            options={{ title: 'Finora' }}
          />
          <Stack.Screen
            name="Udgifter"
            component={UdgifterScreen}
            options={{ title: 'Udgifter' }}
          />
          <Stack.Screen
            name="Tilfoej"
            component={TilfoejScreen}
            options={{ title: 'Ny udgift' }}
          />
          <Stack.Screen
            name="Indsigt"
            component={IndsigtScreen}
            options={{ title: 'AI-indsigt' }}
          />
          {/* NYT I V2 */}
          <Stack.Screen
            name="Budget"
            component={BudgetScreen}
            options={{ title: 'Mit budget' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UdgiftProvider>
  );
}
