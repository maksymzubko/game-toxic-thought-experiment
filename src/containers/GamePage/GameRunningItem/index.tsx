import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import style from "../style.module.css";
import Button from "../../../components/Button";
import beerIcon from '../assets/beer-icon.png';
import useSound from "use-sound";
import buttonSound from "../../../assets/sounds/button.mp3";
import questionSound from "../../../assets/sounds/question.mp3";
import {useSelector} from "react-redux";
import {SelectSocket, SelectUserLetter, SelectUserRoom} from "../../../redux/store/socket/selector";
import complainImg from "../assets/complain.png";
import {SelectIsAuthorized} from "../../../redux/store/user/selector";
import {SelectIsSoundMuted, SelectTips} from "../../../redux/store/game/selector";
import ModalHints from "../../../components/ModalHints";
import {getAnimalByLetter} from "../../../helpers/animalHelp";
import MultiSelect from "../../../components/MultiSelect";
import {AnswerItemInterface} from "../index";

interface AnswerInterface {
    status: boolean,
    message?: string,
    data?: { step?: string }
}

const GameRunningItem = (d: {
    players: { id: string, letter: string }[],
    timer: number,
    multiplayer: boolean,
    question: { question: string; answers: AnswerItemInterface[] },
    currentStep: string, handleAnswer: any,
    handleSkip: any,
    isAnswered: boolean,
    gameStage: number,
    onShowAlert: any,
    setReported: any,
    showTimer: boolean,
    handleReport: any,
    voted: any,
    leader: string
}) => {

    const socket = useSelector(SelectSocket);

    const isSoundMuted = useSelector(SelectIsSoundMuted);
    const [playButton] = useSound(buttonSound,  { volume: isSoundMuted ? 0 : 1 });

    const userLetter = useSelector(SelectUserLetter);
    const [showModal, setShowModal] = useState(false);
    const tipsEnabled = useSelector(SelectTips);
    const userRoom = useSelector(SelectUserRoom);
    const isAuthorized = useSelector(SelectIsAuthorized)
    const [questionSoundLoad, setQuestionSoundLoad] = useState(false);
    const [isMultiSelectStage, setIsMultiSelectStage] = useState(true);
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerItemInterface[]>([]);
    const [playQuestion] = useSound(questionSound, {
        onload: () => setQuestionSoundLoad(true),
        volume: isSoundMuted ? 0 : 1
    });
    useEffect(() => {
        if (questionSoundLoad) {
            playQuestion();
        }
    }, [questionSoundLoad])

    const [selectedAnswer, setSelectedAnswer] = useState<AnswerItemInterface>();

    const submitAnswer = () => {


        if (isMultiSelectStage) {
            if (!selectedAnswers.length) return
            playButton();
            socket.emit('setAnswersList', { answers: selectedAnswers})
            return;
        }

        if (selectedAnswer.id !== undefined) {
            playButton();
            d.handleAnswer(selectedAnswer)
            setSelectedAnswer({ id: undefined, answer: '' });
        }
    }

    const passActiveQuestions = (questions: AnswerItemInterface[]) => {
        console.log('questions', questions);
        if (questions.length > 1 && questions.length < 5) {
            setSelectedAnswers(questions);
        } else {
            setSelectedAnswers([])
        }
    }

    useEffect(() => {
        console.log(d.currentStep)
        setShowModal(true);
    }, [d.currentStep])

    useEffect(() => {
        socket?.on('setAnswersList', (data: AnswerInterface) => {
            if (data.status) {
                setIsMultiSelectStage(false);
            }
        })
        return () => {
            socket?.off('setAnswersList');
        }
    }, [])

    console.log('userLetter',userRoom, userLetter, d.leader, d.multiplayer)

    return (
        <Box className={style.gameRunningScreen}>
            {isMultiSelectStage && (!d.multiplayer || userLetter == d.leader) &&
                <MultiSelect
                    answersList={d?.question?.answers}
                    passActiveQuestions={passActiveQuestions}
                />
            }
            {d.multiplayer && userLetter !== d.leader && isMultiSelectStage &&
                 <h1 className={style.waiting}>Waiting for<br/>the leader...</h1>
            }
            {showModal && tipsEnabled && <ModalHints img={getAnimalByLetter(userRoom.single ? d.currentStep : userLetter)} leader={userRoom.single ? d.currentStep === d.leader : userLetter === d.leader} onClose={() => setShowModal(false)}/>}
            {!d.isAnswered && !isMultiSelectStage && <Box className={style.answers}>
                <Box className={style.content}>
                    {d.question.answers.map((a, i) =>
                        <Button key={i} onClick={() => {setSelectedAnswer(a); playButton()}} className={selectedAnswer?.id === a?.id ? 'cloud' : 'unselected_answer' }>
                            {a.answer}
                        </Button>)}

                </Box>
            </Box>}
            {d.isAnswered && <h1 className={style.waiting}>Waiting while other players answering..</h1>}

            {d.showTimer && !isMultiSelectStage && <Box className={style.timer}>
                {d.timer}
            </Box>}

            {!d.isAnswered &&
            <>
                {!isMultiSelectStage && <Typography className={style.timer_subtitle}>answer secretly!</Typography>}
                <Box className={style.control_buttons}>
                    <Button onClick={() => {d.handleSkip(); playButton()}} className={style.skip_buttons}>
                        <img src={beerIcon} alt="" className={style.beer_icon}/>
                        skip
                    </Button>

                    {d.voted !== 'report' && <img onClick={() => {playButton(); !isAuthorized ? d.onShowAlert() : d.handleReport();}} src={complainImg} alt=""  className={style.report_button} />}

                    <Button
                        style={{ opacity: selectedAnswers.length || !isMultiSelectStage? 1 : 0.5 }}
                        onClick={() => submitAnswer()} className={style.submit_buttons}
                    >
                        Ок
                    </Button>
                </Box>
            </>
            }
        </Box>
    );
};

export default GameRunningItem;
