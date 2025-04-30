import styled, { css } from 'styled-components';

export const ExternalContainer = styled.div`

    display: flex;
    flex-direction: row;
    flex:1;

`


export const Container = styled.div`

    display: none;
    flex-direction: column;
    
    background-color: black;
    flex: 1;
    align-items: center;


    padding-top: 60px;



    ${({ variant, name } ) => variant === name && css`
       display:flex;
    `}


`

export const Container1 = styled.div`

    display: flex;
    flex-direction: column;
    width:100vw;
    background-color: black;
    flex: 1;
    max-width: 1000px;

`

export const RightContainer = styled.div`

    display: flex;
    flex-direction: column;
    background-color: darkblue;
    flex:1;
    max-width: 20vw;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
    height: 100%;
    justify-content:space-between;

`
export const LeftContainer = styled.div`

    display: flex;
    flex-direction: column;
background-color: darkblue;
    flex:1;
    width: 20vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    

`

export const TabsContainer = styled.div`

    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;




`
export const ImputContainer = styled.div`

    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0.5rem;

`

export const ButtonsContainer = styled.div`


    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    align-items: center;
    justify-content: center;

`

export const TitleText = styled.div`



    font-size: 2.5rem;
    color: white;
    margin-top: -3rem;

`




