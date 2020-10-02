import React, { useState, useRef, useEffect } from "react";
import { Image } from "react-native";
import {
  PageContainer,
  DiceContextBox,
  SwitchDice,
  SwitchDiceButton,
  SwitchDiceButtonText,
  MainButton,
  TextButton,
  ResultBox,
  ResultList,
  ResultText,
  ResultBooble,
  ClearResultButton,
  ClearResultText,
  InputBox,
  InputLabel,
  InputField,
  NumberContentBox,
} from "../../styles";
import * as Animatable from "react-native-animatable";
import { AdMobInterstitial } from "expo-ads-admob";
import env from "../../../.env.json";

import d6Img from "../../assets/d6.png";
import d8Img from "../../assets/d8.png";
import d12Img from "../../assets/d12.png";
import d20Img from "../../assets/d20.png";

export default function DiceRoll() {
  const [diceImg, setDiceImg] = useState(d6Img);
  const [modifier, setModifier] = useState("0");
  const [numResult, setNumResult] = useState("1");
  const [maxNumber, setMaxNumber] = useState(6);

  const [diceResult, setDiceResult] = useState([]);
  const [resultList, setResultList] = useState([]);

  const ResultBoobleRef = useRef();
  const DiceImgRef = useRef();

  useEffect(() => {
    if (
      resultList.length == 10 ||
      resultList.length == 20 ||
      resultList.length == 30
    ) {
      openInterstitialAd();
    }
  }, [resultList]);

  async function openInterstitialAd() {
    await AdMobInterstitial.setAdUnitID(
      env.ads.page.dice["ad-interstitial-id"]
    );
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  }

  function handleDiceChange(image, number) {
    DiceImgRef.current.bounceIn();
    setDiceImg(image);
    setMaxNumber(number);
    setDiceResult([]);
  }

  function handleDiceRoll() {
    ResultBoobleRef.current.bounceIn();
    DiceImgRef.current.bounceIn();

    let newNumbersResults = [];

    for (let i = 0; i < numResult; i++) {
      const randomNumber = Math.floor(Math.random() * Math.floor(maxNumber));
      const diceNumber = randomNumber + 1 + Number(modifier);

      newNumbersResults = [...newNumbersResults, diceNumber];
    }
    setDiceResult(newNumbersResults);
    setResultList([...newNumbersResults, ...resultList]);
    setModifier("0");
  }

  function handleClearResult() {
    setResultList([]);
    setDiceResult([]);
  }

  return (
    <PageContainer>
      <DiceContextBox style={{ elevation: 3 }}>
        <Animatable.Image
          source={diceImg}
          animation="bounceIn"
          easing="ease-out"
          iterationCount={1}
          ref={DiceImgRef}
        />
        <SwitchDice>
          <SwitchDiceButton onPress={() => handleDiceChange(d6Img, 6)}>
            <SwitchDiceButtonText>d6</SwitchDiceButtonText>
          </SwitchDiceButton>

          <SwitchDiceButton onPress={() => handleDiceChange(d8Img, 8)}>
            <SwitchDiceButtonText>d8</SwitchDiceButtonText>
          </SwitchDiceButton>

          <SwitchDiceButton onPress={() => handleDiceChange(d12Img, 12)}>
            <SwitchDiceButtonText>d12</SwitchDiceButtonText>
          </SwitchDiceButton>

          <SwitchDiceButton onPress={() => handleDiceChange(d20Img, 20)}>
            <SwitchDiceButtonText>d20</SwitchDiceButtonText>
          </SwitchDiceButton>
        </SwitchDice>
      </DiceContextBox>
      <NumberContentBox style={{ elevation: 3 }}>
        <InputBox>
          <InputLabel>Number of results:</InputLabel>
          <InputField
            value={numResult}
            maxLength={2}
            keyboardType="numeric"
            onChangeText={(num) => setNumResult(num)}
          />
        </InputBox>
        <InputBox>
          <InputLabel>Modifier:</InputLabel>
          <InputField
            value={modifier}
            maxLength={3}
            keyboardType="numeric"
            onChangeText={(num) => setModifier(num)}
          />
        </InputBox>
      </NumberContentBox>

      <MainButton onPress={() => handleDiceRoll()}>
        <TextButton>Roll</TextButton>
      </MainButton>

      <ResultBox style={{ elevation: 3 }}>
        <ResultText>Result:</ResultText>
        <Animatable.View
          animation="bounceIn"
          easing="ease-out"
          iterationCount={1}
          ref={ResultBoobleRef}
        >
          <ResultList>
            {diceResult.map((result, index) => (
              <ResultBooble key={index}>{result}</ResultBooble>
            ))}
          </ResultList>
        </Animatable.View>

        {resultList.length > 0 && <ResultText>Result History:</ResultText>}
        <ResultList>
          {resultList.map((result, index) => (
            <ResultBooble key={index}>{result}</ResultBooble>
          ))}
        </ResultList>

        {resultList.length > 0 && (
          <ClearResultButton onPress={() => handleClearResult()}>
            <ClearResultText>Clear Results</ClearResultText>
          </ClearResultButton>
        )}
      </ResultBox>
    </PageContainer>
  );
}
