import React, { useRef, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DefaultModal from "../modal/DefaultModal";
import {
  Card,
  CardHead,
  CardHeadTit,
  GoViewBtn,
  List,
  ListTitBox,
  ListTit,
  ListTxt,
  ListTxtColor,
  Days,
  ClipboardBtn,
  FlexBoth,
  ClipSpan,
  Price,
  InfoBox,
  InfoTxt,
  Bold,
} from "../../components/history/HistoryStyle";

export default function Item({ onPress, item, copyToClipboard }) {
  // 모달
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  const caregiver = 2;
  const ChoiceItemStyle = {
    0: {
      statusColor: { color: "#0077FF" },
      statusText: "희망간병비 200,000원",
      modalBtn: true,
    },
  };

  return (
    <>
      <Card
        style={{
          ...styles.shadow,
          backgroundColor: "#fff",
          borderRadius: 8,
        }}
      >
        <CardHead>
          <CardHeadTit style={ChoiceItemStyle[item.status].statusColor}>
            {ChoiceItemStyle[item.status].statusText}
          </CardHeadTit>
          <GoViewBtn text="공고보기" onPress={onPress} />
        </CardHead>

        <List>
          <ListTitBox>
            <ListTit>
              <Icon name="calendar-outline" size={14} color="#979797" /> 간병
              기간
            </ListTit>
            <Days>(2박 3일)</Days>
          </ListTitBox>
          <ListTxt>21.07.23 ~ 21.07.25</ListTxt>
        </List>

        <List>
          <ListTitBox>
            <ListTit>
              <Icon name="person-outline" size={14} color="#979797" /> 환자 성함
            </ListTit>
          </ListTitBox>
          <ListTxt>김환자</ListTxt>
        </List>

        <List last={true}>
          <ListTitBox>
            <ListTit>
              <Icon name="location-outline" size={14} color="#979797" /> 간병
              주소
            </ListTit>
          </ListTitBox>
          <ListTxt>
            대전광역시 중구 목중로 29 (대전광역시 중구 목동10-7) 대전선병원
          </ListTxt>
        </List>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 6,
  },
});