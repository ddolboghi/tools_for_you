import {
  GalmegiSums,
  ProviderSums,
  ReportPercentages,
  ReportTables,
} from "@/utils/sale/types";
import SMGalmegiSummary from "./SMGalmegiSummary";

type SMReportProps = {
  providerSums: ProviderSums;
  reportTables: ReportTables;
  reportPercentages: ReportPercentages;
  galmegiSums: GalmegiSums;
};

export default function SMReport({
  providerSums,
  reportTables,
  reportPercentages,
  galmegiSums,
}: SMReportProps) {
  return (
    <div className="border border-blue-300">
      <h1>
        {"<"}이순조SM 퇴근보고{">"}
      </h1>
      <section>
        <h1>1. 야간판촉지역</h1>
        <p>광안 바닷가</p>
        <p>총 테이블 수 : {providerSums.total}</p>
      </section>
      <section>
        <h1>2. 야간 음용비</h1>
        <p>
          좋은데이 : {reportTables.goodDay}T - {reportPercentages.goodDay}%
        </p>
        <p>
          좋은데이 톡시리즈 : {reportTables.toc}T - {reportPercentages.toc}%
        </p>
        <p>
          갈매기19 : {reportTables.galmegi19}T - {reportPercentages.galmegi19}%
          %
        </p>
        <p>
          갈매기16 : {reportTables.galmegi16}T - {reportPercentages.galmegi16}%
        </p>
        <p>
          대선 : {reportTables.daesun}T - {reportPercentages.daesun}%
        </p>
        <p>
          강알리 : {reportTables.gangali}T - {reportPercentages.gangali}%
        </p>
        <p>
          진로 : {reportTables.jinro}T - {reportPercentages.jinro}%
        </p>
        <p>
          진로(골드) : {reportTables.jinrogold}T - {reportPercentages.jinrogold}
          %
        </p>
        <p>
          참이슬 : {reportTables.chamisul}T - {reportPercentages.chamisul}%
        </p>
        <p>C1: T - %</p>
        <h2>기타</h2>
        <p>
          새로: {reportTables.sero}T - {reportPercentages.sero}% %
        </p>
        <p>
          새로(살구): {reportTables.serosalgu}T - {reportPercentages.serosalgu}%
        </p>
        <p>
          청하: {reportTables.chungha}T - {reportPercentages.chungha}%
        </p>
        <br />
        <SMGalmegiSummary galmegiSums={galmegiSums} />
      </section>
    </div>
  );
}
