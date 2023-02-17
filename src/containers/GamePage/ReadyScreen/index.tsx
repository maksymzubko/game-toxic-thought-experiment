import React, {useEffect} from 'react';
import './style.css';
import {getAnimalNameByLetter} from "../../../helpers/animalHelp";
import {getAnimalDrinkByLetter} from "../../../helpers/animalHelp2";
import {Box} from "@mui/material";
import style from "../style.module.css";
import Button from "../../../components/Button";
import {useSelector} from "react-redux";
import {SelectSocket, SelectUserRoom} from "../../../redux/store/socket/selector";
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import {SelectIsSoundMuted} from "../../../redux/store/game/selector";

const ReadyScreen = (d: { players: { id: string, letter: string }[], round: number }  ) => {
    const socket = useSelector(SelectSocket);
    const userRoom = useSelector(SelectUserRoom);

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });


    const handleGameStart = () => {
        // playButton();
        socket?.emit('startGame');
    }

    const handleLeave = () => {
        playButton();
        socket?.emit('leaveRoom');
    }

    useEffect(() => {
        setTimeout(() => {
            handleGameStart()
        }, 3000);
    }, []);


    return (
        <div className="modal">
            <h1>ok, let's start</h1>
            <div className="round-container">
                <p className="round-number">{d.round + 1}</p>
                <h1 className="round-subtitle">round</h1>
            </div>
            <div className="users-list-2" style={{gridTemplateColumns: 'repeat(4, 20%)'}}>
                {d.players.map(p => (
                    <div key={p.letter} className="user">
                        <div className="user-name">{getAnimalNameByLetter(p.letter)}</div>
                        <img className="animal-img" src={getAnimalDrinkByLetter(p.letter)} alt=""/>
                    </div>
                ))}
            </div>
            <br/>
            {/*<Box className={[style.result_buttons, (d.players.length > 4 ?  style.result_buttons_v2 : '')].join(' ')}>*/}
            {/*    {userRoom.isOwner && <Button onClick={handleGameStart} style={{borderRadius: d.players.length > 4 ? 15 : 30}}>continue</Button>}*/}
            {/*    <Button onClick={handleLeave} style={{borderRadius: d.players.length > 4 ? 15 : 30}}>leave</Button>*/}
            {/*</Box>*/}

        </div>
    );
};

export default ReadyScreen;
