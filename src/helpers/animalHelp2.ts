import { deerColor, dogColor, foxColor, koalaColor, monkeyColor, owlColor, rabbitColor, tigerColor } from '../components/Animals/assets/color';
import { deerGrey, dogGrey, foxGrey, koalaGrey, monkeyGrey, owlGrey, rabbitGrey, tigerGrey } from '../components/Animals/assets/grey';
import { deerDrink, dogDrink, foxDrink, koalaDrink, monkeyDrink, owlDrink, rabbitDrink, tigerDrink } from '../components/Animals/assets/drink';

export const getAnimalColorByLetter = (letter: string) => {
    switch (letter) {
        case 'A':
            return deerColor;
        case 'B':
            return dogColor;
        case 'C':
            return foxColor;
        case 'D':
            return koalaColor;
        case 'E':
            return monkeyColor;
        case 'F':
            return owlColor;
        case 'G':
            return rabbitColor;
        default: return tigerColor;
    }
}

export const getAnimalGreyByLetter = (letter: string) => {
    switch (letter) {
        case 'A':
            return deerGrey;
        case 'B':
            return dogGrey;
        case 'C':
            return foxGrey;
        case 'D':
            return koalaGrey;
        case 'E':
            return monkeyGrey;
        case 'F':
            return owlGrey;
        case 'G':
            return rabbitGrey;
        default: return tigerGrey;
    }
}
export const getAnimalDrinkByLetter = (letter: string) => {
    switch (letter) {
        case 'A':
            return deerDrink;
        case 'B':
            return dogDrink;
        case 'C':
            return foxDrink;
        case 'D':
            return koalaDrink;
        case 'E':
            return monkeyDrink;
        case 'F':
            return owlDrink;
        case 'G':
            return rabbitDrink;
        default: return tigerDrink;
    }
}
