import React from 'react';
import dogWarnImg from './assets/dog-warn.png'
import './style.css'
import crossIcon from "../../containers/Modal/assets/cross-icon.png";
import {useSelector} from "react-redux";
import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";
import {SelectIsSoundMuted} from "../../redux/store/game/selector";
import Button from "../Button";

const ModalHints = (props?: any) => {
    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound, {volume: isSoundMuted ? 0 : 1});

    return (
        <div className="info-modal">
            <div className="modal">
                <div className={'top'}>
                    <img className={'img'} src={props?.img} alt=""/>
                    <h1>{props?.leader ? 'You are leader!' : "You are player!"}</h1>
                </div>
                <h1 className={'wtd'}>what to do:</h1>
                <p>
                    {props?.leader ?
                        "The leading player chooses one of the answers to the question that suits him best within 60 seconds."
                        :
                        "The rest of the players have 60 seconds to guess which answer the leading player has chosen."
                    }
                    <br/><br/>
                    {props?.leader ?
                        "Skipping a question means you need a drink."
                        :
                        "A wrong answer or omission of an answer means you need to drink."
                    }
                </p>
                <Button onClick={props?.onClose}>close</Button>
            </div>
        </div>
    );
};

export default ModalHints;
