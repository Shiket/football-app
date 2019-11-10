import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../components/Firebase';
import * as ROUTES from '../../constants/routes';
import { SignUpLink, PasswordForgetLink } from '../index';
import { Link } from 'react-router-dom'
import ball from '../../assets/ball.png'
import Layout from '../../Layout/Layout';
import { Button, Input, FormWrapper, Form, WrapperCenter, FormTitle,
    FormLogo, BottomLinks} from '../../styleComponents/index';

const SignInPage = () => (
    <Layout>
        <WrapperCenter>
            <FormWrapper>
                <WrapperCenter row>
                    <img src={ball} width="48" height="48" alt="ball" />
                    <FormLogo>Football app</FormLogo>
                </WrapperCenter>
                <FormTitle>Sign In</FormTitle>
                <SignInForm />
                <PasswordForgetLink />
                <SignUpLink />
            </FormWrapper>
        </WrapperCenter>
    </Layout>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        document.body.classList.add("bgForm");
        console.log(this.props)
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <Form onSubmit={this.onSubmit}>
                <Input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <Input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <Button disabled={isInvalid} type="submit">
                    Sign In
                    </Button>

                {error && <p>{error.message}</p>}
            </Form>
        );
    }
}
const SignInLink = () => (
    <BottomLinks as={Link} to={ROUTES.SIGN_IN}>
        Do you have an account? Sign In
    </BottomLinks>
);


const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export { SignInForm, SignInLink, SignInPage};