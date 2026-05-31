import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  Modal
} from 'react-native';

import { BASE_URL } from '../../services/api';
import { MaterialIcons } from '@expo/vector-icons';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

import { Alert } from 'react-native';

import Pants from '../../component/Pants';

import {
  auth,
  db
} from "../../services/firebaseConfig";

import {
  onAuthStateChanged
} from 'firebase/auth';


export default function Home({ navigation }) {

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pants, setPants] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // FILTROS
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterColor, setFilterColor] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pants"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPants(lista);
    });

    return () => unsubscribe();
  }, []);

useEffect(() => {

  async function checkAdmin() {

    const user = auth.currentUser;

    if(user) {

      const docRef =
        doc(db, "users", user.uid);

      const docSnap =
        await getDoc(docRef);

      if(docSnap.exists()) {

        const data = docSnap.data();

        if(data.role === 'admin') {

          setIsAdmin(true);

        }

      }

    }

  }

  checkAdmin();

}, []);

async function handleWishlist(item){

  if(!user){
    return;
  }

  try{

    const docRef = doc(db, "favorites", user.uid);

    const isFavorite =
      favorites.includes(item.id);

    if(isFavorite){

      // REMOVE

      await setDoc(
        docRef,
        {
          items: arrayRemove(item.id)
        },
        { merge: true }
      );

      setFavorites(prev =>
        prev.filter(id => id !== item.id)
      );

    }else{

      // ADICIONA

      await setDoc(
        docRef,
        {
          items: arrayUnion(item)
        },
        { merge: true }
      );

      setFavorites(prev => [
        ...prev,
        item.id
      ]);

    }

  }catch(error){

    console.log(error);

    Alert.alert(
      "Erro",
      "Não foi possível atualizar favoritos."
    );

  }

}


useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, (userLogged) => {

    setUser(userLogged);

  });

  return unsubscribe;

}, []);




  function formatPrice(value) {
    if (!value) return "R$ 0,00";
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  }

  const toggleItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id);

    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const gerarMensagem = () => {
    if (selectedItems.length === 0) {
      return "Olá! Ainda não selecionei calças.";
    }

    const lista = selectedItems
      .map(item => `- ${item.name} (R$ ${Number(item.price).toFixed(2)})`)
      .join("\n");

    const total = selectedItems.reduce((soma, item) => soma + Number(item.price), 0);

    return `Olá! Gostaria de fazer um pedido de calças:\n\n${lista}\n\nTotal: R$ ${total.toFixed(2)}`;
  };

  const enviarWhatsApp = () => {
    const numero = "Telefone_Whatapp"; // Numero Whatsapp do Vendedor
    const mensagem = encodeURIComponent(gerarMensagem());

    const url = `https://wa.me/${numero}?text=${mensagem}`;
    Linking.openURL(url);
  };


  // FILTRO
  const filteredPants = pants.filter(item => {

    const itemName = item.name || '';

    // arrays vindos do Firebase
    const itemSizes = item.sizes || [];
    const itemColors = item.colors || [];

    const nameMatch =
      itemName.toLowerCase().includes(filterName.toLowerCase());

    const sizeMatch =
      filterSize === '' ||
      itemSizes.some(size =>
      String(size)
        .toLowerCase()
        .includes(filterSize.toLowerCase())
    );

    const colorMatch =
      filterColor === '' ||
    itemColors.some(color =>
      String(color)
        .toLowerCase()
        .includes(filterColor.toLowerCase())
    );

    return nameMatch && sizeMatch && colorMatch;
  });

  const favoritePants =
  pants.filter(item =>
    favorites.includes(item.id)
  );

        function handleMenu(item){

          setSelectedItem(item);
          setVisible(true);

        }

        async function deleteItem(id){

          try{

            await deleteDoc(doc(db, "pants", id));

            setVisible(false);

            Alert.alert(
              "Sucesso",
              "Produto excluído com sucesso!"
            );

          }catch(error){

            console.log(error);

            Alert.alert(
              "Erro",
              "Não foi possível excluir o produto."
            );

          }

        }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/banner.png')}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.text}>D&A</Text>
            <Text style={[styles.text, styles.gray]}>•</Text>
            <Text style={[styles.text, styles.gray]}>MODAS</Text>
          </View>

          <View style={styles.row}>

            {
              !user && (

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login')}
                >

                  <Text style={styles.loginText}>
                    Login
                  </Text>

                </TouchableOpacity>

              )
            }


            
            {isAdmin ? (

              <TouchableOpacity
                onPress={() => navigation.navigate('AddPants')}
                style={styles.icon}
              >

                <MaterialIcons
                  name="add"
                  size={28}
                  color="#000"
                />

              </TouchableOpacity>

            ) : user ? (

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Wishlist')
                }
                style={styles.icon}
              >

                <MaterialIcons
                  name="favorite"
                  size={26}
                  color="red"
                />

              </TouchableOpacity>

            ) : null}

            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
            >
              <MaterialIcons name="filter-list" size={24} color="#000" />
            </TouchableOpacity>

          </View>
        </View>

      {/* FILTROS */}
      {showFilters && (
        <View style={styles.filterContainer}>

          <TextInput
            placeholder="Buscar por nome"
            value={filterName}
            onChangeText={setFilterName}
            style={styles.input}
          />

          <TextInput
            placeholder="Filtrar tamanho"
            value={filterSize}
            onChangeText={setFilterSize}
            style={styles.input}
          />

          <TextInput
            placeholder="Filtrar cor"
            value={filterColor}
            onChangeText={setFilterColor}
            style={styles.input}
          />

        </View>
      )}
      
      </View> {/* ← FECHA O HEADER */}
      <View style={styles.line} />

