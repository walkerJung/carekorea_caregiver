import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Container,
  Card,
  Card2,
  List,
  ListTitBox,
  ListTit,
  ListTxt,
  ListSubTit,
  Days,
  EditBtn,
  EditTxt,
  GoViewBtn,
  InfoBox,
  InfoTxt,
  Bold,
  Price,
} from "../../components/history/HistoryStyle";
import {
  Item,
  FlexBoth,
  PageHeader,
  StatusTxt,
  Profile,
  ProfileImg,
  ProfileName,
  ProfileDate,
  CancelBtn,
} from "../../components/form/ListStyle";
import DefaultModal from "../../components/modal/DefaultModal";
import NumberFormat from "react-number-format";
import { FormInput, SubmitBtn } from "../../components/form/CareFormStyle";
import Icon from "react-native-vector-icons/Ionicons";
import ProfileModal from "../../components/modal/ProfileModal";
import AlertModal from "../../components/modal/AlertModal";
import DefulatLayout from "../../components/layout/DefaultLayout";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";
import { ANNOUNCEMENT_DETAIL_QUERY, WRITE_HOPECOST_MUTATION } from "../query";
import CurrencyInput from "react-native-currency-input";
import ConfirmModal from "../../components/modal/ConfirmModal";
import logo from "../../assets/img/simbol.png";
import { careTheme } from "../../contents";

