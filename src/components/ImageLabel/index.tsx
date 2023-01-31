import React from 'react';
import {Box} from "@mui/material";

import './style.css'

const ImageLabel = (props: any) => {
    return (
        <Box {...props} className={[props?.className, 'img-label'].join(' ')}>
            <img src={props?.img} alt={'img-label'}/>
            <Box className={'text'}>
                {props?.children}
            </Box>
        </Box>
    );
};

export default ImageLabel;