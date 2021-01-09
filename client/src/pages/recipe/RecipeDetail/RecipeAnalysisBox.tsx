import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { RecipeAnalysis } from '../../../models/Recipe';

interface RecipeAnalysisBoxProps {
    analysis?: RecipeAnalysis
}

const RecipeAnalysisBox = ({analysis}: RecipeAnalysisBoxProps) => (
  <>
    <Row className={'mb-2'}>
      <Col>
        <Card>
          <CardHeader>
                      Analysis
          </CardHeader>
          <CardBody>
            {
              analysis?
                <span>Wow!</span>
                :
                <span>No analysis yet</span>
            }
          </CardBody>
        </Card>
      </Col>
    </Row>
    <Row>
      {analysis? <><Col className={'pr-2'}>
        <Button block color={'primary'} outline>View Analysis Results</Button>
      </Col>
      <Col className={'pl-2'}>
        <Button block color={'primary'}>Re-run Analysis</Button>
      </Col></> :
        <Col>
          <Button block color={'primary'}>Start Analysis</Button>
        </Col>}
    </Row>
  </>
);

export default RecipeAnalysisBox;