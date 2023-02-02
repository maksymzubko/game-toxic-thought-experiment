import React from 'react';
import './style.css'
import {getAnimalColorByLetter, getAnimalGreyByLetter} from "../../helpers/animalHelp2";
import {Avatar} from "@mui/material";
import {getAnimalByLetter} from "../../helpers/animalHelp";
import style from "../../containers/GamePage/style.module.css";

const AnimalBar = (d : {players: { id: string, letter: string }[], currentStep: string}) => {

    const getSourceImg = (letter: string) => {
        if (letter === d.currentStep)
            return getAnimalColorByLetter(letter);
        else return getAnimalGreyByLetter(letter);
    }

    return (
        <div className="animal-bar">
            {d.players.map(p => <img src={getSourceImg(p.letter)} alt={'animal' + p.letter}/>)}
        </div>
    );
};

export default AnimalBar;
