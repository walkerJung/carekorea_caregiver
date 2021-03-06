import React, { useState, useEffect, useRef } from "react";
import { Alert, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import WriteLayout from "../../../components/layout/WriteLayout";
import SectionLayout from "../../../components/layout/SectionLayout";
import {
  StepTxtBox,
  StepNum,
  StepTxt,
  FormBox,
  FormLabelBox,
  FormLabel,
  FormInput,
  ErrorsText,
  JoinCheckWrap,
  CheckBoxAllBox,
  BoxRow,
  CheckBoxInner,
  CheckBoxContainer,
  MoreText,
} from "../../../components/join/JoinStyle";
import JoinRadio from "../../../components/join/JoinRadio";
import {
  FlexRow,
  LeftBtnBox,
  RightBtnBox,
  SearchBtn,
  SearchInput,
  SubmitBtn,
} from "../../../components/form/CareFormStyle";
import Check from "../../../components/join/CheckBox";
import { faCheck } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { careTheme } from "../../../contents";
import RNPickerSelect from "react-native-picker-select";
import { FlexBoth } from "../../../components/form/ListStyle";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_ACCOUNT_MUTATION } from "../../query";
import Postcode from "@actbase/react-daum-postcode";
import PrivacyModal from "../../../components/modal/PrivacyModal";
import ProvisionModal from "../../../components/modal/ProvisionModal";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import AddressModal from "../../../components/modal/AddressModal";

