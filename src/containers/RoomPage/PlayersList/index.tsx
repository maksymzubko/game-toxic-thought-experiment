import React from 'react';
import {Avatar, Box} from "@mui/material";

import style from './style.module.css'
import PlayersListItem from "../PlayersListItem";

const PlayerList = (d: { me: string, players: { id: string, letter: string }[] }) => {
    return (
        <Box className={style.container}>
            <h1>names of players:</h1>
            <Box className={style.list}>
                <PlayersListItem letter={d.me} me={true}/>

                {d.players.map((v, i) => {
                    return <PlayersListItem key={v.letter} letter={v.letter ?? null}></PlayersListItem>
                })}
            </Box>
        </Box>
    );
};

export default PlayerList;