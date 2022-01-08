import { AppBar, Button, Link, Toolbar } from '@mui/material';
import { Link as RouterLink, NavLink } from 'react-router-dom';

function NavBar() {
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
                <Button to="/signin" component={NavLink} color="inherit">
                    Sign In
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
