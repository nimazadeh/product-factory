import type { Transaction } from "./types";
const d = (daysAgo: number) => { const x=new Date(); x.setDate(x.getDate()-daysAgo); return x.toISOString().slice(0,10); };
let n=0; const t=(title:string,amount:number,type:"income"|"expense",category:string,daysAgo:number):Transaction=>({id:`seed-${++n}`,title,amount,type,category,date:d(daysAgo)});
export const SEED: Transaction[] = [
  t("حقوق ماهانه",48000000,"income","درآمد",2), t("پروژه فریلنسری",8500000,"income","درآمد",9),
  t("سوپرمارکت",1280000,"expense","خوراک",0), t("ناهار بیرون",420000,"expense","خوراک",0), t("اسنپ",185000,"expense","حمل‌ونقل",0),
  t("قهوه و کیک",260000,"expense","تفریح",1), t("خرید میوه",680000,"expense","خوراک",1), t("بنزین",500000,"expense","حمل‌ونقل",2),
  t("قبض اینترنت",348000,"expense","قبوض",3), t("کتاب",540000,"expense","آموزش",4), t("سوپرمارکت",1940000,"expense","خوراک",5),
  t("سینما",380000,"expense","تفریح",6), t("داروخانه",720000,"expense","سلامت",7), t("قبض برق",612000,"expense","قبوض",8),
  t("کفش",3200000,"expense","خرید",10), t("رستوران",1150000,"expense","خوراک",12), t("مترو و اتوبوس",120000,"expense","حمل‌ونقل",14),
  t("اشتراک موسیقی",199000,"expense","تفریح",16), t("خرید لباس",2750000,"expense","خرید",19), t("دوره آنلاین",1800000,"expense","آموزش",22),
  t("سوپرمارکت",2100000,"expense","خوراک",25), t("قبض گاز",430000,"expense","قبوض",27), t("هدیه",900000,"expense","سایر",29),
  // previous period (for comparison)
  t("حقوق ماهانه",46000000,"income","درآمد",33), t("سوپرمارکت",1750000,"expense","خوراک",35), t("خرید گوشی اقساط",4500000,"expense","خرید",40),
  t("رستوران",980000,"expense","خوراک",45), t("بنزین",500000,"expense","حمل‌ونقل",50),
];
