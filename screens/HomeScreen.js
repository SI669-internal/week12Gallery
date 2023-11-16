import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser, signOut } from '../AuthManager';
import { useEffect } from 'react';
import { subscribeToUserOnSnapshot } from '../data/Actions';

function HomeScreen({navigation}) {
  
  const currentUser = useSelector(state => state.currentUser);
  const gallery = currentUser.gallery;

  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(subscribeToUserOnSnapshot(getAuthUser().uid));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <Button
          type='clear'
          size='sm'
          onPress={async () => {
            signOut();
          }}
        >
          {'< Sign Out'}
        </Button>
      </View>

      <Text style={{padding:'5%'}}>
        Hi, {currentUser?.displayName}! Here are your photos:
      </Text>

      <View style={styles.listContainer}>
        <FlatList
          data={gallery}
          keyExtractor={item=>item.uri}
          renderItem={({item}) => {
            return (
              <View>
                <Image
                  style={styles.logo}
                  source={item}
                />
              </View>
            );
          }}

        />

      </View>
      <Button
        onPress={async () => {
          navigation.navigate('Camera');
        }}
      >
        Take a picture
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHeader: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    padding: '5%',
    //backgroundColor: 'green'
  },
  listContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%'
  }, 
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  }
});

export default HomeScreen;