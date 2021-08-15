import React, { useState, useEffect } from 'react';

import { Contract, utils } from 'ethers';

import { multihash } from 'is-ipfs';

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
import { ERC721ABI } from '../utils/constants';

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
        marginBottom: 40
    }
});

interface Values {
    contractAddress: string;
    hash: string;
    mintToAddress: string;
}

interface IMintProps {
    tokenAddress: string
}

const MintPage = (props: RouteComponentProps & IMintProps) => {
    const classes = useStyles();

    const { history, tokenAddress } = props;
    
    const { activateBrowserWallet, deactivate, account, library, chainId, connector } = useEthers()

    const [ isAwaitingMetaMaskConfirmation, setIsAwaitingMetaMaskConfirmation ] = useState(false)
    const [ pendingMintTransaction, setPendingMintTransaction ] = useState<boolean | string>(false)
    const [ mintTransactionSuccessful, setMintTransactionSuccessful] = useState<boolean | string>(false)
    const [ currentKey, setCurrentKey ] = useState(0)

    const userBalance = useEtherBalance(account)

    useEffect(() => {
        setCurrentKey(currentKey + 1);
        setMintTransactionSuccessful(false);
    }, [tokenAddress])

    return (
        <Container className={classes.container} maxWidth="md" key={currentKey}>
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
            <h1 style={{marginTop: 0, paddingTop: 0}}>Mint ERC721 NFT</h1>
            <Formik
                initialValues={{
                    hash: '',
                    contractAddress: tokenAddress,
                    mintToAddress: '',
                }}
                validate={values => {
                    const errors: Partial<Values> = {};
                    console.log({values})
                    if (!values.contractAddress) {
                        errors.contractAddress = 'Required';
                    } else if(!utils.isAddress(values.contractAddress)) {
                        errors.contractAddress = 'Invalid contract address';
                    }
                    if (!values.hash) {
                        errors.hash = 'Required';
                    } else if(!multihash(values.hash)) {
                        errors.hash = 'Invalid IPFS Multihash';
                    }
                    if (!values.mintToAddress) {
                        errors.mintToAddress = 'Required';
                    } else if(!utils.isAddress(values.mintToAddress)) {
                        errors.mintToAddress = 'Invalid destination address';
                    }
                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    if(library) {
                        try {
                            const signer = library.getSigner()
                            const contract = new Contract(values.contractAddress, ERC721ABI, signer);

                            setIsAwaitingMetaMaskConfirmation(true);

                            let transactionResponse = await contract.mint(values.mintToAddress, `ipfs://${values.hash}`)

                            setIsAwaitingMetaMaskConfirmation(false);

                            let transactionHash = transactionResponse.hash;

                            setPendingMintTransaction(transactionHash);

                            await transactionResponse.wait();

                            setSubmitting(false);
                            setPendingMintTransaction(false);
                            setMintTransactionSuccessful(transactionHash);

                        }catch(error){
                            console.log({error})
                            setSubmitting(false);
                            setIsAwaitingMetaMaskConfirmation(false);
                            setPendingMintTransaction(false);
                            setMintTransactionSuccessful(false);
                        }
                    }
                }}
                >
                {({ submitForm, isSubmitting }) => (
                    <Form>
                        {!mintTransactionSuccessful &&
                            <>
                                <Field
                                    component={TextField}
                                    name="contractAddress"
                                    type="text"
                                    label="Contract Address"
                                    helperText="Ethereum address of the NFT contract"
                                    variant="outlined"
                                    style={{width: '456px', maxWidth: '100%'}}
                                />
                                <Field
                                    component={TextField}
                                    name="hash"
                                    type="name"
                                    label="Metadata IPFS Hash"
                                    helperText="The IPFS hash of the token metadata"
                                    variant="outlined"
                                    style={{width: '456px', maxWidth: '100%', marginTop: 15}}
                                />
                                <br />
                                <Field
                                    component={TextField}
                                    type="text"
                                    label="Mint To Address"
                                    helperText="The address that the token should be minted into"
                                    name="mintToAddress"
                                    variant="outlined"
                                    style={{width: '456px', maxWidth: '100%', marginTop: 15}}
                                />
                                <br />
                                <Typography variant="subtitle2" style={{color: 'red', fontWeight: 'bold', marginTop: 10}} component="p">
                                    WARNING: IPFS HASH CAN NOT BE CHANGED
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                    style={{marginTop: 15, marginBottom: 15, width: '456px', maxWidth: '100%'}}
                                >
                                    Mint ERC721
                                </Button>
                            </>
                        }
                        {(isAwaitingMetaMaskConfirmation || pendingMintTransaction || mintTransactionSuccessful) &&
                            <div>
                                {isAwaitingMetaMaskConfirmation && `Please Check MetaMask`}
                                {chainId && pendingMintTransaction && typeof pendingMintTransaction === "string" && 
                                    <span>Pending Mint Transaction: <a style={{color: '#39bfff'}} href={getEtherscanLink(pendingMintTransaction, 'tx', chainId)} target="_blank" rel="noreferrer noopener">View On Etherscan</a></span>
                                }
                                {chainId && mintTransactionSuccessful && typeof mintTransactionSuccessful === "string" && 
                                    <div style={{textAlign: 'center', display: 'flex', flexDirection: 'column'}}>
                                        <span>Mint Transaction Successful: <a style={{color: '#39bfff'}} href={getEtherscanLink(mintTransactionSuccessful, 'tx', chainId)} target="_blank" rel="noreferrer noopener">View On Etherscan</a></span>
                                        <span style={{marginTop: 15}}>What's Next?</span>
                                        {/* <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={() => history.push(`/mint/${mintTransactionSuccessful}`)}
                                            style={{display: 'block', marginTop: 15, marginBottom: 15, width: '456px', maxWidth: '100%', marginLeft:'auto',marginRight:'auto'}}
                                        >
                                            View On OpenSea
                                        </Button> */}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={() => {
                                                setMintTransactionSuccessful(false)
                                            }}
                                            style={{display: 'block', marginTop: 15, marginBottom: 15, width: '456px', maxWidth: '100%', marginLeft:'auto',marginRight:'auto'}}
                                        >
                                            Mint another NFT
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={() => history.push(`/deploy`)}
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

export default withRouter(MintPage);