{/* LISTA */}
<ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scroll}
>
  <Text style={styles.sectionTitle}>
    LANÇAMENTOS
  </Text>

  {filteredPants.length === 0 ? (

    <Text style={styles.empty}>
      Nenhuma calça encontrada 😢
    </Text>

  ) : (

    <View style={styles.list}>

      {filteredPants.map(item => (

        <Pants
          key={item.id}

          image={
            item.images && item.images.length > 0
              ? { uri: `${BASE_URL}/uploads/${item.images[0]}` }
              : require('../../assets/1.png')
          }

          price={formatPrice(item.price)}
          name={item.name}

          onClick={() =>
            navigation.navigate('Detail', { item })
          }

          showCheckbox={true}

          isSelected={
            selectedItems.some(i => i.id === item.id)
          }

          onSelect={() => toggleItem(item)}

          showWishlist={!isAdmin && !!user}

          isFavorite={
            favorites.includes(item.id)
          }

          onWishlist={() =>
            handleWishlist(item)
          }

          onMenuPress={
            isAdmin
              ? () => handleMenu(item)
              : null
          }

          showActions={isAdmin}
        />

      ))}

    </View>

  )}

</ScrollView>


      {/* FOOTER */}
      <TouchableOpacity
        onPress={enviarWhatsApp}
        style={styles.footerButton}
      >
        <Text style={styles.footerText}>
          Enviar lista no WhatsApp ({selectedItems.length})
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
      >

        <View style={styles.overlay}>

          <View style={styles.modalContainer}>

            <Text style={styles.modalTitle}>
              {selectedItem?.name}
            </Text>

            <Text style={styles.modalSubtitle}>
              Escolha uma opção
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {

                setVisible(false);

                navigation.navigate('EditPants', {
                  item: selectedItem
                });

              }}
            >
              <Text style={styles.modalButtonText}>
                Editar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.deleteButton
              ]}
              onPress={() => selectedItem && deleteItem(selectedItem.id)}
            >
              <Text style={styles.deleteButtonText}>
                Excluir
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </View>
  );

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#FFF'
  },

  header:{
    marginBottom: 8
  },

  image:{
    width: '100%',
    height: 180,
    resizeMode: 'cover'
  },

  textContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: '5%',
    marginHorizontal: '5%'
  },

  row:{
    flexDirection: 'row',
    alignItems: 'center'
  },

  text:{
    fontFamily: 'Anton_400Regular',
    fontSize: 26,
    marginHorizontal: '1%'
  },

  gray:{
    color: '#CECECF'
  },

  icon:{
    marginRight: 15
  },

  filterContainer:{
    paddingHorizontal: 20,
    marginBottom: 10
  },

  input:{
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF'
  },

  sectionTitle:{
    fontFamily: 'Anton_400Regular',
    fontSize: 24,
    marginHorizontal: '5%',
    marginVertical: 10
  },

  list:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },

  scroll:{
    paddingBottom: 80
  },

  empty:{
    textAlign: 'center',
    marginTop: 20,
    color: '#888'
  },

  line:{
    borderBottomColor: '#D8d8d8',
    borderBottomWidth: 2,
  },

  footerButton:{
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center'
  },

  footerText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

overlay:{
  flex:1,
  backgroundColor:'rgba(0,0,0,0.5)',
  justifyContent:'center',
  alignItems:'center'
},

modalContainer:{
  width:'85%',
  backgroundColor:'#FFF',
  borderRadius:12,
  padding:20
},

modalTitle:{
  fontSize:20,
  fontWeight:'bold',
  textAlign:'center'
},

modalSubtitle:{
  fontSize:15,
  color:'#666',
  textAlign:'center',
  marginTop:5,
  marginBottom:20
},

modalButton:{
  backgroundColor:'#EEE',
  padding:15,
  borderRadius:8,
  marginBottom:10,
  alignItems:'center'
},

modalButtonText:{
  fontSize:16,
  fontWeight:'600'
},

deleteButton:{
  backgroundColor:'#ffe5e5'
},

deleteButtonText:{
  color:'#cc0000',
  fontSize:16,
  fontWeight:'bold'
},

cancelButton:{
  marginTop:10,
  alignItems:'center'
},

cancelButtonText:{
  color:'#666',
  fontSize:15
},

loginButton: {
  backgroundColor: '#000',
  paddingHorizontal: 18,
  height: 38,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12
},

loginText: {
  color: '#FFF',
  fontWeight: 'bold',
  fontSize: 14
}

});
