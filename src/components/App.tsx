import React from 'react';

import { HashRouter } from 'react-router-dom';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import '../styles/App.css';
import { configureHistory } from '../utils';
import { PropsFromRedux } from '../containers/AppContainer';

import PageContainer from './PageContainer';

const App = (props: PropsFromRedux) => {

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: props.darkMode ? 'dark' : 'light',
          ...(props.darkMode && {
            background: {
              default: "#131313",
              paper: "#2b2b2b"
            }
          })
        },
      }),
    [props.darkMode],
  );

  return (
    <HashRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <PageContainer/>
        </ThemeProvider>
    </HashRouter>
  );
}

export default App;
