import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Label,
} from 'reactstrap';
import ContainedContainer from '../../components/ContainedContainer';
import { login } from '../../redux/auth/login';
import { useAppDispatch } from '../../redux/store';

interface formData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useAppDispatch();

  const onSubmit = async ({username, password} : formData) => {

    const res = await dispatch(login({username, password}));
    if(login.rejected.match(res)){
      console.log(res.error.message);
    }
  };

  return (
    <ContainedContainer>
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
                {true && <Alert color='danger'>Invalid username or password</Alert>}
              </FormGroup>
              <FormGroup>
                <Button type="submit" color={'primary'} block>Login</Button>
              </FormGroup>
            </form>
      
          </CardBody>
        </Card>
      </Col>
    </ContainedContainer>
  );
};

export default Login;