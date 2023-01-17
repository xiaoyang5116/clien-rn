import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState, useRef } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { TextButton } from '../../constants/custom-ui';
import { AppDispath, EventKeys } from '../../constants';
import { ErrorMsg } from './Register';

export const EyeComponent = ({ isHidePassword, setIsHidePassword }) => {
  return (
    <Entypo
      name={isHidePassword ? 'eye-with-line' : 'eye'}
      style={{ fontSize: 24, marginRight: 12 }}
      onPress={() => { setIsHidePassword(!isHidePassword) }}
    />
  );
};

async function LoginApi({ username, password }) {
  const url = 'http://172.10.1.81:8443/unAuth/login/password';
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    return await response.json();
  } catch (error) {
    console.log('Request Failed', error);
  }
}

const Login = props => {
  const { onClose, setPage } = props;
  const username = useRef("")
  const password = useRef("")
  const [usernameErrorMsg, setUsernameErrorMsg] = useState(null)
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null)
  const [isHidePassword, setIsHidePassword] = useState(true);

  const changeUsername = value => {
    username.current = value
  };
  const changePassword = value => {
    password.current = value
  };

  const handlerLogin =  async () => {
    // Keyboard.dismiss()
    let isRegister = true
    // if (username.current.length === 0) {
    //   isRegister = false
    //   setUsernameErrorMsg("用户名不能为空")
    // } else {
    //   setUsernameErrorMsg(null)
    // }
    // if (password.current.length === 0) {
    //   isRegister = false
    //   setPasswordErrorMsg("密码不能为空")
    // } else {
    //   setPasswordErrorMsg(null)
    // }
    if (isRegister) {
      const result = await LoginApi({ username: username.current, password: password.current })
      if (result) {
        AppDispath({
          type: 'UserModel/register', payload: result, cb: (v) => {
            if (v === true) {
              onClose()
            }
          }
        })
      }
    }
  }

  return (
    <View style={styles.viewContainer}>
      <Text
        style={{
          marginTop: 24,
          marginBottom: 24,
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
      <ErrorMsg msg={usernameErrorMsg} />
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
      <ErrorMsg msg={passwordErrorMsg} />
      <View style={{ marginTop: 20 }}>
        <TextButton title={'登录'} onPress={handlerLogin} />
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
    // marginTop: 24,
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
