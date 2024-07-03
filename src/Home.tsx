import { Col, Row } from "react-bootstrap";
import Login from "./Login";

export default function Account() {
  return (
    <Row>
      <Col xs={12} sm={12} md={6} lg={6}>
        <Login />
      </Col>
    </Row>
  );
}
