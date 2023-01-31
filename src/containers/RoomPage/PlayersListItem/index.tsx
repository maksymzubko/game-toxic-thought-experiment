import React from 'react';
import {Avatar, Box} from "@mui/material";
import {getAnimalByLetter, getAnimalNameByLetter} from "../../../helpers/animalHelp";
import style from './style.module.css'

const PlayersListItem = (p: { letter: string, me?: boolean }) => {
    return (
        <Box className={ [style.player, p.me ? style.me : null].join(' ')}>
            <Avatar className={style.avatar} src={getAnimalByLetter(p.letter)} alt={'avatar ' + p.letter}/>
            <Box className={style.name}>
                {getAnimalNameByLetter(p.letter)}
            </Box>
        </Box>
    );
};

export default PlayersListItem;