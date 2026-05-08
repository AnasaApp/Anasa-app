import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  GetSupportDetailReducer,
  ReplySupportReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';

import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';

const Chat = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const GetSupportDetailResponse = useSelector(
    GetSupportDetailReducer.selectGetSupportDetailData,
  );
  const ReplySupportResponse = useSelector(
    ReplySupportReducer.selectReplySupportData,
  );
  const ReplySupportErrorResponse = useSelector(
    ReplySupportReducer.selectReplySupportResponse,
  );

  console.log('ReplySupportResponse', ReplySupportResponse);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    callGetDetailApi();
  }, []);

  const callGetDetailApi = () => {
    const payload = {
      uri: `/${route?.params?.ticket_id}`,
    };
    dispatch({type: SagaActions.GET_SUPPORT_DETAIL, payload: payload});
  };
  useEffect(() => {
    if (ReplySupportResponse != null) {
      if (ReplySupportResponse?.message != '') {
        Toast.show(ReplySupportResponse?.message, Toast.LONG);
        dispatch(ReplySupportReducer.removeReplySupportResponse());
        const payload = {
          uri: `/${route?.params?.ticket_id}`,
        };
        dispatch({type: SagaActions.GET_SUPPORT_DETAIL, payload: payload});
        setReply('');
      }
    }
  }, [ReplySupportResponse]);
  useEffect(() => {
    if (ReplySupportErrorResponse != null) {
      Toast.show(ReplySupportErrorResponse?.message, Toast.LONG);
      dispatch(ReplySupportReducer.removeReplySupportResponse());
    }
  }, [ReplySupportErrorResponse]);
  const [reply, setReply] = useState('');

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <View
          style={{
            width: '70%',
            alignSelf: item.replyBy == 'Buyer' ? 'flex-end' : 'flex-start',
          }}>
          <View
            style={[
              item.replyBy == 'Buyer'
                ? styles.flatlistCss
                : styles.flatlistCss2,
              {
                backgroundColor:
                  item.replyBy == 'Buyer' ? '#829CC6' : '#EDF1F7',
              },
            ]}>
            <Text
              style={[
                styles.chatText,
                {color: item.replyBy == 'Buyer' ? '#fff' : '#080B25'},
              ]}>
              {item.message}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {moment(item.createdAt).format('MMM DD YY hh:mm a')}
          </Text>
        </View>
      </View>
    );
  };
  const onPressSave = () => {
    if (reply == '') {
      return Toast.show(t('Message should not be empty'), Toast.LONG);
    }
    const payload = {
      ticketId: route?.params?.ticket_id,
      reply: reply,
    };
    dispatch({type: SagaActions.REPLY_SUPPORT, payload});
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title={t('Tickets')}
      />

      <View style={styles.mainCss}>
        <View style={styles.ticketIDCss}>
          <Text style={styles.ticketID}>
            {t('Ticket Id:')}
            <Text
              style={{
                color: '#4F74B0',
                fontFamily: config.fonts.Poppins_Regular,
                fontSize: 12,
              }}>
              {' '}
              {GetSupportDetailResponse?.results?.support?._id}
            </Text>
          </Text>
          <Text
            style={{
              color: config.colors.Black,
              fontFamily: config.fonts.Poppins_Medium,
              fontSize: 14,
            }}>
            {GetSupportDetailResponse?.results?.support?.subject}
          </Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={GetSupportDetailResponse?.results?.support?.reply}
          refreshControl={
            <RefreshControl
              refreshing={false}
              colors={[config.colors.buttonColor, config.colors.buttonColor]}
              onRefresh={() => callGetDetailApi()}
            />
          }
        />
      </View>
      <View style={styles.inputmainCss}>
        <Image
          style={styles.emojiIcon}
          resizeMode="contain"
          source={require('../../assets/images/emoji.png')}
        />
        <TextInput
          style={styles.input}
          placeholder="Type your message.."
          placeholderTextColor={'#ABB2B7'}
          onChangeText={val => setReply(val)}
          value={reply}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.sendbutton}
          onPress={() => onPressSave()}>
          <Image
            style={styles.sendIcon}
            resizeMode="contain"
            source={require('../../assets/images/Sendicon.png')}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    paddingBottom: 10,
  },
  mainCss: {
    marginHorizontal: 15,
    flex: 1,
  },
  ticketIDCss: {
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    paddingBottom: 5,
  },
  ticketID: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Black,
    fontSize: 12,
  },
  chatMainCss: {
    width: '70%',
    alignSelf: 'flex-end',
  },
  chatMainCss2: {
    width: '70%',
    // alignSelf: 'flex-end'
    // backgroundColor:'red'
  },
  flatlistCss: {
    height: 55,
    width: '100%',
    alignSelf: 'flex-end',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
  },
  flatlistCss2: {
    height: 55,
    width: '100%',
    alignSelf: 'flex-start',
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#EDF1F7',
  },
  timeText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: '#969EA4',
    marginLeft: 20,
    marginTop: 5,
    fontSize: 10,
  },
  chatText: {
    // fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
  },
  inputmainCss: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderColor: '#ECECEC',
    paddingHorizontal: 5,
  },
  emojiIcon: {
    height: 24,
    width: 24,
    marginLeft: 4,
  },
  input: {
    fontSize: 12,
    width: '75%',
    color: config.colors.Black,
  },
  sendbutton: {
    backgroundColor: '#4F74B0',
    height: 38,
    width: 38,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    height: 16,
    width: 20,
    marginLeft: 3,
  },
});

export default Chat;
