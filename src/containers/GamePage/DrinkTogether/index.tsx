import React, {useEffect, useState} from 'react';
import './style.css'
import {getAnimalNameByLetter} from "../../../helpers/animalHelp";
import {getAnimalDrinkByLetter} from "../../../helpers/animalHelp2";
import beerIcon from './assets/beer2-icon.png'
import Button from "../../../components/Button";
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import glassesSound from "../../../assets/sounds/glasses.mp3";

const DrinkTogether = (d: { players: { id: string, letter: string }[], listAnimalsWithBeer: {player?: string}[], letDrink: any},  ) => {

    const [playButton] = useSound(buttonSound);

    const [glassesSoundLoad, setGlassesSoundLoad] = useState(false)
    const [playGlasses] = useSound(glassesSound, {
        onload: () => setGlassesSoundLoad(true)
    });
    useEffect(() => {
        if (glassesSoundLoad) {
            playGlasses();
        }
    }, [glassesSoundLoad])

    return (
        <div className="modal">
            <h1>who drinks today?</h1>
            <div className="users-list" style={{gridTemplateRows: `repeat(${Math.ceil(d.players.length / 2)}, calc(${80 / Math.ceil(d.players.length / 2)}% - 20px)`}}>
                {d.players.map(p => (
                    <div key={p.letter} className="user">
                        <div className="user-name">{getAnimalNameByLetter(p.letter)}</div>
                        <img className="animal-img" src={getAnimalDrinkByLetter(p.letter)} alt=""/>
                        {d.listAnimalsWithBeer.find(item => item.player === p.letter) && <img src={beerIcon} className="beer" style={{bottom: `-${d.players.length  * 10}%`}}/>}
                    </div>
                ))}
            </div>
            <Button onClick={() => {d.letDrink(); playButton()}} className="continue-button">Let's Drink!</Button>
        </div>
    );
};

export default DrinkTogether;
