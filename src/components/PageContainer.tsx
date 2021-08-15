import React from 'react';
import {Route, withRouter, Switch, RouteComponentProps} from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Navigation from './Navigation';
import HomePage from '../pages/HomePage';
import DeployPage from '../pages/DeployPage';
import MintPage from '../pages/MintPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  }),
);

const PageContainer = () => {

    const classes = useStyles();

    return (
        <Navigation>
            <div className={classes.root}>
                <Switch>
                    <Route path="/" exact render={(props) => homeRoute(props)} />
                    <Route path="/deploy" exact render={(props) => deployRoute(props)} />
                    <Route path="/mint" exact render={(props) => mintRoute(props)} />
                    <Route path="/mint/:tokenAddress" exact render={(props) => mintRoute(props)} />
                </Switch>
            </div>
        </Navigation>
    )
}

const homeRoute = (props: RouteComponentProps) => {
    return (
        <HomePage/>
    )
}

const deployRoute = (props: RouteComponentProps) => {
    return (
        <DeployPage/>
    )
}

const mintRoute = (props: RouteComponentProps<{ tokenAddress: string }>) => {
    const {
        match: {
            params: { tokenAddress }
        }
    } = props
    return (
        <MintPage tokenAddress={tokenAddress || ""}/>
    )
}

export default withRouter(PageContainer);