import React, {useEffect, useState} from 'react';
import {Avatar, AvatarGroup, Badge, Box} from "@mui/material";
import {Result} from "../index";
import style from "../style.module.css";
import Button from "../../../components/Button";
import {useSelector} from "react-redux";
import {SelectSocket, SelectUserLetter, SelectUserRoom} from "../../../redux/store/socket/selector";
import {getAnimalByLetter, getAnimalNameByLetter} from "../../../helpers/animalHelp";

const GameResultItem = (d: { result: Result, question: { question: string; answers: string[] } }) => {
    const socket = useSelector(SelectSocket);
    const userLetter = useSelector(SelectUserLetter);
    const userRoom = useSelector(SelectUserRoom);

    const [correct, setCorrect] = useState(-1);
    useEffect(() => {
        setCorrect(d.result.correct);
    }, [d.result])

    const isDrinking = () => {
        if(userRoom.single)
        {
            const whoDrinking = d.result.results.filter(r=>!r.answer.isCorrect);
            if(!whoDrinking.length)
                return "Nobody drinking :("
            else return whoDrinking.map(p=>getAnimalNameByLetter(p.player ?? "")).join(', ') + ' drinking!';
        }
        else
            return d.result.results.filter(p=>p.player === userLetter)[0].answer.isCorrect ? 'You not drinking!' : 'You drinking!';
    }

    const handleGameStart = () => {
        socket?.emit('startGame');
    }

    const handleLeave = () => {
        socket?.emit('leaveRoom');
    }

    const getListVoted = (variant: number) => {
        return (
            <AvatarGroup max={3}>
                {d.result.results
                    .filter(r => r.answer.variant === variant)
                    .map(a => <Avatar src={getAnimalByLetter(a.player ?? "")} alt={'animal-img'}></Avatar>)}
            </AvatarGroup>
        )
    }

    if(d.result.results.length > 0)
    return (
        <Box className={style.results}>
            <Box className={style.players_list}>
                <Box className={style.answers}>
                    <Box className={style.content}>
                        {d.question.answers.map((a, i) =>
                            <Badge style={{width: '100%'}} badgeContent={getListVoted(i)}>
                                <Button className={correct === i ? style.correct : style.incorrect}>
                                    {a}
                                </Button>
                            </Badge>
                        )}
                        <Badge style={{width: '100%'}} badgeContent={getListVoted(-1)}>
                            <Button className={correct === -1 ? style.correct : style.incorrect}>
                                skip (drink)
                            </Button>
                        </Badge>
                    </Box>
                </Box>
            </Box>

            <h1>
                {isDrinking()}
            </h1>

            <Box className={style.result_buttons}>
                {userRoom.isOwner && <Button onClick={handleGameStart}>continue</Button>}
                <Button onClick={handleLeave}>leave</Button>
            </Box>
        </Box>
    );
    else
        return <Box></Box>
};

export default GameResultItem;