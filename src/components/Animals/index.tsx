import React from 'react';
import './style.css'
import {getAnimalColorByLetter, getAnimalGreyByLetter} from "../../helpers/animalHelp2";


const AnimalBar = (d : {players: { id: string, letter: string }[], currentStep: string}) => {

    const getSourceImg = (letter: string) => {
        if (letter === d.currentStep)
            return getAnimalColorByLetter(letter);
        else return getAnimalGreyByLetter(letter);
    }

    return (
        <>
            <div className="animal-bar">
                {d.players.map((p, index) => {
                    if (index < 4) return <img src={getSourceImg(p.letter)} alt={'animal' + p.letter}/>
                })}
            </div>
            {
                d.players.length > 4 &&
                <div className="animal-bar animal-bar-left">
                    {d.players.map((p, index) => {
                        if (index > 3) return <img src={getSourceImg(p.letter)} alt={'animal' + p.letter} />
                    })}
                </div>
            }
        </>
    );
};

export default AnimalBar;
