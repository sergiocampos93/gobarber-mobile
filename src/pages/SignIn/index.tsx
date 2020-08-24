import React, { useCallback, useRef } from 'react';
import {
  Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../Utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
  CustomForm,
} from './styles';

interface SignInFormData{
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInpuRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Type a valid e-mail'),
          password: Yup.string().required('Senha é obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais.');
      }
    },
    [signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>
            <CustomForm ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInpuRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInpuRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => {
                formRef.current?.submitForm();
              }}
              >
                Entrar
              </Button>
            </CustomForm>

            <ForgotPassword onPress={() => { console.log('forgot'); }}>
              <ForgotPasswordText>Esqueci a minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>

      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};
export default SignIn;
