import React, {useEffect} from 'react';
import './style.css'
import {getAnimalByLetter, getAnimalNameByLetter} from "../../../helpers/animalHelp";
import {getAnimalDrinkByLetter} from "../../../helpers/animalHelp2";
import beerIcon from './assets/beer2-icon.png'
import style from "../style.module.css";
import Button from "../../../components/Button";

const DrinkTogether = (d: { players: { id: string, letter: string }[], listAnimalsWithBeer: {player?: string}[], letDrink: any},  ) => {

    return (
        <div className="modal">
            <h1>who drinks today?</h1>
            <div className="users-list" style={{gridTemplateRows: `repeat(${Math.ceil(d.players.length / 2)}, ${80 / Math.ceil(d.players.length / 2)}%)`}}>
                {d.players.map(p => (
                    <div className="user">
                        <div className="user-name">{getAnimalNameByLetter(p.letter)}</div>
                        <img className="animal-img" src={getAnimalDrinkByLetter(p.letter)} alt=""/>
                        {d.listAnimalsWithBeer.find(item => item.player === p.letter) && <img src={beerIcon} className="beer"/>}
                    </div>
                ))}
            </div>
            <Button onClick={() => d.letDrink()} className="continue-button">Let's Drink!</Button>
        </div>
    );
};

export default DrinkTogether;
