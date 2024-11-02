export const translateToKoreanDayOfWeek = (dayOfweekNum: number) => {
  switch (dayOfweekNum) {
    case 0:
      return "일요일";
    case 1:
      return "월요일";
    case 2:
      return "화요일";
    case 3:
      return "수요일";
    case 4:
      return "목요일";
    case 5:
      return "금요일";
    case 6:
      return "토요일";
  }
};

export const getReportDate = () => {
  const kstDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const month = String(kstDate.getMonth() + 1).padStart(2, "");
  const day = String(kstDate.getDate()).padStart(2, "0");
  const dayOfWeek = translateToKoreanDayOfWeek(kstDate.getDay());
  return `<${month}월 ${day}일 ${dayOfWeek} 광안 상권보고>`;
};
