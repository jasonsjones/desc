import { Box, Stack, Typography } from '@mui/material';

function Footer(): JSX.Element {
    return (
        <Box component="footer" sx={{ height: 100, backgroundColor: 'primary.main' }}>
            <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="center">
                <Typography px={4} align="center" color="common.white">
                    {`\u00a9 ${new Date().getFullYear()} \u2022 All Rights Reserved \u2022 Downtown Emergency Service Center`}
                </Typography>
            </Stack>
        </Box>
    );
}

export default Footer;
