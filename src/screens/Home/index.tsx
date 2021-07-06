import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
   const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
   const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    try {
      const response = await AsyncStorage.getItem('@passmanager:logins');
      const fetchData = response ? JSON.parse(response) : []; 
      // console.log(response);
      const fetchDataFormated: LoginListDataProps = fetchData.map((item: LoginDataProps) => {
        return {
          id: item.id,
          title: item.title,
          email: item.email,
          password: item.password
        }   
      });

      setData(fetchDataFormated);
      setSearchListData(fetchDataFormated);
           
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel listar logins');
    }    
  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  function handleFilterLoginData(search: string) {
    // Filter results inside data, save with setSearchListData
    if(search.trim() != '' ){
      const expensive = data.filter((responseCurrent: LoginDataProps) => 
            responseCurrent.title.substring(0,search.length) === search
      ); 
      setSearchListData(expensive);
    }else{
      setSearchListData(data);
    }    
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}