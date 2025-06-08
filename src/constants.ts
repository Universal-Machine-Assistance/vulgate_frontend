import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBook, faScroll, faCross, faCrown, faStar, faSun, faMoon, faHeart, faDove, faScroll as faTorah } from '@fortawesome/free-solid-svg-icons';

export const BOOK_ICONS: { [key: string]: IconDefinition } = {
  'Gn': faTorah,
  'Ex': faTorah,
  'Lv': faTorah,
  'Nm': faTorah,
  'Dt': faTorah,
  'Jos': faCross,
  'Jdc': faCross,
  'Rt': faHeart,
  '1Sm': faCrown,
  '2Sm': faCrown,
  '1Rg': faCrown,
  '2Rg': faCrown,
  '1Ch': faCrown,
  '2Ch': faCrown,
  'Esr': faScroll,
  'Neh': faScroll,
  'Tb': faBook,
  'Jdt': faBook,
  'Est': faBook,
  '1Mc': faBook,
  '2Mc': faBook,
  'Iob': faBook,
  'Ps': faBook,
  'Prv': faBook,
  'Ecl': faBook,
  'Ct': faHeart,
  'Sap': faBook,
  'Sir': faBook,
  'Is': faBook,
  'Ier': faBook,
  'Lam': faBook,
  'Bar': faBook,
  'Ez': faBook,
  'Dn': faBook,
  'Os': faBook,
  'Ioel': faBook,
  'Am': faBook,
  'Abd': faBook,
  'Ion': faBook,
  'Mi': faBook,
  'Naum': faBook,
  'Hab': faBook,
  'Sof': faBook,
  'Agg': faBook,
  'Zac': faBook,
  'Mal': faBook,
  'Mt': faCross,
  'Mc': faCross,
  'Lc': faCross,
  'Io': faCross,
  'Act': faCross,
  'Rm': faBook,
  '1Co': faBook,
  '2Co': faBook,
  'Gl': faBook,
  'Eph': faBook,
  'Php': faBook,
  'Col': faBook,
  '1Th': faBook,
  '2Th': faBook,
  '1Tm': faBook,
  '2Tm': faBook,
  'Tt': faBook,
  'Phm': faBook,
  'Hbr': faBook,
  'Iac': faBook,
  '1Pt': faBook,
  '2Pt': faBook,
  '1Io': faBook,
  '2Io': faBook,
  '3Io': faBook,
  'Iud': faBook,
  'Ap': faBook
};

export const getBookCategoryColor = (bookAbbr: string): string => {
  const category = getBookCategory(bookAbbr);
  switch (category) {
    case 'Pentateuch':
      return 'bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 focus:from-red-200 focus:to-red-300 border-red-300';
    case 'Historical':
      return 'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 focus:from-blue-200 focus:to-blue-300 border-blue-300';
    case 'Wisdom':
      return 'bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 focus:from-emerald-200 focus:to-emerald-300 border-emerald-300';
    case 'Prophets':
      return 'bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 focus:from-purple-200 focus:to-purple-300 border-purple-300';
    case 'Gospels':
      return 'bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 focus:from-amber-200 focus:to-amber-300 border-amber-300';
    case 'Acts':
      return 'bg-gradient-to-br from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 focus:from-teal-200 focus:to-teal-300 border-teal-300';
    case 'Pauline':
      return 'bg-gradient-to-br from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 focus:from-rose-200 focus:to-rose-300 border-rose-300';
    case 'Catholic':
      return 'bg-gradient-to-br from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 focus:from-indigo-200 focus:to-indigo-300 border-indigo-300';
    case 'Apocalyptic':
      return 'bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 focus:from-orange-200 focus:to-orange-300 border-orange-300';
    default:
      return 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 focus:from-gray-200 focus:to-gray-300 border-gray-300';
  }
};

const getBookCategory = (bookAbbr: string): string => {
  const pentateuch = ['Gn', 'Ex', 'Lv', 'Nm', 'Dt'];
  const historical = ['Jos', 'Jdc', 'Rt', '1Sm', '2Sm', '1Rg', '2Rg', '1Ch', '2Ch', 'Esr', 'Neh', 'Tb', 'Jdt', 'Est', '1Mc', '2Mc'];
  const wisdom = ['Iob', 'Ps', 'Prv', 'Ecl', 'Ct', 'Sap', 'Sir'];
  const prophets = ['Is', 'Ier', 'Lam', 'Bar', 'Ez', 'Dn', 'Os', 'Ioel', 'Am', 'Abd', 'Ion', 'Mi', 'Naum', 'Hab', 'Sof', 'Agg', 'Zac', 'Mal'];
  const gospels = ['Mt', 'Mc', 'Lc', 'Io'];
  const acts = ['Act'];
  const pauline = ['Rm', '1Co', '2Co', 'Gl', 'Eph', 'Php', 'Col', '1Th', '2Th', '1Tm', '2Tm', 'Tt', 'Phm'];
  const catholic = ['Hbr', 'Iac', '1Pt', '2Pt', '1Io', '2Io', '3Io', 'Iud'];
  const apocalyptic = ['Ap'];

  if (pentateuch.includes(bookAbbr)) return 'Pentateuch';
  if (historical.includes(bookAbbr)) return 'Historical';
  if (wisdom.includes(bookAbbr)) return 'Wisdom';
  if (prophets.includes(bookAbbr)) return 'Prophets';
  if (gospels.includes(bookAbbr)) return 'Gospels';
  if (acts.includes(bookAbbr)) return 'Acts';
  if (pauline.includes(bookAbbr)) return 'Pauline';
  if (catholic.includes(bookAbbr)) return 'Catholic';
  if (apocalyptic.includes(bookAbbr)) return 'Apocalyptic';
  return 'Other';
}; 