import React from 'react';
import dogWarnImg from './assets/dog-warn.png'
import './style.css'
import crossIcon from "../../containers/Modal/assets/cross-icon.png";
import {useSelector} from "react-redux";
import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";
import {SelectIsSoundMuted} from "../../redux/store/game/selector";

const MessageModal = (props?: any) => {
    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

    return (
        <div className="message-modal">
            <div className="modal">
                <img className={'dog'} src={dogWarnImg} alt=""/>
                <h1>ooops!</h1>
                <p>{props?.message}</p>
                <img className={'close'} src={crossIcon} alt="" onClick={()=> {props?.onClose(); playButton()}} />
            </div>
        </div>
    );
};

export default MessageModal;
