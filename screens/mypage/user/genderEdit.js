import React, { useRef } from "react";
import WriteLayout from "../../../components/layout/WriteLayout";
import {
  FormBox,
  FormLabelBox,
  FormLabel,
  FormInput,
} from "../../../components/join/JoinStyle";
import { SubmitBtn } from "../../../components/form/CareFormStyle";
import JoinRadio from "../../../components/join/JoinRadio";

export default function EditGenderUser() {
  return (
    <WriteLayout>
      <FormBox>
        <FormLabelBox>
          <FormLabel>성별 변경</FormLabel>
        </FormLabelBox>
        <JoinRadio
          lineover={true}
          options={[
            { key: 1, text: "남성" },
            { key: 2, text: "여성" },
          ]}
        />
      </FormBox>

      <SubmitBtn text="수정하기" onPress={() => Alert.alert("수정하기")} />
    </WriteLayout>
  );
}