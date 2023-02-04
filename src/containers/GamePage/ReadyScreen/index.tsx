import React, {useEffect} from 'react';
import './style.css';
import {getAnimalNameByLetter} from "../../../helpers/animalHelp";
import {getAnimalDrinkByLetter} from "../../../helpers/animalHelp2";
import beerIcon from "../DrinkTogether/assets/beer2-icon.png";
import {Box} from "@mui/material";
import style from "../style.module.css";
import Button from "../../../components/Button";
import {useSelector} from "react-redux";
import {SelectSocket, SelectUserRoom} from "../../../redux/store/socket/selector";
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";

const ReadyScreen = (d: { players: { id: string, letter: string }[], round: number }  ) => {
    const socket = useSelector(SelectSocket);
    const userRoom = useSelector(SelectUserRoom);
    const [playButton] = useSound(buttonSound);

    const handleGameStart = () => {
        playButton();
        socket?.emit('startGame');
    }

    const handleLeave = () => {
        playButton();
        socket?.emit('leaveRoom');
    }

    return (
        <div className="modal">
            <h1>ok, let's start</h1>
            <div className="round-container">
                <p className="round-number">{d.round + 1}</p>
                <h1 className="round-subtitle">round</h1>
            </div>
            <div className="users-list-2" style={{gridTemplateColumns: 'repeat(4, 20%)'}}>
                {d.players.map(p => (
                    <div className="user">
                        <div className="user-name">{getAnimalNameByLetter(p.letter)}</div>
                        <img className="animal-img" src={getAnimalDrinkByLetter(p.letter)} alt=""/>
                    </div>
                ))}
            </div>
            <Box className={[style.result_buttons, (d.players.length > 4 ?  style.result_buttons_v2 : '')].join(' ')}>
                {userRoom.isOwner && <Button onClick={handleGameStart} style={{borderRadius: d.players.length > 4 ? 15 : 30}}>continue</Button>}
                <Button onClick={handleLeave} style={{borderRadius: d.players.length > 4 ? 15 : 30}}>leave</Button>
            </Box>

        </div>
    );
};

export default ReadyScreen;
