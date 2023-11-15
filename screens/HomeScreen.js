import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { signOut } from '../AuthManager';

function HomeScreen({navigation}) {
  
  const currentUser = useSelector(state => state.currentUser);
  const picture = useSelector(state => state.picture);

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
        <Image
          style={styles.logo}
          source={picture}
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
    width: '90%',
    height: '90%',
    resizeMode: 'contain'
  }
});

export default HomeScreen;