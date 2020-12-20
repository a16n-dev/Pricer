import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Alert, Button, Card, CardBody, CardTitle, Col, Container, FormGroup, Label } from 'reactstrap';
import { login } from '../../redux/actions/Auth';
import { AuthService } from '../../util/AuthService';

interface formData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [ authError, setAuthError ] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onSubmit = ({username, password} : formData) => {
    setAuthError(false);
    AuthService.signIn(username, password).then((user:any) => {

      // TODO: Move this logic into AuthService
      if(user.challengeName === 'NEW_PASSWORD_REQUIRED'){
        Auth.completeNewPassword(
          user,
          'Temp54321',
        );
      }
      dispatch(login());
    }).catch((err) => {
      setAuthError(true);
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