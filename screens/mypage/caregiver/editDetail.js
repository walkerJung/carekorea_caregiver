import React, { useState } from "react";
import WriteLayout from "../../../components/layout/WriteLayout";
import Icon from "react-native-vector-icons/Ionicons";
import {
  FormBox,
  FormLabelBox,
  FormLabel,
  FormInput,
  StepTxtBox,
  StepNum,
} from "../../../components/join/JoinStyle";
import { SubmitBtn } from "../../../components/form/CareFormStyle";
import { Alert } from "react-native";
import { FlexBoth } from "../../../components/form/ListStyle";
import RNPickerSelect from "react-native-picker-select";
import JoinRadio from "../../../components/join/JoinRadio";
import { useForm } from "react-hook-form";
import { EDIT_CAREGIVERINFO_MUTATION, USER_DETAIL_QUERY } from "../../query";
import { useMutation, useQuery } from "@apollo/client";
import { useReactiveVar } from "@apollo/client";
import { memberVar } from "../../../apollo";
import SectionLayout from "../../../components/layout/SectionLayout";
import ConfirmModal from "../../../components/modal/ConfirmModal";

export default function EditDetailCaregiver({ navigation }) {
  const userInfo = JSON.parse(useReactiveVar(memberVar));
  const { data, loading } = useQuery(USER_DETAIL_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      code: userInfo.code,
    },
  });
  const [selectMealText, setSelectMealText] = useState();
  const [selectUrineText, setSelectUrineText] = useState();
  const [selectSuctionText, setSelectSuctionText] = useState();
  const [selectMoveText, setSelectMoveText] = useState();
  const [selectBedText, setSelectBedText] = useState();
  const [isVisible, setIsVisible] = useState(false);
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
      editCaregiverInfo: { ok },
    } = data;
    if (ok) {
      setIsVisible(true);
    }
  };

  const [editCaregiverInfoMutation] = useMutation(EDIT_CAREGIVERINFO_MUTATION, {
    onCompleted,
    refetchQueries: () => [
      {
        query: USER_DETAIL_QUERY,
        variables: {
          code: userInfo.code,
        },
      },
    ],
  });

  const onValid = async (data) => {
    try {
      await editCaregiverInfoMutation({
        variables: {
          userCode: userInfo.code,
          smoke: data.smoke,
          drink: data.drink,
          mealCare: data.mealCare,
          urineCare: data.urineCare,
          suctionCare: data.suctionCare,
          moveCare: data.moveCare,
          bedCare: data.bedCare,
          introduce: data.introduce,
        },
      });
    } catch (e) {
      console.log(e);
      var error = e.toString();
      error = error.replace("Error: ", "");
      Alert.alert(`${error}`);
    }
  };

  const handleSelectBox = (set, value, setState) => {
    setValue(set, value), setState(value);
  };

  return (
    <>
      {!loading && (
        <WriteLayout>
          <SectionLayout>
            <StepTxtBox>
              <StepNum>??????????????????</StepNum>
            </StepTxtBox>
            <FormBox>
              <FormLabelBox>
                <FormLabel>????????? ????????????????</FormLabel>
              </FormLabelBox>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: "??????",
                  color: "#979797",
                }}
                value={
                  selectMealText
                    ? selectMealText
                    : data.viewProfile.caregiverInfo.mealCare
                }
                onValueChange={(value) =>
                  handleSelectBox("mealCare", value, setSelectMealText)
                }
                items={[
                  { label: "?????? ???????????? ", value: "?????? ???????????? " },
                  { label: "?????? ????????????", value: "?????? ????????????" },
                  { label: "???????????? ?????????", value: "???????????? ?????????" },
                ]}
                doneText="??????"
                Icon={() => {
                  return (
                    <Icon name="caret-down-outline" size={15} color="#676767" />
                  );
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: { top: 20, right: 10 },
                }}
              />
            </FormBox>

            <FormBox>
              <FormLabelBox>
                <FormLabel>????????? ????????? ??????????</FormLabel>
              </FormLabelBox>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: "??????",
                  color: "#979797",
                }}
                value={
                  selectUrineText
                    ? selectUrineText
                    : data.viewProfile.caregiverInfo.urineCare
                }
                onValueChange={(value) =>
                  handleSelectBox("urineCare", value, setSelectUrineText)
                }
                items={[
                  { label: "??????????????? ??????", value: "??????????????? ??????" },
                  { label: "?????? ??????", value: "?????? ??????" },
                  { label: "????????? ??????", value: "????????? ??????" },
                  { label: "???????????? ??????", value: "???????????? ??????" },
                  { label: "????????? ??????", value: "????????? ??????" },
                  { label: "??????", value: "??????" },
                ]}
                doneText="??????"
                Icon={() => {
                  return (
                    <Icon name="caret-down-outline" size={15} color="#676767" />
                  );
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: { top: 20, right: 10 },
                }}
              />
            </FormBox>

            <FormBox>
              <FormLabelBox>
                <FormLabel>????????? ?????? ??????????</FormLabel>
              </FormLabelBox>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: "??????",
                  color: "#979797",
                }}
                value={
                  selectSuctionText
                    ? selectSuctionText
                    : data.viewProfile.caregiverInfo.suctionCare
                }
                onValueChange={(value) =>
                  handleSelectBox("suctionCare", value, setSelectSuctionText)
                }
                items={[
                  { label: "??? ??????", value: "??? ??????" },
                  { label: "??? ??????", value: "??? ??????" },
                  { label: "??? ??????", value: "??? ??????" },
                ]}
                doneText="??????"
                Icon={() => {
                  return (
                    <Icon name="caret-down-outline" size={15} color="#676767" />
                  );
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: { top: 20, right: 10 },
                }}
              />
            </FormBox>

            <FormBox>
              <FormLabelBox>
                <FormLabel>????????? ????????????????</FormLabel>
              </FormLabelBox>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: "??????",
                  color: "#979797",
                }}
                value={
                  selectMoveText
                    ? selectMoveText
                    : data.viewProfile.caregiverInfo.moveCare
                }
                onValueChange={(value) =>
                  handleSelectBox("moveCare", value, setSelectMoveText)
                }
                items={[
                  { label: "????????? ????????????", value: "????????? ????????????" },
                  {
                    label: "????????? ?????? ????????????",
                    value: "????????? ?????? ????????????",
                  },
                  { label: "???????????? ????????????", value: "???????????? ????????????" },
                ]}
                doneText="??????"
                Icon={() => {
                  return (
                    <Icon name="caret-down-outline" size={15} color="#676767" />
                  );
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: { top: 20, right: 10 },
                }}
              />
            </FormBox>

            <FormBox>
              <FormLabelBox>
                <FormLabel>????????? ????????????????</FormLabel>
              </FormLabelBox>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug={true}
                placeholder={{
                  label: "??????",
                  color: "#979797",
                }}
                value={
                  selectBedText
                    ? selectBedText
                    : data.viewProfile.caregiverInfo.bedCare
                }
                onValueChange={(value) =>
                  handleSelectBox("bedCare", value, setSelectBedText)
                }
                items={[
                  {
                    label: "???????????? ????????? ????????????",
                    value: "???????????? ????????? ????????????",
                  },
                  { label: "??????(??????)??????", value: "??????(??????)??????" },
                  { label: "????????????", value: "????????????" },
                ]}
                doneText="??????"
                Icon={() => {
                  return (
                    <Icon name="caret-down-outline" size={15} color="#676767" />
                  );
                }}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: { top: 20, right: 10 },
                }}
              />
            </FormBox>

            <FormBox>
              <FormLabelBox>
                <FormLabel>??????</FormLabel>
              </FormLabelBox>

              <JoinRadio
                defaultValue={data.viewProfile.caregiverInfo.smoke}
                lineover={true}
                options={[
                  { key: "??????", text: "??????" },
                  { key: "?????????", text: "?????????" },
                ]}
                setValue={setValue}
                fieldName="smoke"
              />
            </FormBox>

            <FormBox>
              <FormLabelBox>
                <FormLabel>?????? ??????</FormLabel>
              </FormLabelBox>

              <JoinRadio
                defaultValue={data.viewProfile.caregiverInfo.drink}
                lineover={true}
                options={[
                  { key: "??????", text: "??????" },
                  { key: "?????????", text: "?????????" },
                ]}
                setValue={setValue}
                fieldName="drink"
              />
            </FormBox>

            <FormBox>
              <FormLabelBox>
                <FormLabel>????????????</FormLabel>
              </FormLabelBox>
              <FormInput
                style={{ height: 100, textAlignVertical: "top", fontSize: 15 }}
                defaultValue={data.viewProfile.caregiverInfo.introduce}
                onChangeText={(text) => {
                  setValue("introduce", text);
                }}
                placeholder="?????????????????? ??????????????????."
                numberOfLines={10}
                multiline={true}
              />
            </FormBox>

            <SubmitBtn text="????????????" onPress={handleSubmit(onValid)} />
          </SectionLayout>
          <ConfirmModal
            title="??????"
            isVisible={isVisible}
            text="???????????? ????????? ?????????????????????."
            setIsVisible={setIsVisible}
            navigation={navigation}
            screen={"EditCaregiver"}
          />
        </WriteLayout>
      )}
    </>
  );
}

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "#212121",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 5,
    marginBottom: 8,
    height: 48,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "#212121",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 5,
    marginBottom: 8,
    height: 48,
  },
};
