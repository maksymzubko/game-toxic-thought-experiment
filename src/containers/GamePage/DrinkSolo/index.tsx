import React, {useEffect, useState} from 'react';
import drinkBg from './assets/bg2.png'
import jugImg from './assets/jug.png'
import './style.css'
import {getAnimalColorByLetter, getAnimalDrinkByLetter} from "../../../helpers/animalHelp2";
import Button from "../../../components/Button";
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import glassesSound from "../../../assets/sounds/glasses.mp3";

const DrinkSolo = (d: {drinkStatus: string, drinkStatusBool: boolean, players: any[], userId: any, letDrink: any}) => {

    const [imageSource, setImageSource] = useState("");
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

    const getImageSrc = () => {
        const letter =  d.players.find(player => player.id === d.userId).letter;
        if (d.drinkStatusBool) {
            setImageSource(getAnimalDrinkByLetter(letter))
        } else {
            setImageSource(getAnimalColorByLetter(letter))
        }
    }

    useEffect(() => {
        getImageSrc();
    }, []);


    return (
        <>
            <div className="modal drink-solo" >
                <h1>{d.drinkStatus}</h1>
            </div>
            <img src={drinkBg} alt="" className="drink-bg" />
            <div className="img-wrapper">
                <img src={imageSource} alt="" className="animal-img-big"/>
            </div>
            <img src={jugImg} alt="" className="jug-img"/>
            <Button onClick={() => {d.letDrink(); playButton()}} className="continue-button-2">Let's Drink!</Button>
        </>
    );
};

export default DrinkSolo;
