import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function Guide() {
  return (
    <Dialog>
      <DialogTrigger className="pt-2">🤔어떻게 계산하나요?</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <section>
            <h1 className="text-lg font-bold">
              1. 주류별로 테이블 개수를 모두 더해요. 🫗
            </h1>
            <p>
              예를 들어, 모든 업소에서 좋은데이 테이블 개수를 더하는 거예요.
              ⚠️이때 전환/추가 개수는 더하지 않아요!
            </p>
          </section>
          <section>
            <h1 className="text-lg font-bold">
              2. 전체 테이블 개수를 구해요. ➕
            </h1>
            <p>
              1번에서 구한 각 주류별 테이블 합계를 모두 더하면 돼요. 좋은데이,
              부산갈매기 등 모든 테이블 합계를 한꺼번에 더하는 거죠.
            </p>
          </section>
          <section>
            <h1 className="text-lg font-bold">
              3. 주류별 점유율을 계산해요. 📊
            </h1>
            <p>
              1번에서 구한 주류별 테이블 합계를 2번에서 구한 전체 테이블 합계로
              나눈 다음 100을 곱해요. 그러면 주류별 백분율이 나와요. 🎯
            </p>
          </section>
          <section>
            <h1 className="text-lg font-bold">
              4. 소수점 둘째 자리에서 반올림하고, 총합이 100%가 되게 맞춰요. 🤖
            </h1>
            <p>
              백분율은 소수점 첫째 자리까지만 보여줘야 하니까 둘째 자리에서
              반올림해요. 그런데 반올림하다 보면 총합이 99%나 101%가 될 때가
              있어서 값을 수정해야 했어요. 이제는 버튼 한 번 누르면 자동으로
              100%로 맞춰줘요! 😎
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
