import { StyleSheet, Text, View, TextInput, Keyboard, DeviceEventEmitter } from 'react-native';
import React, { useRef, useState } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { TextButton } from '../../constants/custom-ui';
import { EyeComponent } from './Login';
import { AppDispath, EventKeys } from '../../constants';
import EventListeners from '../../utils/EventListeners';

async function registerApi({ username, password }) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password)

  const url = 'http://172.10.1.81:8443/unAuth/login/register';
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        // 'Content-Type': 'application/json'
      },
      body: params.toString(),
    })
    return await response.json();
  } catch (error) {
    console.log('Request Failed', error);
  }
}

export const ErrorMsg = ({ msg, defaultMsg }) => {
  return msg
    ? (
      <View style={styles.errorMsg}>
        <Text style={{ fontSize: 16, color: "#FF2E2E" }}>{msg}</Text>
      </View>
    )
    : defaultMsg
      ? (
        <View style={styles.errorMsg}>
          <Text style={{ fontSize: 16, color: "#eee" }}>{defaultMsg}</Text>
        </View>
      )
      : (<View style={styles.errorMsg}></View>)
}

const Register = props => {
  const { onClose, setPage } = props;
  const username = useRef("")
  const password = useRef("")
  const twoPassword = useRef("")
  const [firstPasswordIsHide, setFirstPasswordIsHide] = useState(true);
  const [twoPasswordIsHide, setTwoPasswordIsHide] = useState(true);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState(null)
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null)
  const [twoPasswordErrorMsg, setTwoPasswordErrorMsg] = useState(null)

  const changeUsername = value => {
    username.current = value;
  };
  const changePassword = value => {
    password.current = value;
  };
  const changeTwoPassword = value => {
    twoPassword.current = value;
  };

  const handlerRegister = async () => {
    Keyboard.dismiss()
    let isRegister = true

    // 用户名
    if (username.current.length === 0) {
      isRegister = false
      setUsernameErrorMsg("用户名不能为空")
    } else if (username.current.length < 5) {
      isRegister = false
      setUsernameErrorMsg("用户名长度不能低于6位数")
    } else {
      setUsernameErrorMsg(null)
    }

    // 密码
    if (password.current.length === 0) {
      isRegister = false
      setPasswordErrorMsg("密码不能为空")
    } else if (password.current.length < 7) {
      isRegister = false
      setPasswordErrorMsg("密码长度不能低于8位数")
    } else {
      setPasswordErrorMsg(null)
    }
    if (twoPassword.current.length === 0) {
      isRegister = false
      setTwoPasswordErrorMsg("请再次输入密码")
    } else {
      setTwoPasswordErrorMsg(null)
    }
    if (password.current != twoPassword.current) {
      isRegister = false
      setTwoPasswordErrorMsg("两次密码不一致")
    } else {
      setTwoPasswordErrorMsg(null)
    }
    if (isRegister) {
      const result = await registerApi({ username: username.current, password: password.current })
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
  };

  return (
    <View style={styles.viewContainer}>
      <Text
        style={{
          marginTop: 24,
          fontSize: 20,
          color: '#000',
          textAlign: 'center',
          marginBottom: 24
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
      <ErrorMsg msg={usernameErrorMsg} defaultMsg={"用户名长度不能低于6位数"} />
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
        <EyeComponent
          isHidePassword={firstPasswordIsHide}
          setIsHidePassword={setFirstPasswordIsHide}
        />
      </View>
      <ErrorMsg msg={passwordErrorMsg} defaultMsg={"密码长度不能低于8位数"} />
      <View style={styles.inputContainer}>
        <AntDesign name="lock1" style={{ fontSize: 24, marginLeft: 12 }} />
        <TextInput
          style={styles.input}
          maxLength={12}
          placeholder={'重新输入密码'}
          onChangeText={changeTwoPassword}
          textContentType={'password'}
          secureTextEntry={twoPasswordIsHide}
        />
        <EyeComponent
          isHidePassword={twoPasswordIsHide}
          setIsHidePassword={setTwoPasswordIsHide}
        />
      </View>
      <ErrorMsg msg={twoPasswordErrorMsg} />

      <View style={{ marginTop: 20, width: "100%" }}>
        <TextButton title={'提交'} onPress={handlerRegister} />
      </View>
      <View style={{ marginTop: 20, width: "100%" }}>
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
  errorMsg: {
    height: 24
  }
});
