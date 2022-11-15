import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  subscribeToUsers, 
  getFBAuth, 
  signOutFB,  
  subscribeToChat 
} from '../data/DB';

const auth = getFBAuth();

function HomeScreen({navigation}) {
  
  const users = useSelector(state => {
    //console.log('useSelector, state:', state);
    return state.users;
  });

  const currentUser = useSelector(state => {
    const currentUserId = auth.currentUser.uid;
    return state.users.find(u => u.uid === currentUserId);
  })

  const dispatch = useDispatch();

  useEffect(()=>{
    // we assume we can only navigate here if the user is logged in
    subscribeToUsers(dispatch);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{padding:'5%'}}>
        Hi, {currentUser?.displayName}! Say hello to your little friends:
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={users.filter(u => u.uid !== currentUser?.uid)}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={async ()=>{
                    await subscribeToChat(currentUser.uid, item.uid, dispatch);
                    navigation.navigate('Chat')
                  }}
                >
                  <Text>{item.displayName}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={item=>item.uid}
        />
      </View>
      <Button
        onPress={async () => {
          signOutFB();
        }}
      >
        Now sign out!
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
  listContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default HomeScreen;