import { Box } from '@mui/material';

interface SingleColumnProps {
    children: React.ReactNode;
}
function SingleColumnLayout({ children }: SingleColumnProps): JSX.Element {
    return <Box marginTop={4}>{children}</Box>;
}

export default SingleColumnLayout;
