import React from 'react';

import { withRouter, RouteComponentProps } from "react-router";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import DeployIcon from '@material-ui/icons/CloudUpload';
import MintIcon from '@material-ui/icons/AddPhotoAlternate';

import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        marginBottom: 15,
        textAlign: 'center',
    },
    title: {
        fontSize: 14,
    },
    container: {
        marginTop: 15,
    },
    connectionButton: {
        width: '100%',
        marginBottom: 15,
    },
});

const HomePage = (props: RouteComponentProps) => {
    const classes = useStyles();

    const { history } = props;
    
    const { activateBrowserWallet, deactivate, account } = useEthers()
    
    const userBalance = useEtherBalance(account)

    return (
        <Container className={classes.container} maxWidth="md">
            <div className="button-container">
                {!account &&
                    <Button className={classes.connectionButton} color="primary" variant="contained" onClick={() => activateBrowserWallet()}>Connect</Button>
                }
            </div>
            <div>
                {account && (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Account:
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {account}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
                {account && (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Ether balance:
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {userBalance ? `${formatEther(userBalance)} ETH` : `Loading...`}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </div>
            {account && (
                <>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Card className={classes.root}>
                                <CardActionArea style={{paddingBottom: '10px'}} onClick={() => history.push('/deploy')}>
                                    <CardContent>
                                        <Typography variant="subtitle2" component="p">
                                            Step 1
                                        </Typography>
                                        <DeployIcon style={{width: '100px', height: '120px'}}/>
                                        <Typography variant="h5" component="h2">
                                            Deploy
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card className={classes.root}>
                                <CardActionArea style={{paddingBottom: '10px'}} onClick={() => history.push('/mint')}>
                                    <CardContent>
                                        <Typography variant="subtitle2" component="p">
                                            Step 2
                                        </Typography>
                                        <MintIcon style={{width: '100px', height: '120px'}}/>
                                        <Typography variant="h5" component="h2">
                                            Mint
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    )
};

export default withRouter(HomePage);