export interface BeneficiaryItem {
  id: string;
  nameEn: string;
  nameGu: string;
  categoryEn: string;
  categoryGu: string;
  categoryType: 'pregnant' | 'lactating' | 'infant' | 'children' | 'adolescent' | 'other';
  ageEn?: string;
  ageGu?: string;
  phone?: string;
  parentOrSpouseEn?: string;
  parentOrSpouseGu?: string;
  mcpCardNo?: string;
  addressEn?: string;
  addressGu?: string;
  registeredDate?: string;
  isCustom?: boolean;
}

const STORAGE_KEY = 'poshansetu_registered_beneficiaries';

export const INITIAL_BENEFICIARIES: BeneficiaryItem[] = [
  {
    id: 'ben-01',
    nameEn: 'Surbhi Rawat',
    nameGu: 'સુરભી રાવત',
    categoryEn: 'Lactating Mother (LM)',
    categoryGu: 'ધાત્રી માતા (LM)',
    categoryType: 'lactating',
    ageEn: '25 Years',
    ageGu: '૨૫ વર્ષ',
    phone: '+91 98251 44321',
    parentOrSpouseEn: 'Husband: Rajesh Rawat',
    parentOrSpouseGu: 'પતિ: રાજેશ રાવત',
    mcpCardNo: 'MCP-GJ-2026-1011',
    addressEn: 'Station Road, Vadtal',
    addressGu: 'સ્ટેશન રોડ, વડતાલ'
  },
  {
    id: 'ben-02',
    nameEn: 'Shreeya Pankaj Dube',
    nameGu: 'શ્રેયા પંકજ દુબે',
    categoryEn: 'Pregnant Woman (PW)',
    categoryGu: 'સગર્ભા માતા (PW)',
    categoryType: 'pregnant',
    ageEn: '24 Years (4th Month)',
    ageGu: '૨૪ વર્ષ (૪થો મહિનો)',
    phone: '+91 98272 23451',
    parentOrSpouseEn: 'Husband: Pankaj Dube',
    parentOrSpouseGu: 'પતિ: પંકજ દુબે',
    mcpCardNo: 'MCP-GJ-2026-4401',
    addressEn: 'Gayatri Mohalla, Plot 12, Vadtal',
    addressGu: 'ગાયત્રી મહોલ્લો, પ્લોટ ૧૨, વડતાલ'
  },
  {
    id: 'ben-03',
    nameEn: 'Priti Rahul Arora',
    nameGu: 'પ્રિતી રાહુલ અરોરા',
    categoryEn: 'Lactating Mother (LM)',
    categoryGu: 'ધાત્રી માતા (LM)',
    categoryType: 'lactating',
    ageEn: '28 Years',
    ageGu: '૨૮ વર્ષ',
    phone: '+91 98274 45673',
    parentOrSpouseEn: 'Husband: Rahul Arora',
    parentOrSpouseGu: 'પતિ: રાહુલ અરોરા',
    mcpCardNo: 'MCP-GJ-2026-4403',
    addressEn: 'Main Bazaar Road, Vadtal',
    addressGu: 'મુખ્ય બજાર રોડ, વડતાલ'
  },
  {
    id: 'ben-04',
    nameEn: 'Aarav Ramesh Patel',
    nameGu: 'આરવ રમેશ પટેલ',
    categoryEn: 'Child (6m-3 yrs)',
    categoryGu: 'બાળક (૬માસ-૩ વર્ષ)',
    categoryType: 'infant',
    ageEn: '2 Years',
    ageGu: '૨ વર્ષ',
    phone: '+91 98251 12341',
    parentOrSpouseEn: 'Father: Ramesh Patel',
    parentOrSpouseGu: 'પિતા: રમેશ પટેલ',
    addressEn: 'Near Swaminarayan Mandir, Faliyu 1, Vadtal',
    addressGu: 'સ્વામિનારાયણ મંદિર પાસે, ફળિયું ૧, વડતાલ'
  },
  {
    id: 'ben-05',
    nameEn: 'Kiranben Arvind Solanki',
    nameGu: 'કિરણબેન અરવિંદ સોલંકી',
    categoryEn: 'Pregnant Woman (PW)',
    categoryGu: 'સગર્ભા માતા (PW)',
    categoryType: 'pregnant',
    ageEn: '26 Years (7th Month)',
    ageGu: '૨૬ વર્ષ (૭મો મહિનો)',
    phone: '+91 98273 34562',
    parentOrSpouseEn: 'Husband: Arvind Solanki',
    parentOrSpouseGu: 'પતિ: અરવિંદ સોલંકી',
    mcpCardNo: 'MCP-GJ-2026-4402',
    addressEn: 'Station Road, Faliyu 1, Vadtal',
    addressGu: 'સ્ટેશન રોડ, ફળિયું ૧, વડતાલ'
  },
  {
    id: 'ben-06',
    nameEn: 'Sonalben Hitesh Prajapati',
    nameGu: 'સોનલબેન હિતેશ પ્રજાપતિ',
    categoryEn: 'Pregnant Woman (PW)',
    categoryGu: 'સગર્ભા માતા (PW)',
    categoryType: 'pregnant',
    ageEn: '23 Years',
    ageGu: '૨૩ વર્ષ',
    phone: '+91 98275 56784',
    parentOrSpouseEn: 'Husband: Hitesh Prajapati',
    parentOrSpouseGu: 'પતિ: હિતેશ પ્રજાપતિ',
    mcpCardNo: 'MCP-GJ-2026-4404',
    addressEn: 'Kumbhar Vas, Vadtal',
    addressGu: 'કુંભાર વાસ, વડતાલ'
  },
  {
    id: 'ben-07',
    nameEn: 'Vaishali Mehul Patel',
    nameGu: 'વૈશાલી મેહુલ પટેલ',
    categoryEn: 'Pregnant Woman (PW)',
    categoryGu: 'સગર્ભા માતા (PW)',
    categoryType: 'pregnant',
    ageEn: '27 Years',
    ageGu: '૨૭ વર્ષ',
    phone: '+91 98276 67895',
    parentOrSpouseEn: 'Husband: Mehul Patel',
    parentOrSpouseGu: 'પતિ: મેહુલ પટેલ',
    mcpCardNo: 'MCP-GJ-2026-4405',
    addressEn: 'Ramji Mandir Chowk, Vadtal',
    addressGu: 'રામજી મંદિર ચોક, વડતાલ'
  },
  {
    id: 'ben-08',
    nameEn: 'Geetaben Dinesh Vaghela',
    nameGu: 'ગીતાબેન દિનેશ વાઘેલા',
    categoryEn: 'Lactating Mother (LM)',
    categoryGu: 'ધાત્રી માતા (LM)',
    categoryType: 'lactating',
    ageEn: '22 Years',
    ageGu: '૨૨ વર્ષ',
    phone: '+91 98277 78906',
    parentOrSpouseEn: 'Husband: Dinesh Vaghela',
    parentOrSpouseGu: 'પતિ: દિનેશ વાઘેલા',
    mcpCardNo: 'MCP-GJ-2026-4406',
    addressEn: 'Vaghela Vas, Vadtal',
    addressGu: 'વાઘેલા વાસ, વડતાલ'
  },
  {
    id: 'ben-09',
    nameEn: 'Vivaan Rekhaben Chavda',
    nameGu: 'વિવાન રેખાબેન ચાવડા',
    categoryEn: 'Infant (6m-3 yrs)',
    categoryGu: 'શિશુ (૬માસ-૩ વર્ષ)',
    categoryType: 'infant',
    ageEn: '6 Months',
    ageGu: '૬ મહિના',
    parentOrSpouseEn: 'Mother: Rekhaben Chavda',
    parentOrSpouseGu: 'માતા: રેખાબેન ચાવડા',
    addressEn: 'Sardar Patel Nagar, Vadtal',
    addressGu: 'સરદાર પટેલ નગર, વડતાલ'
  },
  {
    id: 'ben-10',
    nameEn: 'Diya Bhavesh Shah',
    nameGu: 'દીયા ભાવેશ શાહ',
    categoryEn: 'Pre-School Child (3-6 yrs)',
    categoryGu: 'પૂર્વ પ્રાથમિક બાળક (૩-૬ વર્ષ)',
    categoryType: 'children',
    ageEn: '5 Years',
    ageGu: '૫ વર્ષ',
    parentOrSpouseEn: 'Father: Bhavesh Shah',
    parentOrSpouseGu: 'પિતા: ભાવેશ શાહ',
    addressEn: 'Station Road, Vadtal',
    addressGu: 'સ્ટેશન રોડ, વડતાલ'
  }
];

