import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { subscribeToUsers, 
  getFBAuth, signOutFB, saveAndDispatch, 
  subscribeToUserGallery
} from '../data/DB';

import { loadPicture } from '../data/Actions';

const auth = getFBAuth();

function HomeScreen({navigation}) {
  
  const currentUser = useSelector(state => {
    const currentUserId = auth.currentUser.uid;
    return state.users.find(u => u.uid === currentUserId);
  });

  // OBSOLETE?
  const picture = useSelector(state => state.picture);

  const gallery = useSelector(state => state.gallery);

  const dispatch = useDispatch();

  useEffect(()=>{
    subscribeToUsers(dispatch);
    subscribeToUserGallery(dispatch);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <Button
          type='clear'
          size='sm'
          onPress={async () => {
            signOutFB();
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
          renderItem={({item}) => {
            return (
              <Image
                style={styles.logo}
                source={item /*already has uri*/}
              />
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
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
});

export default HomeScreen;