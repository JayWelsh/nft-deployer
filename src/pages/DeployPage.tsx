import React, { useState } from 'react';

import { ContractFactory } from 'ethers';

import { withRouter, RouteComponentProps } from "react-router";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { Formik, Form, Field } from 'formik';
import { LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'

import { getEtherscanLink } from '../utils';
import { ERC721ABI, ERC721ByteCode } from '../utils/constants';

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
        textAlign: 'center'
    },
    connectionButton: {
        width: '100%',
        marginBottom: 15,
    },
    paper: {
        padding: 15,
    }
});

interface Values {
    name: string;
    symbol: string;
}

const DeployPage = (props: RouteComponentProps) => {
    const classes = useStyles();

    const { history } = props;
    
    const { activateBrowserWallet, account, library, chainId } = useEthers()

    const [ isAwaitingMetaMaskConfirmation, setIsAwaitingMetaMaskConfirmation ] = useState(false)
    const [ pendingContractDeploymentTransaction, setPendingContractDeploymentTransaction ] = useState<boolean | string>(false)
    const [ contractDeploymentSuccessful, setContractDeploymentSuccessful] = useState<boolean | string>(false)

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
            <Paper className={classes.paper}>
            <h1 style={{marginTop: 0, paddingTop: 0}}>Deploy ERC721 NFT Contract</h1>
            <Formik
                initialValues={{
                    name: '',
                    symbol: '',
                }}
                validate={values => {
                    const errors: Partial<Values> = {};
                    console.log('runs validation')
                    if (!values.name) {
                        errors.name = 'Required';
                    } else if (values.name.length < 3) {
                        errors.name = 'Length of name must be more than 3 characters';
                    } else if (values.name.length > 15) {
                        errors.name = 'Length of name must be 15 or less characters';
                    }
                    if (!values.symbol) {
                        errors.symbol = 'Required';
                    } else if (values.symbol.length > 10) {
                        errors.symbol = 'Length of symbol must be 10 or less characters';
                    }
                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    if(library) {
                        try {
                        const signer = library.getSigner()
                        const factory = new ContractFactory(ERC721ABI, ERC721ByteCode, signer)
                        console.log({factory})

                        setIsAwaitingMetaMaskConfirmation(true);

                        let contract = await factory.deploy(values.name, values.symbol);
                        
                        setIsAwaitingMetaMaskConfirmation(false);

                        let transactionHash = contract.deployTransaction.hash;

                        setPendingContractDeploymentTransaction(transactionHash);

                        await contract.deployTransaction.wait();

                        setSubmitting(false);
                        setPendingContractDeploymentTransaction(false);
                        setContractDeploymentSuccessful(contract.address);

                        }catch(error){
                            setSubmitting(false);
                            setIsAwaitingMetaMaskConfirmation(false);
                            setPendingContractDeploymentTransaction(false);
                            setContractDeploymentSuccessful(false);
                            console.log({error})
                        }
                    }
                }}
                >
                {({ submitForm, isSubmitting }) => (
                    <Form>
                        {!contractDeploymentSuccessful &&
                            <>
                                <Field
                                    component={TextField}
                                    name="name"
                                    type="name"
                                    label="Name"
                                    helperText="Full NFT contract/series name e.g. CRYPTOPUNKS"
                                    variant="outlined"
                                    style={{width: '456px', maxWidth: '100%'}}
                                />
                                <br />
                                <Field
                                    component={TextField}
                                    type="symbol"
                                    label="Symbol"
                                    helperText="Short text that represents all NFTs within contract e.g. Ͼ or PUNK"
                                    name="symbol"
                                    variant="outlined"
                                    style={{width: '456px', maxWidth: '100%', marginTop: 15}}
                                />
                                <br />
                                <Typography variant="subtitle2" style={{color: 'red', fontWeight: 'bold', marginTop: 10}} component="p">
                                    WARNING: THIS DATA CAN NEVER BE CHANGED
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                    style={{marginTop: 15, marginBottom: 15, width: '456px', maxWidth: '100%'}}
                                >
                                    Deploy ERC721
                                </Button>
                            </>
                        }
                        {(isAwaitingMetaMaskConfirmation || pendingContractDeploymentTransaction || contractDeploymentSuccessful) &&
                            <div>
                                {isAwaitingMetaMaskConfirmation && `Please Check MetaMask`}
                                {chainId && pendingContractDeploymentTransaction && typeof pendingContractDeploymentTransaction === "string" && 
                                    <span>Pending Contract Deployment: <a style={{color: '#39bfff'}} href={getEtherscanLink(pendingContractDeploymentTransaction, 'tx', chainId)} target="_blank" rel="noreferrer noopener">View On Etherscan</a></span>
                                }
                                {chainId && contractDeploymentSuccessful && typeof contractDeploymentSuccessful === "string" && 
                                    <div style={{textAlign: 'center', display: 'flex', flexDirection: 'column'}}>
                                        <span>Contract Deployment Successful: <a style={{color: '#39bfff'}} href={getEtherscanLink(contractDeploymentSuccessful, 'address', chainId)} target="_blank" rel="noreferrer noopener">View On Etherscan</a></span>
                                        <span style={{marginTop: 15}}>What's Next?</span>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={() => history.push(`/mint/${contractDeploymentSuccessful}`)}
                                            style={{display: 'block', marginTop: 15, marginBottom: 15, width: '456px', maxWidth: '100%', marginLeft:'auto',marginRight:'auto'}}
                                        >
                                            Mint Token on New NFT Contract
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={() => setContractDeploymentSuccessful(false)}
                                            style={{display: 'block', width: '456px', maxWidth: '100%', marginLeft:'auto',marginRight:'auto'}}
                                        >
                                            Deploy another NFT contract
                                        </Button>
                                    </div>
                                }
                            </div>
                        }
                        <div style={{width: '456px', maxWidth: '100%', marginLeft:'auto',marginRight:'auto', marginTop: 15}}>
                            {isSubmitting && <LinearProgress />}
                        </div>
                    </Form>
                )}
                </Formik>
                </Paper>
            </>
            )}
        </Container>
    )
};

export default withRouter(DeployPage);