import CircleIcon from '@mui/icons-material/Circle';
import { ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

interface ListItemProps {
    children: React.ReactNode;
}

function WelcomeListItem({ children }: ListItemProps): JSX.Element {
    return (
        <ListItem disablePadding>
            <ListItemIcon>
                <CircleIcon sx={{ fontSize: '.75rem' }} />
            </ListItemIcon>
            <ListItemText
                sx={{ ml: -4 }}
                primary={
                    <Typography variant="h5" color="grey.600">
                        {children}
                    </Typography>
                }
            />
        </ListItem>
    );
}

export default WelcomeListItem;
