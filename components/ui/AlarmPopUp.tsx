"use client";

import { useEffect, useState } from "react";

const isAfterThenEndTime = (endTime: Date) => {
  const currentTime = new Date();
  return currentTime > endTime;
};

export default function AlarmPopUp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const endTime = new Date("2025-1-6");
    if (isAfterThenEndTime(endTime)) {
      setIsVisible(false);
    } else {
      const popupHidden = localStorage.getItem("popUpHidden");
      if (popupHidden !== "true") {
        setIsVisible(true);
      }
    }
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("popUpHidden", "true");
    }
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="fixed top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
        <div className="absolute top-10 left-[50%] translate-x-[-50%] bg-white w-[80%] items-center rounded p-2">
          <h1 className="font-semibold text-xl">안내</h1>
          <hr />
          <div className="text-lg">
            <p>
              안녕하세요. 개발자 정재윤입니다.
              <br />
              12월 31일부로 판촉 알바를 종료하게 되었지만,
            </p>
            <p className="font-semibold">사이트 운영은 계속됩니다!</p>
            <p className="text-red-500 font-semibold">
              다만 보고 양식이 변경되면 제가 알기 어려우니,
            </p>
            <p>
              변경 사항이 있으면 언제든 jhasd128@gmail.com으로 알려주세요.
              (이메일은 사이트 하단에도 있어요!)
            </p>
            <p>이외에도 불편한 점이나 협업 제안이 있다면 편하게 연락 주세요.</p>
            <p>그럼 오늘도 힘내요😊</p>
            <p>(안내문은 1월 6일까지 표시됩니다.)</p>
          </div>
          <div className="absolute -bottom-8 left-0 w-full">
            <button
              onClick={handleClose}
              className="bg-[#3B89D6] active:bg-[#BBE1F8] text-white w-full py-1 px-2 rounded-b"
            >
              그만 보기
            </button>
          </div>
        </div>
      </div>
    )
  );
}
