import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home';
import Detail from './pages/Detail';
import AddPants from './pages/AddPants';
import EditPants from './pages/EditPants/index.js';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Wishlist from './pages/Wishlist';

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

                {/* FALTAVA ISSO */}
                <Stack.Screen 
                    name="AddPants"
                    component={AddPants}
                />

                <Stack.Screen 
                    name="EditPants"
                    component={EditPants}
                />

                <Stack.Screen
                    name="Login"
                    component={Login}
                />


                <Stack.Screen
                    name="Register"
                    component={Register}
                />

                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                />


                <Stack.Screen
                    name="Wishlist"
                    component={Wishlist}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}



export default Routes;