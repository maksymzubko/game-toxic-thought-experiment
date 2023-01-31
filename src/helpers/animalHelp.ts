import deer from '../assets/animal-faces/deer-4.png';
import dog from '../assets/animal-faces/dog-4.png';
import fox from '../assets/animal-faces/fox-4.png';
import koala from '../assets/animal-faces/koala-4.png';
import monkey from '../assets/animal-faces/monkey-4.png';
import owl from '../assets/animal-faces/owl-4.png';
import rabbit from '../assets/animal-faces/rabbit-4.png';
import tiger from '../assets/animal-faces/tiger-4.png';

export const getAnimalByLetter = (letter: string) => {
    switch (letter) {
        case 'A':
            return deer;
        case 'B':
            return dog;
        case 'C':
            return fox;
        case 'D':
            return koala;
        case 'E':
            return monkey;
        case 'F':
            return owl;
        case 'G':
            return rabbit;
        default: return tiger;
    }
}

export const getAnimalNameByLetter = (letter: string) => {
    switch (letter) {
        case 'A':
            return 'deer';
        case 'B':
            return 'dog';
        case 'C':
            return 'fox';
        case 'D':
            return 'koala';
        case 'E':
            return 'monkey';
        case 'F':
            return 'owl';
        case 'G':
            return 'rabbit';
        default: return 'tiger';
    }
}