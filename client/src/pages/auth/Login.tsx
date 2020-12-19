import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Label } from 'reactstrap';
import { AuthService } from '../../util/AuthService';

interface formData {
  username: string;
  password: string;
}


interface LoginProps {
  setAuthState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({setAuthState}) => {
  const { register, handleSubmit, errors } = useForm();
  const [ authError, setAuthError ] = useState<boolean>(false);

  const onSubmit = ({username, password} : formData) => {
    setAuthError(false);
    AuthService.signIn(username, password).then((user:any) => {
      console.log(user);
      if(user.challengeName === 'NEW_PASSWORD_REQUIRED'){
        console.log('New password required');
        Auth.completeNewPassword(
          user,
          'Temp54321',
        );
      }
      setAuthState(true);
    }).catch((err) => {
      setAuthError(true);
      console.log(err);
    });;
  };

  return (
    <Container className={'min-vh-100 d-flex align-items-center'}>
      <Col sm={6} className={'col-sm-12 col-md-6 offset-md-3'}>
        <Card>
          <CardBody>
            <CardTitle tag="h1">Login</CardTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label>Username</Label>
                <input
                  name="username"
                  className={'form-control'}
                  placeholder="Enter your username"
                  ref={register}
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <input
                  type={'password'}
                  name="password"
                  className={'form-control'}
                  placeholder="Enter your password"
                  ref={register}
                />
              </FormGroup>
              <FormGroup>
                {authError && <Alert color='danger'>Invalid username or password</Alert>}
              </FormGroup>
              <FormGroup>
                <Button type="submit" color={'primary'} block>Login</Button>
              </FormGroup>
            </form>
      
          </CardBody>
        </Card>
      </Col>
    </Container>
  );
};

export default Login;