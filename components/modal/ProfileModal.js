import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import styled from "styled-components/native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { careTheme } from "../../contents";
import {
  FlexBoth,
  Profile,
  ProfileImg,
  ProfileName,
  ProfileDate,
} from "../form/ListStyle";
import { SubmitBtn } from "../form/CareFormStyle";
import NumberFormat from "react-number-format";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import {
  CHOICE_CAREGIVER_MUTATION,
  ANNOUNCEMENT_LIST_QUERY,
} from "../../screens/query";
import { useReactiveVar } from "@apollo/client";
import { memberVar } from "../../apollo";
import logo from "../../assets/img/simbol.png";
import ConfirmModal from "./ConfirmModal";

const ModalBackground = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;
const Container = styled.View`
  width: 100%;
  background-color: #fff;
  padding: 20px 0px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;
const ModalHeader = styled.View`
  position: relative;
  height: 50px;
  padding: 0px 20px;
`;
const ModalHeaderTxt = styled.Text`
  color: ${careTheme.COLORS.BLUE};
  font-weight: bold;
  font-size: 16px;
`;
const ModalBody = styled.View``;

const Exit = styled.TouchableOpacity`
  position: absolute;
  right: 15px;
  top: 0;
`;
const ScrollBox = styled.ScrollView`
  margin-top: 20px;
  margin-bottom: 20px;
  max-height: 300px;
  padding: 0 20px;
`;
const InnerBox = styled.View`
  margin-bottom: 15px;
  padding-bottom: 15px;
  /* border-bottom-width: ${(props) => (props.last ? "0px" : "1px")}; */
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #eee;
`;
const InnerTit = styled.Text`
  font-size: 16px;
  color: #212121;
  margin-bottom: 8px;
  font-weight: bold;
`;
const InnerTxt = styled.Text`
  font-size: 16px;
  color: #333;
  line-height: 24px;
`;
const BottomBtnBox = styled.View`
  flex-direction: row;
  padding: 0 20px;
`;
const BottomBtnLeft = styled.View`
  width: 30%;
`;
const BottomBtnRight = styled.View`
  flex: 1;
  margin-left: 10px;
`;
const Cancel = styled.TouchableOpacity`
  width: 100%;
  height: 56px;
  align-items: center;
  justify-content: center;
  background-color: #e9e9e9;
  border-radius: 8px;
`;
const CancelTxt = styled.Text`
  color: #454545;
  font-weight: normal;
  text-align: center;
  font-size: 18px;
