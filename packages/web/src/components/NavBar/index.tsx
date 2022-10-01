import { AppBar, Box, Button, Link, Stack, Toolbar } from '@mui/material';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks';

interface NavLinkProps {
    children: React.ReactNode;
    to: string;
}

function NavLink({ children, to }: NavLinkProps): JSX.Element {
    return (
        <Link
            to={to}
            component={RouterNavLink}
            color="inherit"
            underline="none"
            sx={{
                py: 2.75,
                px: 2,
                '&.active, &:hover': {
                    backgroundColor: 'primary.dark'
                }
            }}
        >
            {children}
        </Link>
    );
}

function NavBar(): JSX.Element {
    const { token } = useAuthContext();
    const { mutate: doLogout } = useLogout();
    return (
        <AppBar position="static">
            <Toolbar disableGutters={true} sx={{ px: 12 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                >
                    <Box>
                        <Link
                            to="/"
                            component={RouterLink}
                            variant="h5"
                            underline="none"
                            color="inherit"
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <img
                                    className=""
                                    src="https://www.desc.org/wp-content/themes/desc/img/logo-desc.png"
                                    height="60"
                                    width="60"
                                    alt="DESC logo"
                                />
                                <span>DESC Portal</span>
                            </Stack>
                        </Link>
                    </Box>
                    <Box>
                        {!token ? (
                            <>
                                <NavLink to="/login">Log In</NavLink>
                                <NavLink to="/register">Register</NavLink>
                            </>
                        ) : null}
                        {token ? (
                            <Button
                                variant="outlined"
                                disableRipple
                                sx={{
                                    py: 3,
                                    color: 'common.white',
                                    textTransform: 'capitalize',
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    letterSpacing: 'normal',
                                    '&.active, &:hover': {
                                        backgroundColor: 'primary.dark'
                                    }
                                }}
                                onClick={() => doLogout()}
                            >
                                Log Out
                            </Button>
                        ) : null}
                    </Box>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
