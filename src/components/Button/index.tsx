import React from 'react';
import {Box, Button as Btn, ButtonTypeMap, ExtendButtonBase} from "@mui/material";
import {useNavigate} from "react-router-dom";
import './style.css'

const Button = (props: any) => {
    return (
        <Box {...props} className={[props?.className, 'btn'].join(' ')}>
        </Box>
    );
};

export default Button;