export function getRegisteredBeneficiaries(): BeneficiaryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: BeneficiaryItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not parse beneficiaries from localStorage', e);
  }
  return INITIAL_BENEFICIARIES;
}

export function saveNewBeneficiary(data: {
  name: string;
  categoryType: BeneficiaryItem['categoryType'];
  age?: string;
  phone?: string;
  parentOrSpouse?: string;
  mcpCardNo?: string;
  address?: string;
}): BeneficiaryItem {
  const current = getRegisteredBeneficiaries();

  // Category labels mapping
  const categoryLabels: Record<
    BeneficiaryItem['categoryType'],
    { en: string; gu: string }
  > = {
    pregnant: { en: 'Pregnant Woman (PW)', gu: 'સગર્ભા માતા (PW)' },
    lactating: { en: 'Lactating Mother (LM)', gu: 'ધાત્રી માતા (LM)' },
    infant: { en: 'Child / Infant (6m-3 yrs)', gu: 'બાળક / શિશુ (૬માસ-૩ વર્ષ)' },
    children: { en: 'Pre-School Child (3-6 yrs)', gu: 'પૂર્વ પ્રાથમિક બાળક (૩-૬ વર્ષ)' },
    adolescent: { en: 'Adolescent Girl (Purna)', gu: 'કિશોરી (પૂર્ણા શક્તિ)' },
    other: { en: 'Beneficiary (Other)', gu: 'અન્ય લાભાર્થી' }
  };

  const cat = categoryLabels[data.categoryType] || categoryLabels.other;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const newBeneficiary: BeneficiaryItem = {
    id: `ben-${Date.now()}`,
    nameEn: data.name.trim(),
    nameGu: data.name.trim(),
    categoryEn: cat.en,
    categoryGu: cat.gu,
    categoryType: data.categoryType,
    ageEn: data.age?.trim() || 'N/A',
    ageGu: data.age?.trim() || 'N/A',
    phone: data.phone?.trim() || undefined,
    parentOrSpouseEn: data.parentOrSpouse?.trim() || undefined,
    parentOrSpouseGu: data.parentOrSpouse?.trim() || undefined,
    mcpCardNo: data.mcpCardNo?.trim() || undefined,
    addressEn: data.address?.trim() || 'AWC 04 Vadtal',
    addressGu: data.address?.trim() || 'આંગણવાડી ૦૪ વડતાલ',
    registeredDate: dateStr,
    isCustom: true
  };

  const updated = [newBeneficiary, ...current];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save beneficiary to localStorage', e);
  }

  return newBeneficiary;
}

export function deleteBeneficiary(id: string): void {
  const current = getRegisteredBeneficiaries();
  const filtered = current.filter((b) => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Could not update beneficiaries in localStorage', e);
  }
}
