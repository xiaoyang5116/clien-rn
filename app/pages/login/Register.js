import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { TextButton } from '../../constants/custom-ui';
import { EyeComponent } from './Login';

const Register = props => {
  const { onClose, setPage } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstPasswordIsHide, setFirstPasswordIsHide] = useState(true);
  const [twoPasswordIsHide, setTwoPasswordIsHide] = useState(true);

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
        注册
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
          secureTextEntry={firstPasswordIsHide}
        />
        <EyeComponent isHidePassword={firstPasswordIsHide} setIsHidePassword={setFirstPasswordIsHide} />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="lock1" style={{ fontSize: 24, marginLeft: 12 }} />
        <TextInput
          style={styles.input}
          maxLength={12}
          placeholder={'重新输入密码'}
          onChangeText={changePassword}
          textContentType={'password'}
          secureTextEntry={twoPasswordIsHide}
        />
        <EyeComponent isHidePassword={twoPasswordIsHide} setIsHidePassword={setTwoPasswordIsHide} />
      </View>
      <View style={{ marginTop: 20 }}>
        <TextButton title={'提交'} onPress={() => setPage('register')} />
      </View>
      <View style={{ marginTop: 20 }}>
        <TextButton title={'返回'} onPress={() => setPage('login')} />
      </View>
    </View>
  );
};

export default Register;

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
