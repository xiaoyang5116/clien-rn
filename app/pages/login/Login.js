import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { TextButton } from '../../constants/custom-ui';

export const EyeComponent = ({ isHidePassword, setIsHidePassword }) => {
  return (
    <Entypo
      name={isHidePassword ? 'eye-with-line' : 'eye'}
      style={{ fontSize: 24, marginRight: 12 }}
      onPress={() => { setIsHidePassword(!isHidePassword) }}
    />
  );
};

const Login = props => {
  const { onClose, setPage } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isHidePassword, setIsHidePassword] = useState(true);

  const changeUsername = value => {
    console.log('value', value);
  };
  const changePassword = value => {
    console.log('value', value);
  };

  return (
    <View style={styles.viewContainer}>
      <Text
        style={{
          marginTop: 24,
          fontSize: 20,
          color: '#000',
          textAlign: 'center',
        }}>
        登录
      </Text>
      <View style={styles.inputContainer}>
        <AntDesign name="user" style={{ fontSize: 24, marginLeft: 12 }} />
        <TextInput
          style={styles.input}
          keyboardType={'number-pad'}
          maxLength={12}
          placeholder={'账号'}
          onChangeText={changeUsername}
          textContentType={'username'}
        />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="lock1" style={{ fontSize: 24, marginLeft: 12 }} />
        <TextInput
          style={styles.input}
          maxLength={12}
          placeholder={'密码'}
          onChangeText={changePassword}
          textContentType={'password'}
          secureTextEntry={isHidePassword}
        />
        <EyeComponent
          isHidePassword={isHidePassword}
          setIsHidePassword={setIsHidePassword}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <TextButton title={'登录'} />
      </View>
      <View style={{ marginTop: 20 }}>
        <TextButton title={'注册'} onPress={() => setPage('register')} />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#fff',
    padding: 0,
    color: '#000',
  },
});
