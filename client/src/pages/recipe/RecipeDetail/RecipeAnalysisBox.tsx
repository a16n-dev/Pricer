import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { RecipeAnalysis } from '../../../models/Recipe';
import relativeDateString from '../../../util/relativeDateString';

interface RecipeAnalysisBoxProps {
  id: string;
  analysis?: RecipeAnalysis;
}

const RecipeAnalysisBox = ({ analysis, id }: RecipeAnalysisBoxProps) => {
  const history = useHistory();

  return (
    <>
      <Row className={'mb-2'}>
        <Col>
          <Card>
            <CardHeader>
              <Row>
                <Col>
              Analysis Summary
                </Col>
                <Col className={'ml-auto'} sm={'auto'}>
                  <span className={'text-muted'}>
                    {analysis ? relativeDateString(analysis.date) : 'not run'}
                  </span>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {!analysis ? (
                <span>No analysis yet</span>
              ) : (
                <>
                  <span>Total Cost: ${analysis.cost.toFixed(2)}</span>
                  <br />
                  <span className={'text-success'}>
                    Items Scanned: {analysis.itemsScanned}
                  </span>
                  <br />
                  <span className={'text-danger'}>
                    Items Skipped: {analysis.itemsSkipped}
                  </span>
                  <br />
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            block
            color={'primary'}
            onClick={() => history.push(`${id}/analysis`)}
          >
            Analyse Recipe
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default RecipeAnalysisBox;
