import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  RefreshControl,
  Alert,
  Clipboard,
  TouchableHighlight,
} from "react-native";
import {
  ScrollView,
  Container,
} from "../../../components/history/HistoryStyle";
import Item from "../../../components/history/caregiver/ProgressHistoryItem";
import Toast from "react-native-easy-toast";
import NoneLayout from "../../../components/layout/NoneLayout";
import { useReactiveVar } from "@apollo/client";
import { memberVar } from "../../../apollo";
import { useQuery } from "@apollo/client";
import { ANNOUNCEMENTAPPLICATION_LIST_QUERY } from "../../query";

export default function ProgressHistoryCaregiver({ navigation }) {
  const toastRef = useRef();
  const showCopyToast = useCallback(() => {
    toastRef.current.show("계좌번호가 복사되었습니다.");
  }, []);
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    showCopyToast();
  };
  const userInfo = JSON.parse(useReactiveVar(memberVar));
  const { data, loading } = useQuery(ANNOUNCEMENTAPPLICATION_LIST_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      userCode: userInfo.code,
    },
    pollInterval: 500,
  });
  return (
    <>
      {!loading && (
        <>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container>
              {data.listAnnouncementApplication.announcementApplications
                .length > 0 ? (
                data.listAnnouncementApplication.announcementApplications.map(
                  (item, index) => {
                    return (
                      <Item
                        key={index}
                        item={item}
                        navigation={navigation}
                        copyToClipboard={copyToClipboard}
                      />
                    );
                  }
                )
              ) : (
                <NoneLayout />
              )}
            </Container>
          </ScrollView>
          <Toast
            ref={toastRef}
            textStyle={{ color: "white" }}
            positionValue={140}
            fadeInDuration={200}
            fadeOutDuration={1000}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              borderRadius: 99,
              paddingHorizontal: 10,
            }}
          />
        </>
      )}
    </>
  );
}
