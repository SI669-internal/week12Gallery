import { Button } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { savePicture } from '../data/Actions';

function CameraScreen({navigation}) {
  
  const currentUser = useSelector(state => state.currentUser);
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);

  async function getPermissions(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log('status', status);
    setHasPermission(status === 'granted');
  }
  useEffect(()=>{
    getPermissions();
  }, []);

  let theCamera = undefined;

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <Button
          type='clear'
          size='sm'
          onPress={async () => {
            navigation.goBack();
          }}
        >
          {'< Back Home'}
        </Button>
      </View>

      <Text style={{padding:'5%'}}>
        Hi, {currentUser?.displayName}! Time to take a picture!
      </Text>

      <View style={styles.cameraContainer}>
        { hasPermission ? 
            <Camera 
              style={styles.camera}
              ratio='4:3'
              pictureSize='Medium'
              type={CameraType.back}
              ref={ref => theCamera = ref}
            />
          :
            <Text>Can't access camera--check permissions?</Text>
          }
      </View>

      <Button
        onPress={async () => {
          let pictureObject = await theCamera.takePictureAsync({quality: 0.1});
          dispatch(savePicture(pictureObject));
          navigation.goBack();
        }}
      >
        Snap!
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

  cameraContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  camera: {
    flex: 0.85,
    height: '100%',
    width: '100%',
  },
});

export default CameraScreen;