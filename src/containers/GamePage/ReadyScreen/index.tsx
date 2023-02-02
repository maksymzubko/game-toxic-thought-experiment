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

const ReadyScreen = (d: { players: { id: string, letter: string }[], round: number }  ) => {
    const socket = useSelector(SelectSocket);
    const userRoom = useSelector(SelectUserRoom);

    const handleGameStart = () => {
        socket?.emit('startGame');
    }

    const handleLeave = () => {
        socket?.emit('leaveRoom');
    }

    return (
        <div className="modal">
            <h1>ok, let's start</h1>
            <div className="round-container">
                <p className="round-number">{d.round}</p>
                <h1 className="round-subtitle">round</h1>
            </div>
            <div className="users-list-2">
                {d.players.map(p => (
                    <div className="user">
                        <div className="user-name">{getAnimalNameByLetter(p.letter)}</div>
                        <img className="animal-img" src={getAnimalDrinkByLetter(p.letter)} alt=""/>
                    </div>
                ))}
            </div>
            <Box className={style.result_buttons}>
                {userRoom.isOwner && <Button onClick={handleGameStart}>continue</Button>}
                <Button onClick={handleLeave}>leave</Button>
            </Box>

        </div>
    );
};

export default ReadyScreen;
