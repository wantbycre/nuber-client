import React from "react";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import {
  startPhoneVerification,
  startPhoneVerificationVariables
} from "../../types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneQueries";

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneSignInMutation extends Mutation<
  startPhoneVerification,
  startPhoneVerificationVariables
> {}

class PhoneLoginContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  public state = {
    countryCode: "+82",
    phoneNumber: ""
  };
  public render() {
    const { history } = this.props;
    const { countryCode, phoneNumber } = this.state;
    return (
      <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: `${countryCode}${phoneNumber}`
        }}
        onCompleted={data => {
          const { StartPhoneVerification } = data;
          const phone = `${countryCode}${phoneNumber}`;

          // TODO: 여기 아래 if:true 일경우가 맞습니다.
          // TODO: twilio에서 번호 돈주고 못사서 무조건 넘어가도록 했습니다.
          // TODO: 실제사용시 !제거후 true이면 history 넘어갑니다.

          // tslint:disable-next-line
          console.log("StartPhoneVerification", StartPhoneVerification);

          if (StartPhoneVerification.ok) {
            toast.success("SMS로 번호보냈으니 확인 바랍니다.");

            // TODO: StartPhoneVerification보내면 ok=false로 가는데
            // TODO: false가 문제가되면 nuber-server에서 true로 바꿔야함

            setTimeout(() => {
              history.push({
                pathname: "/verify-phone",
                state: {
                  phone
                }
              });
            }, 2000);
          } else {
            toast.error(StartPhoneVerification.error);
          }
        }}
      >
        {(mutation, { loading }) => {
          const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
            event.preventDefault();
            const phone = `${countryCode}${phoneNumber}`;
            const isValid = /^\+[1-9]{1}[0-9]{7,14}$/.test(phone);

            if (isValid) {
              mutation();
            } else {
              toast.error("숫자만 입력해 주셔 010으로~");
            }
          };
          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={onSubmit}
              loading={loading}
            />
          );
        }}
      </PhoneSignInMutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
}
export default PhoneLoginContainer;
