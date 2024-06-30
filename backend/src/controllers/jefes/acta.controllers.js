const actaCtrl = {};
const Acta = require('../../models/Acta.js');

actaCtrl.conversor = async (req, res) => {
    try {
        const acta = await Acta.findOne();
        if (!acta) {
            return res.status(404).json({ message: 'Acta no encontrada' });
        }
        const number = acta.number;
        const words = convertToWords(number);
        const roman = convertToRoman(number);
        res.status(200).json({ number, words, roman });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const convertToWords = (number) => {
    if (number < 1 || number > 100) {
        return 'Número fuera del rango admitido';
    }

    const units = ['', 'PRIMERA', 'SEGUNDA', 'TERCERA', 'CUARTA', 'QUINTA', 'SEXTA', 'SEPTIMA', 'OCTAVA', 'NOVENA'];
    const tens = [
        '',
        'DECIMA',
        'VIGESIMA',
        'TRIGESIMA',
        'CUADRAGESIMA',
        'QUINCUAGESIMA',
        'SEXAGESIMA',
        'SEPTUAGESIMA',
        'OCTOGESIMA',
        'NONAGESIMA',
    ];

    if (number < 10) {
        return units[number];
    } else if (number % 10 === 0) {
        return tens[Math.floor(number / 10)];
    } else {
        return tens[Math.floor(number / 10)] + ' ' + units[number % 10];
    }
};
const convertToRoman = (number) => {
    const romanNumerals = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
        'XI',
        'XII',
        'XIII',
        'XIV',
        'XV',
        'XVI',
        'XVII',
        'XVIII',
        'XIX',
        'XX',
        'XXI',
        'XXII',
        'XXIII',
        'XXIV',
        'XXV',
        'XXVI',
        'XXVII',
        'XXVIII',
        'XXIX',
        'XXX',
        'XXXI',
        'XXXII',
        'XXXIII',
        'XXXIV',
        'XXXV',
        'XXXVI',
        'XXXVII',
        'XXXVIII',
        'XXXIX',
        'XL',
        'XLI',
        'XLII',
        'XLIII',
        'XLIV',
        'XLV',
        'XLVI',
        'XLVII',
        'XLVIII',
        'XLIX',
        'L',
        'LI',
        'LII',
        'LIII',
        'LIV',
        'LV',
        'LVI',
        'LVII',
        'LVIII',
        'LIX',
        'LX',
        'LXI',
        'LXII',
        'LXIII',
        'LXIV',
        'LXV',
        'LXVI',
        'LXVII',
        'LXVIII',
        'LXIX',
        'LXX',
        'LXXI',
        'LXXII',
        'LXXIII',
        'LXXIV',
        'LXXV',
        'LXXVI',
        'LXXVII',
        'LXXVIII',
        'LXXIX',
        'LXXX',
        'LXXXI',
        'LXXXII',
        'LXXXIII',
        'LXXXIV',
        'LXXXV',
        'LXXXVI',
        'LXXXVII',
        'LXXXVIII',
        'LXXXIX',
        'XC',
        'XCI',
        'XCII',
        'XCIII',
        'XCIV',
        'XCV',
        'XCVI',
        'XCVII',
        'XCVIII',
        'XCIX',
        'C',
    ];
    if (number < 1 || number > 100) {
        return 'Número fuera del rango admitido';
    }
    return romanNumerals[number - 1];
};
actaCtrl.Act = async (req, res) => {
    try {
        const acta = await Acta.findOne();
        if (!acta) {
            return res.status(404).json({ message: 'Acta no encontrada' });
        }
        acta.number++;
        await acta.save();
        res.status(200).json({ number: acta.number });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = actaCtrl;
