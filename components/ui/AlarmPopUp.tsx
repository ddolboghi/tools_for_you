"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const isAfterThenEndTime = (endTime: Date) => {
  const currentTime = new Date();
  return currentTime > endTime;
};

export default function AlarmPopUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const endTime = new Date("2025-2-24");
    if (isAfterThenEndTime(endTime)) {
      setIsVisible(false);
    } else {
      const popupHidden = localStorage.getItem("popUpHidden");
      if (popupHidden !== "true") {
        setIsVisible(true);
      }
    }
  }, []);

  const handleCloseForever = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("popUpHidden", "true");
    }
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    isVisible && (
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-gray-800 z-50 flex justify-center items-center transition-opacity duration-500 ease-in-out
        ${isClosing ? "bg-opacity-0" : "bg-opacity-50"}`}
        onClick={handleClose}
      >
        <div
          className={`absolute bottom-8 left-[50%] translate-x-[-50%] bg-white w-full h-[310px] items-center rounded-t-2xl p-2 transform transition-all duration-500 ease-in-out
          ${
            isClosing
              ? "translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="font-semibold text-xl">안내</h1>
          <hr />
          <div className="text-base">
            <p>
              안녕하세요. 개발자 정재윤입니다.
              <br />
              <span className="text-sky-600 font-semibold">
                25.02.17에 새로운 보고양식으로 업데이트했습니다!
              </span>
              <br />
              이전 버전을 사용하고 싶으시다면 사이트 상단 &apos;이전 버전
              사용하기&apos;를 클릭해주세요.
            </p>
            <p className="font-semibold">
              이전 버전은 2월 28일까지만 사용하실 수 있습니다.
            </p>
            <br />
            <p>
              이상하게 작동한다면{" "}
              <Link
                href={"https://open.kakao.com/o/s9Kbw37g"}
                className="underline font-bold bg-[#FEE500]"
              >
                카톡 오픈채팅
              </Link>
              으로 알려주세요.
            </p>
            <p>오늘도 수고하셨습니다.😊</p>
            <p>(안내문은 일주일동안 표시됩니다.)</p>
          </div>
          <div className="absolute -bottom-10 left-0 w-full bg-gray-200 flex flex-row justify-between pt-1 pb-10">
            <button onClick={handleCloseForever} className="pl-2">
              그만 보기
            </button>
            <button onClick={handleClose} className="pr-2">
              닫기
            </button>
          </div>
        </div>
      </div>
    )
  );
}
