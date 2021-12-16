import React, { useRef, useState, useEffect } from "react";
import WriteLayout from "../../../components/layout/WriteLayout";
import {
  FormBox,
  FormLabelBox,
  FormLabel,
  ErrorsText,
  PhotoBox,
} from "../../../components/join/JoinStyle";
import { SubmitBtn } from "../../../components/form/CareFormStyle";
import { useForm } from "react-hook-form";
import { EDIT_CAREGIVERINFO_MUTATION, USER_DETAIL_QUERY } from "../../query";
import { useMutation, useQuery } from "@apollo/client";
import { useReactiveVar } from "@apollo/client";
import { memberVar } from "../../../apollo";
import { Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import Icon from "react-native-vector-icons/Ionicons";
import SectionLayout from "../../../components/layout/SectionLayout";

export default function EditIdCardCaregiver({ navigation }) {
  const userInfo = JSON.parse(useReactiveVar(memberVar));
  const [idCard, setIdCard] = useState();
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();

  const nameRef = useRef();

  const { data, loading } = useQuery(USER_DETAIL_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      code: userInfo.code,
    },
  });

  const onCompleted = (data) => {
    const {
      editCaregiverInfo: { ok },
    } = data;
    if (ok) {
      Alert.alert("신분증 사진 변경이 완료되었습니다.");
      navigation.navigate("EditCaregiver");
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
      const idCard = new ReactNativeFile({
        uri: data.idCard,
        name: userInfo.userId + "_idCard",
        type: "image/jpeg",
      });

      await editCaregiverInfoMutation({
        variables: {
          userCode: userInfo.code,
          idCard: idCard,
        },
      });
    } catch (e) {
      console.log(e);
      var error = e.toString();
      error = error.replace("Error: ", "");
      Alert.alert(`${error}`);
    }
  };

  const pickImage = async (set, value) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      set(result.uri), setValue(value, result.uri);
    }
  };

  useEffect(() => {
    register("idCard", {
      required: "* 신분증 사진을 선택해주세요.",
    });
  }, [register]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  return (
    <>
      {!loading && (
        <WriteLayout>
          <SectionLayout>
            <FormBox>
              <FormLabelBox>
                <FormLabel>신분증 사진 변경</FormLabel>
              </FormLabelBox>
              <PhotoBox
                onPress={() => {
                  pickImage(setIdCard, "idCard");
                }}
              >
                {data.viewProfile.CaregiverInfo[0].idCard == "idCard" ? (
                  <>
                    {idCard ? (
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={{
                          uri: idCard,
                        }}
                        resizeMode={"contain"}
                      />
                    ) : (
                      <Icon
                        name="add-outline"
                        size={23}
                        style={{ color: "#979797" }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {idCard ? (
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={{
                          uri: idCard,
                        }}
                        resizeMode={"contain"}
                      />
                    ) : (
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={{
                          uri: `http://3.36.22.165:4000${data.viewProfile.CaregiverInfo[0].idCard}`,
                        }}
                        resizeMode={"contain"}
                      />
                    )}
                  </>
                )}
              </PhotoBox>
              {errors.idCard && (
                <ErrorsText>{errors.idCard.message}</ErrorsText>
              )}
            </FormBox>
            <SubmitBtn text="수정하기" onPress={handleSubmit(onValid)} />
          </SectionLayout>
        </WriteLayout>
      )}
    </>
  );
}
