import { AppBar, Link, Toolbar } from '@mui/material';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';

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
                py: 3,
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
    return (
        <AppBar position="static">
            <Toolbar>
                <img
                    className=""
                    src="https://www.desc.org/wp-content/themes/desc/img/logo-desc.png"
                    height="60"
                    width="60"
                    alt="DESC logo"
                />
                <Link
                    to="/"
                    component={RouterLink}
                    variant="h5"
                    underline="none"
                    color="inherit"
                    sx={{ marginInlineStart: '1rem', flexGrow: 1 }}
                >
                    DESC Portal
                </Link>
                <NavLink to="/signin">Sign In</NavLink>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