`;
export default function ProfileModal({
  showModal,
  setShowModal,
  dataArray,
  navigation,
  confirm,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm();

  const [isVisible, setIsVisible] = useState(false);

  const onCompleted = (data) => {
    const {
      choiceCaregiver: { ok },
    } = data;
    if (ok) {
      setShowModal(false);
      setIsVisible(true);
      // Alert.alert("????????? ????????? ?????????????????????.");
      // navigation.navigate("ProgressHistoryUser");
    }
  };
  const userInfo = JSON.parse(useReactiveVar(memberVar));
  const [choiceCaregiverMutation] = useMutation(CHOICE_CAREGIVER_MUTATION, {
    onCompleted,
    refetchQueries: () => [
      {
        query: ANNOUNCEMENT_LIST_QUERY,
        variables: {
          userCode: userInfo.code,
        },
      },
    ],
  });

  const onValid = async () => {
    try {
      await choiceCaregiverMutation({
        variables: {
          code: dataArray.code,
          announcementCode: dataArray.announcementCode,
        },
      });
    } catch (e) {
      console.log(e);
      var error = e.toString();
      error = error.replace("Error: ", "");
      Alert.alert(`${error}`);
    }
  };

  return (
    <>
      {showModal ? (
        <Modal
          style={styles.modal}
          animationType={"fade"}
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
        >
          <ModalBackground>
            <Container>
              <ModalHeader>
                <ModalHeaderTxt numberOfLines={1} ellipsizeMode="tail">
                  ?????????{" "}
                  <NumberFormat
                    value={dataArray.caregiverCost}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"???"}
                    renderText={(formattedValue) => (
                      <Text>{"(" + formattedValue + ")"}</Text>
                    )}
                  />{" "}
                </ModalHeaderTxt>
                <Exit
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowModal();
                  }}
                >
                  <Icon name="close" size={24} color="#333" />
                </Exit>
              </ModalHeader>
              <ModalBody>
                <FlexBoth>
                  <Profile style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <ProfileImg style={{ width: 56, height: 56 }}>
                      <Image
                        style={{ width: 26, height: 26 }}
                        resizeMode="contain"
                        source={logo}
                      />
                    </ProfileImg>
                    <View>
                      <ProfileName style={{ fontSize: 17 }}>
                        {dataArray.user.userName}
                      </ProfileName>
                      <ProfileDate style={{ fontSize: 15 }}>
                        {dataArray.user.sex}
                      </ProfileDate>
                    </View>
                  </Profile>
                </FlexBoth>

                <ScrollBox>
                  <InnerBox>
                    <InnerTit>????????????</InnerTit>
                    <InnerTxt>
                      {dataArray.user.caregiverInfo.introduce}
                    </InnerTxt>
                  </InnerBox>
                  {/* <InnerBox>
                    <FlexBoth>
                      <InnerTit>????????? ?????? ??????</InnerTit>
                      <InnerTxt>???????????? ?????????</InnerTxt>
                    </FlexBoth>
                  </InnerBox>
                  <InnerBox>
                    <FlexBoth>
                      <InnerTit>????????? ????????? ??????</InnerTit>
                      <InnerTxt>????????? ??????</InnerTxt>
                    </FlexBoth>
                  </InnerBox>
                  <InnerBox>
                    <FlexBoth>
                      <InnerTit>????????? ?????? ??????</InnerTit>
                      <InnerTxt>??? ??????</InnerTxt>
                    </FlexBoth>
                  </InnerBox>
                  <InnerBox>
                    <FlexBoth>
                      <InnerTit>????????? ????????????</InnerTit>
                      <InnerTxt>????????? ?????? ????????????</InnerTxt>
                    </FlexBoth>
                  </InnerBox>
                  <InnerBox>
                    <FlexBoth>
                      <InnerTit>????????? ????????????</InnerTit>
                      <InnerTxt>????????????</InnerTxt>
                    </FlexBoth>
                  </InnerBox> */}
                  <InnerBox>
                    <FlexBoth>
                      <InnerTit>?????? ??????</InnerTit>
                      <InnerTxt>{dataArray.user.caregiverInfo.smoke}</InnerTxt>
                    </FlexBoth>
                  </InnerBox>
                  <InnerBox last>
                    <FlexBoth>
                      <InnerTit>?????? ??????</InnerTit>
                      <InnerTxt>{dataArray.user.caregiverInfo.drink}</InnerTxt>
                    </FlexBoth>
                  </InnerBox>
                </ScrollBox>
                {!confirm && (
                  <BottomBtnBox>
                    <BottomBtnLeft>
                      <Cancel
                        activeOpacity={0.8}
                        onPress={() => {
                          setShowModal();
                        }}
                      >
                        <CancelTxt>??????</CancelTxt>
                      </Cancel>
                    </BottomBtnLeft>
                    <BottomBtnRight>
                      <SubmitBtn
                        text="????????? ??????"
                        onPress={handleSubmit(onValid)}
                      />
                    </BottomBtnRight>
                  </BottomBtnBox>
                )}
              </ModalBody>
            </Container>
          </ModalBackground>
        </Modal>
      ) : null}
      <ConfirmModal
        title="??????"
        isVisible={isVisible}
        text="????????? ????????? ?????????????????????."
        setIsVisible={setIsVisible}
        navigation={navigation}
        screen={"ProgressHistoryUser"}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
});
