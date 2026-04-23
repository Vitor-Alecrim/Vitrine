import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home';
import Detail from './pages/Detail';
import AddPants from './pages/AddPants'; // ✅ corrigido

const Stack = createNativeStackNavigator();

function Routes(){
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }}
                />

                <Stack.Screen 
                    name="Detail"
                    component={Detail}
                />

                {/* 🔥 FALTAVA ISSO */}
                <Stack.Screen 
                    name="AddPants"
                    component={AddPants}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}



export default function App() {
  return <Routes />;
}