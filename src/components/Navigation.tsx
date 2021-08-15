import React from 'react';

import NavigationTopBarContainer from '../containers/NavigationTopBarContainer';
import NavigationLeftSideBarContainer from '../containers/NavigationLeftSideBarContainer';

type NavigationProps = {
    children: React.ReactNode
}

const Navigation = (props: NavigationProps) => {
    const { children } = props;
    return (
        <>
            <NavigationTopBarContainer/>
            <NavigationLeftSideBarContainer/>
            {children}
        </>
    )
}

export default Navigation