export default function CaregiverRegister({ navigation }) {
  const [allProvision, setAllProvision] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(false);
  const [provision, setProvision] = useState(false);
  const allAgree = () => {
    if (allProvision === true) {
      setPersonalInfo(false);
      setProvision(false);
      setAllProvision(false);
    } else {
      setPersonalInfo(true);
      setProvision(true);
      setAllProvision(true);
    }
  };
  useEffect(() => {
    if (personalInfo === true && provision === true) {
      setAllProvision(true);
    }
  }, [personalInfo, provision]);

  const [privacyModal, setPrivacyModal] = useState(false);
  const openPrivacyModal = () => {
    setPrivacyModal((prev) => !prev);
  };
  const [provisionModal, setProvisionModal] = useState(false);
  const openProvisionModal = () => {
    setProvisionModal((prev) => !prev);
  };

  const [isModal, setModal] = useState(false);
  const [selectMealText, setSelectMealText] = useState("");
  const [selectUrineText, setSelectUrineText] = useState("");
  const [selectSuctionText, setSelectSuctionText] = useState("");
  const [selectMoveText, setSelectMoveText] = useState("");
  const [selectBedText, setSelectBedText] = useState("");
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
      createAccount: { ok },
    } = data;
    if (ok) {
      setIsVisible(true);
    }
  };

  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  const onValid = async (data) => {
    if (!loading) {
      try {
        if (!personalInfo || !provision) {
          Alert.alert("???????????? ???????????? ??? ??????????????? ??????????????????.");
          return false;
        }
        await createAccountMutation({
          variables: {
            userId: data.userId,
            userType: "?????????",
            userName: data.userName,
            password: data.password,
            sex: data.sex,
            phone: data.phone,
            residentNumber: data.resident_1 + data.resident_2,
            smoke: data.smoke,
            drink: data.drink,
            mealCare: data.mealCare,
            urineCare: data.urineCare,
            suctionCare: data.suctionCare,
            moveCare: data.moveCare,
            bedCare: data.bedCare,
            address: data.address,
            addressDetail: data.addressDetail,
            introduce: data.introduce,
          },
        });
      } catch (e) {
        console.log(e);
        var error = e.toString();
        error = error.replace("Error: ", "");
        Alert.alert(`${error}`);
      }
    }
  };

  const handleAddress = (data) => {
    setValue("address", data.address);
    setModal(false);
  };

  const handleSelectBox = (set, value, setState) => {
    setValue(set, value), setState(value);
  };

  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const usernameRef = useRef();
  const phoneRef = useRef();
  const residentRef = useRef();

  const onNext = (nextOne) => {
    nextOne?.current?.focus();
  };

  useEffect(() => {
    register("userId", {
      required: "* ???????????? ??????????????????.",
    });
    register("password", {
      required: "* ??????????????? ??????????????????.",
    });
    register("passwordConfirm", {
      required: "* ??????????????? ?????? ??? ??????????????????.",
      validate: (value) => {
        return value !== watch("password")
          ? "* ??????????????? ???????????? ????????????. ?????? ??????????????????."
          : undefined;
      },
    });
    register("userName", {
      required: "* ????????? ??????????????????.",
    });
    register("phone", {
      required: "* ???????????? ??????????????????.",
    });
    register("sex", {
      required: "* ????????? ??????????????????.",
    });
    register("address", {
      required: "* ????????? ??????????????????.",
    });
    register("addressDetail", {
      required: "* ??????????????? ??????????????????.",
    });
    register("resident_1", {
      required: "* ?????????????????? ???????????? ??????????????????.",
    });
    register("resident_2", {
      required: "* ?????????????????? ???????????? ??????????????????.",
    });
    register("mealCare", {
      required: "* ????????? ??????????????? ??????????????????.",
    });
    register("urineCare", {
      required: "* ????????? ?????????????????? ??????????????????.",
    });
    register("suctionCare", {
      required: "* ????????? ??????????????? ??????????????????.",
    });
    register("moveCare", {
      required: "* ????????? ??????????????? ??????????????????.",
    });
    register("bedCare", {
      required: "* ????????? ??????????????? ??????????????????.",
    });
    register("smoke", {
      required: "* ????????? ?????? ????????? ??????????????????.",
    });
    register("drink", {
      required: "* ????????? ?????? ????????? ??????????????????.",
    });
    register("introduce", {
      required: "* ????????? ??????????????? ??????????????????.",
    });
  }, [register]);

  return (
    <WriteLayout>
      <SectionLayout>
        <StepTxtBox>
          <StepNum>Step1</StepNum>
          <StepTxt>?????? ?????? ??????</StepTxt>
        </StepTxtBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>?????????</FormLabel>
          </FormLabelBox>

          <FormInput
            placeholder="???????????? ??????????????????."
            placeholderTextColor={"#979797"}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => onNext(passwordRef)}
            onChangeText={(text) => setValue("userId", text)}
          />
          {errors.userId && <ErrorsText>{errors.userId.message}</ErrorsText>}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>????????????</FormLabel>
          </FormLabelBox>
          <FormInput
            ref={passwordRef}
            placeholder="??????????????? ??????????????????."
            placeholderTextColor={"#979797"}
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => onNext(passwordConfirmRef)}
            onChangeText={(text) => setValue("password", text)}
          />
          {errors.password && (
            <ErrorsText>{errors.password.message}</ErrorsText>
          )}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>???????????? ??????</FormLabel>
          </FormLabelBox>
          <FormInput
            ref={passwordConfirmRef}
            placeholder="???????????? ??????"
            placeholderTextColor={"#979797"}
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => onNext(usernameRef)}
            onChangeText={(text) => setValue("passwordConfirm", text)}
          />
          {errors.passwordConfirm && (
            <ErrorsText>{errors.passwordConfirm.message}</ErrorsText>
          )}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>??????</FormLabel>
          </FormLabelBox>
          <FormInput
            ref={usernameRef}
            placeholder="????????? ??????????????????."
            placeholderTextColor={"#979797"}
            returnKeyType="next"
            autoCapitalize="none"
            onSubmitEditing={() => onNext(phoneRef)}
            onChangeText={(text) => setValue("userName", text)}
          />
          {errors.userName && (
            <ErrorsText>{errors.userName.message}</ErrorsText>
          )}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>?????????</FormLabel>
          </FormLabelBox>
          <FormInput
            ref={phoneRef}
            placeholder="- ?????? ??????????????????."
            placeholderTextColor={"#979797"}
            keyboardType="number-pad"
            autoCapitalize="none"
            returnKeyType="done"
            onChangeText={(text) => setValue("phone", text)}
            maxLength={11}
          />
          {errors.phone && <ErrorsText>{errors.phone.message}</ErrorsText>}
        </FormBox>

        <FormBox last>
          <FormLabelBox>
            <FormLabel>??????</FormLabel>
          </FormLabelBox>
          <JoinRadio
            lineover={true}
            options={[
              { key: "??????", text: "??????" },
              { key: "??????", text: "??????" },
            ]}
            setValue={setValue}
            fieldName="sex"
          />
          {errors.sex && <ErrorsText>{errors.sex.message}</ErrorsText>}
        </FormBox>
      </SectionLayout>

      <SectionLayout>
        <StepTxtBox>
          <StepNum>Step2</StepNum>
          <StepTxt>????????? ?????? ?????? ??????</StepTxt>
        </StepTxtBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>????????? ??????</FormLabel>
          </FormLabelBox>
          <FlexRow>
            <LeftBtnBox>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModal(true)}
              >
                <SearchInput
                  placeholder="????????? ??????????????????."
                  placeholderTextColor={"#676767"}
                  keyboardType="default"
                  value={getValues("address")}
                  editable={false}
                />
                {errors.address && (
                  <ErrorsText>{errors.address.message}</ErrorsText>
                )}
              </TouchableOpacity>
            </LeftBtnBox>
            <RightBtnBox>
              <SearchBtn activeOpacity={0.8} onPress={() => setModal(true)}>
                <Text
                  style={{
                    fontSize: 14,
                    color: careTheme.COLORS.PRIMARY,
                    fontWeight: "bold",
                  }}
                >
                  ????????????
                </Text>
              </SearchBtn>
            </RightBtnBox>
          </FlexRow>

          {isModal && (
            <AddressModal isVisible={isModal} onPress={() => setModal(false)}>
              <Postcode
                style={{ width: "100%", height: "100%" }}
                jsOptions={{ animation: true, hideMapBtn: true }}
                onSelected={(data) => {
                  handleAddress(data);
                  setModal(false);
                }}
              />
            </AddressModal>
          )}
          <FormInput
            placeholder="????????????"
            placeholderTextColor={"#979797"}
            keyboardType="default"
            onChangeText={(text) => setValue("addressDetail", text)}
          />
          {errors.addressDetail && (
            <ErrorsText>{errors.addressDetail.message}</ErrorsText>
          )}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>??????????????????</FormLabel>
          </FormLabelBox>
          <FlexBoth style={{ alignItems: "center" }}>
            <FormInput
              placeholder="??? ?????? 6??????"
              placeholderTextColor={"#979797"}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => onNext(residentRef)}
              maxLength={6}
              style={{ flex: 1, marginRight: 5 }}
              onChangeText={(text) => setValue("resident_1", text)}
            />
            <Text>-</Text>
            <FormInput
              ref={residentRef}
              placeholder="??? ?????? 7??????"
              placeholderTextColor={"#979797"}
              keyboardType="number-pad"
              returnKeyType="done"
              secureTextEntry
              maxLength={7}
              style={{ flex: 1, marginLeft: 5 }}
              onChangeText={(text) => setValue("resident_2", text)}
            />
          </FlexBoth>
          {errors.resident_1 && (
            <ErrorsText>{errors.resident_1.message}</ErrorsText>
          )}
          {errors.resident_2 && (
            <ErrorsText>{errors.resident_2.message}</ErrorsText>
          )}
        </FormBox>
      </SectionLayout>

      <SectionLayout last>
        <StepTxtBox>
          <StepNum>Step3</StepNum>
          <StepTxt>????????? ????????????</StepTxt>
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
            value={selectMealText}
            onValueChange={(value) =>
              handleSelectBox("mealCare", value, setSelectMealText)
            }
            items={[
              { label: "?????? ???????????? ", value: "?????? ???????????? " },
              { label: "?????? ????????????", value: "?????? ????????????" },
              { label: "???????????? ?????????", value: "???????????? ?????????" },
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
          {errors.mealCare && (
            <ErrorsText>{errors.mealCare.message}</ErrorsText>
          )}
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
            value={selectUrineText}
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
          {errors.urineCare && (
            <ErrorsText>{errors.urineCare.message}</ErrorsText>
          )}
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
            value={selectSuctionText}
            onValueChange={(value) =>
              handleSelectBox("suctionCare", value, setSelectSuctionText)
            }
            items={[
              { label: "??? ??????", value: "??? ??????" },
              { label: "??? ??????", value: "??? ??????" },
              { label: "??? ??????", value: "??? ??????" },
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
          {errors.suctionCare && (
            <ErrorsText>{errors.suctionCare.message}</ErrorsText>
          )}
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
            value={selectMoveText}
            onValueChange={(value) =>
              handleSelectBox("moveCare", value, setSelectMoveText)
            }
            items={[
              { label: "????????? ????????????", value: "????????? ????????????" },
              { label: "????????? ?????? ????????????", value: "????????? ?????? ????????????" },
              { label: "???????????? ????????????", value: "???????????? ????????????" },
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
          {errors.moveCare && (
            <ErrorsText>{errors.moveCare.message}</ErrorsText>
          )}
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
            value={selectBedText}
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
          {errors.bedCare && <ErrorsText>{errors.bedCare.message}</ErrorsText>}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>?????? ??????</FormLabel>
          </FormLabelBox>

          <JoinRadio
            lineover={true}
            options={[
              { key: "??????", text: "??????" },
              { key: "?????????", text: "?????????" },
            ]}
            setValue={setValue}
            fieldName="smoke"
          />
          {errors.smoke && <ErrorsText>{errors.smoke.message}</ErrorsText>}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>?????? ??????</FormLabel>
          </FormLabelBox>

          <JoinRadio
            lineover={true}
            options={[
              { key: "??????", text: "??????" },
              { key: "?????????", text: "?????????" },
            ]}
            setValue={setValue}
            fieldName="drink"
          />
          {errors.drink && <ErrorsText>{errors.drink.message}</ErrorsText>}
        </FormBox>

        <FormBox>
          <FormLabelBox>
            <FormLabel>????????????</FormLabel>
          </FormLabelBox>
          <FormInput
            style={{ height: 100, textAlignVertical: "top", fontSize: 15 }}
            placeholder="?????????????????? ??????????????????."
            numberOfLines={10}
            multiline={true}
            onChangeText={(text) => {
              setValue("introduce", text);
            }}
          />
          {errors.introduce && (
            <ErrorsText>{errors.introduce.message}</ErrorsText>
          )}
        </FormBox>

        <JoinCheckWrap>
          <CheckBoxAllBox>
            <BoxRow>
              <Check
                icon={faCheckCircle}
                status={personalInfo && provision ? "checked" : "unchecked"}
                onPress={() => {
                  allAgree();
                }}
                title={"?????? ???????????????."}
              />
            </BoxRow>
          </CheckBoxAllBox>
          <CheckBoxContainer>
            <CheckBoxInner>
              <Check
                icon={faCheck}
                status={personalInfo ? "checked" : "unchecked"}
                onPress={() => {
                  setPersonalInfo(!personalInfo);
                }}
                subtit={"(??????) ???????????? ????????????"}
              />
            </CheckBoxInner>
            <TouchableOpacity onPress={openPrivacyModal}>
              <MoreText>??????</MoreText>
            </TouchableOpacity>
            <PrivacyModal
              showModal={privacyModal}
              setShowModal={setPrivacyModal}
            />
          </CheckBoxContainer>

          <CheckBoxContainer>
            <CheckBoxInner>
              <Check
                icon={faCheck}
                status={provision ? "checked" : "unchecked"}
                onPress={() => {
                  setProvision(!provision);
                }}
                subtit={"(??????) ????????????"}
              />
            </CheckBoxInner>

            <TouchableOpacity onPress={openProvisionModal}>
              <MoreText>??????</MoreText>
            </TouchableOpacity>
            <ProvisionModal
              showModal={provisionModal}
              setShowModal={setProvisionModal}
            />
          </CheckBoxContainer>
        </JoinCheckWrap>

        <SubmitBtn text="????????????" onPress={handleSubmit(onValid)} />
      </SectionLayout>
      <ConfirmModal
        title="??????"
        isVisible={isVisible}
        text="??????????????? ?????????????????????."
        setIsVisible={setIsVisible}
        navigation={navigation}
        screen={"Login"}
      />
    </WriteLayout>
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
    paddingRight: 30,
    marginTop: 5,
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
    paddingRight: 30,
    marginTop: 5,
    height: 48,
  },
};
