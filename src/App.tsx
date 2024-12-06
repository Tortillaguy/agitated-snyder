import { useEffect, useState } from "react";
import "./App.css";

// Solution to step 2!
const getFlag = async () => {
  try {
    const response = await fetch(
      "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge"
    );
    const text = await response.text();
    const parser = new DOMParser();
    const document = parser.parseFromString(text, "text/html");

    let payload = "";

    const elements = document.body.querySelectorAll("code > div > span > i");
    elements.forEach((element) => {
      const value = element.getAttribute("value");
      if (value) payload += value;
    });

    return payload;
  } catch (error) {
    console.log(error);
  }
  return null;
};

const getPayload = async (url: string) => {
  const response = await fetch(url);
  const text = await response.text();
  return text;
};

function App() {
  const [flagUrl, setFlagUrl] = useState<string | null>("");
  const [payload, setPayload] = useState<string | null>("");
  const [animIndex, setAnimIndex] = useState<number>(0);

  useEffect(() => {
    getFlag().then(setFlagUrl);
  }, []);

  useEffect(() => {
    if (!flagUrl) return;
    getPayload(flagUrl).then(setPayload);
  }, [flagUrl]);

  useEffect(() => {
    if (!payload) return;
    const interval = setInterval(() => {
      if (animIndex >= payload.length) return;
      else setAnimIndex(animIndex + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [payload, animIndex]);

  return (
    <>
      {!payload && <h1>Loading...</h1>}
      {payload && (
        <ul>
          {payload
            .slice(0, animIndex)
            .split("")
            .map((char, index) => (
              <li key={index}>{char}</li>
            ))}
        </ul>
      )}
    </>
  );
}

export default App;
