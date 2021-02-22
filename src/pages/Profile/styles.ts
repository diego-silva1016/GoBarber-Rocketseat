import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
    height: 100vh;
`;

export const Header = styled.header`
    padding: 32px 0;
    background: #28262e;
`;

export const HeaderContent = styled.div`
    max-width: 1120px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    a{
        text-decoration: none;
        color: #999591;

        &:hover{
            opacity: 0.6;
        }
    }
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: -170px auto 0;

    form{
        margin: 80px 0px;
        width: 340px;
        text-align: center;
        display: flex;
        flex-direction: column;

        h1{
            margin-bottom: 24px;
            font-size: 20px;
            text-align: left;
        }

    }
`;

export const AvatarInput = styled.div`
    margin-bottom: 32px;
    position: relative;
    width: 186px;
    align-self: center;

    img{
        border-radius: 50%;
        width: 186px;
        height: 186px;
    }

    label{
        position: absolute;
        width:48px;
        height: 48px;
        background: #FF9000;
        border-radius: 50%;
        right:0;
        bottom: 0;
        border: 0;
        transition: background-color 0.2s;

        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        svg{
            width: 20px;
            height: 20px;
            color: #312E38;
        }

        &:hover{
            background: ${shade(0.2, '#FF9000')}
        }

        input{
            display: none;
        }
    }
`;
