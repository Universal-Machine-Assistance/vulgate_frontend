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
      return 'hover:bg-blue-100 focus:bg-blue-200';
    case 'Historical':
      return 'hover:bg-green-100 focus:bg-green-200';
    case 'Wisdom':
      return 'hover:bg-yellow-100 focus:bg-yellow-200';
    case 'Prophets':
      return 'hover:bg-red-100 focus:bg-red-200';
    case 'Gospels':
      return 'hover:bg-purple-100 focus:bg-purple-200';
    case 'Acts':
      return 'hover:bg-indigo-100 focus:bg-indigo-200';
    case 'Pauline':
      return 'hover:bg-pink-100 focus:bg-pink-200';
    case 'Catholic':
      return 'hover:bg-orange-100 focus:bg-orange-200';
    case 'Apocalyptic':
      return 'hover:bg-gray-100 focus:bg-gray-200';
    default:
      return 'hover:bg-gray-100 focus:bg-gray-200';
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