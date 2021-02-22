import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`

`;

export const Header = styled.header`
    padding: 32px 0;
    background: #28262e;
`;

export const HeaderContent = styled.div`
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    > img {
        height: 80px;
    }

    a{
        text-decoration: none;
        color: #FF9000;

        &:hover{
            opacity: 0.7;
        }
    }

    button{
        margin-left: auto;
        background: transparent;
        border: 0;

        svg{
            color: #999591;
            width: 20px;
            height: 20px;
        }
    }

`;

export const Profile = styled.div`
    display: flex;
    align-items: center;
    margin-left: 80px;

    img{
        border-radius: 50%;
        width: 56px;
        height: 56px;
    }

    div{
        display: flex;
        flex-direction: column;
        margin-left: 16px;
        line-height: 26px;

        span {
            color: #8a8a8a;
        }

        strong{
            color: #FF9000;
        }
    }

`;

export const Content = styled.main`
    max-width: 1120px;
    margin: 64px auto;
    display: flex;
`;

export const Schedule = styled.div`
    line-height: 47px;
    flex: 1;
    margin-right: 120px;

    h1{
        font-size: 36px;
    }

    p{
        margin-top: 8px;
        color: #FF9000;

        span + span{
            margin-left: 8px;
            padding-left: 8px;
            border-left: 1px solid #FF9000;
        }
    }
`;

export const NextAppointment = styled.div`
    margin-top: 55px;

    >strong{
            font-size: 20px;
            font-weight: 400;
            color: #999591;
    }

    >div{
        display: flex;
        margin-top: 24px;
        background: #3E3B47;
        border-radius: 10px;
        padding: 18px 24px;
        align-items: center;
        position: relative;

        & ::before{
            position: absolute;
            height: 80%;
            width: 1px;
            left: 0;
            top: 10%;
            content:'';
            background: #FF9000;
        }

        img{
            height: 80px;
            width: 80px;
            border-radius: 50%;
        }

        strong{
            font-size: 24px;
            height: 32px;
            line-height: 32px;
            color: #F4EDE8;
            margin-left: 20px;
        }

        span{
            margin-left: auto;
            color: #999591;
            height: 26px;
            font-size: 20px;
            line-height: 26px;
            display: flex;
            align-items: center;

            svg{
                color: #FF9000;
                margin-right: 8px;
            }

        }
    }



`;

export const Section = styled.section`
    margin-top: 48px;

    >strong{
       color: #999591;
       font-size: 20px;
       line-height: 26px;
        display: block;
       padding-bottom: 16px;
       margin-bottom: 16px;
       border-bottom: 2px solid #3E3B47;
    }
`;

export const Appointment = styled.div`
    display:flex;
    align-items: center;

    & + div{
        margin-top: 16px;
    }

    span{
            color: #999591;
            height: 21px;
            font-size: 16px;
            width: 70px;
            line-height: 21px;
            display: flex;
            align-items: center;

            svg{
                color: #FF9000;
                margin-right: 8px;
            }

        }

    div{
        display: flex;
        flex: 1;
        margin-left: 24px;
        background: #3E3B47;
        border-radius: 10px;
        padding: 15px 24px;
        align-items: center;
        position: relative;

        img{
            height: 56px;
            width: 56px;
            border-radius: 50%;
        }

        strong{
            font-size: 20px;
            line-height: 26px;
            color: #F4EDE8;
            margin-left: 20px;
        }
    }
`;

export const Calender = styled.aside`
    width: 390px;
    font-size: 36px;

    .DayPicker {
  background: #28262e;
  border-radius: 10px;
}

.DayPicker-wrapper {
  padding-bottom: 0;
}

.DayPicker,
.DayPicker-Month {
  width: 100%;
}

.DayPicker-Month {
  border-collapse: separate;
  border-spacing: 8px;
  margin: 16px;
}

.DayPicker-Day {
  width: 40px;
  height: 40px;
}

.DayPicker-Day--available:not(.DayPicker-Day--outside) {
  background: #3e3b47;
  border-radius: 10px;
  color: #fff;
}

.DayPicker:not(.DayPicker--interactionDisabled)
  .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
  background: ${shade(0.2, '#3e3b47')};
}

.DayPicker-Day--today {
  font-weight: normal;
}

.DayPicker-Day--disabled {
  color: #666360 !important;
  background: transparent !important;
}

.DayPicker-Day--selected {
  background: #ff9000 !important;
  border-radius: 10px;
  color: #232129 !important;
}
`;
