import React, {useState} from 'react';
import './style.css';
import Button from "../../components/Button";
import crossIcon from './assets/cross-icon.png'
import useSound from "use-sound";
import buttonSound from "../../assets/sounds/button.mp3";
import screen1 from './assets/screens/screen1.png'
import screen2 from './assets/screens/screen2.png'
import screen3 from './assets/screens/screen3.png'
import screen4 from './assets/screens/screen4.png'

const Modal = (props: any) => {

    const [playButton] = useSound(buttonSound);
    const [isShortVersion, setIsShortVersion] = useState(false)

    return (
        <div className="modal-pwa">
            <div className="window">
                {isShortVersion ?
                    <div>
                        <img src={crossIcon} alt="" onClick={()=> {props.onClose(); playButton()}} className="close" />
                        <h1>try PWA app</h1>
                        <p>for better experience try adding game as a Home screen shortcut</p>
                        <Button onClick={() => {setIsShortVersion(false); playButton()}}>try it out</Button>
                    </div>
                    :
                    <div className="part-2">
                        <h2>how to save as PWA?</h2>
                        <img src={screen1} alt="" className="screen"/>
                        <img src={screen2} alt="" className="screen"/>
                        <p>1</p>
                        <p>2</p>
                        <img src={screen3} alt="" className="screen"/>
                        <img src={screen4} alt="" className="screen"/>
                        <p>3</p>
                        <p>4</p>
                        <Button
                            onClick={()=> {props.onClose(); playButton()}}
                            style={{width: 285, maxWidth: '80%', height: 60, fontSize: 32}}

                        >understood</Button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Modal;
