import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Account from "./Home";
import FreeComponent from "./FreeComponent";
import ProtectedRoutes from "./ProtectedRoutes";
import "./App.css";
import Register from "./Register";

function App() {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          <section id="navigation">
            <a href="/">Home</a>
            <a href="/free">Free Component</a>
            <a href="/auth">Auth Component</a>
            <a href="/register">Register</a>
          </section>
        </Col>
      </Row>

      <Routes>
        <Route path='/' element={<Account/>}/>
        <Route path="/free" element={<FreeComponent/>} />
        <Route path="/auth" element={<ProtectedRoutes/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Container>
  );
}

export default App;