export default function RecruitHome({ route, navigation }) {
  const { code } = route.params;
  const [number, setNumber] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const openModal = () => {
    setShowModal((prev) => !prev);
  };
  const openModal1 = () => {
    setShowModal1((prev) => !prev);
  };
  const openModal2 = () => {
    setShowModal2((prev) => !prev);
  };
  const { data, loading } = useQuery(ANNOUNCEMENT_DETAIL_QUERY, {
    variables: {
      code,
    },
    fetchPolicy: "network-only",
  });
  const applicationCaregiverCount = data?.viewAnnouncement
    ?.announcementApplication
    ? data?.viewAnnouncement?.announcementApplication?.length
    : 0;

  const ChoiceItemStyle = {
    1: {
      statusColor: { color: "#FFB400" },
      statusText: "?????? ????????? ?????????",
    },
    2: {
      statusColor: { color: "#0077FF" },
      statusText: "???????????????",
    },
    3: {
      statusColor: { color: "#20CF05" },
      statusText: `????????? ????????? (${applicationCaregiverCount}???)`,
    },
    4: {
      statusColor: { color: careTheme.COLORS.ERROR },
      statusText: "?????? ?????????",
    },
    5: {
      statusColor: { color: "#5e66ff" },
      statusText: "?????? ??? ?????? ??????",
    },
    6: {
      statusColor: { color: "#20CF05" },
      statusText: "?????? ??????",
    },
  };

  const caregiverInfo = data?.viewAnnouncement?.announcementApplication?.find(
    (element) => {
      return element.confirm == true;
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm();

  const onCompleted = (data) => {
    const {
      writeHopeCost: { ok },
    } = data;
    if (ok) {
      setIsVisible(true);
      // Alert.alert("??????????????? ????????? ?????????????????????.");
      // navigation.replace("ProgressHistoryUser");
    }
  };

  const [writeHopeCostMutation] = useMutation(WRITE_HOPECOST_MUTATION, {
    onCompleted,
  });

  const onValid = async (data) => {
    try {
      await writeHopeCostMutation({
        variables: {
          code: data.code,
          hopeCost: parseInt(data.hopeCost),
        },
      });
    } catch (e) {
      console.log(e);
      var error = e.toString();
      error = error.replace("Error: ", "");
      Alert.alert(`${error}`);
    }
  };

  const handleHopeCost = (param) => {
    setNumber(param);
    setValue("hopeCost", param);
  };

  useEffect(() => {
    register("hopeCost", {
      required: "* ?????? ???????????? ??????????????????",
    });
  }, [register]);

  const nightsAndDays =
    (new Date(data?.viewAnnouncement?.endDate).getTime() -
      new Date(data?.viewAnnouncement?.startDate).getTime()) /
    (1000 * 60 * 60 * 24);
  return (
    <>
      {!loading && (
        <DefulatLayout>
          <Container>
            <PageHeader>
              <StatusTxt
                style={{
                  color:
                    ChoiceItemStyle[data?.viewAnnouncement?.status].statusColor
                      .color,
                }}
              >
                {ChoiceItemStyle[data?.viewAnnouncement?.status].statusText}{" "}
                {data?.viewAnnouncement?.status == 2 && (
                  <NumberFormat
                    value={data?.viewAnnouncement?.expectedCost}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"???"}
                    renderText={(formattedValue) => (
                      <Text>{"(" + formattedValue + ")"}</Text>
                    )}
                  />
                )}
              </StatusTxt>
              {setValue("code", data.viewAnnouncement.code)}
              {data?.viewAnnouncement?.status < 4 && (
                <>
                  <CancelBtn text="?????? ??????" onPress={openModal2} />
                  <AlertModal
                    title="??????"
                    text="?????? ?????????????????????????"
                    showModal={showModal2}
                    setShowModal={setShowModal2}
                    announcementCode={data.viewAnnouncement.code}
                    navigation={navigation}
                  />
                </>
              )}
            </PageHeader>

            {!loading && data?.viewAnnouncement?.confirmCaregiverCode && (
              <Card style={styles.shadow}>
                <FlexBoth>
                  <View>
                    <Profile>
                      <ProfileImg>
                        <Image
                          style={{ width: 26, height: 26 }}
                          resizeMode="contain"
                          source={logo}
                        />
                      </ProfileImg>
                      <View>
                        <ProfileDate style={{ marginTop: 0, marginBottom: 2 }}>
                          ?????? ?????????
                        </ProfileDate>
                        <ProfileName>{caregiverInfo.user.userName}</ProfileName>
                      </View>
                    </Profile>
                  </View>
                  <View>
                    <GoViewBtn onPress={openModal1} text="????????? ?????????" />
                  </View>
                </FlexBoth>
                <ProfileModal
                  showModal={showModal1}
                  setShowModal={setShowModal1}
                  dataArray={caregiverInfo}
                  confirm={true}
                />
              </Card>
            )}

            <Card2
              style={{ ...styles.shadow, paddingTop: 12, paddingBottom: 12 }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {data.viewAnnouncement.title}
              </Text>
            </Card2>

            <Card2 style={styles.shadow}>
              <List last={true}>
                <ListTitBox style={{ marginBottom: 0 }}>
                  <ListTit>
                    <Icon name="calendar-outline" size={14} color="#979797" />{" "}
                    ?????? ??????
                  </ListTit>
                  {/* {data.viewAnnouncement.status == 1 && (
                    <EditBtn
                      activeOpacity={0.8}
                      onPress={() =>
                        Alert.alert("ApplyForm ?????? ???????????? ???????????????.")
                      }
                    >
                      <>
                        <Icon name="pencil-outline" size={13} color="#979797" />
                        <EditTxt>????????????</EditTxt>
                      </>
                    </EditBtn>
                  )} */}
                </ListTitBox>
              </List>
              <List>
                <ListTitBox>
                  <ListTxt>
                    {data.viewAnnouncement.startDate}
                    {" ~ "}
                    {data.viewAnnouncement.endDate}
                  </ListTxt>
                  <Days>
                    ({nightsAndDays - 1}??? {nightsAndDays}???)
                  </Days>
                </ListTitBox>
              </List>
              <List last={true}>
                <ListTitBox>
                  <ListTit>
                    <Icon name="location-outline" size={14} color="#979797" />{" "}
                    ?????? ??????
                  </ListTit>
                </ListTitBox>
                <ListTxt>
                  {data.viewAnnouncement.address}{" "}
                  {data.viewAnnouncement.addressDetail}
                </ListTxt>
              </List>
            </Card2>

            <Card2 style={styles.shadow}>
              <List last>
                <ListTitBox>
                  <ListTit>
                    <Icon name="person-outline" size={14} color="#979797" />{" "}
                    ?????????
                  </ListTit>
                </ListTitBox>
                <ListTxt>{data.viewAnnouncement.protectorName}</ListTxt>
              </List>
              {/* <List last>
                <ListTitBox>
                  <ListTit>
                    <Icon name="person-outline" size={14} color="#979797" />{" "}
                    ????????? ?????????
                  </ListTit>
                </ListTitBox>
                <ListTxt>{data.viewAnnouncement.protectorPhone}</ListTxt>
              </List> */}
            </Card2>

            <Card2 style={styles.shadow}>
              <List>
                <ListTitBox style={{ marginBottom: 15 }}>
                  <ListTit>
                    <Icon name="person-outline" size={14} color="#979797" />{" "}
                    ?????? ??????
                  </ListTit>
                </ListTitBox>
                <ListSubTit>?????? ??????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.patientName}</ListTxt>
              </List>

              <List>
                <ListSubTit>?????? ??????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.patientAge}???</ListTxt>
              </List>

              <List>
                <ListSubTit>?????? ?????????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.patientWeight}kg</ListTxt>
              </List>

              <List last={true}>
                <ListSubTit>???????????? ??????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.nursingGrade}</ListTxt>
              </List>
            </Card2>

            <Card2 style={styles.shadow}>
              <List>
                <ListTitBox style={{ marginBottom: 15 }}>
                  <ListTit>
                    <Icon name="person-outline" size={14} color="#979797" />{" "}
                    ?????? ??????
                  </ListTit>
                  {/* {data.viewAnnouncement.status == 1 && (
                    <EditBtn
                      activeOpacity={0.8}
                      onPress={() =>
                        Alert.alert(
                          "?????? ????????????(ApplyFormDetail) ?????????????????? ???????????????."
                        )
                      }
                    >
                      <>
                        <Icon name="pencil-outline" size={13} color="#979797" />
                        <EditTxt>????????????</EditTxt>
                      </>
                    </EditBtn>
                  )} */}
                </ListTitBox>
                <ListSubTit>??????????????? ???????????????????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.needMealCare}</ListTxt>
              </List>

              <List>
                <ListSubTit>????????? ????????? ???????????????????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.needUrineCare}</ListTxt>
              </List>

              <List>
                <ListSubTit>?????? ????????? ????????????????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.needSuctionCare}</ListTxt>
              </List>

              <List>
                <ListSubTit>????????? ????????? ????????? ???????????????????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.needMoveCare}</ListTxt>
              </List>

              <List>
                <ListSubTit>???????????? ????????? ????????? ???????????????????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.needBedCare}</ListTxt>
              </List>

              <List last={true}>
                <ListSubTit>?????? ?????? ????????? ???????????????????</ListSubTit>
                <ListTxt>{data.viewAnnouncement.needHygieneCare}</ListTxt>
              </List>
            </Card2>
            {data.viewAnnouncement.status == 2 && (
              <View style={{ marginTop: 10 }}>
                <SubmitBtn text="??????????????? ??????" onPress={openModal} />
                <DefaultModal
                  title="?????? ????????? ??????"
                  showModal={showModal}
                  setShowModal={setShowModal}
                >
                  <FlexBoth style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, color: "#333" }}>
                      ?????? ?????????
                    </Text>
                    <NumberFormat
                      value={data.viewAnnouncement.expectedCost}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={"???"}
                      renderText={(formattedValue) => (
                        <Price>{formattedValue}</Price>
                      )}
                    />
                  </FlexBoth>
                  <CurrencyInput
                    style={styles.test}
                    value={number}
                    onChangeValue={handleHopeCost}
                    suffix="???"
                    delimiter=","
                    separator="."
                    precision={0}
                    keyboardType="number-pad"
                    placeholder="?????????????????? ????????? ?????????."
                    placeholderTextColor={"#979797"}
                  />
                  {setValue("code", data.viewAnnouncement.code)}
                  {errors.hopeCost && (
                    <ErrorsText>{errors.hopeCost.message}</ErrorsText>
                  )}
                  <InfoBox style={{ marginBottom: 10 }}>
                    <InfoTxt style={{ marginBottom: 10 }}>
                      <Bold>?????? ?????????</Bold>??? ???????????? ????????? ?????? ?????????
                      ???????????????.
                    </InfoTxt>
                    <InfoTxt>
                      <Bold>?????? ?????????</Bold>??? ???????????? ???????????? ?????????
                      ?????????.
                    </InfoTxt>
                  </InfoBox>
                  <SubmitBtn text="??????" onPress={handleSubmit(onValid)} />
                </DefaultModal>
              </View>
            )}
          </Container>
          <ConfirmModal
            title="??????"
            isVisible={isVisible}
            text="??????????????? ????????? ?????????????????????."
            setIsVisible={setIsVisible}
            navigation={navigation}
            screen={"ProgressHistoryUser"}
          />
        </DefulatLayout>
      )}
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
  test: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    height: 48,
    fontSize: 16,
    marginBottom: 10,
    color: "#111",
  },
});
